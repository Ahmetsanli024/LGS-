const fs = require('fs');

const files = [
    './components/Module4.tsx',
    './components/Module10.tsx',
    './components/Module14.tsx',
    './components/Module16.tsx'
];

files.forEach(f => {
  if(!fs.existsSync(f)) return;
  let txt = fs.readFileSync(f, 'utf8');

  // Find if already added width fixes
  if (!txt.includes("clonedEl.style.width = el.scrollWidth + 'px';")) {
      txt = txt.replace(/clonedEl\.style\.height = 'max-content';/g, 
        "clonedEl.style.height = 'max-content';\n             clonedEl.style.width = el.scrollWidth + 'px';\n             clonedEl.style.maxWidth = 'none';\n             clonedEl.style.boxSizing = 'border-box';");
      fs.writeFileSync(f, txt);
  }
});
console.log("Applied width visibility fixes.");
