const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');
dotenv.config({ path: path.join(__dirname, '../.env') });
const Car = require('../models/Car');

async function fix() {
    try {
        console.log('Connecting to database...');
        await mongoose.connect(process.env.MONGO_URI);
        console.log('Connected.');

        const cars = await Car.find({});
        console.log(`Final Normalization: ${cars.length} cars...`);

        for (let car of cars) {
            let changed = false;

            // Strategy: Convert any absolute URL pointing to uploads into a relative /uploads path
            const normalize = (url) => {
                if (!url) return url;
                if (url.includes('/uploads/')) {
                    const parts = url.split('/uploads/');
                    const newUrl = '/uploads/' + parts[parts.length - 1];
                    if (newUrl !== url) {
                        changed = true;
                        return newUrl;
                    }
                }
                return url;
            };

            if (car.image) {
                car.image = normalize(car.image);
            }

            if (car.gallery && car.gallery.length > 0) {
                car.gallery = car.gallery.map(item => ({
                    ...item,
                    url: normalize(item.url)
                }));
            }

            if (changed) {
                await car.save();
                console.log(`✅ NORMALIZED: ${car.brand} ${car.model}`);
            }
        }

        console.log('Database normalization 100% complete.');
        process.exit(0);
    } catch (e) {
        console.error(e);
        process.exit(1);
    }
}

fix();
