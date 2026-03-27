const express = require('express');
const {
    getPlaces,
    getPlace,
    createPlace,
    updatePlace,
    deletePlace,
} = require('../controllers/places');

const router = express.Router();

const { protect, authorize } = require('../middleware/auth');

router.route('/').get(getPlaces).post(protect, authorize('admin'), createPlace);

router
    .route('/:id')
    .get(getPlace)
    .put(protect, authorize('admin'), updatePlace)
    .delete(protect, authorize('admin'), deletePlace);

module.exports = router;
