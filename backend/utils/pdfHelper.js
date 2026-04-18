const PDFDocument = require('pdfkit');

/**
 * Generates a professional Rental Agreement PDF
 * @param {Object} booking - Booking document with populated car and user
 * @param {Stream} res - Writable stream (res or file)
 */
const generateRentalAgreement = (booking, stream) => {
  const doc = new PDFDocument({ margin: 50, size: 'A4' });

  // Pipe to the output stream
  doc.pipe(stream);

  // --- HEADER ---
  doc.fillColor('#0f172a')
     .fontSize(25)
     .font('Helvetica-Bold')
     .text('UNITED CAR', { align: 'center' });
  
  doc.fontSize(10)
     .font('Helvetica')
     .text('Premium Car Rental & Luxury Logistics', { align: 'center' })
     .moveDown(2);

  doc.rect(50, 110, 495, 2)
     .fill('#3b82f6');

  // --- BOOKING INFO ---
  doc.moveDown(4);
  doc.fillColor('#444444')
     .fontSize(18)
     .font('Helvetica-Bold')
     .text('RENTAL AGREEMENT', { underline: true });
  
  doc.fontSize(10)
     .font('Helvetica')
     .text(`Agreement ID: ${booking._id.toString().toUpperCase()}`, { align: 'right' })
     .text(`Date issued: ${new Date().toLocaleDateString()}`, { align: 'right' })
     .moveDown();

  // --- CUSTOMER & VEHICLE DETAILS (Grid Layout) ---
  const startY = doc.y;
  
  // Left Column: Customer
  doc.fontSize(12).font('Helvetica-Bold').text('CUSTOMER DETAILS', 50, startY);
  doc.fontSize(10).font('Helvetica')
     .text(`Name: ${booking.user.name}`, 50, startY + 20)
     .text(`Email: ${booking.user.email}`, 50, startY + 35)
     .text(`KYC Status: ${booking.user.kycStatus?.toUpperCase() || 'VERIFIED'}`, 50, startY + 50);

  // Right Column: Vehicle
  doc.fontSize(12).font('Helvetica-Bold').text('VEHICLE DETAILS', 300, startY);
  doc.fontSize(10).font('Helvetica')
     .text(`Vehicle: ${booking.car.brand} ${booking.car.model}`, 300, startY + 20)
     .text(`Type: ${booking.car.type}`, 300, startY + 35)
     .text(`Pickup: ${booking.pickupLocation}`, 300, startY + 50);

  doc.moveDown(5);

  // --- RENTAL PERIOD & PRICING ---
  doc.rect(50, doc.y, 495, 60).fillAndStroke('#f8fafc', '#e2e8f0');
  doc.fillColor('#0f172a');
  
  const pricingY = doc.y + 15;
  doc.fontSize(10).font('Helvetica-Bold').text('Rental From:', 70, pricingY);
  doc.font('Helvetica').text(new Date(booking.startDate).toLocaleDateString(), 150, pricingY);

  doc.font('Helvetica-Bold').text('Rental To:', 70, pricingY + 20);
  doc.font('Helvetica').text(new Date(booking.endDate).toLocaleDateString(), 150, pricingY + 20);

  doc.fontSize(14).font('Helvetica-Bold').text('Total Price:', 350, pricingY + 10);
  doc.fontSize(14).text(`INR ${booking.totalPrice.toLocaleString()}`, 430, pricingY + 10);

  doc.moveDown(5);

  // --- TERMS AND CONDITIONS ---
  doc.fillColor('#0f172a').fontSize(12).font('Helvetica-Bold').text('TERMS & CONDITIONS');
  doc.fontSize(8).font('Helvetica').fillColor('#64748b')
     .moveDown()
     .text('1. Possession of a valid Driving License and Government ID is mandatory at the time of pickup.')
     .text('2. The vehicle must be returned in the same condition as received, barring normal wear and tear.')
     .text('3. Fuel charges are to be borne by the customer as per the fuel policy (Full-to-Full).')
     .text('4. In case of any damage or accident, the customer is liable for the insurance deductible and downtime.')
     .text('5. Over-speeding (threshold defined by vehicle type) will attract specific penalties.')
     .text('6. The usage of the vehicle is restricted to the geographical limits specified in the subscription.')
     .moveDown();

  // --- SIGNATURE AREA ---
  doc.moveDown(4);
  doc.rect(50, doc.y, 495, 50).fill('#f1f5f9');
  doc.fillColor('#1e293b').fontSize(10).font('Helvetica-Bold')
     .text('DIGITALLY VERIFIED DOCUMENT', 0, doc.y + 15, { align: 'center' });
  doc.fontSize(8).font('Helvetica')
     .text('No physical signature required. This document is system generated upon booking verification.', { align: 'center' });

  // Finalize the PDF
  doc.end();
};

module.exports = { generateRentalAgreement };
