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
        console.log(`Analyzing ${cars.length} cars for hardcoded localhost URLs...`);

        for (let car of cars) {
            let changed = false;

            // Fix main image
            if (car.image && car.image.includes('localhost:5000')) {
                car.image = car.image.replace(/^http:\/\/localhost:5000/, '');
                changed = true;
            }

            // Fix gallery
            if (car.gallery && car.gallery.length > 0) {
                car.gallery = car.gallery.map(item => {
                    if (item.url && item.url.includes('localhost:5000')) {
                        changed = true;
                        return { ...item, url: item.url.replace(/^http:\/\/localhost:5000/, '') };
                    }
                    return item;
                });
            }

            if (changed) {
                await car.save();
                console.log(`✅ FIXED: ${car.brand} ${car.model}`);
            }
        }

        console.log('Database URL normalization complete.');
        process.exit(0);
    } catch (e) {
        console.error(e);
        process.exit(1);
    }
}

fix();
