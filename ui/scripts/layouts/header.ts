import { appWindow } from '@tauri-apps/api/window'
import { exit } from '@tauri-apps/api/process'
import { ask } from '@tauri-apps/api/dialog'

const minimizeButton = document.getElementById('minimize-window')
const closeButton = document.getElementById('close-window')
const exitButton = document.getElementById('exit-app')
const showMoreWindows = document.getElementById("show-more-windows")

minimizeButton?.addEventListener('click', () => appWindow.minimize())

closeButton?.addEventListener('click', () => {
    if (!closeButton.dataset.confirm) return appWindow.close()

    if (confirm("Закрыть окно?")) {
        void appWindow.close()
    }
})

exitButton?.addEventListener('click', () => {
    ask("Вы хотите выйти из приложения?", { type: 'warning' }).then((status) => {
        if (status) void exit()
    })
})

showMoreWindows?.addEventListener('click', () => {
    document.getElementById('more-windows')?.classList.toggle('active')
})
