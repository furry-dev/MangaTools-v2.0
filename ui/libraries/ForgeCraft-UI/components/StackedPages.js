import BaseComponent from "./BaseComponent.js"

/**
 * Класс для управления вкладками и окнами в стеке.
 * @extends BaseComponent
 */
class StackedPages extends BaseComponent {
    /**
     * Флаг, разрешающий навигацию с клавиатуры.
     * @type {boolean}
     */

    enableKeyboardNavigation
    /**
     * Клавиша для перехода к следующему элементу.
     * @type {string}
     */

    nextKey
    /**
     * Клавиша для перехода к предыдущему элементу.
     * @type {string}
     */
    prevKey

    /**
     * Флаг, разрешающий выбор нескольких активных элементов.
     * @type {boolean}
     */
    multiple

    /**
     * Флаг, указывающий, что выбор активного элемента обязателен.
     * @type {boolean}
     */
    isRequired

    /**
     * Массив всех страниц (дочерних элементов).
     * @type {HTMLElement[]}
     */
    pages

    /**
     * Массив активных элементов.
     * @type {HTMLElement[]}
     */
    activeElements = []

    /**
     * Создает новый объект StackedPages.
     * @param {HTMLElement} element - Элемент, представляющий контейнер вкладок и окон.
     * @param {Object} [options] - Настройки для управления поведением вкладок и окон.
     * @param {boolean} [options.enableKeyboardNavigation] - Флаг, разрешающий навигацию с клавиатуры (по умолчанию true).
     * @param {string} [options.nextKey] - Клавиша для перехода к следующему элементу (по умолчанию 'ArrowRight').
     * @param {string} [options.prevKey] - Клавиша для перехода к предыдущему элементу (по умолчанию 'ArrowLeft').
     * @param {boolean} [options.multiple] - Флаг, разрешающий выбор нескольких активных элементов (по умолчанию false).
     * @param {boolean} [options.isRequired] - Флаг, указывающий, что выбор активного элемента обязателен (по умолчанию true).
     */
    constructor(element, options = {
        enableKeyboardNavigation: true,
        nextKey: 'ArrowRight',
        prevKey: 'ArrowLeft',
        multiple: false,
        isRequired: true
    }) {
        super(element)

        this.enableKeyboardNavigation = options.enableKeyboardNavigation !== undefined ? options.enableKeyboardNavigation : true
        this.nextKey = options.nextKey || 'ArrowRight'
        this.prevKey = options.prevKey || 'ArrowLeft'

        this.multiple = options.multiple !== undefined ? options.multiple : false

        this.isRequired = options.isRequired !== undefined ? options.isRequired : true

        this.pages = Array.from(this.children)

        this.addClass('page-stack')
        this.addTabWindowClass()
        this.bindEvents()

        if (this.isRequired && this.pages.length > 0 && this.activeElements.length < 1) {
            this.toggleActiveElement(0)
        }
    }

    /**
     * Переключает активный элемент по индексу или значению атрибута data-name.
     * @param {number|string} indexOrName - Индекс активного элемента или значение атрибута data-name.
     */
    toggleActiveElement(indexOrName) {
        let element
        if (typeof indexOrName === 'number') {
            element = this.pages[indexOrName]
        } else if (typeof indexOrName === 'string') {
            element = this.pages.find(page => page.dataset.name === indexOrName)
        }

        if (!element) return false

        if (this.activeElements.includes(element)) {
            if (this.isRequired && this.activeElements.length < 2) return false

            element.classList.remove('active')
            this.activeElements = this.activeElements.filter(activeElement => activeElement !== element)
        } else {
            if (!this.multiple && this.activeElements.length > 0) {
                this.activeElements.forEach(value => {
                    value.classList.remove('active')
                    this.activeElements = this.activeElements.filter(activeElement => activeElement !== value)
                })
            }
            element.classList.add('active')
            this.activeElements.push(element)
        }
    }


    /**
     * Добавляет новую страницу в стек вкладок.
     * @param {string} content - HTML-контент новой страницы.
     * @param {string|null} [name] - Значение имени по которому  можно обращаться для новой страницы.
     */
    addPage(content, name = null) {
        const newPage = document.createElement('div')
        newPage.innerHTML = content
        newPage.classList.add('tab-window')

        if (name) newPage.dataset.name = name

        this.pages.push(newPage)
        this.appendChild(newPage)
        this.addTabWindowClass()
    }

    /**
     * Устанавливает контент для страницы по индексу или имени.
     * @param {number|string} indexOrName - Индекс страницы или значение атрибута data-name страницы.
     * @param {string} content - HTML-контент для установки.
     */
    setPageContent(indexOrName, content) {
        let page
        if (typeof indexOrName === 'number') {
            page = this.pages[indexOrName]
        } else if (typeof indexOrName === 'string') {
            page = this.pages.find(page => page.dataset.name === indexOrName)
        }

        if (page) {
            page.innerHTML = content
        }
    }

    /**
     * Привязывает события к элементу StackedPages для обработки выбора вкладок и управления с клавиатуры.
     * @private
     */
    bindEvents() {
        this.addEventListener('keydown', (e) => {
            if (this.enableKeyboardNavigation && !this.multiple) {
                if (e.key === this.nextKey || e.key === this.prevKey) {
                    e.preventDefault()
                    const currentIndex = this.pages.indexOf(this.activeElements[0])
                    let newIndex = currentIndex
                    if (e.key === this.nextKey) {
                        newIndex = (currentIndex + 1) % this.pages.length
                    } else if (e.key === this.prevKey) {
                        newIndex = (currentIndex - 1 + this.pages.length) % this.pages.length
                    }
                    this.toggleActiveElement(newIndex)
                }
            }
        })
    }

    /**
     * Добавляет класс 'tab-window' ко всем дочерним элементам контейнера с окнами вкладок.
     * @private
     */
    addTabWindowClass() {
        const childElements = this.children
        for (let i = 0; i < childElements.length; i++) {
            const elem = childElements[i]
            elem.classList.add('page')

            if (elem.classList.contains('active')) {
                this.activeElements.push(elem)
            }
        }
    }
}

export default StackedPages
