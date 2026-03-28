const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Place = require('./backend/models/Place');
const User = require('./backend/models/User');

dotenv.config();

const placesUpdate = [
    {
        name: 'Mahabodhi Temple',
        location: 'Bodh Gaya, Bihar',
        category: 'Religious',
        mapUrl: 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3624.4691461944!2d84.989397675!3d24.6953039!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x39f32c69566f1255%3A0xc3f5c9e29a8f5cfd!2sMahabodhi%20Temple!5e0!3m2!1sen!2sin!4v1711535000000!5m2!1sen!2sin',
        description: 'The Mahabodhi Temple is a UNESCO World Heritage Site, marking the spot where the Buddha attained Enlightenment. It is one of the four holy sites related to the life of the Lord Buddha. The complex contains the Diamond Throne (Vajrasana) and the holy Bodhi tree. It is a masterpiece of ancient brick architecture from the late Gupta period.',
        images: [
            'https://images.unsplash.com/photo-1622396481328-9b1b78cdd9fd?q=80&w=1200',
            'https://images.unsplash.com/photo-1548013146-72479768bada?q=80&w=1200'
        ]
    },
    {
        name: 'Nalanda University',
        location: 'Nalanda, Bihar',
        category: 'Heritage',
        mapUrl: 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3611.8385361234!2d85.441405175!3d25.1352485!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x39f2f35700000001%3A0x86c189b87fcf359!2sAncient%20Nalanda%20University!5e0!3m2!1sen!2sin!4v1711535100000!5m2!1sen!2sin',
        description: 'Nalanda was a renowned Mahavihara, a large Buddhist monastery, in the ancient kingdom of Magadha. It was the world\'s first residential university, hosting over 10,000 students and 2,000 teachers. The ruins stand as a testament to the glorious educational history of India.',
        images: [
            'https://images.unsplash.com/photo-1548013146-72479768bada?q=80&w=1200',
            'https://images.unsplash.com/photo-1590059391036-79ef88be3379?q=80&w=1200'
        ]
    },
    {
        name: 'Rajgir Glass Bridge',
        location: 'Rajgir, Bihar',
        category: 'Nature',
        mapUrl: 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3615.1524316084!2d85.405469475!3d25.0357064!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x39f257a315482397%3A0xbd86241a8775268c!2sNature%20Safari%20Glass%20Bridge!5e0!3m2!1sen!2sin!4v1711535200000!5m2!1sen!2sin',
        description: 'Experience the thrill of Bihar\'s first Glass Skywalk in Rajgir. Suspended over a deep valley, this bridge offers spectacular views of the surrounding hills and nature safari. It is a modern addition to Rajgir\'s rich heritage of peace and adventure.',
        images: [
            'https://images.unsplash.com/photo-1506744038136-46273834b3fb?q=80&w=1200',
            'https://images.unsplash.com/photo-1565012502804-061aa31a748c?q=80&w=1200'
        ]
    },
    {
        name: 'Vishnupad Temple',
        location: 'Gaya, Bihar',
        category: 'Religious',
        mapUrl: 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3619.5714316084!2d85.008469475!3d24.7857064!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x39f32c1c3f8f5cfd%3A0xbd86241a8775268c!2sVishnupad%20Temple!5e0!3m2!1sen!2sin!4v1711535300000!5m2!1sen!2sin',
        description: 'Vishnupad Temple is an ancient temple in Gaya, Bihar, India. It is a Buddhist and Hindu temple dedicated to Lord Vishnu. The temple is located along the Falgu River, marked by a footprint of Vishnu known as Dharmasila, incised into a block of basalt.',
        images: [
            'https://images.unsplash.com/photo-1548013146-72479768bada?q=80&w=1200'
        ]
    },
    {
        name: 'Golghar',
        location: 'Patna, Bihar',
        category: 'Heritage',
        mapUrl: 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3597.5714316084!2d85.138469475!3d25.6157064!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x39ed58ed3f8f5cfd%3A0xbd86241a8775268c!2sGolghar!5e0!3m2!1sen!2sin!4v1711535400000!5m2!1sen!2sin',
        description: 'The Golghar (Round House) is a large granary located to the west of the Gandhi Maidan in Patna. Built by Captain John Garstin in 1786, its 29-meter height and unique architectural style offer a panoramic view of the Ganges river and the city of Patna.',
        images: [
            'https://images.unsplash.com/photo-1565882333140-1a748c8cdeaf?q=80&w=1200'
        ]
    },
    {
        name: 'Sher Shah Suri Tomb',
        location: 'Sasaram, Bihar',
        category: 'Heritage',
        mapUrl: 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3618.5714316084!2d84.008469475!3d24.9557064!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x398ebc1c3f8f5cfd%3A0xbd86241a8775268c!2sTomb%20of%20Sher%20Shah%20Suri!5e0!3m2!1sen!2sin!4v1711535500000!5m2!1sen!2sin',
        description: 'The tomb of Sher Shah Suri is in the Sasaram town of Bihar state, India. Built in memory of Emperor Sher Shah Suri, a Pathan from Bihar who defeated the Mughal Empire and founded the Suri Empire in northern India. It is a masterpiece of Indo-Islamic architecture, standing in the middle of an artificial lake.',
        images: [
            'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?q=80&w=1200'
        ]
    }
];

const seedPlaces = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        const admin = await User.findOne({ role: 'admin' });
        if (!admin) {
            console.error('No admin found.');
            process.exit(1);
        }
        for (const p of placesUpdate) {
            p.user = admin._id;
            await Place.findOneAndUpdate({ name: p.name }, p, { upsert: true, new: true });
            console.log(`Updated: ${p.name}`);
        }
        console.log('Detailed Places Seeding Done!');
        process.exit(0);
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
};

seedPlaces();
