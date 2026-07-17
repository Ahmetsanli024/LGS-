const fs = require('fs');

let f = './components/Module16.tsx';
let txt = fs.readFileSync(f, 'utf8');

txt = txt.replace(/>D:<\/span>/g, ">DOĞRU:</span>");
txt = txt.replace(/>Y:<\/span>/g, ">YANLIŞ:</span>");

fs.writeFileSync(f, txt);

console.log("Fixed Dogru/Yanlis in Module 16");
