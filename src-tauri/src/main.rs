#![cfg_attr(
    all(not(debug_assertions), target_os = "windows"),
    windows_subsystem = "windows"
)]

use discord_rich_presence::activity::Party;
use log::{debug, info, error, trace};
use sysinfo::{Pid, ProcessExt, System, SystemExt};
use tauri::{State, Manager};
use std::sync::Mutex;
use discord_rich_presence::{activity, DiscordIpc, DiscordIpcClient};
use tauri_plugin_log::LogTarget;
use std::env;

#[cfg(target_os = "macos")]
use window_vibrancy::{apply_vibrancy, NSVisualEffectMaterial};

#[cfg(target_os = "windows")]
use window_vibrancy::apply_blur;

struct DiscordClient(Mutex<DiscordIpcClient>);
struct SysInfo(Mutex<System>);
struct DiscordPid(Mutex<Option<Pid>>);
struct DiscordState(Mutex<bool>);

const VERSION: &str = env!("CARGO_PKG_VERSION");

#[tauri::command(rename_all = "camelCase")]
fn start_rpc(id: &str, state: Option<&str>, start_time: Option<i64>, party: Option<(i32, i32)>, buttons: Option<Vec<(&str, &str)>>, details: Option<&str>, large_image: Option<&str>, large_image_text: Option<&str>, small_image: Option<&str>, small_image_text: Option<&str>, client_state: State<DiscordClient>) -> Result<(), u8> {
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
fn stop_rpc(client_state: State<DiscordClient>, system_state: State<SysInfo>, discord_pid_state: State<DiscordPid>) -> Result<(), u8> {
    info!("called rpc stop command");

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

fn main() {
    let client = DiscordIpcClient::new("-1").unwrap();

    tauri::Builder::default()
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
            // if not on macOS, close the app
            #[cfg(not(target_os = "macos"))]
            event.window().close().unwrap();

            // on macOS, hide the window
            #[cfg(target_os = "macos")]
            tauri::AppHandle::hide(&event.window().app_handle()).unwrap();
            api.prevent_close();
        }
        _ => {}
      })
    .manage(DiscordClient(Mutex::new(client)))
    .manage(SysInfo(Mutex::new(System::new())))
    .manage(DiscordPid(Mutex::new(None)))
    .manage(DiscordState(Mutex::new(false)))
    .plugin(tauri_plugin_store::Builder::default().build())
    .setup(|app| {
        info!("setting up app (v{})", VERSION);
        let main_window = app.get_window("main").unwrap();
        main_window.hide().unwrap();

        #[cfg(target_os = "macos")]
        apply_vibrancy(&main_window, NSVisualEffectMaterial::Sidebar, None, None)
            .expect("Unsupported platform! 'apply_vibrancy' is only supported on macOS");

        #[cfg(target_os = "windows")]
        apply_blur(&main_window, Some((18, 18, 18, 125)))
            .expect("Unsupported platform! 'apply_blur' is only supported on Windows");

        Ok(())
      })
    .invoke_handler(tauri::generate_handler![start_rpc, stop_rpc, is_discord_running])
    .plugin(tauri_plugin_window_state::Builder::default().build())
    .run(tauri::generate_context!())
    .expect("error while running tauri application");

    info!("exiting");
}