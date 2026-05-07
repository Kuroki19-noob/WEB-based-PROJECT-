
 (function() {
    
    const checkAuth = () => {
        console.log("--- Auth Check Executing ---");
        
        // 1. Get Path - Use lowercase for comparison
        const path = window.location.pathname.toLowerCase();
        
        // 2. Get User - Handle potential JSON errors
        let user = null;
        try {
            const storedUser = localStorage.getItem('user');
            if (storedUser && storedUser !== "undefined") {
                user = JSON.parse(storedUser);
            }
        } catch (e) {
            console.error("Local storage user data is corrupted.");
            localStorage.removeItem('user');
        }

        // 3. Define Pages
        const protectedPages = ['/index.html', '/pages/menu.html', '/pages/reservation.html', '/pages/team.html'];
        const authPages = ['/login.html', '/signup.html'];

        // 4. Logic: Is the current URL one of the protected ones?
        // This checks if the URL ends in "/" (root) OR contains any protected page name
        const isRoot = path.endsWith('/') || path === '';
        const isProtected = isRoot || protectedPages.some(p => path.includes(p));
        const isAuthPage = authPages.some(p => path.includes(p));

        console.log({ path, isProtected, isAuthPage, loggedIn: !!user });

        // 5. Redirect Logic
        if (!user && isProtected) {
            console.warn("Access Denied. Redirecting to login...");
            window.location.replace("/login.html");
            return; // Stop further execution
        } 
        
        if (user && isAuthPage) {
            console.warn("Already logged in. Redirecting to home...");
            window.location.replace("/index.html");
            return;
        }

        console.log("Access Granted.");
    };

    // Run immediately to prevent "flicker" of protected content
    checkAuth();

    // Attach Event Listeners once DOM is ready
    document.addEventListener('DOMContentLoaded', () => {
        const logoutBtn = document.getElementById('logoutBtn');
        
        if (logoutBtn) {
            logoutBtn.addEventListener('click', async (e) => {
                e.preventDefault();
                console.log("Logging out...");

                try {
                    // Timeout the fetch so it doesn't hang the UI if backend is down
                    const controller = new AbortController();
                    const timeoutId = setTimeout(() => controller.abort(), 2000);

                    await fetch('http://localhost:8000/api/v1/accounttbl/logout', { 
                        method: 'POST',
                        signal: controller.signal 
                    });
                    clearTimeout(timeoutId);
                } catch (err) {
                    console.log("Backend unreachable, clearing local session anyway.");
                }

                localStorage.removeItem('user');
                window.location.replace("/login.html");
            });
        }
    });

})();