// Import utilities
import { AnimationUtils, LoadingUtils, DomUtils, EventUtils, ValidationUtils } from './utils/index.js';

// Import modules
import { FirebaseManager } from './modules/firebaseManager.js';
import { CSVImporter } from './modules/csvImporter.js';
import { PDFGenerator } from './modules/pdfGenerator.js';
import { FilterManager } from './modules/filterManager.js';

class SongManager {
    constructor() {
        this.firebaseManager = new FirebaseManager();
        this.songs = [];
        this.filteredSongs = [];
        this.currentEditId = null;
        this.songToDelete = null;
        this.csvImporter = new CSVImporter(this);
        this.pdfGenerator = new PDFGenerator(this);
        this.filterManager = new FilterManager(this);
        this.initializeEventListeners();
        this.initializeApp();
    }

    async initializeApp() {
        // Mostrar loading en tabla
        this.showTableLoading();
        
        // Cargar datos iniciales
        await this.loadInitialData();
        
        // Ocultar loading
        this.hideTableLoading();
    }

    async loadInitialData() {
        try {
            // Esperar a que Firebase se inicialize completamente
            await this.waitForFirebaseInit();
            
            // Limpiar localStorage para forzar migración con IDs automáticos
            const localSongs = JSON.parse(localStorage.getItem('songs') || '[]');
            if (localSongs.length > 0) {
                localStorage.removeItem('songs');
            }
            
            // Intentar migrar desde localStorage si es necesario
            await this.firebaseManager.migrateFromLocalStorage();
            
            // Cargar desde Firebase
            this.songs = await this.firebaseManager.loadSongs();
            this.filteredSongs = this.songs;
            this.renderTable();
        } catch (error) {
            console.error('Error cargando datos iniciales:', error);
            this.songs = [];
            this.filteredSongs = [];
            this.renderTable();
            alert('Error cargando datos. Verifica tu conexión a Firebase.');
        }
    }

    // Esperar a que Firebase se inicialice completamente
    async waitForFirebaseInit() {
        return new Promise((resolve) => {
            const checkInit = () => {
                if (this.firebaseManager.isInitialized) {
                    resolve();
                } else {
                    setTimeout(checkInit, 100);
                }
            };
            checkInit();
        });
    }



    // Loading methods - using utils
    showTableLoading() {
        LoadingUtils.showTableLoading();
    }

    hideTableLoading() {
        LoadingUtils.hideTableLoading();
    }

    showButtonLoading(buttonId, textId, spinnerId) {
        LoadingUtils.showButtonLoading(buttonId, textId, spinnerId);
    }

    hideButtonLoading(buttonId, textId, spinnerId) {
        LoadingUtils.hideButtonLoading(buttonId, textId, spinnerId);
    }



    initializeEventListeners() {
        document.getElementById('addSongBtn').addEventListener('click', () => this.showModal());
        document.getElementById('importCsvBtn').addEventListener('click', () => document.getElementById('csvFileInput').click());
        document.getElementById('downloadCsvBtn').addEventListener('click', () => this.downloadCSV());
        document.getElementById('downloadPdfBtn').addEventListener('click', () => this.pdfGenerator.generateFilteredPDF());
        document.getElementById('csvFileInput').addEventListener('change', (e) => this.csvImporter.handleFileImport(e.target));
        document.getElementById('cancelBtn').addEventListener('click', () => this.hideModal());
        document.getElementById('songForm').addEventListener('submit', (e) => this.handleSubmit(e));
        document.getElementById('deleteCancelBtn').addEventListener('click', () => this.hideDeleteModal());
        document.getElementById('deleteConfirmBtn').addEventListener('click', () => this.confirmDelete());
        
        // Filtros - add debouncing for better performance
        EventUtils.addDebouncedListener(DomUtils.getElementById('searchInput'), 'input', () => this.filterManager.applyFilters(), 200);
        document.getElementById('clearFilters').addEventListener('click', () => this.filterManager.clearFilters());
        
        // Add debounced input for better performance
        EventUtils.addDebouncedListener(DomUtils.getElementById('artistName'), 'input', (e) => this.handleArtistInput(e), 150);
        document.addEventListener('click', (e) => {
            if (!e.target.closest('#artistName') && !e.target.closest('#artistSuggestions')) {
                document.getElementById('artistSuggestions').classList.add('hidden');
            }
        });

        // Event delegation for comment inputs - will be set up after table rendering

    }

    handleArtistInput(e) {
        const input = e.target.value;
        const suggestions = document.getElementById('artistSuggestions');
        
        if (input.length < 2) {
            suggestions.classList.add('hidden');
            return;
        }

        // Use cached artists list for better performance
        if (!this.cachedArtists) {
            this.cachedArtists = [...new Set(this.songs.map(song => song.artistName))];
        }

        const filteredArtists = this.cachedArtists.filter(artist => 
            artist.toLowerCase().includes(input.toLowerCase())
        );

        if (filteredArtists.length > 0) {
            suggestions.innerHTML = filteredArtists.map(artist => 
                `<div class="px-3 py-2 hover:bg-gray-100 cursor-pointer" onclick="this.selectArtist('${artist}')">${artist}</div>`
            ).join('');
            suggestions.classList.remove('hidden');
        } else {
            suggestions.classList.add('hidden');
        }
    }

    selectArtist(artistName) {
        document.getElementById('artistName').value = artistName;
        document.getElementById('artistSuggestions').classList.add('hidden');
    }

    // Invalidate cached artists when songs change
    invalidateArtistsCache() {
        this.cachedArtists = null;
    }

    showModal(song = null) {
        this.currentEditId = song ? song.id : null;
        document.getElementById('modalTitle').textContent = song ? 'Editar Canción' : 'Agregar Canción';
        
        if (song) {
            document.getElementById('artistName').value = song.artistName;
            document.getElementById('songName').value = song.songName;
            document.getElementById('youtubeLink').value = song.youtubeLink;
            document.getElementById('state').value = song.state;
            document.getElementById('type').value = song.type;
        } else {
            document.getElementById('songForm').reset();
        }
        
        document.getElementById('songModal').classList.remove('hidden');
    }

    hideModal() {
        document.getElementById('songModal').classList.add('hidden');
        this.currentEditId = null;
    }

    showDeleteModal(song) {
        this.songToDelete = song;
        document.getElementById('deleteModal').classList.remove('hidden');
    }

    hideDeleteModal() {
        document.getElementById('deleteModal').classList.add('hidden');
        this.songToDelete = null;
    }

    async handleSubmit(e) {
        e.preventDefault();
        
        // Mostrar loading en botón
        this.showButtonLoading('saveSongBtn', 'saveSongText', 'saveSongSpinner');
        
        const formData = {
            artistName: document.getElementById('artistName').value,
            songName: document.getElementById('songName').value,
            youtubeLink: document.getElementById('youtubeLink').value,
            state: document.getElementById('state').value,
            type: document.getElementById('type').value
        };

        try {
            if (this.currentEditId) {
                const updatedSong = await this.firebaseManager.updateSong(this.currentEditId, formData);
                if (updatedSong) {
                    const index = this.songs.findIndex(song => song.id === this.currentEditId);
                    this.songs[index] = { ...formData, id: this.currentEditId };
                }
            } else {
                const newSong = await this.firebaseManager.addSong(formData);
                if (newSong) {
                    this.songs.push(newSong);
                }
            }

            this.invalidateArtistsCache();
            this.filterManager.applyFilters();
            this.hideModal();
        } catch (error) {
            console.error('Error guardando canción:', error);
            alert('Error guardando canción: ' + error.message);
        } finally {
            // Ocultar loading
            this.hideButtonLoading('saveSongBtn', 'saveSongText', 'saveSongSpinner');
        }
    }

    async confirmDelete() {
        if (this.songToDelete) {
            // Mostrar loading en botón eliminar
            this.showButtonLoading('deleteConfirmBtn', 'deleteConfirmText', 'deleteConfirmSpinner');
            
            try {
                const success = await this.firebaseManager.deleteSong(this.songToDelete.id);
                if (success) {
                    this.songs = this.songs.filter(song => song.id !== this.songToDelete.id);
                    this.invalidateArtistsCache();
                    this.filterManager.applyFilters();
                }
                this.hideDeleteModal();
            } catch (error) {
                console.error('Error eliminando canción:', error);
                alert('Error eliminando canción: ' + error.message);
            } finally {
                // Ocultar loading
                this.hideButtonLoading('deleteConfirmBtn', 'deleteConfirmText', 'deleteConfirmSpinner');
            }
        }
    }

    editSong(song) {
        this.showModal(song);
    }

    deleteSong(song) {
        this.showDeleteModal(song);
    }

    openYouTube(song) {
        if (song.youtubeLink) {
            window.open(song.youtubeLink, '_blank');
        }
    }

    async updateComment(songId, comment) {
        const song = this.songs.find(song => song.id === songId);
        if (song) {
            const input = document.querySelector(`[data-song-id="${songId}"]`);
            if (!input) return;

            // Show loading spinner
            this.showCommentLoading(input);

            const updatedSong = { ...song, comments: comment };
            try {
                const success = await this.firebaseManager.updateSong(songId, updatedSong);
                if (success) {
                    const index = this.songs.findIndex(song => song.id === songId);
                    this.songs[index] = updatedSong;
                    
                    // Update filteredSongs as well
                    const filteredIndex = this.filteredSongs.findIndex(song => song.id === songId);
                    if (filteredIndex !== -1) {
                        this.filteredSongs[filteredIndex] = updatedSong;
                    }
                    
                    // Show success feedback
                    this.showCommentSuccess(input);
                } else {
                    this.showCommentError(input);
                }
            } catch (error) {
                console.error('Error actualizando comentario:', error);
                this.showCommentError(input);
            } finally {
                // Hide loading spinner after a short delay
                setTimeout(() => {
                    this.hideCommentLoading(input);
                }, 1000);
            }
        }
    }

    setupCommentEventListeners() {
        // Remove existing listeners to avoid duplicates
        document.removeEventListener('blur', this.handleCommentBlur);
        document.removeEventListener('keydown', this.handleCommentKeydown);
        
        // Bind methods to preserve 'this' context
        this.handleCommentBlur = (e) => {
            if (e.target.classList.contains('comment-input')) {
                const songId = e.target.getAttribute('data-song-id');
                const comment = e.target.value;
                if (songId) {
                    this.updateComment(songId, comment);
                }
            }
        };
        
        this.handleCommentKeydown = (e) => {
            if (e.target.classList.contains('comment-input')) {
                if (e.key === 'Enter') {
                    e.preventDefault();
                    e.target.blur();
                }
            }
        };
        
        // Add event listeners
        document.addEventListener('blur', this.handleCommentBlur, true);
        document.addEventListener('keydown', this.handleCommentKeydown, true);
    }

    // Comment loading feedback methods
    showCommentLoading(input) {
        // Add loading spinner to the input container
        const container = input.parentNode;
        if (!container.querySelector('.comment-spinner')) {
            const spinner = document.createElement('div');
            spinner.className = 'comment-spinner absolute right-2 top-1/2 transform -translate-y-1/2';
            spinner.innerHTML = '<div class="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-500"></div>';
            container.style.position = 'relative';
            container.appendChild(spinner);
        }
        
        // Disable input during loading
        input.disabled = true;
        input.style.opacity = '0.7';
    }

    hideCommentLoading(input) {
        const container = input.parentNode;
        const spinner = container.querySelector('.comment-spinner');
        if (spinner) {
            spinner.remove();
        }
        
        // Re-enable input
        input.disabled = false;
        input.style.opacity = '1';
    }

    showCommentSuccess(input) {
        // Add success indicator
        const container = input.parentNode;
        if (!container.querySelector('.comment-success')) {
            const success = document.createElement('div');
            success.className = 'comment-success absolute right-2 top-1/2 transform -translate-y-1/2 text-green-500';
            success.innerHTML = '✓';
            container.appendChild(success);
            
            // Remove success indicator after 2 seconds
            setTimeout(() => {
                if (success.parentNode) {
                    success.remove();
                }
            }, 2000);
        }
    }

    showCommentError(input) {
        // Add error indicator
        const container = input.parentNode;
        if (!container.querySelector('.comment-error')) {
            const error = document.createElement('div');
            error.className = 'comment-error absolute right-2 top-1/2 transform -translate-y-1/2 text-red-500';
            error.innerHTML = '✗';
            container.appendChild(error);
            
            // Remove error indicator after 3 seconds
            setTimeout(() => {
                if (error.parentNode) {
                    error.remove();
                }
            }, 3000);
        }
    }

    async downloadCSV() {
        if (this.filteredSongs.length === 0) {
            alert('No hay canciones para exportar. Ajusta los filtros o agrega canciones.');
            return;
        }

        // Mostrar loading
        this.showButtonLoading('downloadCsvBtn', 'downloadCsvText', 'downloadCsvSpinner');

        try {
            const csvContent = this.generateCSVContent();
            const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
            const link = document.createElement('a');
            
            if (link.download !== undefined) {
                const url = URL.createObjectURL(blob);
                link.setAttribute('href', url);
                link.setAttribute('download', `canciones_${new Date().toISOString().split('T')[0]}.csv`);
                link.style.visibility = 'hidden';
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);
            }
        } finally {
            // Ocultar loading
            this.hideButtonLoading('downloadCsvBtn', 'downloadCsvText', 'downloadCsvSpinner');
        }
    }

    generateCSVContent() {
        const headers = ['Nombre', 'Artista', 'Estado', 'Tipo', 'Comentarios', 'YouTube'];
        const csvRows = [headers.join(',')];

        this.filteredSongs.forEach(song => {
            const row = [
                this.escapeCSVField(song.songName),
                this.escapeCSVField(song.artistName),
                this.escapeCSVField(song.state),
                this.escapeCSVField(song.type),
                this.escapeCSVField(song.comments || ''),
                this.escapeCSVField(song.youtubeLink || '')
            ];
            csvRows.push(row.join(','));
        });

        return csvRows.join('\n');
    }

    escapeCSVField(field) {
        if (field === null || field === undefined) {
            return '';
        }
        
        const stringField = String(field);
        if (stringField.includes(',') || stringField.includes('"') || stringField.includes('\n')) {
            return `"${stringField.replace(/"/g, '""')}"`;
        }
        return stringField;
    }

    getStateColor(state) {
        const colors = {
            'Aprobado': 'bg-green-100 text-green-800',
            'Por aprobar': 'bg-yellow-100 text-yellow-800',
            'En grabación': 'bg-blue-100 text-blue-800',
            'Listo': 'bg-purple-100 text-purple-800',
            'Rechazado': 'bg-red-100 text-red-800'
        };
        return colors[state] || 'bg-gray-100 text-gray-800';
    }

    getTypeColor(type) {
        return type === 'Movido' ? 'bg-orange-100 text-orange-800' : 'bg-indigo-100 text-indigo-800';
    }



    renderTable() {
        const tbody = DomUtils.getElementById('songsTableBody');
        
        if (this.filteredSongs.length === 0) {
            tbody.innerHTML = `
                <tr>
                    <td colspan="6" class="px-6 py-4 text-center text-gray-500">
                        ${this.songs.length === 0 ? 'No hay canciones registradas' : 'No se encontraron canciones con los filtros aplicados'}
                    </td>
                </tr>
            `;
            // Add fade-in animation to entire table body
            AnimationUtils.fadeIn(tbody);
            
            // Remove scrollbar hiding class after animation completes
            setTimeout(() => {
                const tableContainer = DomUtils.getElementById('tableContainer');
                if (tableContainer) {
                    DomUtils.removeClass(tableContainer, 'hide-scrollbar');
                }
            }, 500); // Match animation duration
            return;
        }

        tbody.innerHTML = this.filteredSongs.map((song, index) => {
            return `
            <tr class="hover:bg-gray-50">
                <td class="px-4 py-4 text-sm font-medium text-gray-900">
                    ${song.artistName}
                </td>
                <td class="px-4 py-4 text-sm text-gray-900">
                    ${song.songName}
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                    <span class="px-2 py-1 text-xs font-semibold rounded-full ${this.getStateColor(song.state)}">
                        ${song.state}
                    </span>
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                    <span class="px-2 py-1 text-xs font-semibold rounded-full ${this.getTypeColor(song.type)}">
                        ${song.type}
                    </span>
                </td>
                <td class="px-6 py-4 text-sm text-gray-600">
                    <div class="relative">
                        <input 
                            type="text"
                            class="w-full px-2 py-1 border border-gray-300 rounded text-sm focus:outline-none focus:ring-1 focus:ring-blue-500 comment-input" 
                            placeholder="Agregar comentario..."
                            value="${song.comments || ''}"
                            data-song-id="${song.id}"
                        />
                    </div>
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div class="flex space-x-2">
                        <button onclick="songManager.openYouTube(${JSON.stringify(song).replace(/"/g, '&quot;')})" 
                                class="text-red-600 hover:text-red-900 transition duration-200" 
                                title="Ver en YouTube">
                            <svg class="w-5 h-5" viewBox="0 0 461.001 461.001" fill="currentColor">
                                <path d="M365.257,67.393H95.744C42.866,67.393,0,110.259,0,163.137v134.728c0,52.878,42.866,95.744,95.744,95.744h269.513c52.878,0,95.744-42.866,95.744-95.744V163.137C461.001,110.259,418.135,67.393,365.257,67.393z M300.506,237.056l-126.06,60.123c-3.359,1.602-7.239-0.847-7.239-4.568V168.607c0-3.774,3.982-6.22,7.348-4.514l126.06,63.881C304.363,229.873,304.298,235.248,300.506,237.056z"/>
                            </svg>
                        </button>
                        <button onclick="songManager.editSong(${JSON.stringify(song).replace(/"/g, '&quot;')})" 
                                class="text-blue-600 hover:text-blue-900 transition duration-200" 
                                title="Editar">
                            ✏️
                        </button>
                        <button onclick="songManager.deleteSong(${JSON.stringify(song).replace(/"/g, '&quot;')})" 
                                class="text-red-600 hover:text-red-900 transition duration-200" 
                                title="Eliminar">
                            🗑️
                        </button>
                    </div>
                </td>
            </tr>
        `;
        }).join('');

        // Add single fade-in animation to entire table body for better performance
        AnimationUtils.fadeIn(tbody);
        
        // Set up event listeners for comment inputs
        setTimeout(() => {
            this.setupCommentEventListeners();
        }, 100);
        
        // Remove scrollbar hiding class after animation completes
        setTimeout(() => {
            const tableContainer = DomUtils.getElementById('tableContainer');
            if (tableContainer) {
                DomUtils.removeClass(tableContainer, 'hide-scrollbar');
            }
        }, 500); // Match animation duration
    }
}

// Extender el prototipo para el método selectArtist
HTMLElement.prototype.selectArtist = function(artistName) {
    document.getElementById('artistName').value = artistName;
    document.getElementById('artistSuggestions').classList.add('hidden');
};

// Inicializar la aplicación cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', function() {
    window.songManager = new SongManager();
});

// Export SongManager for module usage
export { SongManager };
