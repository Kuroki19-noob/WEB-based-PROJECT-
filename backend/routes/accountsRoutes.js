const express = require('express')
const { getAccounts, getAccountByID, createAccount, updateAccount, deleteAccount, loginAccount, logoutAccount} = require('../controllers/accountController')
const { authMiddleware, adminMiddleware } = require('../middleware/authMiddleware')

const router =express.Router()

router.get("/getall", authMiddleware, adminMiddleware, getAccounts)
router.get("/get/:id", authMiddleware, getAccountByID)
router.post('/create-account', createAccount)
router.put('/update/:id', authMiddleware, updateAccount)
router.delete('/delete/:id', authMiddleware, adminMiddleware, deleteAccount)
router.post('/login',loginAccount)
router.post('/logout',logoutAccount)

module.exports = router
