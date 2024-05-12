#![cfg_attr(
    all(not(debug_assertions), target_os = "windows"),
    windows_subsystem = "windows"
)]

#[global_allocator]
static GLOBAL: mimalloc::MiMalloc = mimalloc::MiMalloc;

use tauri::{AppHandle, CustomMenuItem, SystemTray, SystemTrayEvent, SystemTrayMenu, SystemTrayMenuItem};
use discord_rich_presence::activity::Party;
use tauri_plugin_window_state::{WindowExt, StateFlags, AppHandleExt};
use log::{debug, info, error, trace};
use sysinfo::{Pid, ProcessExt, System, SystemExt};
use tauri::{State, Manager};
use webbrowser::{open_browser, Browser};
use std::sync::Mutex;
use discord_rich_presence::{activity, DiscordIpc, DiscordIpcClient};
use tauri_plugin_log::LogTarget;
use std::env;

#[cfg(target_os = "macos")]
use window_vibrancy::{apply_vibrancy, NSVisualEffectMaterial};

#[derive(Clone, serde::Serialize)]
struct RpcStatePayload {
  running: bool,
}

#[derive(Clone, serde::Serialize)]
struct SingleInstancePayload {
  args: Vec<String>,
  cwd: String,
}
struct DiscordClient(Mutex<DiscordIpcClient>);
struct SysInfo(Mutex<System>);
struct DiscordPid(Mutex<Option<Pid>>);

const VERSION: &str = env!("CARGO_PKG_VERSION");

#[tauri::command(rename_all = "camelCase")]
fn start_rpc(id: &str, state: Option<&str>, start_time: Option<i64>, party: Option<(i32, i32)>, buttons: Option<Vec<(&str, &str)>>, details: Option<&str>, large_image: Option<&str>, large_image_text: Option<&str>, small_image: Option<&str>, small_image_text: Option<&str>, client_state: State<DiscordClient>, app_handle: AppHandle) -> Result<(), u8> {
    info!("called rpc start command");
    debug!("received ipc command params: id: {}, state: {:?}, start_time: {:?}, party: {:?}, buttons: {:?}, details: {:?}, large_image: {:?}, large_image_text: {:?}, small_image: {:?}, small_image_text: {:?}", id, state, start_time, party, buttons, details, large_image, large_image_text, small_image, small_image_text);

    let mut client = client_state.0.lock().unwrap();

    debug!("got client lock, creating new IPC client for Discord");
    *client = DiscordIpcClient::new(id).map_err(|e| {
        error!("could not initiate new ipc client with id {}: {}", id, e);
        return 101;
    })?;

    debug!("establishing IPC");
    client.connect().map_err(|e| {
        error!("ipc connection failed: {}", e);
        return 102;
    })?;

    let mut activity = activity::Activity::new();

    if let Some(state) = state {
        activity = activity.state(state);
    }

    if let Some(details) = details {
        activity = activity.details(details);
    }

    let mut assets = activity::Assets::new();

    if let Some(large_image) = large_image {
        assets = assets.large_image(large_image);
    }

    if let Some(large_image_text) = large_image_text {
        assets = assets.large_text(large_image_text);
    }

    if let Some(small_image) = small_image {
        assets = assets.small_image(small_image);
    }

    if let Some(small_image_text) = small_image_text {
        assets = assets.small_text(small_image_text);
    }

    activity = activity.assets(assets);

    if let Some(start_time) = start_time {
        activity = activity.timestamps(activity::Timestamps::new().start(start_time));
    }

    if let Some(party) = party {
        activity = activity.party(Party::new().size([party.0, party.1]));
    }

    if let Some(buttons) = buttons {
        let buttons = buttons.into_iter().map(|(label, url)| activity::Button::new(label, url)).collect::<Vec<_>>();
        activity = activity.buttons(buttons);
    }

    info!("setting activity");
    client.set_activity(activity).map_err(|e| {
        error!("could not send rpc client activity: {}", e);
        return 103;
    })?;

    let result =  client.recv().map_err(|e| {
        error!("could not send rpc due to ipc error: {}", e);
        return 104;
    })?;

    debug!("ipc recv: {:?}", result);

    app_handle.tray_handle().get_item("stop").set_enabled(true).unwrap();
    
    Ok(())
}

#[tauri::command]
fn is_discord_running(c: State<SysInfo>, d_pid: State<DiscordPid>) -> bool {
    trace!("controlling Discord process");

    let mut sys = c.0.lock().unwrap();
    let mut d_pid = d_pid.0.lock().unwrap();

    // check if we already have a pid
    if let Some(pid) = *d_pid {
        trace!("found pid {}", pid);
        let is_discord_running = sys.refresh_process(pid);
        // check if the process is still running
        if is_discord_running {
            trace!("process {} is still running", pid);
            return true;
        }
        trace!("process {} is no longer running", pid);
        *d_pid = None;
    }
    sys.refresh_processes();
    trace!("refreshed process list");
    for p in sys.processes_by_name("Discord") {
        let pid = p.pid();
        trace!("found {} with pid {}", p.name(), pid);
        *d_pid = Some(pid);
        return true;
    }
    trace!("did not find Discord process");
    
    false
}

#[tauri::command]
fn stop_rpc(client_state: State<DiscordClient>, system_state: State<SysInfo>, discord_pid_state: State<DiscordPid>, app_handle: AppHandle) -> Result<(), u8> {
    info!("called rpc stop command");

    let stop = app_handle.tray_handle().get_item("stop");
    stop.set_enabled(false).unwrap();

    info!("checking if Discord is available");
    if !is_discord_running(system_state,discord_pid_state) {
        error!("discord is not running");
        return Err(105);
    }

    let mut client = client_state.0.lock().unwrap();

    debug!("got client lock, stopping current activity");

    client.clear_activity().map_err(|e| {
        let msg = "could not clear activity";
        error!("{}: {}", msg, e);
        return 106;
    })?;
    Ok(())
}

#[tauri::command]
fn show_main_window(window: tauri::Window) {
    let main_window = window.get_window("main").unwrap();

    #[cfg(not(target_os = "macos"))]
    main_window.set_decorations(false).unwrap();
    
    main_window.show().unwrap();

    #[cfg(not(target_os = "macos"))]
    main_window.set_decorations(true).unwrap();
    
    main_window.restore_state(
        tauri_plugin_window_state::StateFlags::FULLSCREEN
        | tauri_plugin_window_state::StateFlags::MAXIMIZED
        | tauri_plugin_window_state::StateFlags::POSITION
        | tauri_plugin_window_state::StateFlags::SIZE
    ).unwrap();

    main_window.set_focus().unwrap();
}

#[tauri::command]
fn open_url(url: &str) {
    let mut open_url = url.to_string();
    if !url.starts_with("http://") && !url.starts_with("https://") {
        debug!("url {} is not valid, using search instead", url);
        open_url = format!("https://www.google.com/search?q={}", url);
    }
    if open_browser(Browser::Default, &open_url).is_ok() {
        debug!("opened url '{}'", url);
    } else {
        error!("could not open url {}", url);
    }
}

fn main() {
    let client = DiscordIpcClient::new("-1").unwrap();

    #[cfg(target_os = "macos")]
    let quit = CustomMenuItem::new("quit".to_string(), "Quit Statusify").accelerator("CmdOrControl+Q");

    #[cfg(not(target_os = "macos"))]
    let quit = CustomMenuItem::new("quit".to_string(), "Quit Statusify");

    let visibility = CustomMenuItem::new("visibility".to_string(), "Show / hide");

    #[cfg(target_os = "macos")]
    let stop = CustomMenuItem::new("stop".to_string(), "Stop RPC").disabled().native_image(tauri::NativeImage::StopProgress);

    #[cfg(not(target_os = "macos"))]
    let stop = CustomMenuItem::new("stop".to_string(), "Stop RPC").disabled();

    let tray_menu = SystemTrayMenu::new()
        .add_item(stop)
        .add_native_item(SystemTrayMenuItem::Separator)
        .add_item(visibility)
        .add_native_item(SystemTrayMenuItem::Separator)
        .add_item(quit);

    #[cfg(not(target_os = "windows"))]
    let tray = SystemTray::new().with_menu(tray_menu);

    #[cfg(target_os = "windows")]
    let tray = SystemTray::new().with_menu(tray_menu).with_tooltip("Statusify");

    tauri::Builder::default()
    .system_tray(tray)
    .plugin(tauri_plugin_log::Builder::default()
        .level(
            log::LevelFilter::Debug,
        )
        .targets([
            LogTarget::Stdout,
            LogTarget::LogDir,
        ])
        .format(
            |callback, message, record| {
                let format =
                time::format_description::parse("[[[year]-[month]-[day]][[[hour]:[minute]:[second]]")
                    .unwrap();
                callback.finish(format_args!(
                    "{}[{}] {}",
                    time::OffsetDateTime::now_utc().format(&format).unwrap(),
                    record.level(),
                    message
                ))
            }
        ).build()
    )
    .on_window_event(|event| match event.event() {
        tauri::WindowEvent::CloseRequested { api, .. } => {
            event.window().app_handle().save_window_state(StateFlags::all()).unwrap();

            #[cfg(not(target_os = "macos"))]
            event.window().hide().unwrap();

            #[cfg(target_os = "macos")]
            tauri::AppHandle::hide(&event.window().app_handle()).unwrap();

            api.prevent_close();
        }
        _ => {}
      })
    .manage(DiscordClient(Mutex::new(client)))
    .manage(SysInfo(Mutex::new(System::new())))
    .manage(DiscordPid(Mutex::new(None)))
    .plugin(tauri_plugin_store::Builder::default().build())
    .plugin(tauri_plugin_context_menu::init())
    .plugin(tauri_plugin_single_instance::init(|app, argv, cwd| {
        debug!("instance: {}, {argv:?}, {cwd}", app.package_info().name);
        app.emit_all("single-instance", SingleInstancePayload { args: argv, cwd }).unwrap();
        let window = app.get_window("main").unwrap();
            if !window.is_visible().unwrap() {
                show_main_window(window);
            }else {
                window.set_focus().unwrap();
            }
    }))
    .setup(|app| {
        info!("setting up app (v{})", VERSION);

        #[cfg(target_os = "macos")]
        let main_window = app.get_window("main").unwrap();

        #[cfg(target_os = "macos")]
        apply_vibrancy(&main_window, NSVisualEffectMaterial::Sidebar, None, None)
            .expect("Unsupported platform! 'apply_vibrancy' is only supported on macOS");

        Ok(())
      })
    .invoke_handler(tauri::generate_handler![start_rpc, stop_rpc, is_discord_running, show_main_window, open_url])
    .plugin(tauri_plugin_window_state::Builder::default().with_state_flags(
        tauri_plugin_window_state::StateFlags::FULLSCREEN
            | tauri_plugin_window_state::StateFlags::MAXIMIZED
            | tauri_plugin_window_state::StateFlags::POSITION
            | tauri_plugin_window_state::StateFlags::SIZE
    ).with_denylist(&["main"]).build())
    .on_system_tray_event(|app, event| match event {
        #[cfg(not(target_os = "macos"))]
        SystemTrayEvent::LeftClick { .. } => {
            let window = app.get_window("main").unwrap();
            if !window.is_visible().unwrap() {
                show_main_window(window);
            }else {
                window.set_focus().unwrap();
            }
        }
        SystemTrayEvent::MenuItemClick { id, .. } => {
            match id.as_str() {
                "stop" => {
                    let client_state = app.state::<DiscordClient>();
                    let system_state = app.state::<SysInfo>();
                    let discord_pid_state = app.state::<DiscordPid>();

                    let _ = stop_rpc(client_state, system_state, discord_pid_state, app.app_handle());

                    app.emit_all("rpc-running-change", RpcStatePayload { running: false }).unwrap();
                }
                "quit" => {
                    app.get_window("main").unwrap().app_handle().save_window_state(StateFlags::all()).unwrap();
                    app.exit(0);
                }
                "visibility" => {
                    let window = app.get_window("main").unwrap();
                    if window.is_visible().unwrap() {
                        #[cfg(not(target_os = "macos"))]
                        window.hide().unwrap();
            
                        #[cfg(target_os = "macos")]
                        tauri::AppHandle::hide(&window.app_handle()).unwrap();
                    } else {
                        show_main_window(window);
                    }
                }
                _ => {}
            }
        }
        _ => {}
    })
    .run(tauri::generate_context!())
    .expect("error while running tauri application");
    info!("exiting");
}
