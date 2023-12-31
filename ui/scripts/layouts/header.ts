import { appWindow } from '@tauri-apps/api/window'

const minimizeButton = document.getElementById('minimize-window')
const closeButton = document.getElementById('close-window')

if (minimizeButton) {
    minimizeButton.addEventListener('click', () => appWindow.minimize())
}

if (closeButton) {
    closeButton.addEventListener('click', () => appWindow.close())
}
