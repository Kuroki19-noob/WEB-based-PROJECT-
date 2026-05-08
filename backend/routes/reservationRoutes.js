const express = require('express')
const { body } = require('express-validator')
const { createReservation, getAllReservations, deleteReservation } = require('../controllers/reservationController')
const { authMiddleware, adminMiddleware } = require('../middleware/authMiddleware')

const router = express.Router()

router.get('/all', authMiddleware, adminMiddleware, getAllReservations)
router.delete('/delete/:id', authMiddleware, adminMiddleware, deleteReservation)
router.post('/create-reservation', [
    body('DateD').notEmpty(),
    body('TableNum').isInt({ min: 1, max: 13 }),
    body('email').isEmail(),
    body('number').isString().notEmpty(),
    body('name').isString().notEmpty()
], createReservation)

module.exports = router
