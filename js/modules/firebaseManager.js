export class FirebaseManager {
    constructor() {
        this.db = null;
        this.isInitialized = false;
        this.initializeFirebase();
    }

    async initializeFirebase() {
        try {
            // Verificar si Firebase está disponible
            if (typeof firebase === 'undefined') {
                console.error('Firebase SDK no está cargado. La aplicación requiere Firebase para funcionar.');
                this.isInitialized = false;
                return;
            }

            // Configuración de Firebase (debes reemplazar con tu configuración)
            const firebaseConfig = {
                apiKey: "AIzaSyD9CuAUAEFxym8b1ZTpHVklOHwucrwOV7o",
                authDomain: "gestor-canciones-edd13.firebaseapp.com",
                projectId: "gestor-canciones-edd13",
                storageBucket: "gestor-canciones-edd13.firebasestorage.app",
                messagingSenderId: "1042934080371",
                appId: "1:1042934080371:web:2e0b2ca90125d72ce81b06"
            };

            // Inicializar Firebase
            firebase.initializeApp(firebaseConfig);
            this.db = firebase.firestore();

            this.isInitialized = true;
            console.log('Firebase inicializado correctamente');
        } catch (error) {
            console.error('Error inicializando Firebase:', error);
            this.isInitialized = false;
        }
    }

    // CRUD Operations
    async loadSongs() {
        if (!this.isInitialized) {
            throw new Error('Firebase no está inicializado. La aplicación requiere Firebase para funcionar.');
        }

        try {
            const snapshot = await this.db.collection('songs')
                .orderBy('createdAt', 'desc')
                .get();
            
            const songs = [];
            snapshot.forEach(doc => {
                songs.push({
                    id: doc.id,
                    ...doc.data()
                });
            });
            
            return songs;
        } catch (error) {
            console.error('Error cargando canciones desde Firebase:', error);
            throw error;
        }
    }

    async saveSongs(songs) {
        if (!this.isInitialized) {
            throw new Error('Firebase no está inicializado. La aplicación requiere Firebase para funcionar.');
        }

        try {
            // Firebase no requiere guardar arrays completos, cada canción se guarda individualmente
            return true;
        } catch (error) {
            console.error('Error guardando canciones en Firebase:', error);
            throw error;
        }
    }

    async addSong(song) {
        if (!this.isInitialized) {
            throw new Error('Firebase no está inicializado. La aplicación requiere Firebase para funcionar.');
        }

        try {
            // Remover el ID manual y dejar que Firebase genere uno automáticamente
            const { id, ...songWithoutId } = song;
            
            const songData = {
                ...songWithoutId,
                createdAt: firebase.firestore.FieldValue.serverTimestamp(),
                updatedAt: firebase.firestore.FieldValue.serverTimestamp()
            };

            const docRef = await this.db.collection('songs').add(songData);
            
            return { ...songWithoutId, id: docRef.id };
        } catch (error) {
            console.error('Error agregando canción en Firebase:', error);
            throw error;
        }
    }

    async updateSong(songId, updatedSong) {
        if (!this.isInitialized) {
            throw new Error('Firebase no está inicializado. La aplicación requiere Firebase para funcionar.');
        }

        try {
            const songData = {
                ...updatedSong,
                updatedAt: firebase.firestore.FieldValue.serverTimestamp()
            };

            await this.db.collection('songs').doc(songId).update(songData);
            
            return true;
        } catch (error) {
            console.error('Error actualizando canción en Firebase:', error);
            throw error;
        }
    }

    async deleteSong(songId) {
        if (!this.isInitialized) {
            throw new Error('Firebase no está inicializado. La aplicación requiere Firebase para funcionar.');
        }

        try {
            await this.db.collection('songs').doc(songId).delete();
            
            return true;
        } catch (error) {
            console.error('Error eliminando canción en Firebase:', error);
            throw error;
        }
    }

    async migrateFromLocalStorage() {
        if (!this.isInitialized) {
            throw new Error('Firebase no está inicializado. La aplicación requiere Firebase para funcionar.');
        }

        try {
            // Obtener canciones de localStorage
            const localSongs = JSON.parse(localStorage.getItem('songs') || '[]');
            
            if (localSongs.length === 0) {
                return;
            }

            // Verificar cuántas canciones hay en Firebase
            const snapshot = await this.db.collection('songs').get();
            
            // Si Firebase tiene menos canciones que localStorage, migrar las faltantes
            if (snapshot.size < localSongs.length) {
                // Migrar cada canción con ID automático de Firebase
                for (const song of localSongs) {
                    try {
                        // Remover el ID manual y dejar que Firebase genere uno automáticamente
                        const { id, ...songWithoutId } = song;
                        
                        const songData = {
                            ...songWithoutId,
                            createdAt: firebase.firestore.FieldValue.serverTimestamp(),
                            updatedAt: firebase.firestore.FieldValue.serverTimestamp()
                        };

                        await this.db.collection('songs').add(songData);
                    } catch (error) {
                        console.error(`Error migrando canción:`, error);
                    }
                }
            }
        } catch (error) {
            console.error('Error durante la migración:', error);
            throw error;
        }
    }

}
