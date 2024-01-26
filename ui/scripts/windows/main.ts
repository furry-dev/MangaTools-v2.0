// open folder and get folder path

// import { open } from '@tauri-apps/api/dialog'

// const selected = await open({
//     directory: true,
//     multiple: true
//   })

// console.log(selected)


const soundSearch = document.querySelector('#sound-page .header .search')
const soundInput = soundSearch?.querySelector('form input')
const soundResults = document.querySelector('#sound-page .results .result-list')

soundSearch?.addEventListener('click', (e) => e.stopPropagation())

const disableSearch = (e: Event) => {
    e.preventDefault()
    soundSearch?.classList.remove('active')
    soundResults?.classList.remove("search")
}

soundSearch?.querySelector('form')?.addEventListener('submit', (e) => {
    disableSearch(e)
})

soundSearch?.addEventListener('keydown', (e) => {
    const key = (e as KeyboardEvent).key

    if (key === "Escape") {
        disableSearch(e)
    }
})

soundInput?.addEventListener('click', () => {
    soundSearch?.classList.add('active')
    soundResults?.classList.add("search")
})


const soundSearchResults = document.querySelector("#soundSearchResults")

soundSearchResults?.addEventListener('click', (e) => {
    const target = e.target
    if (!(target instanceof Element)) return false

    const text = target.closest(".trans")?.textContent
    if (!text) return false

    copyText(text).then(result => {
        if (result) {
            console.log("Done!")
        } else {
            console.error("Error copy text!")
        }
    })
})
