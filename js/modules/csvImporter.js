export class CSVImporter {
    constructor(songManager) {
        this.songManager = songManager;
    }

    parseCSV(csvText) {
        const lines = csvText.split('\n');
        const headers = lines[0].split(',').map(header => header.trim());
        const songs = [];

        for (let i = 1; i < lines.length; i++) {
            const line = lines[i].trim();
            if (!line) continue;

            const values = this.parseCSVLine(line);
            if (values.length >= 4) {
                // Detectar formato del CSV
                const isNewFormat = headers.includes('Estado') && headers.includes('Tipo');
                
                let song;
                if (isNewFormat) {
                    // Formato nuevo: Nombre,Artista,Estado,Tipo,Comentarios,YouTube
                    song = {
                        id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
                        artistName: values[1]?.trim() || '',
                        songName: values[0]?.trim() || '',
                        youtubeLink: values[5]?.trim() || '',
                        state: this.mapState(values[2]?.trim()) || 'Por aprobar',
                        type: this.mapType(values[3]?.trim()) || 'Lento',
                        comments: values[4]?.trim() || ''
                    };
                } else {
                    // Formato original: Nombre,Artista,Género,Estado,Tipo
                    song = {
                        id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
                        artistName: values[1]?.trim() || '',
                        songName: values[0]?.trim() || '',
                        youtubeLink: '',
                        state: this.mapState(values[3]?.trim()) || 'Por aprobar',
                        type: this.mapType(values[4]?.trim()) || 'Lento',
                        comments: ''
                    };
                }
                songs.push(song);
            }
        }

        return songs;
    }

    parseCSVLine(line) {
        const result = [];
        let current = '';
        let inQuotes = false;

        for (let i = 0; i < line.length; i++) {
            const char = line[i];
            
            if (char === '"') {
                inQuotes = !inQuotes;
            } else if (char === ',' && !inQuotes) {
                result.push(current);
                current = '';
            } else {
                current += char;
            }
        }
        
        result.push(current);
        return result;
    }

    mapState(csvState) {
        const stateMap = {
            'Aprobado': 'Aprobado',
            'Por aprobar': 'Por aprobar',
            'En grabación': 'En grabación',
            'Listo': 'Listo',
            'Rechazado': 'Rechazado'
        };
        return stateMap[csvState] || 'Por aprobar';
    }

    mapType(csvType) {
        const typeMap = {
            'Lento': 'Lento',
            'Movido': 'Movido'
        };
        return typeMap[csvType] || 'Lento';
    }

    importFromFile(file) {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            
            reader.onload = (e) => {
                try {
                    const csvText = e.target.result;
                    const songs = this.parseCSV(csvText);
                    resolve(songs);
                } catch (error) {
                    reject(new Error('Error al procesar el archivo CSV: ' + error.message));
                }
            };
            
            reader.onerror = () => {
                reject(new Error('Error al leer el archivo'));
            };
            
            reader.readAsText(file, 'UTF-8');
        });
    }

    async handleFileImport(fileInput) {
        const file = fileInput.files[0];
        if (!file) return;

        if (!file.name.toLowerCase().endsWith('.csv')) {
            alert('Por favor selecciona un archivo CSV válido');
            return;
        }

        // Mostrar loading
        this.songManager.showButtonLoading('importCsvBtn', 'importCsvText', 'importCsvSpinner');

        try {
            const importedSongs = await this.importFromFile(file);
            
            if (importedSongs.length === 0) {
                alert('No se encontraron canciones válidas en el archivo CSV');
                return;
            }

            const existingSongs = this.songManager.songs;
            const newSongs = importedSongs.filter(importedSong => 
                !existingSongs.some(existingSong => 
                    existingSong.artistName.toLowerCase() === importedSong.artistName.toLowerCase() &&
                    existingSong.songName.toLowerCase() === importedSong.songName.toLowerCase()
                )
            );

            if (newSongs.length === 0) {
                alert('Todas las canciones del CSV ya existen en la base de datos');
                return;
            }

            const confirmMessage = `Se encontraron ${importedSongs.length} canciones en el CSV.\n` +
                                 `${newSongs.length} son nuevas y se agregarán.\n` +
                                 `${importedSongs.length - newSongs.length} ya existen y se omitirán.\n\n` +
                                 `¿Deseas continuar con la importación?`;

            if (confirm(confirmMessage)) {
                // Agregar canciones usando Firebase manager
                for (const song of newSongs) {
                    try {
                        const addedSong = await this.songManager.firebaseManager.addSong(song);
                        if (addedSong) {
                            this.songManager.songs.push(addedSong);
                        }
                    } catch (error) {
                        console.error('Error agregando canción:', error);
                    }
                }
                this.songManager.filteredSongs = this.songManager.songs;
                this.songManager.renderTable();
                alert(`Se importaron ${newSongs.length} canciones exitosamente`);
            }

        } catch (error) {
            alert('Error al importar el archivo: ' + error.message);
        } finally {
            // Ocultar loading
            this.songManager.hideButtonLoading('importCsvBtn', 'importCsvText', 'importCsvSpinner');
        }

        fileInput.value = '';
    }
}
