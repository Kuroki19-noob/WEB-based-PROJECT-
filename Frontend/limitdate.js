async function getReservationError() {
    // Get elements
    const dateInput = document.getElementById('dateID');
    const emailInput = document.getElementById('email-id');
    const phoneInput = document.getElementById('phone-id');
    const tableInput = document.getElementById('table-id');
    const errorDisplay = document.getElementById('error-msg');

    // Get values
    const dateVal = dateInput.value;
    const emailVal = emailInput.value.trim();
    const phoneVal = phoneInput.value.trim();
    const tableVal = parseInt(tableInput.value);

    let errors = [];

    // Validation
    if (!dateVal || !emailVal || !phoneVal || isNaN(tableVal)) {
        errors.push("All fields are required.");
    }

    if (tableVal <= 0 || tableVal >= 14) {
        errors.push("Invalid Table: Choose between 1 and 13.");
    }

    // Fixed date comparison
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    if (dateVal && new Date(dateVal) < today) {
        errors.push("Cannot reserve a past date.");
    }

    if (errors.length > 0) {
        errorDisplay.style.color = "red";
        errorDisplay.innerHTML = errors.join("<br>");
        return;
    }

    try {
        errorDisplay.style.color = "blue";
        errorDisplay.innerHTML = "Processing...";

        const response = await fetch('/api/v1/reservations/create-reservation', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                DateD: dateVal,
                TableNum: tableVal,
                email: emailVal,
                number: phoneVal
            })
        });

        // ✅ CHECK RESPONSE STATUS FIRST
        if (!response.ok) {
            throw new Error(`HTTP Error: ${response.status} ${response.statusText}`);
        }

        const result = await response.json();
        
        if (result.success) {
            errorDisplay.style.color = "green";
            errorDisplay.innerHTML = "Reservation Successful! Redirecting...";
            setTimeout(() => {
                window.location.href = "/index.html";
            }, 2000);
        } else {
            errorDisplay.style.color = "red";
            errorDisplay.innerHTML = result.message || "Failed to create reservation.";
        }
    } catch (err) {
        errorDisplay.style.color = "red";
        errorDisplay.innerHTML = `Error: ${err.message}`;
        console.error("Full error:", err);
    }
}