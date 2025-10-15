/**
 * Animation and transition utilities
 */
class AnimationUtils {
    /**
     * Add fade-in animation to element
     * @param {HTMLElement} element - Element to animate
     * @param {number} delay - Delay in milliseconds
     */
    static fadeIn(element, delay = 0) {
        if (!element) return;
        
        element.style.opacity = '0';
        element.style.transform = 'translateY(10px)';
        element.style.transition = 'opacity 0.5s ease-in-out, transform 0.5s ease-in-out';
        
        setTimeout(() => {
            element.style.opacity = '1';
            element.style.transform = 'translateY(0)';
        }, delay);
    }

    /**
     * Add cascade fade-in animation to multiple elements
     * @param {HTMLElement[]} elements - Elements to animate
     * @param {number} staggerDelay - Delay between each element
     */
    static fadeInCascade(elements, staggerDelay = 100) {
        if (!elements || elements.length === 0) return;
        
        elements.forEach((element, index) => {
            if (element) {
                this.fadeIn(element, index * staggerDelay);
            }
        });
    }

    /**
     * Add slide-in animation from left
     * @param {HTMLElement} element - Element to animate
     * @param {number} delay - Delay in milliseconds
     */
    static slideInLeft(element, delay = 0) {
        if (!element) return;
        
        element.style.opacity = '0';
        element.style.transform = 'translateX(-20px)';
        element.style.transition = 'opacity 0.5s ease-in-out, transform 0.5s ease-in-out';
        
        setTimeout(() => {
            element.style.opacity = '1';
            element.style.transform = 'translateX(0)';
        }, delay);
    }

    /**
     * Add slide-in animation from right
     * @param {HTMLElement} element - Element to animate
     * @param {number} delay - Delay in milliseconds
     */
    static slideInRight(element, delay = 0) {
        if (!element) return;
        
        element.style.opacity = '0';
        element.style.transform = 'translateX(20px)';
        element.style.transition = 'opacity 0.5s ease-in-out, transform 0.5s ease-in-out';
        
        setTimeout(() => {
            element.style.opacity = '1';
            element.style.transform = 'translateX(0)';
        }, delay);
    }

    /**
     * Add scale-in animation
     * @param {HTMLElement} element - Element to animate
     * @param {number} delay - Delay in milliseconds
     */
    static scaleIn(element, delay = 0) {
        if (!element) return;
        
        element.style.opacity = '0';
        element.style.transform = 'scale(0.9)';
        element.style.transition = 'opacity 0.3s ease-in-out, transform 0.3s ease-in-out';
        
        setTimeout(() => {
            element.style.opacity = '1';
            element.style.transform = 'scale(1)';
        }, delay);
    }

    /**
     * Add bounce animation
     * @param {HTMLElement} element - Element to animate
     * @param {number} delay - Delay in milliseconds
     */
    static bounce(element, delay = 0) {
        if (!element) return;
        
        element.style.animation = 'none';
        
        setTimeout(() => {
            element.style.animation = 'bounce 0.6s ease-in-out';
        }, delay);
    }

    /**
     * Add pulse animation
     * @param {HTMLElement} element - Element to animate
     * @param {number} delay - Delay in milliseconds
     */
    static pulse(element, delay = 0) {
        if (!element) return;
        
        element.style.animation = 'none';
        
        setTimeout(() => {
            element.style.animation = 'pulse 0.5s ease-in-out';
        }, delay);
    }

    /**
     * Remove all animations from element
     * @param {HTMLElement} element - Element to reset
     */
    static reset(element) {
        if (!element) return;
        
        element.style.opacity = '';
        element.style.transform = '';
        element.style.transition = '';
        element.style.animation = '';
    }

    /**
     * Add loading animation to element
     * @param {HTMLElement} element - Element to animate
     */
    static loading(element) {
        if (!element) return;
        
        element.style.animation = 'loading 1s linear infinite';
    }

    /**
     * Remove loading animation from element
     * @param {HTMLElement} element - Element to reset
     */
    static stopLoading(element) {
        if (!element) return;
        
        element.style.animation = '';
    }
}

// Add CSS animations to document head
document.addEventListener('DOMContentLoaded', () => {
    const style = document.createElement('style');
    style.textContent = `
        @keyframes bounce {
            0%, 20%, 50%, 80%, 100% { transform: translateY(0); }
            40% { transform: translateY(-10px); }
            60% { transform: translateY(-5px); }
        }
        
        @keyframes pulse {
            0%, 100% { transform: scale(1); }
            50% { transform: scale(1.05); }
        }
        
        @keyframes loading {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
        }
    `;
    document.head.appendChild(style);
});

export default AnimationUtils;
