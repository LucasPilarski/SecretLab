class TextInput extends HTMLElement {
    static observedAttributes = ["type"];

    constructor() {
        super();
        debugger
        const element = document.createElement('template')
        element.innerHTML = '<label>Test<input type="text"/></label>'
        this.attachShadow({mode: "open"}).appendChild(element.content.cloneNode(true))
    }

    connectedCallback() {
        // this.shadowRoot.querySelector('input').type = this.getAttribute('type')
    }
}

customElements.define('text-input', TextInput)

const errorMessages = {
    required: "This field is required",
    maxtext: "This value can't be longer than {value} characters",
    mintext: "This value can't be shorter than {value}",
    minnumber: "This value can't be lower than {value}",
    maxnumber: "This value can't be higher than {value}"
}

const validator = {
    required: (value) => {
        return value.length <= 0
    },
    maxtext: (value, max) => {
        return value.length > parseInt(max)
    },
    mintext: (value, min) => {
        return value.length <= parseInt(min)
    },
    maxnumber: (value, max) => {
        return parseInt(value) > parseInt(max)
    },
    minnumber: (value, min) => {
        return parseInt(value) < parseInt(min)
    }
}

const getValidationRules = element => Object.entries(element).reduce((acc, [key, value]) => {
    if (key.includes('validation')) {
        const validationKey = key.replace('validation', '').toLowerCase()
        acc[validationKey] = value;
    }
    return acc
}, {})

const validateForm = (id) => {
    const form = document.getElementById(id)
    const inputs = form.getElementsByTagName("input")
    let formValid = true
    for (let i = 0; i < inputs.length; i++) {
        if (inputs[i].dataset.valid === 'false') formValid = false
    }
    form.dataset.valid = String(formValid)
    document.getElementById(`${form.id}-submit`).disabled = !formValid
}

document.addEventListener('DOMContentLoaded', () => {

    document.getElementById('form-main').addEventListener('submit', e => {
        e.preventDefault()
        if (e.target.dataset.valid === 'true') {
            document.getElementById(`${e.target.id}-status`).textContent = 'Submitting'
            let formData = {}
            const inputs = e.target.getElementsByTagName("input")
            for (let i = 0; i < inputs.length; i++) {
                formData[inputs[i].name] = inputs[i].value
            }
            console.log(formData)
            document.getElementById(`${e.target.id}-status`).textContent = ''
        }
    })

    document.getElementById('form-main').addEventListener('keyup', e => {
        if (e.key === 'Tab') {
            return;
        }
        if (e.target.nodeName === 'INPUT') {
            e.target.dataset.dirty = 'true'
            const validationRules = getValidationRules(e.target.dataset)
            if (Object.keys(validationRules).length > 0) {
                document.getElementById(`${e.target.id}-errors`).textContent = ''
                const error = Object.keys(validationRules).find(key => {
                    return validator[key](e.target.value, validationRules[key])
                })
                if (error) {
                    let errorMessage = errorMessages[error];
                    if (errorMessage.includes('{')) {
                        errorMessage = errorMessage.replace('{value}', validationRules[error])
                    }
                    document.getElementById(`${e.target.id}`).dataset.valid = 'false'
                    document.getElementById(`${e.target.id}-errors`).textContent = errorMessage
                } else {
                    document.getElementById(`${e.target.id}`).dataset.valid = 'true'
                }
                validateForm('form-main')
            }
        }
    })
})

