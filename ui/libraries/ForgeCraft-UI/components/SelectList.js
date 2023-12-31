import BaseComponent from "./BaseComponent.js"
import SelectableItems from "./SelectableItems.js";

class SelectList extends BaseComponent {
    /**
     * Создает новый объект SelectableSelect.
     * @param {HTMLSelectElement} element - Элемент <select> для управления выбором.
     * @param {Object} [options] - Настройки для управления выбором элементов.
     * @param {boolean} [options.isRequired] - Флаг, указывающий, что выбор хотя бы одного элемента обязателен (по умолчанию false).
     * @param {boolean} [options.enableKeyboardNavigation] - Флаг, разрешающий навигацию с клавиатуры (по умолчанию true).
     * @param {string} [options.confirmKey] - Клавиша для подтверждения выбора элемента (по умолчанию 'Enter').
     * @param {string} [options.prevKey] - Клавиша для перемещения к предыдущему элементу (по умолчанию 'ArrowUp').
     * @param {string} [options.nextKey] - Клавиша для перемещения к следующему элементу (по умолчанию 'ArrowDown').
     */
    constructor(element, options = {
        isRequired: true,
        enableKeyboardNavigation: true,
        confirmKey: 'Enter',
        prevKey: 'ArrowUp',
        nextKey: 'ArrowDown'
    }) {
        super(element)

        this.createSelect()
        this.selectable = new SelectableItems(this.selectContainer, options)
        this.bindEvents()

        this.initialiseActiveItems(options)
    }

    /**
     * Получает текущее значение выбранного элемента выпадающего списка.
     * @returns {string} - Значение выбранного элемента.
     */
    get value() {
        return this.element.value
    }

    /**
     * Устанавливает новое значение выбранного элемента выпадающего списка.
     * @param {string} newValue - Новое значение для установки.
     */
    set value(newValue) {
        const selectedOption = this.selectable.querySelector(`[data-value="${newValue}"]`)
        if (selectedOption && selectedOption.dataset.disabled !== 'true') {
            this.selectable.setSelectedItem(selectedOption)

            const event = new Event('change', { bubbles: true })
            this.dispatchEvent(event)
        }
    }

    /**
     * Получает выбранный элемент списка.
     * @returns {HTMLElement[]} - Выбранный элемент.
     */
    get selectedItems() {
        return this.selectable.getSelectedItems()
    }

    /**
     * Создает визуальное представление выпадающего списка и скрывает оригинальный элемент <select>.
     * @private
     */
    createSelect() {
        this.element.style.display = 'none'

        this.selectContainer = document.createElement('div')
        this.selectContainer.classList.add('select-list')
        this.selectContainer.tabIndex = this.element.tabIndex


        this.element.insertAdjacentElement('afterend', this.selectContainer)

        const options = this.element.querySelectorAll('option')
        options.forEach(option => {
            const listItem = document.createElement('div')
            listItem.classList.add('select-list__item')
            listItem.textContent = option.textContent
            listItem.dataset.value = option.value
            if (option.disabled) listItem.dataset.disabled = 'true'
            this.selectContainer.appendChild(listItem)
        })
    }

    /**
     * Привязывает события к элементу SelectList для обработки выбора элемента.
     */
    bindEvents() {
        this.selectable.addEventListener('change', e => {
            const selectedItem = this.selectable.getSelectedItems()[0]
            if (selectedItem) {
                this.element.value = selectedItem.dataset.value
            }
        })
    }
    
    /**
     * Инициализирует активные элементы списка в соответствии с настройками.
     * @param {Object} options - Настройки для управления выбором элементов.
     * @private
     */
    initialiseActiveItems(options) {
        if (options.isRequired) {
            if (this.element.multiple) {
                this.querySelectorAll('[selected]').forEach(option => {
                    this.value = option.value
                    if (!this.selectable.multiple) this.selectable.multiple = true
                })
            } else {
                const startValue = this.querySelector('[selected]')?.value
                if (startValue) this.value = startValue
            }
        } else {
            if (this.element.multiple) {
                this.querySelectorAll('[selected]').forEach(option => {
                    this.value = option.value
                    if (!this.selectable.multiple) this.selectable.multiple = true
                })

                if (this.selectedItems.length < 1) {
                    const startValue = this.selectable.getSelectedItems()[0]?.dataset.value
                    if (startValue) this.value = startValue
                }
            } else {
                const startValue = this.querySelector('[selected]')?.value
                if (startValue) this.value = startValue
            }
        }
    }
}

export default SelectList
