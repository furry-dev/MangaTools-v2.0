class BaseComponent {
    constructor(element) {
        this.element = element
    }

    /**
     * Добавляет класс к элементу.
     * @param {string} className - Название класса для добавления.
     */
    addClass(className) {
        this.element.classList.add(className)
    }

    /**
     * Удаляет класс из элемента.
     * @param {string} className - Название класса для удаления.
     */
    removeClass(className) {
        this.element.classList.remove(className)
    }

    /**
     * Проверяет, содержит ли элемент указанный класс.
     * @param {string} className - Название класса для проверки.
     * @returns {boolean} - true, если элемент содержит указанный класс, иначе false.
     */
    hasClass(className) {
        return this.element.classList.contains(className)
    }

    /**
     * Геттер для получения дочерних элементов.
     * @returns {HTMLCollection} - Внутреннее HTML содержимое элемента.
     */
    get children() {
        return this.element.children
    }

    /**
     * Геттер для получения внутреннего HTML содержимого элемента.
     * @returns {string} - Внутреннее HTML содержимое элемента.
     */
    get innerHTML() {
        return this.element.innerHTML
    }

    /**
     * Сеттер для установки внутреннего HTML содержимого элемента.
     * @param {string} html - HTML строка для установки внутреннего содержимого элемента.
     */
    set innerHTML(html) {
        this.element.innerHTML = html
    }

    /**
     * Добавляет дочерний элемент к текущему элементу.
     * @param {Element} child - Элемент, который будет добавлен в качестве дочернего.
     */
    appendChild(child) {
        this.element.appendChild(child)
    }

    querySelector(selector) {
        return this.element.querySelector(selector)
    }

    querySelectorAll(selector) {
        return this.element.querySelectorAll(selector)
    }

    /**
     * Добавляет слушателя события к элементу.
     * @param {string} type - Тип события.
     * @param {Function} listener - Функция-обработчик события.
     */
    addEventListener(type, listener) {
        if (this.element.addEventListener) {
            this.element.addEventListener(type, listener)
        } else if (this.element.attachEvent) {
            this.element.attachEvent('on' + type, listener)
        } else {
            this.element['on' + type] = listener
        }
    }

    /**
     * Удаляет слушателя события у элемента.
     * @param {string} type - Тип события.
     * @param {Function} listener - Функция-обработчик события.
     */
    removeEventListener(type, listener) {
        if (this.element.removeEventListener) {
            this.element.removeEventListener(type, listener)
        } else if (this.element.detachEvent) {
            this.element.detachEvent('on' + type, listener)
        } else {
            this.element['on' + type] = null
        }
    }

    /**
     * Инициирует событие у элемента.
     * @param {Event} event - Объект события для инициации.
     */
    dispatchEvent(event) {
        if (this.element.dispatchEvent) {
            this.element.dispatchEvent(event)
        } else if (this.element.fireEvent) {
            this.element.fireEvent('on' + event.type, event)
        }
    }

    /**
     * Показывает элемент.
     */
    show() {
        this.element.style.display = 'block'
    }

    /**
     * Скрывает элемент.
     */
    hide() {
        this.element.style.display = 'none'
    }
}

export default BaseComponent
