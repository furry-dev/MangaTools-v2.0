async function copyText(text: string) {
    try {
        await navigator.clipboard.writeText(text)
        return true
    } catch (err) {
        console.error(err)
        return false
    }
}