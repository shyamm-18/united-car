const mongoose = require('mongoose');
const dotenv = require('dotenv');
const fs = require('fs');
const path = require('path');
dotenv.config({ path: path.join(__dirname, '../.env') });
const Car = require('../models/Car');

async function fixGallery() {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        const cars = await Car.find({});
        console.log('Scanning cars to restore gallery images...');
        
        for (let car of cars) {
            let modelLower = car.model.toLowerCase().replace(/ 20\d\d$/, '').replace(/\s+/g, '_');
            // Try brand + model or just model
            let baseName = modelLower;
            
            if (baseName === 'roxx') baseName = 'thar_roxx';
            if (baseName === 'n') baseName = 'scorpio_n';
            if (baseName === 'classic') baseName = 'scorpio_classic';
            if (car.brand === 'Maruti Suzuki' && car.model.includes('Swift')) baseName = 'swift';
            if (car.brand === 'Maruti Suzuki' && car.model.includes('Fronx')) baseName = 'fronx';
            if (car.brand === 'Toyota' && car.model.includes('Fortuner')) baseName = 'fortuner';
            if (car.brand === 'Mahindra' && car.model.includes('Thar')) {
                baseName = car.model.toLowerCase().includes('roxx') ? 'thar_roxx' : 'thar';
            }

            console.log(`Checking DB for ${car.brand} ${car.model} (basename: ${baseName})`);
            
            // Rebuild the gallery using the original image names if they exist on disk
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
                intImg = 'thar_interior.png'; // Fallback to thar
            }
            if (fs.existsSync(path.join(uploadsDir, intImg))) {
                newGallery.push({ category: 'Interior', url: `/uploads/${intImg}` });
            }

            // Check Detail
            let detImg = `${baseName}_detail.png`;
            if (baseName === 'thar_roxx' && !fs.existsSync(path.join(uploadsDir, detImg))) {
                detImg = 'thar_detail.png'; // Fallback to thar
            }
            if (fs.existsSync(path.join(uploadsDir, detImg))) {
                newGallery.push({ category: 'Detail', url: `/uploads/${detImg}` });
            }

            if (newGallery.length > 0) {
                car.gallery = newGallery;
                await car.save();
                console.log(` Restored Gallery: ${newGallery.map(g => g.category + ' -> ' + g.url).join(', ')}`);
            }
        }
        
        console.log('Database gallery restoration complete.');
        process.exit(0);
    } catch (e) {
        console.error(e);
        process.exit(1);
    }
}
fixGallery();
