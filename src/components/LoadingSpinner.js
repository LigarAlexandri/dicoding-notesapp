class LoadingSpinner extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: 'open' });
        this.render();
    }

    render() {
        this.shadowRoot.innerHTML = `
            <style>
                :host {
                    position: fixed;
                    top: 0;
                    left: 0;
                    width: 100%;
                    height: 100%;
                    background-color: rgba(255, 255, 255, 0.8);
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    z-index: 1000;
                    transition: opacity 0.3s ease-in-out;
                    opacity: 0; /* Default hidden */
                }
                :host([visible]) {
                    opacity: 1; /* Visible when attribute is present */
                }
                .spinner {
                    border: 8px solid #f3f3f3; /* Light grey */
                    border-top: 8px solid var(--primary-color); /* Blue */
                    border-radius: 50%;
                    width: 60px;
                    height: 60px;
                    animation: spin 1s linear infinite;
                }
                @keyframes spin {
                    0% { transform: rotate(0deg); }
                    100% { transform: rotate(360deg); }
                }
            </style>
            <div class="spinner"></div>
        `;
    }

    static get observedAttributes() {
        return ['visible'];
    }

    attributeChangedCallback(name, oldValue, newValue) {
        if (name === 'visible') {
            if (newValue !== null) {
                this.style.opacity = '1';
                this.style.display = 'flex';
            } else {
                this.style.opacity = '0';
                // Delay display:none to allow transition to complete
                setTimeout(() => {
                    if (this.getAttribute('visible') === null) { // Check if it's still hidden
                        this.style.display = 'none';
                    }
                }, 300);
            }
        }
    }
}

customElements.define('loading-spinner', LoadingSpinner);
