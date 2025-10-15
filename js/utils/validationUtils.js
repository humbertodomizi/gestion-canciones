/**
 * Validation and form utilities
 */
class ValidationUtils {
    /**
     * Validate email format
     * @param {string} email - Email to validate
     * @returns {boolean} Is valid email
     */
    static isValidEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }

    /**
     * Validate URL format
     * @param {string} url - URL to validate
     * @returns {boolean} Is valid URL
     */
    static isValidUrl(url) {
        try {
            new URL(url);
            return true;
        } catch {
            return false;
        }
    }

    /**
     * Validate YouTube URL
     * @param {string} url - URL to validate
     * @returns {boolean} Is valid YouTube URL
     */
    static isValidYouTubeUrl(url) {
        const youtubeRegex = /^(https?:\/\/)?(www\.)?(youtube\.com|youtu\.be)\/.+/;
        return youtubeRegex.test(url);
    }

    /**
     * Validate required field
     * @param {string} value - Value to validate
     * @returns {boolean} Is valid
     */
    static isRequired(value) {
        return value && value.trim().length > 0;
    }

    /**
     * Validate minimum length
     * @param {string} value - Value to validate
     * @param {number} minLength - Minimum length
     * @returns {boolean} Is valid
     */
    static hasMinLength(value, minLength) {
        return value && value.length >= minLength;
    }

    /**
     * Validate maximum length
     * @param {string} value - Value to validate
     * @param {number} maxLength - Maximum length
     * @returns {boolean} Is valid
     */
    static hasMaxLength(value, maxLength) {
        return value && value.length <= maxLength;
    }

    /**
     * Validate length range
     * @param {string} value - Value to validate
     * @param {number} minLength - Minimum length
     * @param {number} maxLength - Maximum length
     * @returns {boolean} Is valid
     */
    static hasLengthRange(value, minLength, maxLength) {
        return this.hasMinLength(value, minLength) && this.hasMaxLength(value, maxLength);
    }

    /**
     * Validate numeric value
     * @param {string|number} value - Value to validate
     * @returns {boolean} Is numeric
     */
    static isNumeric(value) {
        return !isNaN(value) && !isNaN(parseFloat(value));
    }

    /**
     * Validate integer value
     * @param {string|number} value - Value to validate
     * @returns {boolean} Is integer
     */
    static isInteger(value) {
        return Number.isInteger(Number(value));
    }

    /**
     * Validate positive number
     * @param {string|number} value - Value to validate
     * @returns {boolean} Is positive
     */
    static isPositive(value) {
        return this.isNumeric(value) && Number(value) > 0;
    }

    /**
     * Validate negative number
     * @param {string|number} value - Value to validate
     * @returns {boolean} Is negative
     */
    static isNegative(value) {
        return this.isNumeric(value) && Number(value) < 0;
    }

    /**
     * Validate number range
     * @param {string|number} value - Value to validate
     * @param {number} min - Minimum value
     * @param {number} max - Maximum value
     * @returns {boolean} Is in range
     */
    static isInRange(value, min, max) {
        return this.isNumeric(value) && Number(value) >= min && Number(value) <= max;
    }

    /**
     * Validate phone number
     * @param {string} phone - Phone number to validate
     * @returns {boolean} Is valid phone
     */
    static isValidPhone(phone) {
        const phoneRegex = /^[\+]?[1-9][\d]{0,15}$/;
        return phoneRegex.test(phone.replace(/[\s\-\(\)]/g, ''));
    }

    /**
     * Validate date format
     * @param {string} date - Date to validate
     * @param {string} format - Date format (optional)
     * @returns {boolean} Is valid date
     */
    static isValidDate(date, format = 'YYYY-MM-DD') {
        const dateObj = new Date(date);
        return dateObj instanceof Date && !isNaN(dateObj);
    }

    /**
     * Validate future date
     * @param {string} date - Date to validate
     * @returns {boolean} Is future date
     */
    static isFutureDate(date) {
        return this.isValidDate(date) && new Date(date) > new Date();
    }

    /**
     * Validate past date
     * @param {string} date - Date to validate
     * @returns {boolean} Is past date
     */
    static isPastDate(date) {
        return this.isValidDate(date) && new Date(date) < new Date();
    }

    /**
     * Validate form field
     * @param {HTMLElement} field - Form field element
     * @param {Object} rules - Validation rules
     * @returns {Object} Validation result
     */
    static validateField(field, rules = {}) {
        const value = field.value;
        const errors = [];

        // Required validation
        if (rules.required && !this.isRequired(value)) {
            errors.push('Este campo es obligatorio');
        }

        // Email validation
        if (rules.email && value && !this.isValidEmail(value)) {
            errors.push('Ingresa un email válido');
        }

        // URL validation
        if (rules.url && value && !this.isValidUrl(value)) {
            errors.push('Ingresa una URL válida');
        }

        // YouTube URL validation
        if (rules.youtube && value && !this.isValidYouTubeUrl(value)) {
            errors.push('Ingresa una URL de YouTube válida');
        }

        // Length validation
        if (rules.minLength && !this.hasMinLength(value, rules.minLength)) {
            errors.push(`Mínimo ${rules.minLength} caracteres`);
        }

        if (rules.maxLength && !this.hasMaxLength(value, rules.maxLength)) {
            errors.push(`Máximo ${rules.maxLength} caracteres`);
        }

        // Numeric validation
        if (rules.numeric && value && !this.isNumeric(value)) {
            errors.push('Ingresa un número válido');
        }

        // Range validation
        if (rules.min !== undefined && value && !this.isInRange(value, rules.min, rules.max || Infinity)) {
            errors.push(`Valor debe estar entre ${rules.min} y ${rules.max || '∞'}`);
        }

        return {
            isValid: errors.length === 0,
            errors: errors
        };
    }

    /**
     * Validate form
     * @param {HTMLFormElement} form - Form element
     * @param {Object} rules - Validation rules
     * @returns {Object} Validation result
     */
    static validateForm(form, rules = {}) {
        const errors = {};
        let isValid = true;

        Object.entries(rules).forEach(([fieldName, fieldRules]) => {
            const field = form.querySelector(`[name="${fieldName}"]`);
            if (field) {
                const result = this.validateField(field, fieldRules);
                if (!result.isValid) {
                    errors[fieldName] = result.errors;
                    isValid = false;
                }
            }
        });

        return {
            isValid: isValid,
            errors: errors
        };
    }

    /**
     * Show field error
     * @param {HTMLElement} field - Form field
     * @param {string} message - Error message
     */
    static showFieldError(field, message) {
        this.clearFieldError(field);
        
        const errorElement = document.createElement('div');
        errorElement.className = 'text-red-500 text-sm mt-1 field-error';
        errorElement.textContent = message;
        
        field.parentNode.appendChild(errorElement);
        field.classList.add('border-red-500');
    }

    /**
     * Clear field error
     * @param {HTMLElement} field - Form field
     */
    static clearFieldError(field) {
        const errorElement = field.parentNode.querySelector('.field-error');
        if (errorElement) {
            errorElement.remove();
        }
        field.classList.remove('border-red-500');
    }

    /**
     * Show form errors
     * @param {Object} errors - Validation errors
     */
    static showFormErrors(errors) {
        Object.entries(errors).forEach(([fieldName, fieldErrors]) => {
            const field = document.querySelector(`[name="${fieldName}"]`);
            if (field) {
                this.showFieldError(field, fieldErrors[0]);
            }
        });
    }

    /**
     * Clear form errors
     * @param {HTMLFormElement} form - Form element
     */
    static clearFormErrors(form) {
        const errorElements = form.querySelectorAll('.field-error');
        errorElements.forEach(element => element.remove());
        
        const fields = form.querySelectorAll('input, select, textarea');
        fields.forEach(field => {
            field.classList.remove('border-red-500');
        });
    }

    /**
     * Sanitize string
     * @param {string} str - String to sanitize
     * @returns {string} Sanitized string
     */
    static sanitizeString(str) {
        return str.replace(/[<>]/g, '').trim();
    }

    /**
     * Escape HTML
     * @param {string} str - String to escape
     * @returns {string} Escaped string
     */
    static escapeHtml(str) {
        const div = document.createElement('div');
        div.textContent = str;
        return div.innerHTML;
    }

    /**
     * Format phone number
     * @param {string} phone - Phone number
     * @returns {string} Formatted phone
     */
    static formatPhone(phone) {
        const cleaned = phone.replace(/\D/g, '');
        const match = cleaned.match(/^(\d{3})(\d{3})(\d{4})$/);
        if (match) {
            return `(${match[1]}) ${match[2]}-${match[3]}`;
        }
        return phone;
    }

    /**
     * Format currency
     * @param {number} amount - Amount to format
     * @param {string} currency - Currency code
     * @returns {string} Formatted currency
     */
    static formatCurrency(amount, currency = 'USD') {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: currency
        }).format(amount);
    }

    /**
     * Format date
     * @param {string|Date} date - Date to format
     * @param {string} format - Date format
     * @returns {string} Formatted date
     */
    static formatDate(date, format = 'YYYY-MM-DD') {
        const dateObj = new Date(date);
        if (isNaN(dateObj.getTime())) return '';
        
        const year = dateObj.getFullYear();
        const month = String(dateObj.getMonth() + 1).padStart(2, '0');
        const day = String(dateObj.getDate()).padStart(2, '0');
        
        return format
            .replace('YYYY', year)
            .replace('MM', month)
            .replace('DD', day);
    }
}

export default ValidationUtils;
