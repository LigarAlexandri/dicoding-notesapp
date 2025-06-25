// 3. <note-form> - Formulir dengan validasi real-time
class NoteForm extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: 'open' });
        this.MAX_TITLE_LENGTH = 50;
        this._isEnabled = true; // Untuk mengontrol status aktif/nonaktif form
    }

    connectedCallback() {
        this.render();
        this.setupEventListeners();
    }

    toggleFormEnabled(enabled) {
        this._isEnabled = enabled;
        const titleInput = this.shadowRoot.querySelector('#note-title');
        const bodyInput = this.shadowRoot.querySelector('#note-body');
        const submitButton = this.shadowRoot.querySelector('button');

        if (titleInput) titleInput.disabled = !enabled;
        if (bodyInput) bodyInput.disabled = !enabled;
        if (submitButton) this.validateForm(); // Re-validate to update button state
    }

    setupEventListeners() {
        const form = this.shadowRoot.querySelector('form');
        const titleInput = this.shadowRoot.querySelector('#note-title');
        const bodyInput = this.shadowRoot.querySelector('#note-body');
        const charCounter = this.shadowRoot.querySelector('.char-counter');

        this.validateForm = () => { // Make validateForm accessible for external calls
            const submitButton = this.shadowRoot.querySelector('button');
            const titleValue = titleInput.value.trim();
            const bodyValue = bodyInput.value.trim();
            const titleLength = titleValue.length;

            charCounter.textContent = `${titleLength}/${this.MAX_TITLE_LENGTH}`;

            if (titleLength > this.MAX_TITLE_LENGTH) {
                charCounter.style.color = 'red';
            } else {
                charCounter.style.color = 'inherit';
            }

            submitButton.disabled = !this._isEnabled || !titleValue || !bodyValue || titleLength > this.MAX_TITLE_LENGTH;
        };

        titleInput.addEventListener('input', this.validateForm);
        bodyInput.addEventListener('input', this.validateForm);

        form.addEventListener('submit', (event) => {
            event.preventDefault();
            if (!this._isEnabled) return; // Prevent submission if disabled

            const newNote = {
                title: titleInput.value.trim(),
                body: bodyInput.value.trim(),
            };

            this.dispatchEvent(new CustomEvent('add-note', {
                detail: newNote,
                bubbles: true,
                composed: true
            }));

            form.reset();
            this.validateForm();
        });

        this.validateForm(); // Initial validation
    }

    render() {
        this.shadowRoot.innerHTML = `
            <style>
                :host { display: block; max-width: 600px; margin: 0 auto 48px auto; }
                form { display: flex; flex-direction: column; gap: 20px; padding: 24px; background-color: var(--surface-color); border-radius: var(--border-radius); box-shadow: var(--shadow); }
                h2 { margin: 0 0 16px 0; font-weight: 600; color: var(--primary-color); }
                .input-group { position: relative; }
                input, textarea { width: 100%; padding: 14px; border: 1px solid var(--border-color); border-radius: 8px; font-size: 1em; font-family: inherit; transition: border-color 0.3s, box-shadow 0.3s; box-sizing: border-box;}
                input:focus, textarea:focus { outline: none; border-color: var(--primary-color); box-shadow: 0 0 0 3px rgba(74, 144, 226, 0.2); }
                textarea { min-height: 150px; resize: vertical; }
                .char-counter { text-align: right; font-size: 0.8em; color: #999; margin-top: 4px; }
                button { padding: 14px 24px; background-color: var(--primary-color); color: var(--on-primary); border: none; border-radius: 8px; font-size: 1em; font-weight: 600; cursor: pointer; transition: background-color 0.3s, transform 0.2s; align-self: flex-end; }
                button:hover:not(:disabled) { background-color: #357ABD; transform: translateY(-2px); }
                button:disabled { background-color: #B0C4DE; cursor: not-allowed; }
            </style>
            <form>
                <h2>Buat Catatan Baru</h2>
                <div class="input-group">
                    <input type="text" id="note-title" placeholder="Judul Catatan..." required>
                    <div class="char-counter">0/${this.MAX_TITLE_LENGTH}</div>
                </div>
                <textarea id="note-body" placeholder="Tuliskan catatanmu di sini..." required></textarea>
                <button type="submit" disabled>Buat Catatan</button>
            </form>
        `;
    }
}

customElements.define('note-form', NoteForm);
