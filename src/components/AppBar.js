// 2. <app-bar> - Header dengan penanganan custom attribute
class AppBar extends HTMLElement {
  static get observedAttributes() {
    return ['header-title'];
  }

  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
    this._headerTitle = this.getAttribute('header-title') || 'Aplikasi Catatan';
  }

  attributeChangedCallback(name, oldValue, newValue) {
    if (name === 'header-title' && oldValue !== newValue) {
      this._headerTitle = newValue;
      this.render();
    }
  }

  connectedCallback() {
    this.render();
  }

  render() {
    this.shadowRoot.innerHTML = `
            <style>
                :host {
                    display: block;
                    padding: 16px;
                    width: 100%;
                    background-color: var(--primary-color);
                    color: var(--on-primary);
                    text-align: center;
                    font-size: 1.2em;
                    font-weight: 600;
                    box-shadow: 0 2px 4px rgba(0,0,0,0.1);
                    box-sizing: border-box;
                }
                h1 {
                    margin: 0;
                    font-size: 1.5rem;
                }
                @media (max-width: 768px) {
                    h1 {
                       font-size: 1.2rem;
                    }
                }
            </style>
            <h1>${this._headerTitle}</h1>
        `;
  }
}

customElements.define('app-bar', AppBar);
