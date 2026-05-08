const form = document.getElementById('form');
const errorDisplay = document.getElementById('error-msg');
const apiBase = `${window.location.origin}/api/v1`;

if (form) {
    form.addEventListener('submit', (e) => {
        e.preventDefault();

        const dateInput = document.getElementById('dateID');
        const emailInput = document.getElementById('email-id');
        const phoneInput = document.getElementById('phone-id');
        const tableInput = document.getElementById('table-id');
        const usernameInput = document.getElementById('username-input');
        const passwordInput = document.getElementById('password-input');
        const repeatPasswordInput = document.getElementById('repeat-password-input');
        const isReservationPage = document.getElementById('dateID') !== null;

        if (isReservationPage) {
            const dateVal = dateInput.value;
            const emailVal = emailInput.value.trim();
            const phoneVal = phoneInput.value.trim();
            const tableVal = parseInt(tableInput.value);

            getReservationError(dateVal, emailVal, phoneVal, tableVal);
            return;
        }

        const user = usernameInput?.value.trim() || '';
        const email = emailInput?.value.trim() || '';
        const pass = passwordInput?.value || '';
        const repeatPass = repeatPasswordInput?.value || '';   

        if (usernameInput) { // Signup Page
            getSignupError(user, email, pass, repeatPass);
        } else { // Login Page
            getLoginError(email, pass);
        }
    });
}
   
async function getSignupError(user, email, pass, repeatPass) {
    let errors = [];
    const errorDisplay = document.getElementById('error-msg');

    if (!user || !email || !pass || !repeatPass) {
        errors.push("All fields must be filled.");
    } else if (pass !== repeatPass) {
        errors.push("Passwords do not match.");
    } else if (pass.length < 8) {
        errors.push("Password must be at least 8 characters.");
    }

    if (errors.length > 0) {
        errorDisplay.style.color = "red";
        errorDisplay.innerHTML = errors.join("<br>");
        return; 
    }

    try {
        const response = await fetch(`${apiBase}/accounts/create-account`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ 
                username: user, 
                email: email, 
                password: pass, 
                repeatpassword: repeatPass 
            })
        });

        const result = await response.json();

        if (response.ok) {
            errorDisplay.style.color = "green";
            errorDisplay.innerHTML = "Account successfully made! Redirecting...";
            
            setTimeout(() => {
                window.location.href = "/Login.html";
            }, 2000);
        } else {
            errorDisplay.style.color = "red";
            errorDisplay.innerHTML = result.message; 
        }

    } catch (err) {
        errorDisplay.style.color = "red";
        errorDisplay.innerHTML = "Server is offline. Please try again later.";
    }
}

async function getLoginError(email, pass) {
    let errors = [];
    let missingFields = [];
    const errorDisplay = document.getElementById('error-msg');

    if (email === "") missingFields.push("Email");
    if (pass === "") missingFields.push("Password");
    if (pass.length >= 20) missingFields.push("Password (too long)");

    if (missingFields.length > 0) {
        let combinedError = missingFields.join(", ") + " must be filled correctly.";
        errors.push(combinedError);
    }

    if (errors.length !== 0) {
        errorDisplay.style.color = "red";
        errorDisplay.innerHTML = errors.join("<br>");
        return errors; 
    }

    try {
        errorDisplay.style.color = "blue";
        errorDisplay.innerHTML = "Logging in...";

        const response = await fetch(`${apiBase}/accounts/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email: email, password: pass }) 
        });

        const result = await response.json();

        if (response.ok && result.success) {
            errorDisplay.style.color = "green";
            errorDisplay.innerHTML = "Log in successfully!";
            localStorage.setItem('user', JSON.stringify(result.user));
            localStorage.setItem('token', result.token);

            alert("Login successful! Redirecting...");
            window.location.href = "/index.html";
        } else {
            errorDisplay.style.color = "red";
            errorDisplay.innerHTML = result.message || "Invalid credentials.";
            errors.push(result.message);
        }

    } catch (err) {
        errorDisplay.style.color = "red";
        errorDisplay.innerHTML = "Cannot connect to server.";
        errors.push("Server connection error");
    }

    return errors;
}

async function getReservationError(dateVal, emailVal, phoneVal, tableVal) {
    const errorDisplay = document.getElementById('error-msg');

    if (!dateVal || !emailVal || !phoneVal || isNaN(tableVal)) {
        errorDisplay.style.color = "red";
        errorDisplay.innerHTML = "All fields are required.";
        return;
    }

    if (tableVal <= 0 || tableVal > 13) {
        errorDisplay.style.color = "red";
        errorDisplay.innerHTML = "Please choose a table between 1 and 13.";
        return;
    }

    const phoneRegex = /^\d{10,}$/;
    if (!phoneRegex.test(phoneVal.replace(/\D/g, ''))) {
        errorDisplay.style.color = "red";
        errorDisplay.innerHTML = "Please enter a valid phone number.";
        return;
    }

    try {
        errorDisplay.style.color = "blue";
        errorDisplay.innerHTML = "Sending reservation...";

        const response = await fetch(`${apiBase}/reservations/create-reservation`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                DateD: dateVal,
                TableNum: tableVal,
                email: emailVal,
                number: phoneVal
            })
        });

        const data = await response.json();

        if (response.ok && data.success) {
            errorDisplay.style.color = "green";
            errorDisplay.innerHTML = "Reservation Successful! Redirecting...";
            setTimeout(() => {
                window.location.href = "/index.html";
            }, 2000);
        } else {
            errorDisplay.style.color = "red";
            errorDisplay.innerHTML = data.message || "Failed to create reservation.";
        }

    } catch (err) {
        errorDisplay.style.color = "red";
        errorDisplay.innerHTML = "Server Offline or CORS error.";
        console.error("Error:", err);
    }
}










