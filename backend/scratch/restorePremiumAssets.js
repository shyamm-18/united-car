const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');
dotenv.config({ path: path.join(__dirname, '../.env') });
const Car = require('../models/Car');

const imageMap = {
    'SWIFT': 'ai_swift_red_1776494576134.png',
    'THAR': 'ai_thar_black_1776494598594.png',
    'FORTUNER': 'ai_fortuner_white_1776494616355.png',
    'SCORPIO N': 'ai_scorpio_n_white_1776494642685.png',
    'THAR ROXX': 'ai_thar_roxx_green_1776494663931.png',
    'FRONX': 'ai_fronx_blue_1776494682552.png',
    'GLANZA': 'ai_glanza_silver_1776494704888.png',
    'ALTO': 'ai_alto_blue_1776494722136.png'
};

const priceMap = {
    'SWIFT': 2000,
    'THAR': 4500,
    'FORTUNER': 12000,
    'SCORPIO N': 5999,
    'THAR ROXX': 5999,
    'FRONX': 2700,
    'GLANZA': 2999,
    'ALTO': 1500,
    'SCORPIO CLASSIC': 4999
};

const galleryMap = {
    'SWIFT': [
        { url: '/uploads/ai_swift_red_1776494576134.png', category: 'Exterior' },
        { url: '/uploads/swift_interior_sporty_empty_1776495789292.png', category: 'Interior' },
        { url: '/uploads/swift_detail_tail_empty_1776495808130.png', category: 'Detail' }
    ],
    'THAR': [
        { url: '/uploads/ai_thar_black_1776494598594.png', category: 'Exterior' },
        { url: '/uploads/thar_interior_rugged_empty_1776495745415.png', category: 'Interior' },
        { url: '/uploads/thar_detail_tyre_empty_1776495764035.png', category: 'Detail' }
    ],
    'FORTUNER': [
        { url: '/uploads/ai_fortuner_white_1776494616355.png', category: 'Exterior' },
        { url: '/uploads/fortuner_interior_lux_empty_1776495703909.png', category: 'Interior' },
        { url: '/uploads/fortuner_detail_wheel_empty_1776495724310.png', category: 'Detail' }
    ],
    'SCORPIO N': [
        { url: '/uploads/ai_scorpio_n_white_1776494642685.png', category: 'Exterior' },
        { url: '/uploads/scorpio_n_interior_lux_empty_1776495824516.png', category: 'Interior' }
    ]
};

const BASE_URL = ''; // Make paths relative for universal compatibility (Prod/Local)

async function restore() {
    try {
        console.log('Connecting to database...');
        await mongoose.connect(process.env.MONGO_URI);
        console.log('Connected.');

        const cars = await Car.find({});
        console.log(`Found ${cars.length} cars. Restoring premium assets...`);

        for (let car of cars) {
            const combined = `${car.brand} ${car.model}`.toUpperCase();

            let matched = false;
            
            // Match for main image
            for (let key in imageMap) {
                if (combined.includes(key)) {
                    car.image = `${BASE_URL}/uploads/${imageMap[key]}`;
                    matched = true;
                }
            }

            // Match for prices
            for (let key in priceMap) {
                if (combined.includes(key)) {
                    car.pricePerDay = priceMap[key];
                    matched = true;
                }
            }

            // Match for galleries
            for (let key in galleryMap) {
                if (combined.includes(key)) {
                    car.gallery = galleryMap[key].map(item => ({
                        url: `${BASE_URL}${item.url}`,
                        category: item.category
                    }));
                    matched = true;
                }
            }

            if (matched) {
                await car.save();
                console.log(`✅ RESTORED: ${car.brand} ${car.model} | Gallery: ${car.gallery.map(g => g.category).join(', ')}`);
            }
        }

        console.log('Restoration Complete.');
        process.exit(0);
    } catch (e) {
        console.error(e);
        process.exit(1);
    }
}

restore();
