document.addEventListener('DOMContentLoaded', () => {
    const user = JSON.parse(localStorage.getItem('user'));

    if (!user) {
        // Not logged in, redirect to login
        window.location.replace('/Login.html');
        return;
    }

    // Fill in the details
    document.getElementById('prof-username').textContent = user.username || 'N/A';
    document.getElementById('prof-email').textContent = user.email || 'N/A';
    document.getElementById('prof-role').textContent = user.role || 'user';

    // Show admin link if the user is an admin
    if (user.role === 'admin') {
        const adminContainer = document.getElementById('admin-link-container');
        if (adminContainer) {
            adminContainer.style.display = 'block';
        }
    }
});
