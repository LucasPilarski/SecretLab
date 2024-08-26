const createHTMLProxy = (initValue, {
    selector,
    template
}) => {
    return new Proxy(initValue, {
        set(object, key, value) {
            object[key] = value;
            let updatedTemplate = template;
            Object.keys(object).forEach(key => {
                updatedTemplate = updatedTemplate.replace(`{${key}}`, object[key])
            })
            document.getElementById(selector).textContent = updatedTemplate;
            return true;
        },
    })
}

const counter = createHTMLProxy({value: 0}, {
    selector: 'counter',
    template: `Counter: {value}`
})

const callbacks = {
    increase: (event) => {
        counter.value += 1
    }
}

document.addEventListener('DOMContentLoaded', () => {
    document.addEventListener('click', e => {
        if (e.target.nodeName === 'BUTTON') {
            if (e.target.dataset.click) {
                callbacks[e.target.dataset.click](e)
            }
        }
    })
})
