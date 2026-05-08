async function getReservationError() {
    // Grab elements
    const dateInput = document.getElementById('dateID');
    const emailInput = document.getElementById('email-id');
    const phoneInput = document.getElementById('phone-id');
    const errorDisplay = document.getElementById('error-msg');

    // Get current values
    const dateVal = dateInput.value;
    const emailVal = emailInput.value.trim();
    const phoneVal = phoneInput.value.trim();

    // 1. Local Validation
    if (!dateVal || !emailVal || !phoneVal) {
        errorDisplay.style.color = "red";
        errorDisplay.innerHTML = "All fields are required.";
        return;
    }

    try {
        errorDisplay.style.color = "blue";
        errorDisplay.innerHTML = "Sending reservation...";

        const response = await fetch('/api/v1/reservations/create-reservation', {
            method: 'POST', // This MUST match router.post in backend
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                DateD: dateVal,
                TableNum: "T1", // Your new column name
                email: emailVal,
                number: phoneVal
            }) 
        });

        const result = await response.json();

        if (response.ok && result.success) {
            alert("Reservation Successful!");
            window.location.href = "my-reservations.html";
        } else {
            errorDisplay.style.color = "red";
            errorDisplay.innerHTML = result.message || "405 Method Not Allowed - Check Routes";
        }

    } catch (err) {
        errorDisplay.style.color = "red";
        errorDisplay.innerHTML = "CORS Blocked or Server Offline.";
    }
}

