const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');

// Load .env from the project root
dotenv.config({ path: path.join(__dirname, '../../.env') });

const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/bihar_tourism';
const JWT_SECRET = process.env.JWT_SECRET || 'yoursecret123';

const userSchema = new mongoose.Schema({
    name: String,
    email: { type: String, unique: true },
    password: String,
    role: { type: String, default: 'tourist' },
    createdAt: { type: Date, default: Date.now },
});

const placeSchema = new mongoose.Schema({
    name: String,
    description: String,
    location: String,
    category: { type: String, enum: ['Heritage', 'Religious', 'Nature', 'Others'] },
    images: [String],
    averageRating: Number,
    user: mongoose.Schema.ObjectId,
    createdAt: { type: Date, default: Date.now },
});

const User = mongoose.model('User', userSchema);
const Place = mongoose.model('Place', placeSchema);

const run = async () => {
    try {
        console.log('Connecting to:', MONGO_URI);
        await mongoose.connect(MONGO_URI);
        console.log('Connected!');

        await User.deleteMany();
        await Place.deleteMany();
        console.log('Cleared old data.');

        const bcrypt = require('bcryptjs');
        const salt = await bcrypt.genSalt(10);
        const hashed = await bcrypt.hash('admin123', salt);

        const admin = await User.create({
            name: 'Bihar Tourism Admin',
            email: 'admin@bihartourism.gov.in',
            password: hashed,
            role: 'admin',
        });
        console.log('Admin created:', admin.email);

        const places = [
            {
                name: 'Mahabodhi Temple',
                description: 'A UNESCO World Heritage Site where the Lord Buddha attained Enlightenment beneath the Bodhi Tree. A monument of global spiritual significance.',
                location: 'Bodh Gaya',
                category: 'Religious',
                images: ['https://images.unsplash.com/photo-1622396481328-9b1b78cdd9fd?q=80&w=1200&auto=format&fit=crop'],
                averageRating: 4.9,
                user: admin._id,
            },
            {
                name: 'Nalanda Ruins',
                description: 'The world\'s oldest residential university, dating back to the 5th century. A beacon of ancient learning that attracted scholars from across Asia.',
                location: 'Nalanda',
                category: 'Heritage',
                images: ['https://images.unsplash.com/photo-1548013146-72479768bada?q=80&w=1200&auto=format&fit=crop'],
                averageRating: 4.8,
                user: admin._id,
            },
            {
                name: 'Rajgir Hot Springs',
                description: 'Natural hot springs in the valley of Rajgir, surrounded by green hills. A sacred site mentioned in ancient Buddhist and Jain scriptures.',
                location: 'Rajgir',
                category: 'Nature',
                images: ['https://images.unsplash.com/photo-1506905925346-21bda4d32df4?q=80&w=1200&auto=format&fit=crop'],
                averageRating: 4.5,
                user: admin._id,
            },
            {
                name: 'Vikramshila Ruins',
                description: 'Ruins of another ancient Buddhist university established by King Dharmapala, once a centre of Tantric Buddhism in the 8th century.',
                location: 'Bhagalpur',
                category: 'Heritage',
                images: ['https://images.unsplash.com/photo-1561361058-c24e017e2b34?q=80&w=1200&auto=format&fit=crop'],
                averageRating: 4.4,
                user: admin._id,
            },
            {
                name: 'Barabar Caves',
                description: 'The oldest surviving rock-cut caves in India, dating to the Mauryan Empire (3rd century BC). A testament to ancient Ajivika faith.',
                location: 'Jehanabad',
                category: 'Heritage',
                images: ['https://images.unsplash.com/photo-1590050752117-23a9d7f2819a?q=80&w=1200&auto=format&fit=crop'],
                averageRating: 4.6,
                user: admin._id,
            },
            {
                name: 'Valmiki National Park',
                description: 'Bihar\'s only national park and tiger reserve, spanning 800 sq km in the foothills of the Himalayas — home to Bengal tigers and gharials.',
                location: 'West Champaran',
                category: 'Nature',
                images: ['https://images.unsplash.com/photo-1541123437800-1bb1317badc2?q=80&w=1200&auto=format&fit=crop'],
                averageRating: 4.7,
                user: admin._id,
            },
        ];

        await Place.insertMany(places);
        console.log('✅ All 6 destinations seeded!');
        console.log('');
        console.log('Admin Login:');
        console.log('  Email:    admin@bihartourism.gov.in');
        console.log('  Password: admin123');

        await mongoose.disconnect();
        process.exit(0);
    } catch (err) {
        console.error('Seeding FAILED:', err.message);
        await mongoose.disconnect();
        process.exit(1);
    }
};

run();
