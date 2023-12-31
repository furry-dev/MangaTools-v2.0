import {listen} from '@tauri-apps/api/event'

interface BackLogs {
    payload: {
        message: string
    }
}

const footer = document.querySelector(".back-logs")

await listen('applogs', (e: BackLogs) => {
    if (!footer) return false
    footer.innerHTML = e.payload.message
})