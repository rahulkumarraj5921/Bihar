const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Article = require('./backend/models/Article');
const User = require('./backend/models/User');

dotenv.config();

const defaultArticles = [
    {
        slug: 'travel-guide',
        title: 'Ultimate Bihar Travel Guide (Edition 2026)',
        image: 'images/heritage_banner.png',
        content: `<h2>Prachin Bharat ka Gaurav: Bihar</h2>
        <p>Bihar wo dharti hai jahan se duniya ko gyan aur shanti ka sandesh mila. Ye sirf ek rajya nahi, balki ek mahan sabhyata hai. Yahan ka kankan itihaas se juda hai.</p>
        
        <h3>1. Bodh Gaya: Atma ka Milan</h3>
        <p>Bodh Gaya mein hi <strong>Mahabodhi Tree</strong> ke niche Siddharth ko 'Buddhatva' prapt hua tha. Ab ye ek UNESCO World Heritage site hai. Mahabodhi Temple ki banawat aur vahan ka vatavaran aapko ek nayi urja se bhar dega. Yahan par 80-foot ki Buddha प्रतिमा (Great Buddha Statue) bhi ek mukhya akarshan hai.</p>
        
        <div style="display:grid; grid-template-columns: 1fr 1fr; gap:20px; margin: 30px 0;">
            <div style="text-align:center;"><img src="images/mahabodhi.png" style="width:100%; border-radius:20px; height:250px; object-fit:cover;" /><p style="font-size:0.8rem; color:#888;">Mahabodhi Temple, Bodh Gaya</p></div>
            <div style="text-align:center;"><img src="images/nalanda.png" style="width:100%; border-radius:20px; height:250px; object-fit:cover;" /><p style="font-size:0.8rem; color:#888;">Ancient Nalanda Ruins</p></div>
        </div>

        <h3>2. Nalanda & Rajgir: Gyan ki Dharti</h3>
        <p>Nalanda Vishwavidyalaya duniya ka pehla residential university tha, jahan 10,000 se zyada students padhte the. Rajgir mein <strong>Glass Bridge</strong> (Skywalk) ek naya aur romanchak anubhav hai. Yahan ki <em>Vishwa Shanti Stupa</em> tak pahunchne ke liye 'Ropeway' ka safar bahut maza deta hai.</p>
        
        <h3>3. Vaishali: Ganatantra ki Janm-sthali</h3>
        <p>Duniya ka sabse pehla 'Republic' (Ganatantra) Vaishali mein hi sthapit hua tha. Lord Mahavira ka janmasthan hone ke saath-saath, ye Gautam Buddha ke antim pravachan ki jagah bhi hai.</p>
        
        <h3>4. Cuisine: Litti-Chokha aur Sattu</h3>
        <p>Bihar ka safar tab tak adhura hai jab tak aapne garam-garam ghee mein doobi <strong>Litti-Chokha</strong> aur thanda-thanda <strong>Sattu ka sharbat</strong> nahi piya.</p>`
    },
    {
        slug: 'hotels',
        title: 'Where to Stay: Premium Hospitality in Bihar',
        image: 'images/hotels_banner.png',
        content: `<h2>Bihar ki Mehmandari: Best Hotels</h2>
        <p>Bihar mein aapka swagat shahi andaaz mein hota hai. Yahan har budget ke liye behtareen options hain.</p>
        
        <div style="background:#fff; padding:30px; border-radius:25px; border:1px solid #efefef; margin:40px 0; box-shadow: 0 10px 30px rgba(0,0,0,0.03);">
            <h3>1. Hotel Chanakya, Patna</h3>
            <p>Patna ke dil mein sthit, ye hotel apni shandaar service aur swadisht khane ke liye jana jata hai.</p>
            <h3>2. Hotel Maurya, Patna</h3>
            <p>VVIPs aur celebrities ka pasandida thikana. Iska ambience aapko Bihar ke mahan itihaas ki yaad dilayega.</p>
            <h3>3. Lemon Tree Premier</h3>
            <p>Modern luxury ke saath agar aap stay chahte hain, toh ye best option hai.</p>
            <h3>4. BSTDC Tourist Bungalows</h3>
            <p>Sarkari tourism bungalows (Kautilya Vihar etc.) Bodh Gaya aur Rajgir mein budget-friendly aur safe stay provide karte hain.</p>
        </div>
        
        <p>Bodh Gaya mein <strong>The Royal Residency</strong> aur <strong>Maya Heritage</strong> pilgrims ke beech bahut popular hain.</p>`
    },
    {
        slug: 'best-season',
        title: 'Melas and Seasons: When to Visit Bihar',
        image: 'images/nature_banner.png',
        content: `<h2>Bihar ka Mausam aur Mahatva</h2>
        <p>Bihar ko sahi se dekhne ke liye mausam ka chunav bahut zaroori hai.</p>
        
        <h3>1. Winter (October se March): Sone Ka Samay</h3>
        <p>Ye sightseeing ke liye sabse behtareen waqt hai. Isi dauran Bihar ka garv, <strong>Sonepur Mela</strong> lagta hai, jo Asia ka sabse bada pashu mela (cattle fair) hai. Karthik Purnima ke waqt vahan ka mahaul dekhne layak hota hai.</p>
        
        <h3>2. Pitrapaksh Mela, Gaya</h3>
        <p>Bhadrapad Purnima ke waqt puri duniya se log apne purvajon ko pinda-daan karne Gaya aate hain. Ye Bihar ki prachin parampara ka jeeta-jagta roop hai.</p>
        
        <h3>3. Chhath Puja: Bihar ka Lok Parv</h3>
        <p>Agar aap November ke waqt Bihar aate hain, toh aapko 'The Sun God' ki puja — <strong>Chhath Puja</strong> dekhne ko milegi. Ganga ke ghaton par lakho logo ka ek saath arghya dena kisi chamatkar se kam nahi.</p>
        
        <div style="padding:20px; border-left:4px solid var(--terracotta); background:#fdf7f2; margin:30px 0;">
            <strong>Pro Tip:</strong> June se August tak garmi aur baarish zyada hoti hai, isliye indoor activities ya museum visits zyada behtar rainge.
        </div>`
    },
    {
        slug: 'getting-there',
        title: 'Connectivity: Bihar ki Yatra Kaise Karein?',
        image: 'images/transport_banner.png',
        content: `<h2>Har Rasta Bihar ko Jata Hai</h2>
        <p>Bihar connectivity ke maamle mein ab bahut aage badh chuka hai.</p>
        
        <ul>
            <li><strong>Air Travel:</strong> Patna ka <em>Jay Prakash Narayan International Airport</em> main hub hai. Gaya mein international flights aati hain (specially South East Asia se). Ab <strong>Darbhanga Airport</strong> ke chalu hone se Uttar Bihar (North Bihar) pahunchna bahut asan ho gaya hai.</li>
            <li><strong>Railways:</strong> Bihar mein Indian Railways ka jaal bichha hua hai. <em>Patna Junction, Mughal Sarai (Pt. Deen Dayal Upadhyaya), aur Katihar</em> bade hubs hain.</li>
            <li><strong>Roadways:</strong> Golden Quadrilateral aur naye Expressways ne Bihar ke har kone ko jod diya hai.</li>
        </ul>
        
        <img src="images/transport_banner.png" style="width:100%; border-radius:20px; margin-top:20px;" />`
    }
];

const seedArticles = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        const admin = await User.findOne({ role: 'admin' });
        if (!admin) {
            console.error('No admin found.');
            process.exit(1);
        }
        for (const art of defaultArticles) {
            art.user = admin._id;
            await Article.findOneAndUpdate({ slug: art.slug }, art, { upsert: true, new: true });
        }
        console.log('Very Detailed Bihar Seeding Done!');
        process.exit(0);
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
};

seedArticles();
