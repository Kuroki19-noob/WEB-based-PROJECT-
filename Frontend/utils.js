/**
 * Utility function to show stylized notifications (toasts)
 * @param {string} message - The message to display
 * @param {string} type - 'success', 'error', or 'info'
 */
function showToast(message, type = 'info') {
    let container = document.getElementById('toast-container');
    if (!container) {
        container = document.createElement('div');
        container.id = 'toast-container';
        document.body.appendChild(container);
    }

    const toast = document.createElement('div');
    toast.className = `toast toast-${type}`;
    
    // Set border color based on type
    const colors = {
        success: '#16a34a',
        error: '#dc2626',
        info: '#7c3aed'
    };
    toast.style.borderLeftColor = colors[type] || colors.info;

    toast.innerHTML = `
        <span>${message}</span>
        <button onclick="this.parentElement.remove()" style="padding: 0; margin: 0; width: auto; background: none; color: #94a3b8; font-size: 1.2rem; border: none;">&times;</button>
    `;

    container.appendChild(toast);

    // Auto-remove after 5 seconds
    setTimeout(() => {
        toast.classList.add('fade-out');
        setTimeout(() => toast.remove(), 300);
    }, 5000);
}

/**
 * Utility to update in-page alert components
 * @param {string} elementId - The ID of the element to update
 * @param {string} message - The message to display
 * @param {string} type - 'success', 'error', or 'info'
 */
function showAlert(elementId, message, type = 'info') {
    const el = document.getElementById(elementId);
    if (!el) return;

    el.textContent = message;
    el.className = `alert alert-${type} show`;
}
