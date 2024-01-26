import { invoke } from '@tauri-apps/api/tauri'

const okButton = document.querySelector(".window-buttons .ok")

if (okButton) {
    okButton.addEventListener('click', () => {
        void invoke('open_main_window')
    })
} else {
    alert("Непредвиденная ошибка!")
}
