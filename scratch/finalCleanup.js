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

const srcPath = path.join(__dirname, '../frontend/src');
const files = walkSync(srcPath);

let totalFixed = 0;

files.forEach(file => {
  let content = fs.readFileSync(file, 'utf8');
  let original = content;

  // Pattern 1: `$?{` or `₹?{` or `$`?{` -> `₹${`
  content = content.replace(/\$?\??\{/g, (match) => {
     // This was too broad. Let's be more specific.
     return match; 
  });

  // Specific common corruption patterns from previous runs
  content = content.replace(/\$\?\{/g, '₹${');
  content = content.replace(/₹\?\{/g, '₹${');
  content = content.replace(/\$([0-9]+)/g, '₹$1');
  content = content.replace(/₹\?([0-9]+)/g, '₹$1');
  content = content.replace(/\$\?([0-9]+)/g, '₹$1');
  
  // Clean up any remaining "?{" that looks like a variable interpolation intent
  // But wait, some ? could be ternary operators.
  // Template literals: `... ₹${...} ...`
  // We only want to fix cases where it's clearly currency.
  
  if (original !== content) {
    fs.writeFileSync(file, content, 'utf8');
    totalFixed++;
  }
});

console.log(`Cleaned up corrupted currency symbols in ${totalFixed} files.`);
