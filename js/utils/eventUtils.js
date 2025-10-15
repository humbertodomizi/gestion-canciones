/**
 * Event handling and delegation utilities
 */
class EventUtils {
    /**
     * Add event listener with delegation
     * @param {HTMLElement} parent - Parent element
     * @param {string} event - Event type
     * @param {string} selector - Child selector
     * @param {Function} handler - Event handler
     * @param {boolean} useCapture - Use capture phase
     */
    static addDelegatedListener(parent, event, selector, handler, useCapture = false) {
        if (!parent) return;
        
        parent.addEventListener(event, (e) => {
            if (e.target.matches(selector)) {
                handler.call(e.target, e);
            }
        }, useCapture);
    }

    /**
     * Add multiple event listeners
     * @param {HTMLElement} element - Element to add listeners to
     * @param {Object} events - Events object {event: handler}
     * @param {boolean} useCapture - Use capture phase
     */
    static addMultipleListeners(element, events, useCapture = false) {
        if (!element) return;
        
        Object.entries(events).forEach(([event, handler]) => {
            element.addEventListener(event, handler, useCapture);
        });
    }

    /**
     * Remove multiple event listeners
     * @param {HTMLElement} element - Element to remove listeners from
     * @param {Object} events - Events object {event: handler}
     * @param {boolean} useCapture - Use capture phase
     */
    static removeMultipleListeners(element, events, useCapture = false) {
        if (!element) return;
        
        Object.entries(events).forEach(([event, handler]) => {
            element.removeEventListener(event, handler, useCapture);
        });
    }

    /**
     * Add one-time event listener
     * @param {HTMLElement} element - Element to add listener to
     * @param {string} event - Event type
     * @param {Function} handler - Event handler
     * @param {boolean} useCapture - Use capture phase
     */
    static addOnceListener(element, event, handler, useCapture = false) {
        if (!element) return;
        
        const onceHandler = (e) => {
            handler(e);
            element.removeEventListener(event, onceHandler, useCapture);
        };
        
        element.addEventListener(event, onceHandler, useCapture);
    }

    /**
     * Add event listener with timeout
     * @param {HTMLElement} element - Element to add listener to
     * @param {string} event - Event type
     * @param {Function} handler - Event handler
     * @param {number} timeout - Timeout in milliseconds
     * @param {boolean} useCapture - Use capture phase
     */
    static addTimeoutListener(element, event, handler, timeout, useCapture = false) {
        if (!element) return;
        
        let timeoutId;
        
        const timeoutHandler = (e) => {
            clearTimeout(timeoutId);
            timeoutId = setTimeout(() => handler(e), timeout);
        };
        
        element.addEventListener(event, timeoutHandler, useCapture);
    }

    /**
     * Add event listener with debounce
     * @param {HTMLElement} element - Element to add listener to
     * @param {string} event - Event type
     * @param {Function} handler - Event handler
     * @param {number} delay - Debounce delay in milliseconds
     * @param {boolean} useCapture - Use capture phase
     */
    static addDebouncedListener(element, event, handler, delay, useCapture = false) {
        if (!element) return;
        
        let timeoutId;
        
        const debouncedHandler = (e) => {
            clearTimeout(timeoutId);
            timeoutId = setTimeout(() => handler(e), delay);
        };
        
        element.addEventListener(event, debouncedHandler, useCapture);
    }

    /**
     * Add event listener with throttle
     * @param {HTMLElement} element - Element to add listener to
     * @param {string} event - Event type
     * @param {Function} handler - Event handler
     * @param {number} delay - Throttle delay in milliseconds
     * @param {boolean} useCapture - Use capture phase
     */
    static addThrottledListener(element, event, handler, delay, useCapture = false) {
        if (!element) return;
        
        let lastCall = 0;
        
        const throttledHandler = (e) => {
            const now = Date.now();
            if (now - lastCall >= delay) {
                lastCall = now;
                handler(e);
            }
        };
        
        element.addEventListener(event, throttledHandler, useCapture);
    }

    /**
     * Prevent default and stop propagation
     * @param {Event} event - Event object
     */
    static preventDefault(event) {
        if (event) {
            event.preventDefault();
            event.stopPropagation();
        }
    }

    /**
     * Stop event propagation
     * @param {Event} event - Event object
     */
    static stopPropagation(event) {
        if (event) {
            event.stopPropagation();
        }
    }

    /**
     * Get event target with fallback
     * @param {Event} event - Event object
     * @param {string} selector - Fallback selector
     * @returns {HTMLElement} Target element
     */
    static getTarget(event, selector = null) {
        if (!event) return null;
        
        if (selector) {
            return event.target.closest(selector);
        }
        
        return event.target;
    }

    /**
     * Check if event is from specific element
     * @param {Event} event - Event object
     * @param {string} selector - Element selector
     * @returns {boolean} Is from element
     */
    static isFromElement(event, selector) {
        if (!event) return false;
        
        return event.target.matches(selector);
    }

    /**
     * Get event coordinates
     * @param {Event} event - Event object
     * @returns {Object} Coordinates object
     */
    static getCoordinates(event) {
        if (!event) return { x: 0, y: 0 };
        
        return {
            x: event.clientX || event.touches?.[0]?.clientX || 0,
            y: event.clientY || event.touches?.[0]?.clientY || 0
        };
    }

    /**
     * Add keyboard event listener
     * @param {HTMLElement} element - Element to add listener to
     * @param {string} key - Key to listen for
     * @param {Function} handler - Event handler
     * @param {boolean} useCapture - Use capture phase
     */
    static addKeyListener(element, key, handler, useCapture = false) {
        if (!element) return;
        
        element.addEventListener('keydown', (e) => {
            if (e.key === key) {
                handler(e);
            }
        }, useCapture);
    }

    /**
     * Add escape key listener
     * @param {HTMLElement} element - Element to add listener to
     * @param {Function} handler - Event handler
     * @param {boolean} useCapture - Use capture phase
     */
    static addEscapeListener(element, handler, useCapture = false) {
        this.addKeyListener(element, 'Escape', handler, useCapture);
    }

    /**
     * Add enter key listener
     * @param {HTMLElement} element - Element to add listener to
     * @param {Function} handler - Event handler
     * @param {boolean} useCapture - Use capture phase
     */
    static addEnterListener(element, handler, useCapture = false) {
        this.addKeyListener(element, 'Enter', handler, useCapture);
    }

    /**
     * Add click outside listener
     * @param {HTMLElement} element - Element to listen outside of
     * @param {Function} handler - Event handler
     * @param {boolean} useCapture - Use capture phase
     */
    static addClickOutsideListener(element, handler, useCapture = false) {
        if (!element) return;
        
        document.addEventListener('click', (e) => {
            if (!element.contains(e.target)) {
                handler(e);
            }
        }, useCapture);
    }

    /**
     * Add resize listener
     * @param {Function} handler - Event handler
     * @param {number} delay - Debounce delay in milliseconds
     * @param {boolean} useCapture - Use capture phase
     */
    static addResizeListener(handler, delay = 100, useCapture = false) {
        this.addDebouncedListener(window, 'resize', handler, delay, useCapture);
    }

    /**
     * Add scroll listener
     * @param {Function} handler - Event handler
     * @param {number} delay - Debounce delay in milliseconds
     * @param {boolean} useCapture - Use capture phase
     */
    static addScrollListener(handler, delay = 100, useCapture = false) {
        this.addDebouncedListener(window, 'scroll', handler, delay, useCapture);
    }

    /**
     * Add visibility change listener
     * @param {Function} handler - Event handler
     * @param {boolean} useCapture - Use capture phase
     */
    static addVisibilityChangeListener(handler, useCapture = false) {
        document.addEventListener('visibilitychange', handler, useCapture);
    }

    /**
     * Add beforeunload listener
     * @param {Function} handler - Event handler
     * @param {boolean} useCapture - Use capture phase
     */
    static addBeforeUnloadListener(handler, useCapture = false) {
        window.addEventListener('beforeunload', handler, useCapture);
    }
}

export default EventUtils;
