function checkAuth() {
    const user = JSON.parse(localStorage.getItem('user'));
    const token = localStorage.getItem('token');
    if (!token || !user || user.role !== 'admin') {
        alert('Access denied. Admin privileges required.');
        window.location.href = '/Login.html';
        return false;
    }
    return token;
}

async function fetchReservations() {
    const token = checkAuth();
    if (!token) return;

    try {
        const response = await fetch('/api/v1/reservations/all', {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });
        const data = await response.json();
        
        if (!response.ok) {
            throw new Error(data.message || 'Failed to fetch reservations');
        }

        const tbody = document.getElementById('res-body');
        if (!tbody) return;

        tbody.innerHTML = '';
        data.reservations.forEach(res => {
            tbody.innerHTML += `<tr>
                <td style="padding: 1rem; border-bottom: 1px solid var(--border-color);">${res.id}</td>
                <td style="padding: 1rem; border-bottom: 1px solid var(--border-color);">${res.DateD.split('T')[0]}</td>
                <td style="padding: 1rem; border-bottom: 1px solid var(--border-color);">${res.TableNum}</td>
                <td style="padding: 1rem; border-bottom: 1px solid var(--border-color);">${res.email}</td>
                <td style="padding: 1rem; border-bottom: 1px solid var(--border-color);">${res.number}</td>
            </tr>`;
        });
    } catch (err) { 
        console.error(err);
        alert('Error: ' + err.message);
    }
}

document.addEventListener('DOMContentLoaded', fetchReservations);
