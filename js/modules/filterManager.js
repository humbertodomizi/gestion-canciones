export class FilterManager {
    constructor(songManager) {
        this.songManager = songManager;
        this.initializeMultiSelects();
    }

    initializeMultiSelects() {
        // Tipo multiselect
        const typeBtn = document.getElementById('typeDropdownBtn');
        const typeDropdown = document.getElementById('typeDropdown');
        const typeCheckboxes = document.querySelectorAll('.type-checkbox');
        
        typeBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            typeDropdown.classList.toggle('hidden');
            document.getElementById('stateDropdown').classList.add('hidden');
        });
        
        typeCheckboxes.forEach(checkbox => {
            checkbox.addEventListener('change', () => {
                this.updateTypeDropdownText();
                this.applyFilters();
            });
        });
        
        // Estado multiselect
        const stateBtn = document.getElementById('stateDropdownBtn');
        const stateDropdown = document.getElementById('stateDropdown');
        const stateCheckboxes = document.querySelectorAll('.state-checkbox');
        
        stateBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            stateDropdown.classList.toggle('hidden');
            document.getElementById('typeDropdown').classList.add('hidden');
        });
        
        stateCheckboxes.forEach(checkbox => {
            checkbox.addEventListener('change', () => {
                this.updateStateDropdownText();
                this.applyFilters();
            });
        });
        
        // Cerrar dropdowns al hacer click fuera
        document.addEventListener('click', () => {
            typeDropdown.classList.add('hidden');
            stateDropdown.classList.add('hidden');
        });
    }

    updateTypeDropdownText() {
        const selectedTypes = Array.from(document.querySelectorAll('.type-checkbox:checked')).map(cb => cb.value);
        const textElement = document.getElementById('typeDropdownText');
        
        if (selectedTypes.length === 0) {
            textElement.textContent = 'Todos los tipos';
        } else if (selectedTypes.length === 1) {
            textElement.textContent = selectedTypes[0];
        } else {
            textElement.textContent = `${selectedTypes.length} tipos seleccionados`;
        }
    }

    updateStateDropdownText() {
        const selectedStates = Array.from(document.querySelectorAll('.state-checkbox:checked')).map(cb => cb.value);
        const textElement = document.getElementById('stateDropdownText');
        
        if (selectedStates.length === 0) {
            textElement.textContent = 'Todos los estados';
        } else if (selectedStates.length === 1) {
            textElement.textContent = selectedStates[0];
        } else {
            textElement.textContent = `${selectedStates.length} estados seleccionados`;
        }
    }

    applyFilters() {
        const searchInput = document.getElementById('searchInput').value.toLowerCase();
        const selectedTypes = Array.from(document.querySelectorAll('.type-checkbox:checked')).map(cb => cb.value);
        const selectedStates = Array.from(document.querySelectorAll('.state-checkbox:checked')).map(cb => cb.value);

        this.songManager.filteredSongs = this.songManager.songs.filter(song => {
            const matchesSearch = !searchInput || 
                song.songName.toLowerCase().includes(searchInput) ||
                song.artistName.toLowerCase().includes(searchInput) ||
                (song.comments && song.comments.toLowerCase().includes(searchInput));
            
            const matchesType = selectedTypes.length === 0 || selectedTypes.includes(song.type);
            const matchesState = selectedStates.length === 0 || selectedStates.includes(song.state);
            
            return matchesSearch && matchesType && matchesState;
        });

        this.songManager.renderTable();
        this.updateFilterResults();
    }

    clearFilters() {
        document.getElementById('searchInput').value = '';
        
        // Limpiar checkboxes de tipo
        document.querySelectorAll('.type-checkbox').forEach(checkbox => {
            checkbox.checked = false;
        });
        this.updateTypeDropdownText();
        
        // Limpiar checkboxes de estado
        document.querySelectorAll('.state-checkbox').forEach(checkbox => {
            checkbox.checked = false;
        });
        this.updateStateDropdownText();
        
        this.songManager.filteredSongs = this.songManager.songs;
        this.songManager.renderTable();
        this.updateFilterResults();
    }

    updateFilterResults() {
        const resultsElement = document.getElementById('filterResults');
        const total = this.songManager.songs.length;
        const filtered = this.songManager.filteredSongs.length;
        
        if (filtered === total) {
            resultsElement.textContent = `${total} canciones`;
        } else {
            resultsElement.textContent = `${filtered} de ${total} canciones`;
        }
    }
}
