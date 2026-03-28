const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');

dotenv.config({ path: path.join(__dirname, '.env') });

const PlaceSchema = new mongoose.Schema({
    name: { type: String, required: true },
    description: { type: String, required: true },
    location: { type: String, required: true },
    category: { type: String, required: true },
    images: { type: [String], default: ['no-photo.jpg'] },
    averageRating: { type: Number, min: 1, max: 5 }
});

const Place = mongoose.models.Place || mongoose.model('Place', PlaceSchema);

async function checkAndFix() {
    try {
        await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/bihar_tourism');
        console.log('Connected to MongoDB');

        const places = await Place.find();
        console.log(`Found ${places.length} places`);

        const FALLBACKS = {
            Religious: 'https://images.unsplash.com/photo-1622396481328-9b1b78cdd9fd?q=80&w=1200&auto=format&fit=crop',
            Heritage: 'https://images.unsplash.com/photo-1548013146-72479768bada?q=80&w=1200&auto=format&fit=crop',
            Nature: 'https://images.unsplash.com/photo-1541123437800-1bb1317badc2?q=80&w=1200&auto=format&fit=crop',
            'Vishwa Shanti Stupa': 'https://images.unsplash.com/photo-1541123437800-1bb1317badc2?q=80&w=1200&auto=format&fit=crop',
            Other: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?q=80&w=1200&auto=format&fit=crop'
        };

        for (const p of places) {
            if (!p.images || p.images.length === 0 || p.images[0] === 'no-photo.jpg' || p.images[0] === '') {
                console.log(`Fixing missing image for: ${p.name}`);
                const fallback = FALLBACKS[p.name] || FALLBACKS[p.category] || FALLBACKS.Other;
                p.images = [fallback];
                await p.save();
                console.log(`✅ Updated ${p.name}`);
            }
        }

        console.log('Finished fixing images');
        process.exit(0);
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
}

checkAndFix();
