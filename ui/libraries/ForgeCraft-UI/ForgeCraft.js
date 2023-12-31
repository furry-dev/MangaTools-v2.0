document.addEventListener('click', (e) => {
    if (!e.target.closest('.hideOnClickOut')) {
        document.querySelectorAll('.hideOnClickOut').forEach(value => {
            value.classList.remove('opened')
        })
    }
})