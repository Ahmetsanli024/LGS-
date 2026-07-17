const fs = require('fs');

let f = './components/Module16.tsx';
let txt = fs.readFileSync(f, 'utf8');

txt = txt.replace(/>DOĞRU:<\/span>/g, ">D:</span>");
txt = txt.replace(/>YANLIŞ:<\/span>/g, ">Y:</span>");

fs.writeFileSync(f, txt);
console.log("Reverted to D/Y");
