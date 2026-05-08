const form = document.getElementById('form');
const errorDisplay = document.getElementById('error-msg');
const apiBase = `${window.location.origin}/api/v1`;

if (form) {
    form.addEventListener('submit', (e) => {
        e.preventDefault();

        const dateInput = document.getElementById('dateID');
        const emailInput = document.getElementById('email-id') || document.getElementById('email-input');
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
            const nameEl = document.getElementById('name-id');
            const nameVal = nameEl ? nameEl.value.trim() : '';
            const tableVal = parseInt(tableInput.value);

            console.log('Reservation Data:', { dateVal, emailVal, phoneVal, nameVal, tableVal });
            getReservationError(dateVal, emailVal, phoneVal, tableVal, nameVal);
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
        showAlert('error-msg', errors.join(" "), 'error');
        return; 
    }

    try {
        showAlert('error-msg', "Creating account...", 'info');
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
            showAlert('error-msg', "Account successfully made! Redirecting...", 'success');
            
            setTimeout(() => {
                window.location.href = "/Login.html";
            }, 2000);
        } else {
            showAlert('error-msg', result.message, 'error'); 
        }

    } catch (err) {
        showAlert('error-msg', "Server is offline. Please try again later.", 'error');
    }
}

async function getLoginError(email, pass) {
    let errors = [];
    let missingFields = [];
    const errorDisplay = document.getElementById('error-msg');

    if (email === "") missingFields.push("Email");
    if (pass === "") missingFields.push("Password");

    if (missingFields.length > 0) {
        let combinedError = missingFields.join(", ") + " must be filled correctly.";
        errors.push(combinedError);
    }

    if (errors.length !== 0) {
        showAlert('error-msg', errors.join(" "), 'error');
        return errors; 
    }

    try {
        showAlert('error-msg', "Logging in...", 'info');

        const response = await fetch(`${apiBase}/accounts/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email: email, password: pass }) 
        });

        const result = await response.json();

        if (response.ok && result.success) {
            showAlert('error-msg', "Log in successfully! Redirecting...", 'success');
            localStorage.setItem('user', JSON.stringify(result.user));
            localStorage.setItem('token', result.token);

            setTimeout(() => {
                window.location.href = "/index.html";
            }, 1000);

        } else {
            showAlert('error-msg', result.message || "Invalid credentials.", 'error');
            errors.push(result.message);
        }

    } catch (err) {
        showAlert('error-msg', "Cannot connect to server.", 'error');
        errors.push("Server connection error");
    }

    return errors;
}

async function getReservationError(dateVal, emailVal, phoneVal, tableVal, nameVal) {
    const errorDisplay = document.getElementById('error-msg');

    if (!dateVal || !emailVal || !phoneVal || isNaN(tableVal) || !nameVal) {
        showAlert('error-msg', "All fields are required.", 'error');
        return;
    }

    if (tableVal <= 0 || tableVal > 13) {
        showAlert('error-msg', "Please choose a table between 1 and 13.", 'error');
        return;
    }

    const phoneRegex = /^\d{10,}$/;
    if (!phoneRegex.test(phoneVal.replace(/\D/g, ''))) {
        showAlert('error-msg', "Please enter a valid phone number.", 'error');
        return;
    }

    try {
        showAlert('error-msg', "Sending reservation...", 'info');

        const payload = {
            DateD: dateVal,
            TableNum: tableVal,
            email: emailVal,
            number: phoneVal,
            name: nameVal
        };
        console.log('Sending Payload:', payload);

        const response = await fetch(`${apiBase}/reservations/create-reservation`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        });

        const data = await response.json();

        if (response.ok && data.success) {
            showAlert('error-msg', "Reservation Successful! Redirecting...", 'success');
            setTimeout(() => {
                window.location.href = "/index.html";
            }, 2000);
        } else {
            let errorMsg = data.message || "Failed to create reservation.";
            if (data.errors && Array.isArray(data.errors)) {
                errorMsg = data.errors.map(err => `${err.path || err.param}: ${err.msg}`).join(", ");
            }
            showAlert('error-msg', errorMsg, 'error');
        }

    } catch (err) {
        showAlert('error-msg', "Server connection error.", 'error');
        console.error("Error:", err);
    }
}










