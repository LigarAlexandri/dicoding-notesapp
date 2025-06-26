// 4. <note-list> - Komponen untuk daftar catatan
class NoteList extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
    this._notes = [];
  }

  connectedCallback() {
    this.render();
  }

  updateNotes(notes) {
    this._notes = notes || [];
    this.render();
  }

  render() {
    this.shadowRoot.innerHTML = `
            <style>
                .note-list-container {
                    display: grid;
                    grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
                    gap: 24px;
                }
                .empty-message {
                    text-align: center;
                    font-size: 1.2em;
                    color: #777;
                    grid-column: 1 / -1;
                    margin-top: 40px;
                }
                @media (max-width: 600px) {
                    .note-list-container {
                        grid-template-columns: 1fr;
                    }
                }
            </style>
            <div class="note-list-container" id="notes-container">
                ${this._notes.length > 0
    ? this._notes.map((note) => `
                        <note-item
                            data-id="${note.id}"
                            data-title="${this.escapeHtml(note.title)}"
                            data-body="${this.escapeHtml(note.body)}"
                            data-created="${note.createdAt}">
                        </note-item>
                    `).join('')
    : '<p class="empty-message">Tidak ada catatan.</p>'
}
            </div>
        `;
  }

  escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
  }
}

customElements.define('note-list', NoteList);
