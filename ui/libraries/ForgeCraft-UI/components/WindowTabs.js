import BaseComponent from "./BaseComponent.js"
import SelectableItems from "./SelectableItems.js"
import StackedPages from "./StackedPages.js"

class WindowTabs extends BaseComponent {
    constructor(tabs, windows, options) {
        super(windows)

        this.tabs = new SelectableItems(tabs, options)
        this.windows = new StackedPages(windows, options)

        this.tabs.addClass('tabs-header')
        this.windows.addClass('tabs-windows')

        this.bindEvents()
    }

    /**
     * Привязывает события к элементу WindowTabs для обработки выбора вкладок и управления с клавиатуры.
     * @private
     */
    bindEvents() {
        this.tabs.addEventListener('change', () => {
            const tabs = this.tabs.getSelectedItems()
            const openedWindows = []

            const windows = this.windows.activeElements

            windows.forEach(window => {
                const tabName = window.dataset.name.replace(/-content$/, '')
                const correspondingTab = tabs.find(tab => tab.dataset.name === tabName)

                if (correspondingTab) return openedWindows.push(correspondingTab.dataset.name)

                this.windows.toggleActiveElement(window.dataset.name)
            })

            tabs.forEach(tab => {
                if (openedWindows.includes(tab.dataset.name)) return

                this.windows.toggleActiveElement(`${tab.dataset.name}-content`)
            })

            const event = new Event('changeWindow', {bubbles: true})
            this.dispatchEvent(event)
        })
    }
}

export default WindowTabs
