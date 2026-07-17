const fs = require('fs');

let f = './components/Module10.tsx';
let txt = fs.readFileSync(f, 'utf8');

txt = txt.replace(/windowWidth: isLandscape \? 1600 : 1200,/g, 
  "windowWidth: isLandscape ? 1600 : 1200,\n        windowHeight: element.scrollHeight,");

fs.writeFileSync(f, txt);
console.log("Fixed module 10 height");
