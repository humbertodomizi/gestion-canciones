/**
 * Loading spinner and state management utilities
 */
class LoadingUtils {
    /**
     * Show loading spinner on button
     * @param {string} buttonId - Button element ID
     * @param {string} textId - Text span ID
     * @param {string} spinnerId - Spinner div ID
     */
    static showButtonLoading(buttonId, textId, spinnerId) {
        const button = document.getElementById(buttonId);
        const text = document.getElementById(textId);
        const spinner = document.getElementById(spinnerId);
        
        if (button && text && spinner) {
            text.classList.add('hidden');
            spinner.classList.remove('hidden');
            button.disabled = true;
        }
    }

    /**
     * Hide loading spinner on button
     * @param {string} buttonId - Button element ID
     * @param {string} textId - Text span ID
     * @param {string} spinnerId - Spinner div ID
     */
    static hideButtonLoading(buttonId, textId, spinnerId) {
        const button = document.getElementById(buttonId);
        const text = document.getElementById(textId);
        const spinner = document.getElementById(spinnerId);
        
        if (button && text && spinner) {
            text.classList.remove('hidden');
            spinner.classList.add('hidden');
            button.disabled = false;
        }
    }

    /**
     * Show table loading state
     * @param {string} tableBodyId - Table body ID
     * @param {string} loadingBodyId - Loading body ID
     */
    static showTableLoading(tableBodyId = 'songsTableBody', loadingBodyId = 'loadingTableBody') {
        const tableBody = document.getElementById(tableBodyId);
        const loadingBody = document.getElementById(loadingBodyId);
        
        if (tableBody && loadingBody) {
            tableBody.classList.add('hidden');
            loadingBody.classList.remove('hidden');
        }
    }

    /**
     * Hide table loading state
     * @param {string} tableBodyId - Table body ID
     * @param {string} loadingBodyId - Loading body ID
     */
    static hideTableLoading(tableBodyId = 'songsTableBody', loadingBodyId = 'loadingTableBody') {
        const tableBody = document.getElementById(tableBodyId);
        const loadingBody = document.getElementById(loadingBodyId);
        
        if (tableBody && loadingBody) {
            tableBody.classList.remove('hidden');
            loadingBody.classList.add('hidden');
        }
    }

    /**
     * Show loading overlay
     * @param {string} overlayId - Overlay element ID
     */
    static showOverlay(overlayId = 'loadingOverlay') {
        const overlay = document.getElementById(overlayId);
        if (overlay) {
            overlay.classList.remove('hidden');
        }
    }

    /**
     * Hide loading overlay
     * @param {string} overlayId - Overlay element ID
     */
    static hideOverlay(overlayId = 'loadingOverlay') {
        const overlay = document.getElementById(overlayId);
        if (overlay) {
            overlay.classList.add('hidden');
        }
    }

    /**
     * Create loading spinner element
     * @param {string} size - Size class (sm, md, lg)
     * @param {string} color - Color class
     * @returns {HTMLElement} Spinner element
     */
    static createSpinner(size = 'md', color = 'white') {
        const spinner = document.createElement('div');
        spinner.className = `animate-spin rounded-full border-b-2 border-${color} ${this.getSpinnerSize(size)}`;
        return spinner;
    }

    /**
     * Get spinner size class
     * @param {string} size - Size (sm, md, lg)
     * @returns {string} Size class
     */
    static getSpinnerSize(size) {
        const sizes = {
            sm: 'h-3 w-3',
            md: 'h-4 w-4',
            lg: 'h-6 w-6'
        };
        return sizes[size] || sizes.md;
    }

    /**
     * Show loading state with custom message
     * @param {string} elementId - Element ID to show loading in
     * @param {string} message - Loading message
     */
    static showLoadingMessage(elementId, message = 'Cargando...') {
        const element = document.getElementById(elementId);
        if (element) {
            element.innerHTML = `
                <div class="flex items-center justify-center p-4">
                    <div class="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-500 mr-3"></div>
                    <span class="text-gray-600">${message}</span>
                </div>
            `;
        }
    }

    /**
     * Hide loading message and restore content
     * @param {string} elementId - Element ID
     * @param {string} originalContent - Original content to restore
     */
    static hideLoadingMessage(elementId, originalContent = '') {
        const element = document.getElementById(elementId);
        if (element) {
            element.innerHTML = originalContent;
        }
    }

    /**
     * Show loading state for form submission
     * @param {HTMLFormElement} form - Form element
     */
    static showFormLoading(form) {
        if (form) {
            const submitBtn = form.querySelector('button[type="submit"]');
            if (submitBtn) {
                submitBtn.disabled = true;
                submitBtn.classList.add('opacity-50', 'cursor-not-allowed');
            }
        }
    }

    /**
     * Hide loading state for form submission
     * @param {HTMLFormElement} form - Form element
     */
    static hideFormLoading(form) {
        if (form) {
            const submitBtn = form.querySelector('button[type="submit"]');
            if (submitBtn) {
                submitBtn.disabled = false;
                submitBtn.classList.remove('opacity-50', 'cursor-not-allowed');
            }
        }
    }
}

export default LoadingUtils;
