const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Place = require('./backend/models/Place');
const User = require('./backend/models/User');

dotenv.config();

const allPlaces = [
    {
        name: 'Mahabodhi Temple',
        description: 'A UNESCO World Heritage Site where the Lord Buddha attained Enlightenment. A monument of global spiritual significance since 300 BC.',
        location: 'Bodh Gaya',
        category: 'Religious',
        mapUrl: 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3624.4691461944!2d84.989397675!3d24.6953039!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x39f32c69566f1255%3A0xc3f5c9e29a8f5cfd!2sMahabodhi%20Temple!5e0!3m2!1sen!2sin!4v1711535000000!5m2!1sen!2sin',
        images: ['https://images.unsplash.com/photo-1622396481328-9b1b78cdd9fd?q=80&w=1200&auto=format&fit=crop'],
        averageRating: 4.9
    },
    {
        name: 'Nalanda University Ruins',
        description: 'The world\'s oldest residential university, dating back to the 5th century — a beacon of ancient learning attracting scholars from across Asia.',
        location: 'Nalanda',
        category: 'Heritage',
        mapUrl: 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3611.8385361234!2d85.441405175!3d25.1352485!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x39f2f35700000001%3A0x86c189b87fcf359!2sAncient%20Nalanda%20University!5e0!3m2!1sen!2sin!4v1711535100000!5m2!1sen!2sin',
        images: ['https://images.unsplash.com/photo-1548013146-72479768bada?q=80&w=1200&auto=format&fit=crop'],
        averageRating: 4.8
    },
    {
        name: 'Sher Shah Suri Tomb',
        description: 'A masterpiece of Indo-Islamic architecture, this majestic red sandstone mausoleum stands in the middle of an artificial lake.',
        location: 'Sasaram',
        category: 'Heritage',
        mapUrl: 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3618.5714316084!2d84.008469475!3d24.9557064!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x398ebc1c3f8f5cfd%3A0xbd86241a8775268c!2sTomb%20of%20Sher%20Shah%20Suri!5e0!3m2!1sen!2sin!4v1711535500000!5m2!1sen!2sin',
        images: ['https://images.unsplash.com/photo-1590050752117-23a9d7f2819a?q=80&w=1200&auto=format&fit=crop'],
        averageRating: 4.7
    },
    {
        name: 'Vishnupad Temple',
        description: 'An ancient temple dedicated to Lord Vishnu, featuring a 40cm footprint of the deity incised into solid rock.',
        location: 'Gaya',
        category: 'Religious',
        mapUrl: 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3621.5714316084!2d85.008469475!3d24.7857064!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x39f32c1c3f8f5cfd%3A0xbd86241a8775268c!2sVishnupad%20Temple!5e0!3m2!1sen!2sin!4v1711535300000!5m2!1sen!2sin',
        images: ['https://images.unsplash.com/photo-1541123437800-1bb1317badc2?q=80&w=1200&auto=format&fit=crop'],
        averageRating: 4.6
    },
    {
        name: 'Valmiki National Park',
        description: 'Bihar\'s only tiger reserve, spanning 800 sq km in the Himalayan foothills — a pristine habitat for Bengal tigers and wildlife.',
        location: 'West Champaran',
        category: 'Nature',
        images: ['https://images.unsplash.com/photo-1506905925346-21bda4d32df4?q=80&w=1200&auto=format&fit=crop'],
        averageRating: 4.7
    },
    {
        name: 'Takhat Sri Patna Sahib',
        description: 'One of the five Takhats of Sikhism, marking the birthplace of Guru Gobind Singh Ji. A stunning white marble structure.',
        location: 'Patna',
        category: 'Religious',
        images: ['https://images.unsplash.com/photo-1514222134-b57cbb8ce073?q=80&w=1200&auto=format&fit=crop'],
        averageRating: 4.9
    },
    {
        name: 'Vikramshila University',
        description: 'The ruins of another great center of learning established by King Dharmapala, famous for its majestic stupa and monastery.',
        location: 'Bhagalpur',
        category: 'Heritage',
        images: ['https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?q=80&w=1200&auto=format&fit=crop'],
        averageRating: 4.5
    },
    {
        name: 'Jal Mandir',
        description: 'A beautiful white marble temple situated in the middle of a large pond filled with lotuses. The place where Lord Mahavira attained Nirvana.',
        location: 'Pawapuri',
        category: 'Religious',
        images: ['https://images.unsplash.com/photo-1589182373726-e4f658ab50f0?q=80&w=1200&auto=format&fit=crop'],
        averageRating: 4.8
    },
    {
        name: 'Rajgir Glass Bridge',
        location: 'Rajgir, Bihar',
        category: 'Nature',
        description: 'Experience the thrill of Bihar\'s first Glass Skywalk in Rajgir. Suspended over a deep valley, this bridge offers spectacular views of the surrounding hills.',
        mapUrl: 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3615.1524316084!2d85.405469475!3d25.0357064!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x39f257a315482397%3A0xbd86241a8775268c!2sNature%20Safari%20Glass%20Bridge!5e0!3m2!1sen!2sin!4v1711535200000!5m2!1sen!2sin',
        images: ['https://images.unsplash.com/photo-1506744038136-46273834b3fb?q=80&w=1200'],
        averageRating: 4.7
    },
    {
        name: 'Golghar',
        location: 'Patna, Bihar',
        category: 'Heritage',
        description: 'Unique architectural style offering a panoramic view of the Ganges river and the city of Patna. Built in 1786.',
        mapUrl: 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3597.5714316084!2d85.138469475!3d25.6157064!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x39ed58ed3f8f5cfd%3A0xbd86241a8775268c!2sGolghar!5e0!3m2!1sen!2sin!4v1711535400000!5m2!1sen!2sin',
        images: ['https://images.unsplash.com/photo-1565882333140-1a748c8cdeaf?q=80&w=1200'],
        averageRating: 4.6
    }
];

const restoreAll = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        const admin = await User.findOne({ role: 'admin' });
        if (!admin) {
            console.error('No admin found.');
            process.exit(1);
        }
        
        // Use deleteMany to reset fully if needed
        await Place.deleteMany({});
        console.log('Resetting Database...');

        for (const p of allPlaces) {
            p.user = admin._id;
            await Place.create(p);
            console.log(`Restored: ${p.name}`);
        }
        console.log('\n✅ All original 8 places + 2 new ones restored with correct images!');
        process.exit(0);
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
};

restoreAll();
