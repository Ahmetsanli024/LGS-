const fs = require('fs');

const files = [
    './components/Module4.tsx',
    './components/Module10.tsx',
    './components/Module11.tsx',
    './components/Module14.tsx',
    './components/Module16.tsx'
];

files.forEach(item => {
    let text = fs.readFileSync(item, 'utf8');
    text = text.replace(/import html2canvas from 'html2canvas';/, "import { toPng } from 'html-to-image';");
    fs.writeFileSync(item, text);
});
console.log("Imports swapped.");
