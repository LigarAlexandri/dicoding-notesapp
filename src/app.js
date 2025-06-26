import 'regenerator-runtime';
import './style.css';
import {
  getAllNotes,
  getArchivedNotes,
  addNote,
  deleteNote,
  archiveNote,
  unarchiveNote
} from './utils/NotesAPI.js';
import './components/AppBar.js';
import './components/NoteForm.js';
import './components/NoteList.js';
import './components/NoteItem.js';
import './components/LoadingSpinner.js';
import Swal from 'sweetalert2'; // Impor SweetAlert2
import anime from 'animejs'; // Impor Anime.js

// 1. <note-app> - Komponen utama
class NoteApp extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
    this._activeNotes = [];
    this._archivedNotes = [];
    this._isLoading = false;
    this._currentView = 'active'; // 'active' atau 'archived'
  }

  connectedCallback() {
    this.render();
    this.setupEventListeners();
    this.fetchNotes();
  }

  setLoading(isLoading) {
    this._isLoading = isLoading;
    const spinner = this.shadowRoot.querySelector('loading-spinner');
    if (spinner) {
      // Gunakan atribut visible untuk mengontrol display dan opacity
      if (isLoading) {
        spinner.setAttribute('visible', '');
      } else {
        spinner.removeAttribute('visible');
      }
    }
    const noteForm = this.shadowRoot.querySelector('note-form');
    if (noteForm) {
      noteForm.toggleFormEnabled(!isLoading);
    }
  }

  async fetchNotes() {
    this.setLoading(true);
    try {
      const [activeResponse, archivedResponse] = await Promise.all([
        getAllNotes(),
        getArchivedNotes()
      ]);

      if (activeResponse.error) {
        Swal.fire({
          icon: 'error',
          title: 'Oops...',
          text: `Gagal mengambil catatan aktif: ${activeResponse.message}`,
        });
        this._activeNotes = [];
      } else {
        this._activeNotes = activeResponse.data;
      }

      if (archivedResponse.error) {
        Swal.fire({
          icon: 'error',
          title: 'Oops...',
          text: `Gagal mengambil catatan terarsip: ${archivedResponse.message}`,
        });
        this._archivedNotes = [];
      } else {
        this._archivedNotes = archivedResponse.data;
      }

    } catch (error) {
      console.error('Error fetching notes:', error);
      Swal.fire({
        icon: 'error',
        title: 'Oops...',
        text: `Terjadi kesalahan saat mengambil catatan: ${error.message}`,
      });
      this._activeNotes = [];
      this._archivedNotes = [];
    } finally {
      this.setLoading(false);
      this.updateNoteList();
      this.animateNotes(); // Panggil animasi setelah update
    }
  }

  setupEventListeners() {
    const noteForm = this.shadowRoot.querySelector('note-form');
    if (noteForm) {
      noteForm.addEventListener('add-note', async (event) => {
        const newNote = event.detail;
        this.setLoading(true);
        try {
          const response = await addNote(newNote);
          if (response.error) {
            Swal.fire({
              icon: 'error',
              title: 'Gagal!',
              text: `Gagal menambahkan catatan: ${response.message}`,
            });
          } else {
            Swal.fire({
              icon: 'success',
              title: 'Berhasil!',
              text: 'Catatan berhasil ditambahkan.',
              showConfirmButton: false,
              timer: 1500
            });
            await this.fetchNotes();
          }
        } catch (error) {
          console.error('Error adding note:', error);
          Swal.fire({
            icon: 'error',
            title: 'Oops...',
            text: `Terjadi kesalahan saat menambahkan catatan: ${error.message}`,
          });
        } finally {
          this.setLoading(false);
        }
      });
    }

    this.shadowRoot.addEventListener('delete-note', async (event) => {
      const noteIdToDelete = event.detail;
      const result = await Swal.fire({
        title: 'Apakah Anda yakin?',
        text: 'Catatan ini akan dihapus permanen!',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#ff4d4d',
        cancelButtonColor: '#999',
        confirmButtonText: 'Ya, hapus!',
        cancelButtonText: 'Batal'
      });

      if (result.isConfirmed) {
        this.setLoading(true);
        try {
          const response = await deleteNote(noteIdToDelete);
          if (response.error) {
            Swal.fire({
              icon: 'error',
              title: 'Gagal!',
              text: `Gagal menghapus catatan: ${response.message}`,
            });
          } else {
            Swal.fire(
              'Dihapus!',
              'Catatan Anda telah dihapus.',
              'success'
            );
            await this.fetchNotes();
          }
        } catch (error) {
          console.error('Error deleting note:', error);
          Swal.fire({
            icon: 'error',
            title: 'Oops...',
            text: `Terjadi kesalahan saat menghapus catatan: ${error.message}`,
          });
        } finally {
          this.setLoading(false);
        }
      }
    });

    this.shadowRoot.addEventListener('archive-note', async (event) => {
      const noteIdToArchive = event.detail;
      this.setLoading(true);
      try {
        const response = await archiveNote(noteIdToArchive);
        if (response.error) {
          Swal.fire({
            icon: 'error',
            title: 'Gagal!',
            text: `Gagal mengarsipkan catatan: ${response.message}`,
          });
        } else {
          Swal.fire({
            icon: 'success',
            title: 'Berhasil!',
            text: 'Catatan berhasil diarsipkan.',
            showConfirmButton: false,
            timer: 1500
          });
          await this.fetchNotes();
        }
      } catch (error) {
        console.error('Error archiving note:', error);
        Swal.fire({
          icon: 'error',
          title: 'Oops...',
          text: `Terjadi kesalahan saat mengarsipkan catatan: ${error.message}`,
        });
      } finally {
        this.setLoading(false);
      }
    });

    this.shadowRoot.addEventListener('unarchive-note', async (event) => {
      const noteIdToUnarchive = event.detail;
      this.setLoading(true);
      try {
        const response = await unarchiveNote(noteIdToUnarchive);
        if (response.error) {
          Swal.fire({
            icon: 'error',
            title: 'Gagal!',
            text: `Gagal membatalkan arsip catatan: ${response.message}`,
          });
        } else {
          Swal.fire({
            icon: 'success',
            title: 'Berhasil!',
            text: 'Catatan berhasil dibatalkan arsipnya.',
            showConfirmButton: false,
            timer: 1500
          });
          await this.fetchNotes();
        }
      } catch (error) {
        console.error('Error unarchiving note:', error);
        Swal.fire({
          icon: 'error',
          title: 'Oops...',
          text: `Terjadi kesalahan saat membatalkan arsip catatan: ${error.message}`,
        });
      } finally {
        this.setLoading(false);
      }
    });

    // Event listener untuk tombol tab
    this.shadowRoot.addEventListener('click', (event) => {
      if (event.target.matches('.tab-button')) {
        this._currentView = event.target.dataset.view;
        this.updateNoteList();
        this.updateTabButtons();
        this.animateNotes();
      }
    });
  }

  updateNoteList() {
    const noteList = this.shadowRoot.querySelector('note-list');
    if (noteList) {
      let notesToDisplay = [];
      if (this._currentView === 'active') {
        notesToDisplay = [...this._activeNotes].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
      } else {
        notesToDisplay = [...this._archivedNotes].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
      }
      noteList.updateNotes(notesToDisplay);

      // Update section title based on view
      const sectionTitle = this.shadowRoot.querySelector('.section-title');
      if (sectionTitle) {
        sectionTitle.textContent = this._currentView === 'active' ? 'Catatan Aktif Saya' : 'Catatan Terarsip Saya';
      }
    }
  }

  updateTabButtons() {
    const tabButtons = this.shadowRoot.querySelectorAll('.tab-button');
    tabButtons.forEach((button) => {
      if (button.dataset.view === this._currentView) {
        button.classList.add('active');
      } else {
        button.classList.remove('active');
      }
    });
  }

  animateNotes() {
    // Animasi untuk setiap note item setelah dirender
    anime({
      targets: this.shadowRoot.querySelectorAll('note-item'),
      opacity: [0, 1],
      translateY: [20, 0],
      delay: anime.stagger(100), // Staggered animation
      easing: 'easeOutQuad'
    });
  }

  render() {
    this.shadowRoot.innerHTML = `
            <style>
                @import './style.css';
                /* Tambahkan styling khusus untuk tab di sini jika tidak di style.css */
                .tabs-container {
                    display: flex;
                    justify-content: center;
                    gap: 16px;
                    margin-bottom: 32px;
                    padding: 0 16px; /* Tambahkan padding agar tidak terlalu mepet di mobile */
                }
                .tab-button {
                    padding: 12px 24px;
                    background-color: var(--surface-color);
                    color: var(--on-surface);
                    border: 1px solid var(--border-color);
                    border-radius: 8px;
                    font-size: 1em;
                    font-weight: 600;
                    cursor: pointer;
                    transition: background-color 0.3s, color 0.3s, box-shadow 0.3s;
                    min-width: 150px;
                    text-align: center;
                }
                .tab-button:hover:not(.active) {
                    background-color: #f0f0f0;
                    box-shadow: 0 2px 8px rgba(0,0,0,0.05);
                }
                .tab-button.active {
                    background-color: var(--primary-color);
                    color: var(--on-primary);
                    border-color: var(--primary-color);
                    box-shadow: var(--shadow);
                }

                @media (max-width: 600px) {
                    .tabs-container {
                        flex-direction: column;
                        align-items: stretch;
                    }
                    .tab-button {
                        width: 100%;
                        min-width: unset;
                    }
                }
            </style>
            <app-bar header-title="Note App - Ligar Alexandri"></app-bar>
            <main>
                <note-form></note-form>
                <section>
                    <div class="tabs-container">
                        <button class="tab-button active" data-view="active">Catatan Aktif</button>
                        <button class="tab-button" data-view="archived">Catatan Terarsip</button>
                    </div>
                    <h2 class="section-title">Catatan Aktif Saya</h2>
                    <note-list></note-list>
                </section>
            </main>
            <loading-spinner></loading-spinner>
        `;
    this.updateTabButtons(); // Pastikan tombol tab diperbarui pada render awal
  }
}

customElements.define('note-app', NoteApp);
