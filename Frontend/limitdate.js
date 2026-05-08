// This script ensures the reservation date cannot be in the past
document.addEventListener('DOMContentLoaded', () => {
    const dateInput = document.getElementById('dateID');
    if (dateInput) {
        const today = new Date().toISOString().split('T')[0];
        dateInput.setAttribute('min', today);
    }
});
