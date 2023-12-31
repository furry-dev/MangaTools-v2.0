import BaseComponent from "./BaseComponent.js"

/**
 * Класс Dropdown представляет выпадающий список.
 * @extends BaseComponent
 */
class Dropdown extends BaseComponent {

    /**
     * Создает экземпляр Dropdown.
     * @param {HTMLSelectElement} selectElement - Элемент select, который будет преобразован в выпадающий список.
     * @param {object} options - Объект с настройками для Dropdown.
     * @param {string} [options.placeholderText='Select an option'] - Текст, отображаемый в Dropdown, когда ни один элемент не выбран.
     * @param {number} [options.maxItems=5] - Максимальное количество элементов для отображения в выпадающем списке без прокрутки.
     * @param {boolean} [options.enableScrollChange=true] - Включает возможность изменения выбранного варианта колесиком мыши.
     * @param {boolean} [options.hideOnClickOut=true] - Включает возможность изменения выбранного варианта колесиком мыши.
     */
    constructor(selectElement,
                options = {
                    placeholderText: 'Select an option',
                    maxItems: 5,
                    enableScrollChange: true,
                    hideOnClickOut: true
                }) {
        super(selectElement)
        this.placeholderText = options.placeholderText || 'Select an option'
        this._maxItems = options.maxItems !== undefined ? options.maxItems : 5
        this.enableScrollChange = options.enableScrollChange !== undefined ? options.enableScrollChange : true
        this.hideOnClickOut = options.hideOnClickOut !== undefined ? options.hideOnClickOut : true

        this.createDropdown()
        this.bindEvents()

        const selectedOption = selectElement.querySelector('option[selected]')
        if (selectedOption) {
            this.value = selectedOption.value
        }
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
        const selectedOption = this.dropdownList.querySelector(`[data-value="${newValue}"]`)
        if (selectedOption && selectedOption.dataset.disabled !== 'true') {
            this.dropdownButton.value = selectedOption.textContent
            this.element.value = newValue

            const event = new Event('change', { bubbles: true })
            this.dispatchEvent(event)
        }
    }

    /**
     * Устанавливает новое содержимое выпадающего списка.
     * @param {Array} options - Список объектов {value: string, text: string, disabled: false}.
     */
    set options(options) {
        this.dropdownList.innerHTML = ''
        this.element.innerHTML = ''

        options.forEach(option => this.addOption(option))
    }

    /**
     * Функция для добавления нового варианта в выпадающий список.
     * @param {object} option - Объект {value: text} для добавления.
     */
    addOption(option) {
        const listItem = document.createElement('div')
        listItem.classList.add('dropdown-option')
        listItem.textContent = option.text
        listItem.dataset.value = option.value
        if (option.disabled) listItem.dataset.disabled = 'true'
        this.dropdownList.appendChild(listItem)
        const selectItem = document.createElement('option')
        selectItem.textContent = option.text
        selectItem.value = option.value
        if (option.disabled) selectItem.disabled = true
        this.element.appendChild(selectItem)

        this.updateDropdownStyles()
    }

    /**
     * Функция для удаления варианта из выпадающего списка по значению.
     * @param {string} value - Значение варианта для удаления.
     */
    removeOption(value) {
        const optionToRemove = this.dropdownList.querySelector(`[data-value="${value}"]`);
        if (optionToRemove) {
            this.dropdownList.removeChild(optionToRemove);
        }

        this.updateDropdownStyles()
    }

    /**
     * Запрещает выбор определенного варианта по его значению.
     * @param {string} value - Значение варианта для запрета выбора.
     */
    disableOption(value) {
        const optionToDisable = this.dropdownList.querySelector(`[data-value="${value}"]`);
        if (optionToDisable) {
            optionToDisable.dataset.disabled = 'true';
        }
    }

    /**
     * Разрешает выбор определенного варианта по его значению.
     * @param {string} value - Значение варианта для разрешения выбора.
     */
    enableOption(value) {
        const optionToEnable = this.dropdownList.querySelector(`[data-value="${value}"]`);
        if (optionToEnable) {
            delete optionToEnable.dataset.disabled
        }
    }

    /**
     * Устанавливает новое максимальное количество элементов для отображения в выпадающем списке без прокрутки.
     * @param {number} newValue - Новое значение максимального количества элементов.
     */
    set maxItems(newValue) {
        this._maxItems = newValue
        this.updateDropdownStyles()
    }

    /**
     * Получает текущее значение максимального количества элементов для отображения в выпадающем списке без прокрутки.
     * @returns {number} - Значение выбранного элемента.
     */
    get maxItems() {
        return this._maxItems
    }

    /**
     * Обновляет стили выпадающего списка в зависимости от настроек.
     * @private
     */
    updateDropdownStyles() {
        if (this._maxItems) {
            this.dropdownList.style.opacity = '0'
            this.dropdownList.style.display = 'block'

            const numItems = Math.min(this._maxItems, this.dropdownList.children.length)
            const itemHeight = this.dropdownList.children[0].offsetHeight
            const dropdownHeight = numItems * itemHeight

            this.dropdownList.style.maxHeight = `${dropdownHeight}px`
            this.dropdownList.style.overflowY = this.dropdownList.children.length > numItems ? 'scroll' : 'auto'

            this.dropdownList.style.removeProperty('display')
            this.dropdownList.style.removeProperty('opacity')
        } else {
            this.dropdownList.style.removeProperty('max-height')
            this.dropdownList.style.removeProperty('overflow-y')

        }
    }

    /**
     * Создает интерфейс выпадающего списка из элемента select.
     * Устанавливает необходимую HTML структуру и стили.
     * @private
     */
    createDropdown() {
        this.element.style.display = 'none'

        this.dropdownContainer = document.createElement('div')
        this.dropdownContainer.classList.add('dropdown-container')
        if (this.hideOnClickOut) this.dropdownContainer.classList.add('hideOnClickOut')

        this.dropdownButton = document.createElement('input')
        this.dropdownButton.classList.add('dropdown-button')
        this.dropdownButton.setAttribute('readonly', 'true')
        this.dropdownButton.value = this.placeholderText
        this.dropdownContainer.appendChild(this.dropdownButton)

        this.dropdownList = document.createElement('div')
        this.dropdownList.classList.add('dropdown-list')
        this.dropdownContainer.appendChild(this.dropdownList)


        this.element.insertAdjacentElement('afterend', this.dropdownContainer)

        const options = this.element.querySelectorAll('option')
        options.forEach(option => {
            const listItem = document.createElement('div')
            listItem.classList.add('dropdown-option')
            listItem.textContent = option.textContent
            listItem.dataset.value = option.value
            if (option.disabled) listItem.dataset.disabled = 'true'
            this.dropdownList.appendChild(listItem)
        })

        this.updateDropdownStyles()
    }

    /**
     * Привязывает обработчики событий к элементам выпадающего списка для взаимодействия.
     * Обрабатывает события клика на элементах списка и кнопке.
     * @private
     */
    bindEvents() {
        this.dropdownList.addEventListener('click', (e) => {
            const selectedItem = e.target.closest('.dropdown-option')
            if (selectedItem && !selectedItem.dataset.disabled) {
                this.value = selectedItem.dataset.value
                this.dropdownContainer.classList.remove('opened')
            }
        })

        this.dropdownButton.addEventListener('click', () => {
            this.dropdownContainer.classList.toggle('opened')


            const rect = this.dropdownButton.getBoundingClientRect();
            const windowHeight = window.innerHeight;

            if (windowHeight - rect.bottom < this.dropdownList.offsetHeight) {
                this.dropdownList.style.top = `-${this.dropdownList.offsetHeight}px`;
            } else {
                this.dropdownList.style.top = `${this.dropdownButton.offsetHeight}px`;
            }

        })

        this.dropdownButton.addEventListener('wheel', (e) => {
            if (!this.enableScrollChange) return false

            e.preventDefault()
            const direction = e.deltaY > 0 ? 1 : -1
            let newIndex = Array.from(this.dropdownList.children).findIndex(option => option.dataset.value === this.value)

            do {
                newIndex = Math.max(0, Math.min(newIndex + direction, this.dropdownList.children.length - 1))
            } while (this.dropdownList.children[newIndex].dataset.disabled)

            const newOption = this.dropdownList.children[newIndex]
            if (newOption) {
                this.value = newOption.dataset.value
            }
        })
    }
}

export default Dropdown
