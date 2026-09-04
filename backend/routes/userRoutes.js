const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const controller = require('../controllers/userController');

router.post('/register', controller.register);
router.post('/login', controller.login);
router.get('/me', auth, controller.me);

module.exports = router;
