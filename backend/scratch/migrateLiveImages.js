const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');
dotenv.config({ path: path.join(__dirname, '../.env') });

const Car = require('../models/Car');

const BASE_URL = 'https://united-car.onrender.com';

const imageMap = {
    'SWIFT': 'swift.png',
    'THAR': 'thar.png',
    'FORTUNER': 'fortuner.png',
    'FRONX': 'fronx.png',
    'GLANZA': 'glanza.png',
    'SCORPIO N': 'scorpio_n.png',
    'SCORPIO CLASSIC': 'scorpio_classic.png',
    'THAR ROXX': 'thar_roxx.png',
    'ALTO': 'alto.png'
};

const galleryMap = {
    'FORTUNER': [
        { url: '/uploads/fortuner.png', category: 'Exterior' },
        { url: '/uploads/fortuner_interior.png', category: 'Interior' },
        { url: '/uploads/fortuner_detail.png', category: 'Detail' }
    ],
    'SWIFT': [
        { url: '/uploads/swift.png', category: 'Exterior' },
        { url: '/uploads/swift_interior.png', category: 'Interior' },
        { url: '/uploads/swift_detail.png', category: 'Detail' }
    ],
    'THAR': [
        { url: '/uploads/thar.png', category: 'Exterior' },
        { url: '/uploads/thar_interior.png', category: 'Interior' },
        { url: '/uploads/thar_detail.png', category: 'Detail' }
    ],
    'FRONX': [
        { url: '/uploads/fronx.png', category: 'Exterior' },
        { url: '/uploads/fronx_interior.png', category: 'Interior' }
    ]
};

async function migrate() {
    try {
        console.log('Connecting to Live Database...');
        await mongoose.connect(process.env.MONGO_URI);
        console.log('Connected.');

        const cars = await Car.find({});
        console.log(`Found ${cars.length} cars. Starting Intelligent Mapping...`);

        // Sort keys by length DESC to match more specific strings first (e.g., 'THAR ROXX' before 'THAR')
        const sortedKeys = Object.keys(imageMap).sort((a, b) => b.length - a.length);

        for (let car of cars) {
            let updated = false;
            
            // Normalize strings for comparison
            const brand = (car.brand || '').trim().toUpperCase();
            const model = (car.model || '').trim().toUpperCase();
            const combined = `${brand} ${model}`;

            console.log(`Analyzing: [${brand}] [${model}]`);

            // Find best image match
            let matchedImage = null;
            for (let key of sortedKeys) {
                if (combined.includes(key) || brand.includes(key) || model.includes(key)) {
                    matchedImage = imageMap[key];
                    break;
                }
            }

            if (matchedImage) {
                car.image = `${BASE_URL}/uploads/${matchedImage}`;
                updated = true;
                console.log(`  -> Match Found: ${matchedImage}`);
            } else {
                console.log(`  !! No Match Found`);
            }

            // Find best gallery match
            let matchedGallery = null;
            for (let [key, val] of Object.entries(galleryMap)) {
                if (combined.includes(key) || brand.includes(key) || model.includes(key)) {
                    matchedGallery = val;
                    break;
                }
            }

            if (matchedGallery) {
                car.gallery = matchedGallery.map(item => ({
                    url: `${BASE_URL}${item.url}`,
                    category: item.category
                }));
                updated = true;
                console.log(`  -> Gallery Injected`);
            }

            if (updated) {
                await car.save();
                console.log(`✅ DATABASE UPDATED for ${car.brand} ${car.model}`);
            }
            console.log('-------------------');
        }

        console.log('Migration Complete.');
        process.exit(0);
    } catch (error) {
        console.error('Migration Failed:', error);
        process.exit(1);
    }
}

migrate();
