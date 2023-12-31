import BaseComponent from "./BaseComponent.js"

/**
 * Класс для управления выбираемыми элементами в контейнере.
 */
class SelectableItems extends BaseComponent {
    /**
     * Флаг, разрешающий выбор нескольких элементов.
     * @type {boolean}
     */
    multiple
    
    /**
     * Флаг, указывающий, что выбор хотя бы одного элемента обязателен.
     * @type {boolean}
     */
    isRequired

    /**
     * Флаг, разрешающий навигацию с клавиатуры.
     * @type {boolean}
     */
    enableKeyboardNavigation
    /**
     * Клавиша для подтверждения выбора элемента.
     * @type {string}
     */
    confirmKey
    /**
     * Клавиша для перемещения к предыдущему элементу.
     * @type {string}
     */
    nextKey
    /**
     * Клавиша для перемещения к следующему элементу.
     * @type {string}
     */
    prevKey

    /**
     * Создает новый объект SelectableItems.
     * @param {HTMLElement} element - Контейнер с элементами.
     * @param {Object} [options] - Настройки для управления выбором элементов.
     * @param {boolean} [options.multiple] - Флаг, разрешающий выбор нескольких элементов (по умолчанию false).
     * @param {boolean} [options.isRequired] - Флаг, указывающий, что выбор хотя бы одного элемента обязателен (по умолчанию false).
     * @param {boolean} [options.enableKeyboardNavigation] - Флаг, разрешающий навигацию с клавиатуры (по умолчанию true).
     * @param {string} [options.confirmKey] - Клавиша для подтверждения выбора элемента (по умолчанию 'Enter').
     * @param {string} [options.prevKey] - Клавиша для перемещения к предыдущему элементу (по умолчанию 'ArrowUp').
     * @param {string} [options.nextKey] - Клавиша для перемещения к следующему элементу (по умолчанию 'ArrowDown').
     */
    constructor(element, options = {
        multiple: false,
        isRequired: true,
        enableKeyboardNavigation: true,
        confirmKey: 'Enter',
        prevKey: 'ArrowUp',
        nextKey: 'ArrowDown'

    }) {
        super(element)

        this.multiple = options.multiple !== undefined ? options.multiple : false
        this.isRequired = options.isRequired !== undefined ? options.isRequired : true
        this.enableKeyboardNavigation = options.enableKeyboardNavigation !== undefined ? options.enableKeyboardNavigation : true
        this.confirmKey = options.confirmKey || 'Enter'
        this.prevKey = options.prevKey || 'ArrowUp'
        this.nextKey = options.nextKey || 'ArrowDown'

        this.addClass('selectable')

        this.addElementsClass()
        this.initializeActiveItem()
        this.bindEvents()
    }

    /**
     * Переключает состояние выбора для элемента.
     * @param {HTMLElement} item - Элемент, который нужно выбрать или отменить выбор.
     */
    toggleItem(item) {
        if (item.classList.contains('active')) {
            if (this.isRequired && this.getSelectedItems().length < 2) return false

            item.classList.remove('active')
        } else {
            if (!this.multiple && this.getSelectedItems().length > 0) {
                this.getSelectedItems().forEach(value => {
                    value.classList.remove('active')
                })
            }
            item.classList.add('active')
        }

        const event = new Event('change', {bubbles: true})
        this.dispatchEvent(event)
    }

    /**
     * Возвращает массив выбранных элементов.
     * @returns {HTMLElement[]} - Массив выбранных элементов.
     */
    getSelectedItems() {
        return Array.from(this.element.querySelectorAll('.selectable-item.active'));
    }

    /**
     * Устанавливает выбранный элемент по его индексу или HTMLElement.
     * @param {number|HTMLElement} indexOrElement - Индекс элемента или сам HTMLElement.
     */
    setSelectedItem(indexOrElement) {
        if (typeof indexOrElement === 'number') {
            const items = this.element.querySelectorAll('.selectable-item');
            if (indexOrElement < 0 || indexOrElement > items.length) return false

            this.toggleItem(items[indexOrElement])

        } else if (indexOrElement instanceof HTMLElement && indexOrElement.classList.contains('selectable-item')) {
            this.toggleItem(indexOrElement);
        }
    }

    /**
     * Привязывает события к списку для обработки выбора элементов.
     * @private
     */
    bindEvents() {
        this.addEventListener('click', (e) => {
            const target = e.target.closest('.selectable-item')
            if (target) {
                this.toggleItem(target)
            }
        })

        this.addEventListener('keydown', (e) => {
            const selectedElem = this.querySelector('.selected') || this.getSelectedItems()[0]

            if (e.key === this.nextKey || e.key === this.prevKey) {
                if (!selectedElem) return false

                e.preventDefault()

                const items = this.querySelectorAll('.selectable-item');
                if (items.length === 0) return;

                const children = Array.from(this.children)
                const currentIndex = children.indexOf(selectedElem)

                let newIndex = currentIndex

                if (e.key === this.prevKey) {
                    newIndex = (currentIndex - 1 + items.length) % items.length;
                } else if (e.key === this.nextKey) {
                    newIndex = (currentIndex + 1) % items.length;
                }
                if (selectedElem) selectedElem.classList.remove('selected')
                items[newIndex].classList.add('selected')
            } else if (e.key === this.confirmKey && selectedElem) {
                if (!selectedElem) return false

                e.preventDefault()

                this.toggleItem(selectedElem)

                if (this.getSelectedItems().length > 0) {
                    selectedElem.classList.remove('selected')
                } else {
                    selectedElem.classList.add('selected')
                }
            }
        })

        const callback = (mutationList) => {
            for (const mutation of mutationList) {
                if (mutation.type !== "childList") return false
                this.addElementsClass()
                this.initializeActiveItem()
            }
        }

        const observer = new MutationObserver(callback)

        observer.observe(this.element, {childList: true})
    }

    /**
     * Добавляет класс 'active' к первому элементу, если ни один элемент не выбран и isRequired = true.
     * @private
     */
    initializeActiveItem() {
        if (this.children.length > 0 &&
            this.isRequired &&
            !this.querySelector('.active')
        ){
            this.children[0].classList.add('active')
        }

        const event = new Event('listUpdate', {bubbles: true})
        this.dispatchEvent(event)
    }

    /**
     * Добавляет класс 'selectable-item' ко всем дочерним элементам контейнера.
     * @private
     */
    addElementsClass() {
        const childElements = this.children
        for (let i = 0; i < childElements.length; i++) {
            const elem = childElements[i]
            elem.classList.add('selectable-item')
        }
    }
}

export default SelectableItems;
