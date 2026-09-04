const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const authorize = require('../middleware/authorize');
const upload = require('../middleware/upload');
const controller = require('../controllers/accommodationController');

router.get('/', controller.getAccommodations);
router.get('/:id', controller.getAccommodationById);
router.post('/', auth, authorize('host', 'admin'), upload.array('images', 5), controller.createAccommodation);
router.put('/:id', auth, authorize('host', 'admin'), upload.array('images', 5), controller.updateAccommodation);
router.delete('/:id', auth, authorize('host', 'admin'), controller.deleteAccommodation);

module.exports = router;
