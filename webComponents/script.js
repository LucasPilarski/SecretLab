document.addEventListener('DOMContentLoaded', () => {
    class TextInput extends HTMLElement {
        static observedAttributes = ["type"];

        constructor() {
            super();
            debugger
            const element = document.createElement('template')
            element.innerHTML = '<label>Test<input type="text"/></label>'
            this.attachShadow({mode: "open"}).appendChild(element.content.cloneNode(true))
        }

        attributeChangeCallback(name, oldValue, newValue) {
            console.log(name, oldValue, newValue)
        }

        connectedCallback() {
            // this.shadowRoot.querySelector('input').type = this.getAttribute('type')
        }
    }

    customElements.define('text-input', TextInput)
})
