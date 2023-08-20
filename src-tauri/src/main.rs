#![cfg_attr(
    all(not(debug_assertions), target_os = "windows"),
    windows_subsystem = "windows"
)]

use discord_rich_presence::activity::Party;
use log::{debug, info, error, trace};
use sysinfo::{System, SystemExt};
use tauri::{State, Manager};
use std::sync::Mutex;
use discord_rich_presence::{activity, DiscordIpc, DiscordIpcClient};
use tauri_plugin_log::LogTarget;

struct DiscordClient(Mutex<DiscordIpcClient>);
struct SysInfo(Mutex<System>);

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
fn is_discord_running(c: State<SysInfo>) -> bool {
    trace!("controlling Discord process");

    let mut sys = c.0.lock().unwrap();

    sys.refresh_processes();

    trace!("refreshed process list");
    for _ in sys.processes_by_name("Discord") {
        trace!("found Discord process");
        return true;
    }
    trace!("did not find Discord process");
    
    false
}

#[tauri::command]
fn stop_rpc(client_state: State<DiscordClient>, system_state: State<SysInfo>) -> Result<(), String> {
    info!("called rpc stop command");

    info!("checking if Discord is available");
    if !is_discord_running(system_state) {
        error!("discord is not running");
        return Err("Discord is not running".to_string());
    }

    let mut client = client_state.0.lock().unwrap();

    debug!("got client lock, stopping current activity");

    client.clear_activity().map_err(|e| {
        let msg = "could not clear activity";
        error!("{}: {}", msg, e);
        return msg;
    })?;
    Ok(())
}

fn main() {
    let client = DiscordIpcClient::new("-1").unwrap();

    tauri::Builder::default()
    .plugin(tauri_plugin_log::Builder::default().level(
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
    )
    .build())
    .plugin(tauri_plugin_window_state::Builder::default().build())
    .on_window_event(|event| match event.event() {
        tauri::WindowEvent::CloseRequested { api, .. } => {
            #[cfg(target_os = "macos")]
            tauri::AppHandle::hide(&event.window().app_handle()).unwrap();
            api.prevent_close();
        }
        _ => {}
      })
      .setup(|app| {
        let main_window = app.get_window("main").unwrap();
        main_window.hide().unwrap();

        Ok(())
      })
    .manage(DiscordClient(Mutex::new(client)))
    .manage(SysInfo(Mutex::new(System::new())))
    .plugin(tauri_plugin_store::Builder::default().build())
        .invoke_handler(tauri::generate_handler![start_rpc, stop_rpc, is_discord_running])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");

    info!("Exiting");
}