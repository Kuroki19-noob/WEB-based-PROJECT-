const db = require("../config/db")

const createReservation = async (req, res) => {
    try {
        const { DateD, TableNum, email, number } = req.body;

        console.log("Received data:", { DateD, TableNum, email, number }); // DEBUG

        const table = parseInt(TableNum);
        
        if (isNaN(table) || table <= 0 || table >= 14) {
            return res.status(400).send({
                success: false,
                message: 'Invalid Table Selection. Please choose between 1 and 13.'
            });
        }

        if (!DateD || !email || !number) {
            return res.status(400).send({
                success: false,
                message: 'Missing required data.'
            });
        }

        // Correct way: don't destructure, get the full result
        const result = await db.query(
            "INSERT INTO reservationttbl (DateD, TableNum, email, number) VALUES (?, ?, ?, ?)", 
            [DateD, table, email, number] 
        );

        console.log("Insert successful, ID:", result[0].insertId); // DEBUG

        res.status(201).send({
            success: true,
            message: 'Reservation created successfully!',
            id: result[0].insertId
        });

    } catch (error) {
        console.error("DB Error:", error);
        res.status(500).send({ 
            success: false, 
            message: error.message 
        });
    }
};

module.exports = {createReservation}