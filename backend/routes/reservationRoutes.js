const express = require('express')
const { body } = require('express-validator')
const { createReservation, getAllReservations } = require('../controllers/reservationController')

const router = express.Router()

router.get('/all', getAllReservations)
router.post('/create-reservation', [
    body('DateD').isISO8601(),
    body('TableNum').isInt({ min: 1, max: 13 }),
    body('email').isEmail(),
    body('number').isString().notEmpty()
], createReservation)

module.exports = router
