function checkAuth() {
    const user = JSON.parse(localStorage.getItem('user'));
    const token = localStorage.getItem('token');
    if (!token || !user || user.role !== 'admin') {
        showToast('Access denied. Admin privileges required.', 'error');
        setTimeout(() => {
            window.location.href = '/Login.html';
        }, 1000);
        return false;
    }
    return token;
}

async function fetchReservations() {
    console.log('Fetching reservations...');
    const token = checkAuth();
    if (!token) return;

    try {
        const response = await fetch('/api/v1/reservations/all', {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });
        
        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || 'Failed to fetch reservations');
        }

        const data = await response.json();
        const tbody = document.getElementById('res-body');
        if (!tbody) return;

        if (!data.reservations || data.reservations.length === 0) {
            tbody.innerHTML = '<tr><td colspan="7" style="text-align: center; padding: 2rem;">No reservations found.</td></tr>';
            return;
        }

        tbody.innerHTML = data.reservations.map(res => {
            // Safely handle DateD
            let dateStr = 'N/A';
            if (res.DateD) {
                dateStr = typeof res.DateD === 'string' ? res.DateD.split('T')[0] : new Date(res.DateD).toISOString().split('T')[0];
            }

            return `
                <tr>
                    <td style="padding: 1rem; border-bottom: 1px solid var(--border-color);">${res.id}</td>
                    <td style="padding: 1rem; border-bottom: 1px solid var(--border-color);">${res.name || 'N/A'}</td>
                    <td style="padding: 1rem; border-bottom: 1px solid var(--border-color);">${dateStr}</td>
                    <td style="padding: 1rem; border-bottom: 1px solid var(--border-color);">${res.TableNum}</td>
                    <td style="padding: 1rem; border-bottom: 1px solid var(--border-color);">${res.email}</td>
                    <td style="padding: 1rem; border-bottom: 1px solid var(--border-color);">${res.number}</td>
                    <td style="padding: 1rem; border-bottom: 1px solid var(--border-color);">
                        <button class="delete-btn" data-id="${res.id}" style="padding: 0.5rem 1rem; background: #dc2626; font-size: 0.8rem; width: auto; color: white; border: none; border-radius: 4px; cursor: pointer;">Delete</button>
                    </td>
                </tr>
            `;
        }).join('');

        // Re-attach listeners after rendering
        attachDeleteListeners();

    } catch (err) { 
        console.error('Fetch Error:', err);
        showToast('Error: ' + err.message, 'error');
    }
}

function attachDeleteListeners() {
    const buttons = document.querySelectorAll('.delete-btn');
    buttons.forEach(btn => {
        btn.addEventListener('click', async (e) => {
            const id = e.currentTarget.getAttribute('data-id');
            await deleteRes(id);
        });
    });
}

async function deleteRes(id) {
    console.log(`Delete requested for ID: ${id}`);
    if (!id) {
        showToast('Invalid Reservation ID', 'error');
        return;
    }

    if (!confirm('Are you sure you want to delete this reservation?')) return;
    
    const token = localStorage.getItem('token');
    const apiBase = `${window.location.origin}/api/v1`;
    
    try {
        showToast('Deleting...', 'info');
        const response = await fetch(`${apiBase}/reservations/delete/${id}`, {
            method: 'DELETE',
            headers: { 
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            }
        });

        const data = await response.json();
        console.log('Delete response:', data);

        if (response.ok && data.success) {
            showToast('Deleted successfully', 'success');
            fetchReservations();
        } else {
            showToast(data.message || 'Failed to delete', 'error');
        }
    } catch (err) {
        console.error('Delete error:', err);
        showToast('Failed to delete: ' + err.message, 'error');
    }
}

document.addEventListener('DOMContentLoaded', fetchReservations);
