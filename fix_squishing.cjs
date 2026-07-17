const fs = require('fs');

const files = [
    './components/Module4.tsx',
    './components/Module10.tsx',
    './components/Module11.tsx',
    './components/Module14.tsx',
    './components/Module16.tsx'
];

files.forEach(f => {
  if(!fs.existsSync(f)) return;
  let txt = fs.readFileSync(f, 'utf8');

  // Change display: flex to display: block for replaced inputs to avoid text squishing
  txt = txt.replace(/div\.style\.display = 'flex';\s*div\.style\.alignItems = 'center';/g, "div.style.display = input.tagName === 'TEXTAREA' ? 'block' : 'inline-block';");
  
  // Also ensure text nodes don't collapse their spaces. 
  // Let's ensure text isn't squished by html2canvas using letter-spacing normal actively on the div.
  txt = txt.replace(/div\.style\.whiteSpace = 'pre-wrap';/g, "div.style.whiteSpace = 'pre-wrap';\n                div.style.letterSpacing = 'normal';\n                div.style.wordSpacing = 'normal';");

  fs.writeFileSync(f, txt);
});
console.log("Fixed text squishing in clones.");
