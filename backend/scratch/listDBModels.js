const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');
dotenv.config({ path: path.join(__dirname, '../.env') });
const Car = require('../models/Car');

async function list() {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        const cars = await Car.find({});
        console.log('--- DATABASE CAR MODELS ---');
        cars.forEach(c => {
            console.log(`[${c._id}] ${c.brand} | ${c.model} | Price: ${c.pricePerDay} | Image: ${c.image}`);
        });
        process.exit(0);
    } catch (e) {
        console.error(e);
        process.exit(1);
    }
}
list();
