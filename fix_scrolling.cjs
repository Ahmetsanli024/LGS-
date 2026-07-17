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

  // Fix html2canvas call to include scroll dimensions and prevent cropping
  txt = txt.replace(/const canvas = await html2canvas\(el, {([\s\S]*?)onclone: \(clonedDoc\) => {/g, (match, p1) => {
      // make sure it doesn't already have windowWidth
      let inner = p1;
      inner = inner.replace(/windowWidth:.*?,/g, "");
      inner = inner.replace(/windowHeight:.*?,/g, "");
      
      return `const canvas = await html2canvas(el, {${inner}windowWidth: el.scrollWidth,
        windowHeight: el.scrollHeight,
        onclone: (clonedDoc) => {`;
  });

  // Remove padding and margin from clonedEl
  txt = txt.replace(/clonedEl\.style\.margin = '0 auto';\s*clonedEl\.style\.padding = '40px';/g, "");

  // Sometimes Module10 has extra styling in onclone that messes up
  txt = txt.replace(/el\.style\.width = targetWidth;/g, "el.style.width = targetWidth;\n             el.style.height = 'auto';\n             el.style.overflow = 'visible';");

  fs.writeFileSync(f, txt);
});
console.log("Fixed PDF truncations and padding");
