const fs = require('fs');
const path = require('path');

const walkSync = (dir, filelist = []) => {
  fs.readdirSync(dir).forEach(file => {
    const filePath = path.join(dir, file);
    if (fs.statSync(filePath).isDirectory()) {
      if (!filePath.includes('node_modules')) {
        filelist = walkSync(filePath, filelist);
      }
    } else if (filePath.endsWith('.jsx') || filePath.endsWith('.js')) {
      filelist.push(filePath);
    }
  });
  return filelist;
};

const files = walkSync(path.join(__dirname, '../frontend/src'));

let replacedCount = 0;

files.forEach(file => {
  let content = fs.readFileSync(file, 'utf8');
  // Match $ followed by a number or { (which usually means ${car.price})
  // BUT be careful: Javascript template literals use ${var}. So we ONLY want to replace $ if it's meant as currency.
  // Actually, the safest way is to match `$` when it's outside template literals, 
  // OR when it's specifically `$${` -> `₹${`

  // Let's replace `$${` with `₹${`
  let newContent = content.replace(/\$\$\{/g, '₹${');
  
  // Replace `$` followed by number => `₹` followed by number
  newContent = newContent.replace(/\$([0-9]+)/g, '₹$1');

  // Specific matches for AdminDashboard where it was `$`${item.totalRevenue...} 
  // Wait, in AdminDashboard.jsx it might have been `$` + ${...
  // In `AdminDashboard.jsx`, the code was: \`${card.value}\` -> no, it was `\$${analytics.summary.totalRevenue.toLocaleString()}`
  newContent = newContent.replace(/\\\$\$\{/g, '₹${'); // If it was escaped
  newContent = newContent.replace(/\> \$/g, '> ₹'); // Like > $40
  newContent = newContent.replace(/\"\$/g, '"₹'); // Like "$40"
  newContent = newContent.replace(/\'\$/g, "'₹"); // Like '$40'
  newContent = newContent.replace(/\(\$/g, '(₹'); // Like ($40)

  // In `Cars.jsx`, it's `<span ...>${car.pricePerDay}</span>`
  // We should specifically change `>${...}` to `>₹${...}` if it's price
  // Let's just catch specific files where we know prices are:
  if (file.includes('Cars.jsx')) {
    newContent = newContent.replace(/<span className="block text-2xl font-extrabold text-blue-600 dark:text-blue-400">\$?\{car\.pricePerDay\}<\/span>/g, '<span className="block text-2xl font-extrabold text-blue-600 dark:text-blue-400">₹{car.pricePerDay}</span>');
  }
  if (file.includes('AdminDashboard.jsx')) {
    newContent = newContent.replace(/\$\$\{/g, '₹${');
  }
  if (file.includes('TopRatedCars.jsx')) {
     newContent = newContent.replace(/\$\{car\.pricePerDay\}/g, '₹{car.pricePerDay}');
  }
  if (content !== newContent) {
    fs.writeFileSync(file, newContent, 'utf8');
    replacedCount++;
  }
});

console.log('Replaced currency symbols in ' + replacedCount + ' files.');
