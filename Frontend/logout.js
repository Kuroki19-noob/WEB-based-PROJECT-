
 (function() {
    
    const checkAuth = () => {
        console.log("--- Auth Check Executing ---");
        
        const path = window.location.pathname.toLowerCase();

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

        const protectedPages = ['/index.html', '/pages/menu.html', '/pages/reservation.html', '/pages/team.html', '/profile.html', '/admin.html'];
        const authPages = ['/login.html', '/signup.html'];
        const isRoot = path.endsWith('/') || path === '';
        const isProtected = isRoot || protectedPages.some(p => path.includes(p));
        const isAuthPage = authPages.some(p => path.includes(p));

        console.log({ path, isProtected, isAuthPage, loggedIn: !!user });

        if (!user && isProtected) {
            console.warn("Access Denied. Redirecting to login...");
            window.location.replace("/Login.html");
            return;
        } 
        
        if (user && isAuthPage) {
            console.warn("Already logged in. Redirecting to home...");
            window.location.replace("/index.html");
            return;
        }

        console.log("Access Granted.");
    };

    checkAuth();

    document.addEventListener('DOMContentLoaded', () => {
        const logoutBtn = document.getElementById('logoutBtn');
        
        if (logoutBtn) {
            logoutBtn.addEventListener('click', async (e) => {
                e.preventDefault();
                console.log("Logging out...");

                try {
                    const controller = new AbortController();
                    const timeoutId = setTimeout(() => controller.abort(), 2000);

                    await fetch(`${window.location.origin}/api/v1/accounts/logout`, {
                        method: 'POST',
                        signal: controller.signal 
                    });
                    clearTimeout(timeoutId);
                } catch (err) {
                    console.log("Backend unreachable, clearing local session anyway.");
                }

                localStorage.removeItem('user');
                window.location.replace("/Login.html");
            });
        }
    });

})();
