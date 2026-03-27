const mongoose = require('mongoose');

const placeSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Please add a name'],
        trim: true,
        maxlength: [100, 'Name cannot be more than 100 characters'],
    },
    description: {
        type: String,
        required: [true, 'Please add a description'],
        maxlength: [1000, 'Description cannot be more than 1000 characters'],
    },
    location: {
        type: String,
        required: [true, 'Please add a location'],
    },
    mapUrl: {
        type: String,
        default: ''
    },
    category: {
        type: String,
        required: [true, 'Please add a category'],
        enum: ['Heritage', 'Religious', 'Nature', 'Others'],
    },
    images: {
        type: [String],
        default: ['no-photo.jpg'],
    },
    averageRating: {
        type: Number,
        min: [1, 'Rating must be at least 1'],
        max: [5, 'Rating must be at most 5'],
    },
    user: {
        type: mongoose.Schema.ObjectId,
        ref: 'User',
        required: true, // Only admins can add places
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
});

module.exports = mongoose.model('Place', placeSchema);
