use std::fs;
use tauri::{AppHandle, Manager};

use crate::utils::json::open_json;
use crate::config;

// Learn more about Tauri commands at https://tauri.app/v1/guides/features/command
#[tauri::command(async)]
pub fn open_main_window(app_handle: AppHandle) {
    app_handle.get_window("main").unwrap().show().unwrap();
    app_handle.get_window("welcome").unwrap().close().unwrap();

    let mut program = open_json(config::CONFIG_FILE_PATH, None);
    println!("{:?}", &program);
    program["showWelcome"] = serde_json::json!(false);

    fs::write(config::CONFIG_FILE_PATH, serde_json::to_string_pretty(&program).unwrap()).expect("dfd")
}
