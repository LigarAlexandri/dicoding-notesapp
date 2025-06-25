const BASE_URL = 'https://notes-api.dicoding.dev/v2';

// Fungsi bantuan untuk menangani respons
async function handleResponse(response) {
    const data = await response.json();
    if (!response.ok) {
        // Lemparkan error dengan pesan dari API jika ada
        throw new Error(data.message || 'Terjadi kesalahan pada permintaan.');
    }
    return data;
}

// Mendapatkan semua catatan aktif (tidak diarsipkan)
async function getAllNotes() {
    try {
        const response = await fetch(`${BASE_URL}/notes`);
        const result = await handleResponse(response);
        return { error: false, data: result.data };
    } catch (error) {
        console.error('Error in getAllNotes:', error);
        return { error: true, message: error.message };
    }
}

// Mendapatkan semua catatan yang diarsipkan
async function getArchivedNotes() {
    try {
        const response = await fetch(`${BASE_URL}/notes/archived`);
        const result = await handleResponse(response);
        return { error: false, data: result.data };
    } catch (error) {
        console.error('Error in getArchivedNotes:', error);
        return { error: true, message: error.message };
    }
}

// Menambahkan catatan baru
async function addNote(note) {
    try {
        const response = await fetch(`${BASE_URL}/notes`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(note),
        });
        const result = await handleResponse(response);
        return { error: false, data: result.data };
    } catch (error) {
        console.error('Error in addNote:', error);
        return { error: true, message: error.message };
    }
}

// Menghapus catatan berdasarkan ID
async function deleteNote(id) {
    try {
        const response = await fetch(`${BASE_URL}/notes/${id}`, {
            method: 'DELETE',
        });
        const result = await handleResponse(response);
        return { error: false, data: result.data };
    } catch (error) {
        console.error('Error in deleteNote:', error);
        return { error: true, message: error.message };
    }
}

// Mengarsipkan catatan berdasarkan ID
async function archiveNote(id) {
    try {
        const response = await fetch(`${BASE_URL}/notes/${id}/archive`, {
            method: 'POST',
        });
        const result = await handleResponse(response);
        return { error: false, data: result.data };
    } catch (error) {
        console.error('Error in archiveNote:', error);
        return { error: true, message: error.message };
    }
}

// Membatalkan arsip catatan berdasarkan ID
async function unarchiveNote(id) {
    try {
        const response = await fetch(`${BASE_URL}/notes/${id}/unarchive`, {
            method: 'POST',
        });
        const result = await handleResponse(response);
        return { error: false, data: result.data };
    } catch (error) {
        console.error('Error in unarchiveNote:', error);
        return { error: true, message: error.message };
    }
}

export {
    getAllNotes,
    getArchivedNotes,
    addNote,
    deleteNote,
    archiveNote,
    unarchiveNote
};
