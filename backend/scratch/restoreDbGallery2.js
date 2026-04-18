const mongoose = require('mongoose');
const dotenv = require('dotenv');
const fs = require('fs');
const path = require('path');
dotenv.config({ path: path.join(__dirname, '../.env') });
const Car = require('../models/Car');

async function fixGallery2() {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        const cars = await Car.find({});
        
        for (let car of cars) {
            let baseName = car.model.toLowerCase().replace(/ 20\d\d$/, '').replace(/\s+/g, '_');
            const brandUpper = car.brand.toUpperCase();
            
            if (brandUpper.includes('FRONX')) baseName = 'fronx';
            if (brandUpper.includes('GLANZA')) baseName = 'glanza';
            if (brandUpper.includes('SCORPIO N')) baseName = 'scorpio_n';
            if (brandUpper === 'SCORPIO CLASSIC') baseName = 'scorpio_classic';
            if (brandUpper === 'THAR ROXX') baseName = 'thar_roxx';
            if (brandUpper.includes('ALTO')) baseName = 'alto';
            if (brandUpper === 'MARUTI SUZUKI' && car.model.includes('Swift')) baseName = 'swift';
            if (brandUpper === 'MAHINDRA' && car.model.includes('Thar')) baseName = 'thar';
            if (brandUpper === 'TOYOTA' && car.model.includes('Fortuner')) baseName = 'fortuner';

            let newGallery = [];
            const uploadsDir = path.join(__dirname, '../uploads');
            
            // Check Exterior
            let extImg = `${baseName}.png`;
            if (fs.existsSync(path.join(uploadsDir, extImg))) {
                newGallery.push({ category: 'Exterior', url: `/uploads/${extImg}` });
            } else if (car.image) {
                 newGallery.push({ category: 'Exterior', url: car.image });
            }

            // Check Interior
            let intImg = `${baseName}_interior.png`;
            if (baseName === 'thar_roxx' && !fs.existsSync(path.join(uploadsDir, intImg))) {
                intImg = 'thar_interior.png';
            }
            if (fs.existsSync(path.join(uploadsDir, intImg))) {
                newGallery.push({ category: 'Interior', url: `/uploads/${intImg}` });
            }

            // Check Detail
            let detImg = `${baseName}_detail.png`;
            if (baseName === 'thar_roxx' && !fs.existsSync(path.join(uploadsDir, detImg))) {
                detImg = 'thar_detail.png';
            }
            if (fs.existsSync(path.join(uploadsDir, detImg))) {
                newGallery.push({ category: 'Detail', url: `/uploads/${detImg}` });
            }

            if (newGallery.length > 0) {
                car.gallery = newGallery;
                await car.save();
                console.log(`Restored ${car.brand}: ${newGallery.map(g => g.category + ' -> ' + g.url).join(', ')}`);
            }
        }
        
        process.exit(0);
    } catch (e) {
        console.error(e);
        process.exit(1);
    }
}
fixGallery2();
