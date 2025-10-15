/**
 * DOM manipulation and utility functions
 */
class DomUtils {
    /**
     * Get element by ID with error handling
     * @param {string} id - Element ID
     * @returns {HTMLElement|null} Element or null
     */
    static getElementById(id) {
        const element = document.getElementById(id);
        if (!element) {
            console.warn(`Element with ID '${id}' not found`);
        }
        return element;
    }

    /**
     * Get elements by class name
     * @param {string} className - Class name
     * @param {HTMLElement} parent - Parent element (optional)
     * @returns {NodeList} Elements
     */
    static getElementsByClassName(className, parent = document) {
        return parent.getElementsByClassName(className);
    }

    /**
     * Query selector with error handling
     * @param {string} selector - CSS selector
     * @param {HTMLElement} parent - Parent element (optional)
     * @returns {HTMLElement|null} Element or null
     */
    static querySelector(selector, parent = document) {
        const element = parent.querySelector(selector);
        if (!element) {
            console.warn(`Element with selector '${selector}' not found`);
        }
        return element;
    }

    /**
     * Query selector all with error handling
     * @param {string} selector - CSS selector
     * @param {HTMLElement} parent - Parent element (optional)
     * @returns {NodeList} Elements
     */
    static querySelectorAll(selector, parent = document) {
        return parent.querySelectorAll(selector);
    }

    /**
     * Add event listener with error handling
     * @param {HTMLElement} element - Element to add listener to
     * @param {string} event - Event type
     * @param {Function} handler - Event handler
     * @param {boolean} useCapture - Use capture phase
     */
    static addEventListener(element, event, handler, useCapture = false) {
        if (!element) {
            console.warn('Cannot add event listener to null element');
            return;
        }
        
        element.addEventListener(event, handler, useCapture);
    }

    /**
     * Remove event listener
     * @param {HTMLElement} element - Element to remove listener from
     * @param {string} event - Event type
     * @param {Function} handler - Event handler
     * @param {boolean} useCapture - Use capture phase
     */
    static removeEventListener(element, event, handler, useCapture = false) {
        if (!element) return;
        
        element.removeEventListener(event, handler, useCapture);
    }

    /**
     * Show element
     * @param {HTMLElement} element - Element to show
     */
    static show(element) {
        if (element) {
            element.classList.remove('hidden');
        }
    }

    /**
     * Hide element
     * @param {HTMLElement} element - Element to hide
     */
    static hide(element) {
        if (element) {
            element.classList.add('hidden');
        }
    }

    /**
     * Toggle element visibility
     * @param {HTMLElement} element - Element to toggle
     */
    static toggle(element) {
        if (element) {
            element.classList.toggle('hidden');
        }
    }

    /**
     * Add class to element
     * @param {HTMLElement} element - Element
     * @param {string} className - Class name
     */
    static addClass(element, className) {
        if (element) {
            element.classList.add(className);
        }
    }

    /**
     * Remove class from element
     * @param {HTMLElement} element - Element
     * @param {string} className - Class name
     */
    static removeClass(element, className) {
        if (element) {
            element.classList.remove(className);
        }
    }

    /**
     * Toggle class on element
     * @param {HTMLElement} element - Element
     * @param {string} className - Class name
     */
    static toggleClass(element, className) {
        if (element) {
            element.classList.toggle(className);
        }
    }

    /**
     * Check if element has class
     * @param {HTMLElement} element - Element
     * @param {string} className - Class name
     * @returns {boolean} Has class
     */
    static hasClass(element, className) {
        return element ? element.classList.contains(className) : false;
    }

    /**
     * Set element text content
     * @param {HTMLElement} element - Element
     * @param {string} text - Text content
     */
    static setText(element, text) {
        if (element) {
            element.textContent = text;
        }
    }

    /**
     * Set element HTML content
     * @param {HTMLElement} element - Element
     * @param {string} html - HTML content
     */
    static setHTML(element, html) {
        if (element) {
            element.innerHTML = html;
        }
    }

    /**
     * Get element text content
     * @param {HTMLElement} element - Element
     * @returns {string} Text content
     */
    static getText(element) {
        return element ? element.textContent : '';
    }

    /**
     * Get element HTML content
     * @param {HTMLElement} element - Element
     * @returns {string} HTML content
     */
    static getHTML(element) {
        return element ? element.innerHTML : '';
    }

    /**
     * Set element attribute
     * @param {HTMLElement} element - Element
     * @param {string} name - Attribute name
     * @param {string} value - Attribute value
     */
    static setAttribute(element, name, value) {
        if (element) {
            element.setAttribute(name, value);
        }
    }

    /**
     * Get element attribute
     * @param {HTMLElement} element - Element
     * @param {string} name - Attribute name
     * @returns {string} Attribute value
     */
    static getAttribute(element, name) {
        return element ? element.getAttribute(name) : null;
    }

    /**
     * Remove element attribute
     * @param {HTMLElement} element - Element
     * @param {string} name - Attribute name
     */
    static removeAttribute(element, name) {
        if (element) {
            element.removeAttribute(name);
        }
    }

    /**
     * Create element with attributes
     * @param {string} tagName - Tag name
     * @param {Object} attributes - Attributes object
     * @param {string} textContent - Text content
     * @returns {HTMLElement} Created element
     */
    static createElement(tagName, attributes = {}, textContent = '') {
        const element = document.createElement(tagName);
        
        Object.entries(attributes).forEach(([key, value]) => {
            element.setAttribute(key, value);
        });
        
        if (textContent) {
            element.textContent = textContent;
        }
        
        return element;
    }

    /**
     * Append child to parent
     * @param {HTMLElement} parent - Parent element
     * @param {HTMLElement} child - Child element
     */
    static appendChild(parent, child) {
        if (parent && child) {
            parent.appendChild(child);
        }
    }

    /**
     * Remove child from parent
     * @param {HTMLElement} parent - Parent element
     * @param {HTMLElement} child - Child element
     */
    static removeChild(parent, child) {
        if (parent && child) {
            parent.removeChild(child);
        }
    }

    /**
     * Clear element content
     * @param {HTMLElement} element - Element to clear
     */
    static clear(element) {
        if (element) {
            element.innerHTML = '';
        }
    }

    /**
     * Scroll to element
     * @param {HTMLElement} element - Element to scroll to
     * @param {Object} options - Scroll options
     */
    static scrollTo(element, options = {}) {
        if (element) {
            element.scrollIntoView({
                behavior: 'smooth',
                block: 'start',
                ...options
            });
        }
    }

    /**
     * Focus element
     * @param {HTMLElement} element - Element to focus
     */
    static focus(element) {
        if (element && element.focus) {
            element.focus();
        }
    }

    /**
     * Blur element
     * @param {HTMLElement} element - Element to blur
     */
    static blur(element) {
        if (element && element.blur) {
            element.blur();
        }
    }

    /**
     * Get element position
     * @param {HTMLElement} element - Element
     * @returns {Object} Position object
     */
    static getPosition(element) {
        if (!element) return { top: 0, left: 0 };
        
        const rect = element.getBoundingClientRect();
        return {
            top: rect.top + window.scrollY,
            left: rect.left + window.scrollX,
            width: rect.width,
            height: rect.height
        };
    }

    /**
     * Check if element is visible
     * @param {HTMLElement} element - Element to check
     * @returns {boolean} Is visible
     */
    static isVisible(element) {
        if (!element) return false;
        
        const style = window.getComputedStyle(element);
        return style.display !== 'none' && style.visibility !== 'hidden' && style.opacity !== '0';
    }

    /**
     * Check if element is in viewport
     * @param {HTMLElement} element - Element to check
     * @returns {boolean} Is in viewport
     */
    static isInViewport(element) {
        if (!element) return false;
        
        const rect = element.getBoundingClientRect();
        return (
            rect.top >= 0 &&
            rect.left >= 0 &&
            rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
            rect.right <= (window.innerWidth || document.documentElement.clientWidth)
        );
    }
}

export default DomUtils;
