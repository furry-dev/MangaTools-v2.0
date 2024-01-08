use tauri::{AppHandle, Manager};

// Learn more about Tauri commands at https://tauri.app/v1/guides/features/command
#[tauri::command(async)]
pub fn close_splash_window(app_handle: AppHandle) {
    app_handle.get_window("splash").unwrap().close().unwrap();
}