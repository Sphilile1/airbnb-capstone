const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const authorize = require('../middleware/authorize');
const controller = require('../controllers/reservationController');

router.post('/', auth, controller.createReservation);
router.get('/host', auth, authorize('host', 'admin'), controller.getReservationsByHost);
router.get('/user', auth, controller.getReservationsByUser);
router.put('/:id', auth, controller.updateReservation);
router.delete('/:id', auth, controller.deleteReservation);

module.exports = router;
