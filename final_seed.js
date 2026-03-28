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

const perfectPlaces = [
    {
        name: 'Mahabodhi Temple',
        description: 'The holiest site in Buddhism, where Siddhartha Gautama attained Enlightenment. A UNESCO World Heritage site.',
        location: 'Bodh Gaya',
        category: 'Religious',
        images: ['/assets/images/mahabodhi.png'],
        averageRating: 4.9
    },
    {
        name: 'Nalanda University',
        description: 'Excavated ruins of the ancient world\'s first residential university, which hosted over 10,000 students and 2,000 teachers.',
        location: 'Nalanda',
        category: 'Heritage',
        images: ['/assets/images/nalanda.png'],
        averageRating: 4.8
    },
    {
        name: 'Vishwa Shanti Stupa',
        description: 'Set atop the historic Gridhakuta Hill in Rajgir, this majestic white peace pagoda radiates tranquility across the valley.',
        location: 'Rajgir',
        category: 'Religious',
        images: ['/assets/images/rajgir.png'],
        averageRating: 4.7
    },
    {
        name: 'Sher Shah Suri Tomb',
        description: 'An architectural marvel standing in the middle of a square lake. It is a stunning example of Indo-Islamic architecture.',
        location: 'Sasaram',
        category: 'Heritage',
        images: ['/assets/images/sasaram.png'],
        averageRating: 4.7
    },
    {
        name: 'Jal Mandir',
        description: 'A beautiful white marble temple situated in the middle of a tank filled with lotuses in Pawapuri.',
        location: 'Pawapuri',
        category: 'Religious',
        images: ['/assets/images/jal_mandir.png'],
        averageRating: 4.8
    },
    {
        name: 'Takhat Sri Patna Sahib',
        description: 'One of the five Takhats of Sikhism, marking the birthplace of Guru Gobind Singh Ji.',
        location: 'Patna',
        category: 'Religious',
        images: ['/assets/images/patna_sahib.png'],
        averageRating: 4.9
    }
];

async function reseed() {
    try {
        await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/bihar_tourism');
        console.log('Connected. Cleaning up...');

        await Place.deleteMany({});
        console.log('Database cleared.');

        await Place.insertMany(perfectPlaces);
        console.log('✅ 6 perfect places added with working images.');

        process.exit(0);
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
}

reseed();
