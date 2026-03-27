const Place = require('../models/Place');
const ErrorResponse = require('../utils/errorResponse');

// @desc    Get all places
// @route   GET /api/v1/places
// @access  Public
exports.getPlaces = async (req, res, next) => {
    try {
        const places = await Place.find();
        res.status(200).json({
            success: true,
            count: places.length,
            data: places,
        });
    } catch (err) {
        next(err);
    }
};

// @desc    Get single place
// @route   GET /api/v1/places/:id
// @access  Public
exports.getPlace = async (req, res, next) => {
    try {
        const place = await Place.findById(req.params.id);

        if (!place) {
            return next(
                new ErrorResponse(`Place not found with id of ${req.params.id}`, 404)
            );
        }

        res.status(200).json({
            success: true,
            data: place,
        });
    } catch (err) {
        next(err);
    }
};

// @desc    Create new place
// @route   POST /api/v1/places
// @access  Private (Admin)
exports.createPlace = async (req, res, next) => {
    try {
        // Add user to req.body
        req.body.user = req.user.id;

        const place = await Place.create(req.body);

        res.status(201).json({
            success: true,
            data: place,
        });
    } catch (err) {
        next(err);
    }
};

// @desc    Update place
// @route   PUT /api/v1/places/:id
// @access  Private (Admin)
exports.updatePlace = async (req, res, next) => {
    try {
        let place = await Place.findById(req.params.id);

        if (!place) {
            return next(
                new ErrorResponse(`Place not found with id of ${req.params.id}`, 404)
            );
        }

        place = await Place.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            runValidators: true,
        });

        res.status(200).json({
            success: true,
            data: place,
        });
    } catch (err) {
        next(err);
    }
};

// @desc    Delete place
// @route   DELETE /api/v1/places/:id
// @access  Private (Admin)
exports.deletePlace = async (req, res, next) => {
    try {
        const place = await Place.findById(req.params.id);

        if (!place) {
            return next(
                new ErrorResponse(`Place not found with id of ${req.params.id}`, 404)
            );
        }

        await place.deleteOne();

        res.status(200).json({
            success: true,
            data: {},
        });
    } catch (err) {
        next(err);
    }
};
