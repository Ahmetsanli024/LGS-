const fs = require('fs');

const files = [
    './components/Module10.tsx',
    './components/Module11.tsx'
];

files.forEach(f => {
  if(!fs.existsSync(f)) return;
  let txt = fs.readFileSync(f, 'utf8');

  // Fix PDF height cropping exactly as we did for Module4
  const replaceStr = `const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = pdf.internal.pageSize.getHeight();
      
      const imgRatio = canvas.width / canvas.height;
      
      let finalWidth = pdfWidth;
      let finalHeight = finalWidth / imgRatio;
      
      if (finalHeight > pdfHeight) {
          finalHeight = pdfHeight;
          finalWidth = finalHeight * imgRatio;
      }
      
      const xOffset = (pdfWidth - finalWidth) / 2;
      const yOffset = (pdfHeight - finalHeight) / 2;
      
      pdf.addImage(imgData, 'JPEG', xOffset, yOffset, finalWidth, finalHeight);`;

  txt = txt.replace(/const pdfWidth = pdf\.internal\.pageSize\.getWidth\(\);[\s\S]*?pdf\.addImage\(imgData, 'JPEG', 0, 0, [^)]+\);/g, replaceStr);

  fs.writeFileSync(f, txt);
});

console.log("PDF fitting fixed for remaining modules!");
