use std::fs;
use tauri::Window;
use serde_json::Value;
use crate::handlers::send_log;

pub fn open_json(path: &str, log_window: Option<&Window>) -> Value {
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