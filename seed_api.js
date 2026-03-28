const http = require('http');

const BASE = 'http://localhost:5001';

function request(method, path, body, cookie) {
    return new Promise((resolve, reject) => {
        const data = body ? JSON.stringify(body) : null;
        const options = {
            hostname: 'localhost',
            port: 5001,
            path,
            method,
            headers: {
                'Content-Type': 'application/json',
                ...(cookie ? { Cookie: cookie } : {}),
                ...(data ? { 'Content-Length': Buffer.byteLength(data) } : {})
            }
        };
        const req = http.request(options, (res) => {
            let chunks = '';
            res.on('data', d => chunks += d);
            res.on('end', () => {
                try { resolve(JSON.parse(chunks)); } catch(e) { resolve(chunks); }
            });
        });
        req.on('error', reject);
        if (data) req.write(data);
        req.end();
    });
}

const places = [
    {
        name: 'Mahabodhi Temple',
        description: 'A UNESCO World Heritage Site where the Lord Buddha attained Enlightenment. A monument of global spiritual significance since 300 BC.',
        location: 'Bodh Gaya',
        category: 'Religious',
        images: ['https://images.unsplash.com/photo-1622396481328-9b1b78cdd9fd?q=80&w=1200&auto=format&fit=crop'],
        averageRating: 4.9,
    },
    {
        name: 'Nalanda University Ruins',
        description: 'The world\'s oldest residential university, dating back to the 5th century — a beacon of ancient learning attracting scholars from across Asia.',
        location: 'Nalanda',
        category: 'Heritage',
        images: ['https://images.unsplash.com/photo-1548013146-72479768bada?q=80&w=1200&auto=format&fit=crop'],
        averageRating: 4.8,
    },
    {
        name: 'Sher Shah Suri Tomb',
        description: 'A masterpiece of Indo-Islamic architecture, this majestic red sandstone mausoleum stands in the middle of an artificial lake.',
        location: 'Sasaram',
        category: 'Heritage',
        images: ['https://images.unsplash.com/photo-1590050752117-23a9d7f2819a?q=80&w=1200&auto=format&fit=crop'],
        averageRating: 4.7,
    },
    {
        name: 'Vishnupad Temple',
        description: 'An ancient temple dedicated to Lord Vishnu, featuring a 40cm footprint of the deity incised into solid rock.',
        location: 'Gaya',
        category: 'Religious',
        images: ['https://images.unsplash.com/photo-1541123437800-1bb1317badc2?q=80&w=1200&auto=format&fit=crop'],
        averageRating: 4.6,
    },
    {
        name: 'Valmiki National Park',
        description: 'Bihar\'s only tiger reserve, spanning 800 sq km in the Himalayan foothills — a pristine habitat for Bengal tigers and wildlife.',
        location: 'West Champaran',
        category: 'Nature',
        images: ['https://images.unsplash.com/photo-1506905925346-21bda4d32df4?q=80&w=1200&auto=format&fit=crop'],
        averageRating: 4.7,
    },
    {
        name: 'Takhat Sri Patna Sahib',
        description: 'One of the five Takhats of Sikhism, marking the birthplace of Guru Gobind Singh Ji. A stunning white marble structure.',
        location: 'Patna',
        category: 'Religious',
        images: ['https://images.unsplash.com/photo-1514222134-b57cbb8ce073?q=80&w=1200&auto=format&fit=crop'],
        averageRating: 4.9,
    },
    {
        name: 'Vikramshila University',
        description: 'The ruins of another great center of learning established by King Dharmapala, famous for its majestic stupa and monastery.',
        location: 'Bhagalpur',
        category: 'Heritage',
        images: ['https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?q=80&w=1200&auto=format&fit=crop'],
        averageRating: 4.5,
    },
    {
        name: 'Jal Mandir',
        description: 'A beautiful white marble temple situated in the middle of a large pond filled with lotuses. The place where Lord Mahavira attained Nirvana.',
        location: 'Pawapuri',
        category: 'Religious',
        images: ['https://images.unsplash.com/photo-1589182373726-e4f658ab50f0?q=80&w=1200&auto=format&fit=crop'],
        averageRating: 4.8,
    }
];

async function seed() {
    // 1. Try login first, then register if fails
    console.log('Authenticating...');
    let token;
    
    const login = await request('POST', '/api/v1/auth/login', {
        email: 'admin@bihartourism.gov.in',
        password: 'admin123'
    });

    if (login && login.token) {
        console.log('Login successful.');
        token = login.token;
    } else {
        console.log('Login failed, trying registration...');
        const reg = await request('POST', '/api/v1/auth/register', {
            name: 'Bihar Tourism Admin',
            email: 'admin@bihartourism.gov.in',
            password: 'admin123',
            role: 'admin'
        });
        if (reg && reg.token) {
            console.log('Registration successful.');
            token = reg.token;
        } else {
            console.error('Auth failed:', reg.error || JSON.stringify(reg));
            process.exit(1);
        }
    }

    const tokenCookie = `token=${token}`;

    // 2. Add each place
    for (const place of places) {
        const result = await request('POST', '/api/v1/places', place, tokenCookie);
        if (result.success) {
            console.log('✅ Added:', place.name);
        } else {
            console.log('❌ Failed:', place.name, '-', result.error || JSON.stringify(result));
        }
    }
    console.log('\nDone! Visit http://localhost:5001 to see the website.');
    process.exit(0);
}

seed().catch(err => {
    console.error('Fatal:', err.message);
    process.exit(1);
});
