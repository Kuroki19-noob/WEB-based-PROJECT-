const db = require("../config/db")
const { validationResult } = require('express-validator')

const createReservation = async (req, res, next) => {
    try {
        console.log('--- Incoming Reservation Request ---');
        console.log('Body:', req.body);
        
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            console.log('Validation Errors:', errors.array());
            return res.status(400).send({ success: false, errors: errors.array() });
        }

        const { DateD, TableNum, email, number, name } = req.body;
        console.log(`Checking existing for Date: ${DateD}, Table: ${TableNum}`);

        const [existing] = await db.query(
            "SELECT id FROM reservationttbl WHERE DateD = ? AND TableNum = ?",
            [DateD, TableNum]
        );

        if (existing.length > 0) {
            console.log('Conflict: Table already reserved.');
            return res.status(409).send({
                success: false,
                message: 'Table already reserved for this date.'
            });
        }

        console.log('Inserting reservation...');
        const result = await db.query(
            "INSERT INTO reservationttbl (DateD, TableNum, email, number, name) VALUES (?, ?, ?, ?, ?)",
            [DateD, TableNum, email, number, name]
        );

        console.log('Reservation created, ID:', result[0].insertId);
        res.status(201).send({
            success: true,
            message: 'Reservation created successfully!',
            id: result[0].insertId
        });

    } catch (error) {
        console.error('Error in createReservation:', error);
        next(error);
    }
};

const getAllReservations = async (req, res, next) => {
    try {
        const [reservations] = await db.query("SELECT * FROM reservationttbl ORDER BY DateD DESC");
        res.status(200).send({ success: true, reservations });
    } catch (error) {
        console.error('Error in getAllReservations:', error);
        next(error);
    }
};

const deleteReservation = async (req, res, next) => {
    try {
        const { id } = req.params;
        console.log(`--- Delete Request for ID: ${id} ---`);
        
        const [result] = await db.query("DELETE FROM reservationttbl WHERE id = ?", [id]);
        console.log('Delete Result:', result);

        if (result.affectedRows === 0) {
            return res.status(404).send({ success: false, message: 'Reservation not found' });
        }

        res.status(200).send({ success: true, message: 'Reservation deleted successfully' });
    } catch (error) {
        console.error('Error in deleteReservation:', error);
        next(error);
    }
};

module.exports = { createReservation, getAllReservations, deleteReservation }
