// Data dummy yang sudah diperbarui dan lengkap
const notesData = [
  { id: 'notes-jT-jjsyz61J8XKiI', title: 'Welcome to Notes, Dimas!', body: 'Welcome to Notes! This is your first note. You can archive it, delete it, or create new ones.', createdAt: '2022-07-28T10:03:12.594Z', archived: false, },
  { id: 'notes-aB-cdefg12345', title: 'Meeting Agenda', body: 'Discuss project updates and assign tasks for the upcoming week.', createdAt: '2022-08-05T15:30:00.000Z', archived: false, },
  { id: 'notes-XyZ-789012345', title: 'Shopping List', body: 'Milk, eggs, bread, fruits, and vegetables.', createdAt: '2022-08-10T08:45:23.120Z', archived: false, },
  { id: 'notes-1a-2b3c4d5e6f', title: 'Personal Goals', body: 'Read two books per month, exercise three times a week, learn a new language.', createdAt: '2022-08-15T18:12:55.789Z', archived: false, },
  { id: 'notes-LMN-456789', title: 'Recipe: Spaghetti Bolognese', body: 'Ingredients: ground beef, tomatoes, onions, garlic, pasta. Steps:...', createdAt: '2022-08-20T12:30:40.200Z', archived: false, },
  { id: 'notes-QwErTyUiOp', title: 'Workout Routine', body: 'Monday: Cardio, Tuesday: Upper body, Wednesday: Rest, Thursday: Lower body, Friday: Cardio.', createdAt: '2022-08-25T09:15:17.890Z', archived: false, },
  { id: 'notes-abcdef-987654', title: 'Book Recommendations', body: "1. 'The Alchemist' by Paulo Coelho\n2. '1984' by George Orwell\n3. 'To Kill a Mockingbird' by Harper Lee", createdAt: '2022-09-01T14:20:05.321Z', archived: false, },
  { id: 'notes-zyxwv-54321', title: 'Daily Reflections', body: 'Write down three positive things that happened today and one thing to improve tomorrow.', createdAt: '2022-09-07T20:40:30.150Z', archived: false, },
  { id: 'notes-poiuyt-987654', title: 'Travel Bucket List', body: '1. Paris, France\n2. Kyoto, Japan\n3. Santorini, Greece\n4. New York City, USA', createdAt: '2022-09-15T11:55:44.678Z', archived: false, },
  { id: 'notes-asdfgh-123456', title: 'Coding Projects', body: '1. Build a personal website\n2. Create a mobile app\n3. Contribute to an open-source project', createdAt: '2022-09-20T17:10:12.987Z', archived: false, },
  { id: 'notes-5678-abcd-efgh', title: 'Project Deadline', body: 'Complete project tasks by the deadline on October 1st.', createdAt: '2022-09-28T14:00:00.000Z', archived: false, },
  { id: 'notes-9876-wxyz-1234', title: 'Health Checkup', body: 'Schedule a routine health checkup with the doctor.', createdAt: '2022-10-05T09:30:45.600Z', archived: false, },
  { id: 'notes-qwerty-8765-4321', title: 'Financial Goals', body: '1. Create a monthly budget\n2. Save 20% of income\n3. Invest in a retirement fund.', createdAt: '2022-10-12T12:15:30.890Z', archived: false, },
  { id: 'notes-98765-54321-12345', title: 'Holiday Plans', body: 'Research and plan for the upcoming holiday destination.', createdAt: '2022-10-20T16:45:00.000Z', archived: false, },
  { id: 'notes-1234-abcd-5678', title: 'Language Learning', body: 'Practice Spanish vocabulary for 30 minutes every day.', createdAt: '2022-10-28T08:00:20.120Z', archived: false, },
];

// 1. <note-app> - Komponen utama
class NoteApp extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: 'open' });
        this._notes = [];
    }

    connectedCallback() {
        console.log('NoteApp connected, loading notes...'); // Debug
        this._notes = [...notesData];
        console.log('Notes loaded:', this._notes.length); // Debug
        this.render();
        this.setupEventListeners();
    }

    setupEventListeners() {
        const noteForm = this.shadowRoot.querySelector('note-form');
        if (noteForm) {
            noteForm.addEventListener('add-note', (event) => {
                console.log('Adding new note:', event.detail); // Debug
                const newNote = event.detail;
                this._notes.unshift(newNote);
                this.updateNoteList();
            });
        }
    }

    updateNoteList() {
        const noteList = this.shadowRoot.querySelector('note-list');
        if (noteList) {
            console.log('Updating note list with', this._notes.length, 'notes'); // Debug
            noteList.updateNotes(this._notes);
        }
    }

    render() {
        this.shadowRoot.innerHTML = `
            <style>
                @import 'style.css';
            </style>
            <app-bar header-title="Note App - Ligar Alexandri"></app-bar>
            <main>
                <note-form></note-form>
                <section>
                    <h2 class="section-title">Catatan Saya</h2>
                    <note-list></note-list>
                </section>
            </main>
        `;
        
        // Set initial notes after a brief delay to ensure elements are ready
        setTimeout(() => {
            this.updateNoteList();
        }, 0);
    }
}

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
                @import 'style.css';
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

// 3. <note-form> - Formulir dengan validasi real-time
class NoteForm extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: 'open' });
        this.MAX_TITLE_LENGTH = 50;
    }

    connectedCallback() {
        this.render();
        this.setupEventListeners();
    }

    setupEventListeners() {
        const form = this.shadowRoot.querySelector('form');
        const titleInput = this.shadowRoot.querySelector('#note-title');
        const bodyInput = this.shadowRoot.querySelector('#note-body');
        const submitButton = this.shadowRoot.querySelector('button');
        const charCounter = this.shadowRoot.querySelector('.char-counter');

        const validateForm = () => {
            const titleValue = titleInput.value.trim();
            const bodyValue = bodyInput.value.trim();
            const titleLength = titleValue.length;
            
            charCounter.textContent = `${titleLength}/${this.MAX_TITLE_LENGTH}`;
            
            if (titleLength > this.MAX_TITLE_LENGTH) {
                charCounter.style.color = 'red';
            } else {
                charCounter.style.color = 'inherit';
            }

            submitButton.disabled = !titleValue || !bodyValue || titleLength > this.MAX_TITLE_LENGTH;
        };

        titleInput.addEventListener('input', validateForm);
        bodyInput.addEventListener('input', validateForm);

        form.addEventListener('submit', (event) => {
            event.preventDefault();
            const newNote = {
                id: 'notes-' + Math.random().toString(36).substr(2, 9) + '-' + Date.now(),
                title: titleInput.value.trim(),
                body: bodyInput.value.trim(),
                createdAt: new Date().toISOString(),
                archived: false,
            };
            
            console.log('Form submitting note:', newNote); // Debug
            this.dispatchEvent(new CustomEvent('add-note', { 
                detail: newNote, 
                bubbles: true, 
                composed: true 
            }));
            
            form.reset();
            validateForm();
        });
        
        validateForm();
    }

    render() {
        this.shadowRoot.innerHTML = `
            <style>
                @import 'style.css';
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

// 4. <note-list> - Komponen untuk daftar catatan
class NoteList extends HTMLElement {
    constructor() { 
        super(); 
        this.attachShadow({ mode: 'open' }); 
        this._notes = [];
    }
    
    connectedCallback() {
        console.log('NoteList connected'); // Debug
        this.render();
    }
    
    updateNotes(notes) {
        console.log('NoteList updateNotes called with:', notes?.length, 'notes'); // Debug
        this._notes = notes || [];
        this.render();
    }
    
    render() {
        console.log('NoteList rendering with', this._notes.length, 'notes'); // Debug
        
        this.shadowRoot.innerHTML = `
            <style>
                @import 'style.css';
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
                    ? this._notes.map(note => `
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

// 5. <note-item> - Komponen untuk setiap item catatan
class NoteItem extends HTMLElement {
    static get observedAttributes() {
        return ['data-id', 'data-title', 'data-body', 'data-created'];
    }
    
    constructor() { 
        super(); 
        this.attachShadow({ mode: 'open' }); 
    }
    
    connectedCallback() {
        this.render();
    }
    
    attributeChangedCallback(name, oldValue, newValue) {
        if (oldValue !== newValue) {
            this.render();
        }
    }
    
    render() {
        const title = this.getAttribute('data-title') || '';
        const body = this.getAttribute('data-body') || '';
        const createdAt = this.getAttribute('data-created') || '';
        
        if (!title && !body) {
            return; // Don't render if no data
        }
        
        const formattedDate = createdAt ? new Date(createdAt).toLocaleDateString('id-ID', { 
            weekday: 'long', 
            year: 'numeric', 
            month: 'long', 
            day: 'numeric' 
        }) : '';
        
        this.shadowRoot.innerHTML = `
            <style>
                @import 'style.css';
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
            </style>
            <h3>${title}</h3>
            ${formattedDate ? `<span class="date">${formattedDate}</span>` : ''}
            <p>${body}</p>
        `;
    }
}

// Mendefinisikan semua custom elements
customElements.define('note-app', NoteApp);
customElements.define('app-bar', AppBar);
customElements.define('note-form', NoteForm);
customElements.define('note-list', NoteList);
customElements.define('note-item', NoteItem);