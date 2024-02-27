const express = require('express');
const { getAllUser, login, signup,getSignUp,getLogin,getHistory, deleteUser, renderAdminPage} = require('../controllers/userController.js');
const isAdmin = require('../middleware/isAdmin');

const router = express.Router()
router.get('/admin', isAdmin, renderAdminPage);
router.get('/all-users', isAdmin, getAllUser);
router.delete('/user/:userId', isAdmin, deleteUser);
router.get('/', getSignUp);
router.get('/login', getLogin);
router.get('/history',getHistory);
router.post("/signup", signup);
router.post("/login", login);

module.exports = router;
