use tauri::Window;

// the payload type must implement `Serialize` and `Clone`.
#[derive(Clone, serde::Serialize)]
struct Payload {
    message: String,
}

#[tauri::command]
pub fn send_log(window: &Window, log: &str) {
    window.emit("applogs", Payload { message: log.into() }).unwrap();
}