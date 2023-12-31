// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

use std::fs;
use tauri::{AppHandle, Manager, Window};
use serde_json;
use serde_json::Value;

const VERSION_DATA_PATH: &str = "./data/version.json";

// Learn more about Tauri commands at https://tauri.app/v1/guides/features/command

#[tauri::command(async)]
fn open_main_window(app_handle: AppHandle) {
    app_handle.get_window("main").unwrap().show().unwrap();
    app_handle.get_window("welcome").unwrap().close().unwrap();

    let mut program = open_json(VERSION_DATA_PATH, None);
    println!("{:?}", &program);
    program["showWelcome"] = serde_json::json!(false);

    fs::write(VERSION_DATA_PATH, serde_json::to_string_pretty(&program).unwrap()).expect("dfd")
}

// the payload type must implement `Serialize` and `Clone`.
#[derive(Clone, serde::Serialize)]
struct Payload {
    message: String,
}

#[tauri::command]
fn send_log(window: &Window, log: &str) {
    window.emit("applogs", Payload { message: log.into() }).unwrap();
}

fn open_json(path: &str, log_window: Option<&Window>) -> Value {
    let res: Result<String, std::io::Error> = fs::read_to_string(&path);
    let s = match res {
        Ok(s) => s,
        Err(err) => {
            if let Some(window) = log_window {
                send_log(&window, &*format!("Can't read file: {}", &path));
            }
            panic!("Can't read file: {}. {:?}", path, err)
        }
    };

    serde_json::from_str(&s).expect(&*format!("Can't parse {}", path))
}

fn main() {
    tauri::Builder::default()
        .invoke_handler(tauri::generate_handler![open_main_window])
        .setup(|app| {
            let splashscreen_window = app.get_window("splashscreen").unwrap();
            let main_window = app.get_window("main").unwrap();
            let welcome_window = app.get_window("welcome").unwrap();

            tauri::async_runtime::spawn(async move {
                send_log(&splashscreen_window, "Start initializing...");

                send_log(&splashscreen_window, "Read program data...");

                let welcome_data: Value = open_json(VERSION_DATA_PATH, Some(&splashscreen_window));

                // инициализация функционала

                splashscreen_window.close().unwrap();

                if welcome_data["showWelcome"] == true {
                    welcome_window.show().unwrap();
                } else {
                    main_window.show().unwrap();
                }
            });
            Ok(())
        })
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
