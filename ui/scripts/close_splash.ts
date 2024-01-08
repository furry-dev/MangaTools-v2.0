import {invoke} from "@tauri-apps/api/tauri";

document.addEventListener('DOMContentLoaded', () => {
    void invoke('close_splash_window')
})