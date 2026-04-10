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
let fixedFiles = 0;

files.forEach(file => {
  let content = fs.readFileSync(file, 'utf8');
  // Sometimes PowerShell replaces it with literal '?' 
  let newContent = content.replace(/\?([0-9]+)/g, '₹$1');
  newContent = newContent.replace(/\?\$\{/g, '₹${');
  newContent = newContent.replace(/> \?/g, '> ₹');
  newContent = newContent.replace(/>\?/g, '>₹');

  // Fix known occurrences where '?' was embedded due to regex
  // E.g. `<span ...>?{car.pricePerDay}`
  if (file.includes('Cars.jsx')) {
     newContent = newContent.replace(/<span className="block text-2xl font-extrabold text-blue-600 dark:text-blue-400">\?\{car\.pricePerDay\}<\/span>/g, '<span className="block text-2xl font-extrabold text-blue-600 dark:text-blue-400">₹{car.pricePerDay}</span>');
  }

  // Ensure utf8 write
  if (content !== newContent) {
    fs.writeFileSync(file, newContent, 'utf8');
    fixedFiles++;
  }
});
console.log(`Fixed formatting in ${fixedFiles} files!`);
