const fs = require('fs');
const files = ['./components/Module4.tsx','./components/Module14.tsx','./components/Module16.tsx'];

files.forEach(f => {
  if(!fs.existsSync(f)) return;
  let txt = fs.readFileSync(f, 'utf8');
  txt = txt.replace(/if \(input\.placeholder === "ÖĞRENCİ ADI SOYADI" \|\| input\.placeholder === "ÖĞRENCİ İSMİ GİRİN"\) \{\n\s*div\.style\.fontSize = '24px';\n\s*div\.style\.fontWeight = '900';\n\s*\}\n\s*(if \(input\.parentNode\))/g, 
  `if (input.placeholder === "ÖĞRENCİ ADI SOYADI" || input.placeholder === "ÖĞRENCİ İSMİ GİRİN") {
                    div.style.fontSize = '24px';
                    div.style.fontWeight = '900';
                }
                const computed = window.getComputedStyle(input);
                div.style.color = computed.color;
                div.style.fontSize = computed.fontSize;
                div.style.fontWeight = computed.fontWeight;
                
                $1`);
  fs.writeFileSync(f, txt);
});
console.log("Fixed PDF styles");
