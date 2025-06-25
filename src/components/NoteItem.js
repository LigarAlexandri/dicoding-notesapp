// 5. <note-item> - Komponen untuk setiap item catatan
class NoteItem extends HTMLElement {
    static get observedAttributes() {
        return ['data-id', 'data-title', 'data-body', 'data-created', 'data-archived'];
    }

    constructor() {
        super();
        this.attachShadow({ mode: 'open' });
    }

    connectedCallback() {
        this.render();
        this.setupEventListeners();
    }

    setupEventListeners() {
        // Hapus event listener lama jika ada (untuk menghindari duplikasi)
        const oldDeleteButton = this.shadowRoot.querySelector('.delete-button');
        if (oldDeleteButton) oldDeleteButton.removeEventListener('click', this._deleteHandler);
        const oldArchiveButton = this.shadowRoot.querySelector('.archive-button');
        if (oldArchiveButton) oldArchiveButton.removeEventListener('click', this._archiveHandler);


        this._deleteHandler = () => {
            const noteId = this.getAttribute('data-id');
            this.dispatchEvent(new CustomEvent('delete-note', {
                detail: noteId,
                bubbles: true,
                composed: true
            }));
        };

        this._archiveHandler = () => {
            const noteId = this.getAttribute('data-id');
            const isArchived = this.getAttribute('data-archived') === 'true';
            this.dispatchEvent(new CustomEvent(isArchived ? 'unarchive-note' : 'archive-note', {
                detail: noteId,
                bubbles: true,
                composed: true
            }));
        };

        // Tambahkan event listener baru
        const deleteButton = this.shadowRoot.querySelector('.delete-button');
        if (deleteButton) deleteButton.addEventListener('click', this._deleteHandler);
        const archiveButton = this.shadowRoot.querySelector('.archive-button');
        if (archiveButton) archiveButton.addEventListener('click', this._archiveHandler);
    }

    attributeChangedCallback(name, oldValue, newValue) {
        if (oldValue !== newValue) {
            this.render();
            // Panggil kembali setupEventListeners untuk memastikan event listener baru dipasang
            // setelah rendering ulang karena perubahan atribut.
            this.setupEventListeners();
        }
    }

    render() {
        const id = this.getAttribute('data-id') || '';
        const title = this.getAttribute('data-title') || '';
        const body = this.getAttribute('data-body') || '';
        const createdAt = this.getAttribute('data-created') || '';
        const isArchived = this.getAttribute('data-archived') === 'true';

        if (!title && !body) {
            return; // Jangan render jika tidak ada data
        }

        const formattedDate = createdAt ? new Date(createdAt).toLocaleDateString('id-ID', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        }) : '';

        this.shadowRoot.innerHTML = `
            <style>
                :host {
                    display: flex;
                    flex-direction: column;
                    background-color: var(--surface-color);
                    border-radius: var(--border-radius);
                    box-shadow: var(--shadow);
                    padding: 24px;
                    transition: transform 0.3s, box-shadow 0.3s;
                    height: auto;
                    min-height: 200px;
                    box-sizing: border-box;
                    position: relative; /* Untuk posisi tombol delete/archive */
                    overflow: hidden; /* Untuk animasi pop-in jika diterapkan */
                }
                :host(:hover) {
                    transform: translateY(-5px);
                    box-shadow: 0 8px 20px rgba(0,0,0,0.12);
                }
                h3 {
                    margin: 0 0 8px 0;
                    font-size: 1.3em;
                    font-weight: 600;
                    color: #333;
                    word-wrap: break-word;
                }
                .date {
                    font-size: 0.8em;
                    color: #999;
                    margin-bottom: 16px;
                }
                p {
                    margin: 0;
                    flex-grow: 1;
                    line-height: 1.7;
                    white-space: pre-wrap;
                    word-wrap: break-word;
                    color: #555;
                }
                .actions {
                    position: absolute;
                    top: 10px;
                    right: 10px;
                    display: flex;
                    gap: 8px;
                }
                .action-button {
                    background-color: #ff4d4d;
                    color: white;
                    border: none;
                    border-radius: 50%;
                    width: 30px;
                    height: 30px;
                    font-size: 1.2em;
                    cursor: pointer;
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    box-shadow: 0 2px 4px rgba(0,0,0,0.2);
                    transition: background-color 0.2s, transform 0.2s;
                }
                .action-button:hover {
                    transform: scale(1.1);
                }
                .delete-button {
                    background-color: #ff4d4d;
                }
                .delete-button:hover {
                    background-color: #cc0000;
                }
                .archive-button {
                    background-color: var(--secondary-color); /* Warna arsip/unarsip */
                }
                .archive-button:hover {
                    background-color: #d19a00; /* Warna hover arsip/unarsip */
                }
            </style>
            <h3>${title}</h3>
            ${formattedDate ? `<span class="date">${formattedDate}</span>` : ''}
            <p>${body}</p>
            <div class="actions">
                <button class="action-button archive-button" aria-label="${isArchived ? 'Batal Arsip' : 'Arsip'} catatan" data-id="${id}">
                    ${isArchived ? '&#x1F5C0;' : '&#x1F5C3;'} <!-- Icon arsip atau unarsip -->
                </button>
                <button class="action-button delete-button" aria-label="Hapus catatan" data-id="${id}">
                    &times;
                </button>
            </div>
        `;
    }
}

customElements.define('note-item', NoteItem);
