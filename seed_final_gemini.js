const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Place = require('./backend/models/Place');
const User = require('./backend/models/User');

dotenv.config();

const placesUpdate = [
    { name: 'Mahabodhi Temple', images: ['images/mahabodhi.png'] },
    { name: 'Nalanda University Ruins', images: ['images/nalanda.png'] },
    { name: 'Sher Shah Suri Tomb', images: ['images/sasaram.png'] },
    { name: 'Vishnupad Temple', images: ['images/gaya.png'] },
    { name: 'Valmiki National Park', images: ['images/valmiki.png'] },
    { name: 'Takhat Sri Patna Sahib', images: ['images/patna_sahib.png'] },
    { name: 'Vikramshila University', images: ['images/vikramshila.png'] },
    { name: 'Jal Mandir', images: ['images/jal_mandir.png'] },
    { name: 'Rajgir Glass Bridge', images: ['images/rajgir.png'] },
    { name: 'Golghar', images: ['images/golghar.png'] }
];

const seedGemini = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('Connected to MongoDB');
        
        for (const p of placesUpdate) {
            const updated = await Place.findOneAndUpdate(
                { name: p.name },
                { $set: { images: p.images } },
                { new: true }
            );
            if (updated) console.log(`✅ Updated Image for: ${p.name}`);
        }
        
        console.log('\n🌟 All 10 places now have Premium Gemini Generated Images!');
        process.exit(0);
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
};

seedGemini();
