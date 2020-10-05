const express = require('express');
const router = express.Router();
const { protect } = require('../middlewares/auth');
const {
  register,
  login,
  logout,
  getMe,
} = require('../controllers/authController');

router.post('/register', register);
router.get('/logout', logout);
router.post('/login', login);
router.get('/me', protect, getMe);

module.exports = router;
