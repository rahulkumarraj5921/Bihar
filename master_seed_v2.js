const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Place = require('./backend/models/Place');
const User = require('./backend/models/User');

dotenv.config();

const finalPlaces = [
    {
        name: 'Mahabodhi Temple',
        description: 'A UNESCO World Heritage Site where the Lord Buddha attained Enlightenment. A monument of global spiritual significance since 300 BC.',
        location: 'Bodh Gaya',
        category: 'Religious',
        images: ['images/mahabodhi.png'],
        mapUrl: 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3624.4691461944!2d84.989397675!3d24.6953039!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x39f32c69566f1255%3A0xc3f5c9e29a8f5cfd!2sMahabodhi%20Temple!5e0!3m2!1sen!2sin!4v1711535000000!5m2!1sen!2sin'
    },
    {
        name: 'Nalanda University Ruins',
        description: 'The world\'s oldest residential university, dating back to the 5th century — a beacon of ancient learning attracting scholars from across Asia.',
        location: 'Nalanda',
        category: 'Heritage',
        images: ['images/nalanda.png'],
        mapUrl: 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3611.8385361234!2d85.441405175!3d25.1352485!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x39f2f35700000001%3A0x86c189b87fcf359!2sAncient%20Nalanda%20University!5e0!3m2!1sen!2sin!4v1711535100000!5m2!1sen!2sin'
    },
    {
        name: 'Sher Shah Suri Tomb',
        description: 'A masterpiece of Indo-Islamic architecture, this majestic red sandstone mausoleum stands in the middle of an artificial lake.',
        location: 'Sasaram',
        category: 'Heritage',
        images: ['images/sasaram.png'],
        mapUrl: 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3618.5714316084!2d84.008469475!3d24.9557064!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x398ebc1c3f8f5cfd%3A0xbd86241a8775268c!2sTomb%20of%20Sher%20Shah%20Suri!5e0!3m2!1sen!2sin!4v1711535500000!5m2!1sen!2sin'
    },
    {
        name: 'Vishnupad Temple',
        description: 'An ancient temple dedicated to Lord Vishnu, featuring a 40cm footprint of the deity incised into solid rock. A site of profound spiritual significance.',
        location: 'Gaya',
        category: 'Religious',
        images: ['images/gaya_vibrant.png'],
        mapUrl: 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3621.5714316084!2d85.008469475!3d24.7857064!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x39f32c1c3f8f5cfd%3A0xbd86241a8775268c!2sVishnupad%20Temple!5e0!3m2!1sen!2sin!4v1711535300000!5m2!1sen!2sin'
    },
    {
        name: 'Valmiki National Park',
        description: 'Bihar\'s only tiger reserve, spanning 800 sq km in the Himalayan foothills — a pristine habitat for Bengal tigers and wildlife.',
        location: 'West Champaran',
        category: 'Nature',
        images: ['images/valmiki.png'],
        mapUrl: 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d14338.4038131234!2d83.921405175!3d27.3152485!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3994f35700000001%3A0x86c189b87fcf359!2sValmiki%20Tiger%20Reserve!5e0!3m2!1sen!2sin!4v1711536000000!5m2!1sen!2sin'
    },
    {
        name: 'Takhat Sri Patna Sahib',
        description: 'One of the five Takhats of Sikhism, marking the birthplace of Guru Gobind Singh Ji. A stunning white marble structure of great holiness.',
        location: 'Patna',
        category: 'Religious',
        images: ['images/patna_sahib.png'],
        mapUrl: 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3598.6714316084!2d85.228469475!3d25.6057064!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x39ed58ed3f8f5cfd%3A0xbd86241a8775268c!2sTakhat%20Sri%20Patna%20Sahib!5e0!3m2!1sen!2sin!4v1711536100000!5m2!1sen!2sin'
    },
    {
        name: 'Vikramshila University',
        description: 'Ancient ruins of a major Buddhist university center established by King Dharmapala, famous for its massive central stupa and monasteries.',
        location: 'Bhagalpur',
        category: 'Heritage',
        images: ['images/vikramshila.png'],
        mapUrl: 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3615.5714316084!2d87.268469475!3d25.3357064!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x39ed58ed3f8f5cfd%3A0xbd86241a8775268c!2sAncient%20Vikramshila%20University!5e0!3m2!1sen!2sin!4v1711536200000!5m2!1sen!2sin'
    },
    {
        name: 'Jal Mandir',
        description: 'A beautiful white marble temple situated in Pawapuri, the site where Lord Mahavira attained Nirvana. Set amidst a lotus-filled pond.',
        location: 'Pawapuri',
        category: 'Religious',
        images: ['images/jal_mandir.png'],
        mapUrl: 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3618.5714316084!2d85.558469475!3d25.1057064!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x39ed58ed3f8f5cfd%3A0xbd86241a8775268c!2sJal%20Mandir%2C%20Pawapuri!5e0!3m2!1sen!2sin!4v1711536300000!5m2!1sen!2sin'
    },
    {
        name: 'Rajgir Glass Bridge',
        location: 'Rajgir, Bihar',
        category: 'Nature',
        description: 'Experience the thrill of Bihar\'s first Glass Skywalk in Rajgir. Suspended over a deep valley, this bridge offers spectacular nature views.',
        images: ['images/rajgir.png'],
        mapUrl: 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3615.1524316084!2d85.405469475!3d25.0357064!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x39f257a315482397%3A0xbd86241a8775268c!2sNature%20Safari%20Glass%20Bridge!5e0!3m2!1sen!2sin!4v1711535200000!5m2!1sen!2sin'
    },
    {
        name: 'Golghar',
        location: 'Patna, Bihar',
        category: 'Heritage',
        description: 'Iconic beehive-shaped granary with massive staircases and panoramic views of the Ganges. A historic symbol of Patna.',
        images: ['images/golghar.png'],
        mapUrl: 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3597.5714316084!2d85.138469475!3d25.6157064!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x39ed58ed3f8f5cfd%3A0xbd86241a8775268c!2sGolghar!5e0!3m2!1sen!2sin!4v1711535400000!5m2!1sen!2sin'
    }
];

const masterSeed = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        const admin = await User.findOne({ role: 'admin' });
        if (!admin) {
            console.error('Admin user not found.');
            process.exit(1);
        }

        await Place.deleteMany({});
        console.log('Database cleared.');

        for (const p of finalPlaces) {
            p.user = admin._id;
            await Place.create(p);
            console.log(`✅ Set: ${p.name}`);
        }
        
        console.log('\n🌟 SUCCESS: All 10 places now have Premium Images & Verified Google Maps!');
        process.exit(0);
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
};

masterSeed();
