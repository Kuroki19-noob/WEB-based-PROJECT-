const db = require("../config/db")
const { validationResult } = require('express-validator')

const createReservation = async (req, res, next) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).send({ success: false, errors: errors.array() });
        }

        const { DateD, TableNum, email, number } = req.body;

        const [existing] = await db.query(
            "SELECT id FROM reservationttbl WHERE DateD = ? AND TableNum = ?",
            [DateD, TableNum]
        );

        if (existing.length > 0) {
            return res.status(409).send({
                success: false,
                message: 'Table already reserved for this date.'
            });
        }

        const result = await db.query(
            "INSERT INTO reservationttbl (DateD, TableNum, email, number) VALUES (?, ?, ?, ?)",
            [DateD, TableNum, email, number]
        );

        res.status(201).send({
            success: true,
            message: 'Reservation created successfully!',
            id: result[0].insertId
        });

    } catch (error) {
        next(error);
    }
};

const getAllReservations = async (req, res, next) => {
    try {
        const [reservations] = await db.query("SELECT * FROM reservationttbl ORDER BY DateD DESC");
        res.status(200).send({ success: true, reservations });
    } catch (error) {
        next(error);
    }
};

module.exports = { createReservation, getAllReservations }
