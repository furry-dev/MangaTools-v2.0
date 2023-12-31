class StorageManager {
    constructor() {

    }

    get cookie() {
        return {
            set: (name, value, options) => this.setCookie(name, value, options),
            get: (name) => this.getCookie(name),
            delete: (name) => this.deleteCookie(name),
            include: (name) => this.includeCookie(name),
            length: () => this.lengthCookie(),
            all: () => this.getAllCookies(),
            validName: (name) => this.isValidCookieName(name),
            clearAll: () => this.clearAllCookies()
        }
    }

    setCookie(name, value, options = {}) {
        if (!this.isValidCookieName(name)) {
            throw new Error('Invalid cookie name')
        }

        options = {
            path: '/',
            sameSite: "None",
            ...options
        }

        if (value instanceof Object) {
            value = JSON.stringify(value);
        }

        let cookieString = `${encodeURIComponent(name)}=${encodeURIComponent(value)}`

        if (options.expires instanceof Date) {
            cookieString += `;expires=${options.expires.toUTCString()}`
        }

        if (options.maxAge && typeof options.maxAge === 'number') {
            cookieString += `;max-age=${options.maxAge}`
        }

        if (options.domain && typeof options.domain === 'string') {
            cookieString += `;domain=${options.domain}`
        }

        if (options.path && typeof options.path === 'string') {
            cookieString += `;path=${options.path}`
        }

        if (options.secure === true) {
            cookieString += ';secure'
        }

        if (options.httpOnly === true) {
            cookieString += ';httpOnly'
        }

        if (options.sameSite && ['Lax', 'Strict', 'None'].includes(options.sameSite)) {
            cookieString += `;SameSite=${options.sameSite}`
        }

        document.cookie = cookieString
    }

    getCookie(name) {
        if (!this.isValidCookieName(name)) {
            throw new Error('Invalid cookie name')
        }

        const nameEQ = name + "="
        const ca = document.cookie.split(';')
        for(let i=0;i < ca.length;i++) {
            let c = ca[i]
            while (c.charAt(0)===' ') c = c.substring(1,c.length)
            if (c.indexOf(nameEQ) === 0) return c.substring(nameEQ.length,c.length)
        }
        return null
    }
    
    getAllCookies() {
        return document.cookie
            .split('; ')
            .map(cookie => {
                const [name, value] = cookie.split('=')
                return { [name]: decodeURIComponent(value) }
            })
            .reduce((acc, cookie) => Object.assign(acc, cookie), {})
    }

    deleteCookie(name) {
        if (!this.isValidCookieName(name)) {
            throw new Error('Invalid cookie name')
        }

        this.setCookie(name, '', { expires: new Date(0) })
    }

    includeCookie(name, matchCase = true) {
        if (!this.isValidCookieName(name)) {
            throw new Error('Invalid cookie name')
        }

        let cookie = document.cookie

        if (!matchCase) {
            cookie = cookie.toLowerCase()
            name = name.toLowerCase()
        }

        return cookie.includes(name)
    }

    lengthCookie() {
        if (document.cookie === "") return 0
        return document.cookie.split('; ').length
    }

    clearAllCookies() {
        const cookies = document.cookie.split(' ')

        cookies.forEach(cookie => {
            const [name] = cookie.split('=')
            this.deleteCookie(name.trim())
        })
    }

    isValidCookieName(name) {
        return /^[a-zA-Z0-9_-]+$/.test(name)
    }
}

export default StorageManager
