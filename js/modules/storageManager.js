export class StorageManager {
    constructor() {
        this.storageKey = 'songs';
    }

    // Cargar canciones desde localStorage
    loadSongs() {
        try {
            const stored = localStorage.getItem(this.storageKey);
            return stored ? JSON.parse(stored) : [];
        } catch (error) {
            console.error('Error al cargar canciones desde localStorage:', error);
            return [];
        }
    }

    // Guardar canciones en localStorage
    saveSongs(songs) {
        try {
            localStorage.setItem(this.storageKey, JSON.stringify(songs));
            return true;
        } catch (error) {
            console.error('Error al guardar canciones en localStorage:', error);
            return false;
        }
    }

    // Generar ID único
    generateUniqueId() {
        return Date.now().toString() + Math.random().toString(36).substr(2, 9);
    }

    // Agregar una nueva canción
    addSong(song) {
        const songs = this.loadSongs();
        const newSong = { ...song, id: this.generateUniqueId() };
        songs.push(newSong);
        
        if (this.saveSongs(songs)) {
            return newSong;
        }
        return null;
    }

    // Actualizar una canción existente
    updateSong(songId, updatedSong) {
        const songs = this.loadSongs();
        const index = songs.findIndex(song => song.id === songId);
        
        if (index !== -1) {
            songs[index] = { ...updatedSong, id: songId };
            if (this.saveSongs(songs)) {
                return songs[index];
            }
        }
        return null;
    }

    // Eliminar una canción
    deleteSong(songId) {
        const songs = this.loadSongs();
        const filteredSongs = songs.filter(song => song.id !== songId);
        
        if (this.saveSongs(filteredSongs)) {
            return true;
        }
        return false;
    }

    // Obtener una canción por ID
    getSongById(songId) {
        const songs = this.loadSongs();
        return songs.find(song => song.id === songId) || null;
    }

    // Buscar canciones por criterios
    searchSongs(criteria) {
        const songs = this.loadSongs();
        return songs.filter(song => {
            const matchesSearch = !criteria.search || 
                song.songName.toLowerCase().includes(criteria.search.toLowerCase()) ||
                song.artistName.toLowerCase().includes(criteria.search.toLowerCase()) ||
                (song.comments && song.comments.toLowerCase().includes(criteria.search.toLowerCase()));
            
            const matchesType = !criteria.types || criteria.types.length === 0 || criteria.types.includes(song.type);
            const matchesState = !criteria.states || criteria.states.length === 0 || criteria.states.includes(song.state);
            
            return matchesSearch && matchesType && matchesState;
        });
    }

    // Limpiar todos los datos
    clearAll() {
        try {
            localStorage.removeItem(this.storageKey);
            return true;
        } catch (error) {
            console.error('Error al limpiar datos:', error);
            return false;
        }
    }

    // Exportar datos (para backup)
    exportData() {
        const songs = this.loadSongs();
        return {
            songs: songs,
            exportDate: new Date().toISOString(),
            version: '1.0'
        };
    }

    // Importar datos (para restore)
    importData(data) {
        try {
            if (data && data.songs && Array.isArray(data.songs)) {
                return this.saveSongs(data.songs);
            }
            return false;
        } catch (error) {
            console.error('Error al importar datos:', error);
            return false;
        }
    }

    // Obtener estadísticas
    getStats() {
        const songs = this.loadSongs();
        const stats = {
            total: songs.length,
            byState: {},
            byType: {},
            byArtist: {}
        };

        songs.forEach(song => {
            // Por estado
            stats.byState[song.state] = (stats.byState[song.state] || 0) + 1;
            
            // Por tipo
            stats.byType[song.type] = (stats.byType[song.type] || 0) + 1;
            
            // Por artista
            stats.byArtist[song.artistName] = (stats.byArtist[song.artistName] || 0) + 1;
        });

        return stats;
    }

    // Verificar si hay datos
    hasData() {
        const songs = this.loadSongs();
        return songs.length > 0;
    }

    // Obtener tamaño de datos en localStorage
    getStorageSize() {
        try {
            const data = localStorage.getItem(this.storageKey);
            return data ? new Blob([data]).size : 0;
        } catch (error) {
            return 0;
        }
    }

    // Regenerar IDs únicos para todas las canciones
    regenerateAllIds() {
        const songs = this.loadSongs();
        const updatedSongs = songs.map(song => ({
            ...song,
            id: this.generateUniqueId()
        }));
        
        if (this.saveSongs(updatedSongs)) {
            return updatedSongs;
        }
        return null;
    }
}
