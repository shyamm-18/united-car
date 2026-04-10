const fs = require('fs');
const path = require('path');

const walkSync = (dir, filelist = []) => {
  fs.readdirSync(dir).forEach(file => {
    const filePath = path.join(dir, file);
    if (fs.statSync(filePath).isDirectory()) {
      if (!filePath.includes('node_modules') && !filePath.includes('.git') && !filePath.includes('dist')) {
        filelist = walkSync(filePath, filelist);
      }
    } else if (
      filePath.endsWith('.jsx') || 
      filePath.endsWith('.js') || 
      filePath.endsWith('.html') || 
      filePath.endsWith('.json')
    ) {
      filelist.push(filePath);
    }
  });
  return filelist;
};

const frontendFiles = walkSync(path.join(__dirname, '../frontend'));
const backendFiles = walkSync(path.join(__dirname, '../backend'));

const allFiles = [...frontendFiles, ...backendFiles];
let replacedFilesCount = 0;

allFiles.forEach(file => {
  let content = fs.readFileSync(file, 'utf8');
  let newContent = content;

  // Basic replacements
  newContent = newContent.replace(/LuxeDrive/g, 'UNITED CAR');
  newContent = newContent.replace(/LuxeDrive International/g, 'UNITED CAR');
  newContent = newContent.replace(/concierge@luxedrive\.co/g, 'unitedcarsjhotwara@gmail.com');
  newContent = newContent.replace(/admin@luxedrive\.com/g, 'unitedcarsjhotwara@gmail.com');
  
  // Phone replacements
  newContent = newContent.replace(/\+1 \(555\) 000-8888/g, '9784820100');
  newContent = newContent.replace(/\+1 \(800\) LUXE-DRIV/g, '9784820100');
  
  // Address updates (specifically from contact and footer)
  newContent = newContent.replace(/123 Luxury Drive, <br\/>Manhattan, NY 10001/g, 'Jhotwara, <br/>Jaipur, RJ 302012');
  newContent = newContent.replace(/100 Luxury Ave, Suite 500<br\/>\s*Beverly Hills, CA 90210/g, 'Jhotwara, Jaipur, Rajasthan 302012');

  // React Logo Spans
  newContent = newContent.replace(/Luxe<span className="text-blue-600">Drive<\/span>/g, 'UNITED <span className="text-blue-600">CAR</span>');
  newContent = newContent.replace(/Luxe<span className="text-blue-600 dark:text-blue-400">Drive<\/span>/g, 'UNITED <span className="text-blue-600 dark:text-blue-400">CAR</span>');
  
  newContent = newContent.replace(/luxedrive-theme/g, 'unitedcar-theme');
  
  if (content !== newContent) {
    fs.writeFileSync(file, newContent, 'utf8');
    replacedFilesCount++;
  }
});

console.log(`Re-branding successful. Replaced content in ${replacedFilesCount} files.`);
