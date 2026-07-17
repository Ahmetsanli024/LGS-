const fs = require('fs');
const files = [
  './components/Module4.tsx',
  './components/Module10.tsx',
  './components/Module11.tsx',
  './components/Module14.tsx',
  './components/Module16.tsx'
];

files.forEach(f => {
  if (!fs.existsSync(f)) return;
  let text = fs.readFileSync(f, 'utf8');

  // Remove problematic CSS properties that break html2canvas text
  text = text.replace(/font-variant-ligatures:.*?;/g, '');
  text = text.replace(/text-rendering:.*?;/g, '');
  text = text.replace(/letter-spacing:.*?;/g, '');

  fs.writeFileSync(f, text);
});
console.log("Cleaned CSS styles");
