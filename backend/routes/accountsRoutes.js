const express = require('express')
const { getAccounts, getAccountByID, createAccount, updateAccount, deleteAccount, loginAccount, logoutAccount} = require('../controllers/accountController')

const router =express.Router()

router.get("/getall", getAccounts)
router.get("/get/:id", getAccountByID)
router.post('/create-account', createAccount)
router.put('/update/:id', updateAccount)
router.delete('/delete/:id', deleteAccount)
router.post('/login',loginAccount)
router.post('/logout',logoutAccount)

module.exports = router
