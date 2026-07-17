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

  // Add max-content and visible overflow to all captured elements in onclone
  txt = txt.replace(/if \(clonedEl\) \{\n(\s*)/g, "if (clonedEl) {\n$1clonedEl.style.height = 'max-content';\n$1clonedEl.style.overflow = 'visible';\n$1clonedEl.style.maxHeight = 'none';\n$1");

  fs.writeFileSync(f, txt);
});
console.log("Applied height visibility fixes.");
