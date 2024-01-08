// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

mod utils;
mod handlers;
mod config;

use tauri::{Manager, Window, };
use serde_json::Value;

use utils::json::open_json;
use handlers::{main_window::open_main_window, splash_window::close_splash_window};

async fn initialize_functionality(
    splashscreen_window: Window,
    main_window: Window,
    welcome_window: Window
) {
    handlers::send_log(&splashscreen_window, "Start initializing...");
    handlers::send_log(&splashscreen_window, "Read program data...");

    // Конфигурационный файл
    let conf: Value = open_json(config::CONFIG_FILE_PATH, Some(&splashscreen_window));

    // Инициализация функционала

    handlers::send_log(&splashscreen_window, "Loading UI...");

    if conf["showWelcome"] == true {
        welcome_window.show().unwrap();
    } else {
        main_window.show().unwrap();
    }
}

fn main() {
    let context = tauri::generate_context!();
    tauri::Builder::default()
        .invoke_handler(tauri::generate_handler![
            open_main_window,
            close_splash_window
        ])
        .setup(|app| {
            let splashscreen_window = app.get_window("splash").unwrap();
            let main_window = app.get_window("main").unwrap();
            let welcome_window = app.get_window("welcome").unwrap();

            tauri::async_runtime::spawn(initialize_functionality(
                splashscreen_window,
                main_window,
                welcome_window
            ));

            Ok(())
        })
        .run(context)
        .expect("error while running tauri application");
}
