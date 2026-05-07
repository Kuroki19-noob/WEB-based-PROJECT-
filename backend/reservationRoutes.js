const express = require('express')
const {createReservation} = require('../controllers/reservationController')

const router =express.Router()

router.post('/create-reservation', createReservation)   


module.exports = router