import { resolveResource } from '@tauri-apps/api/path'
import { readTextFile } from '@tauri-apps/api/fs'
import { invoke } from '@tauri-apps/api/tauri'

type ProgramData = {
    version: string;
    versionTitle: string;
    description: string;
    note: string;
    newFunctions: string[];
}

const resourcePath = await resolveResource('./data/version.json')
const program: ProgramData = JSON.parse(await readTextFile(resourcePath))

const okButton = document.querySelector(".window-buttons .ok")

if (okButton) {
    okButton.addEventListener('click', () => {
        void invoke('open_main_window')
    })
} else {
    alert("Непредвиденная ошибка!")
}

document.querySelectorAll('.appVersion').forEach(element => {
    element.textContent = program.version
})

document.querySelectorAll('.appTitle').forEach(element => {
    element.innerHTML = program.versionTitle
})

document.querySelectorAll('.appDesc').forEach(element => {
    element.innerHTML = program.description
})

document.querySelectorAll('.appNew').forEach(element => {
    let listItems = ""
    program.newFunctions.forEach(value => {
        listItems += `<li>${value}</li>`
    })
    element.innerHTML = listItems
})

document.querySelectorAll('.appNote').forEach(element => {
    element.innerHTML = program.note
})
