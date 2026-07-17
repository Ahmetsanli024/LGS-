const fs = require('fs');

const replacement = `const handleDownloadPdf = async () => {
    if (!captureRef.current) return;
    const el = captureRef.current;

    const exportRoot = document.createElement('div');
    exportRoot.style.position = 'absolute';
    exportRoot.style.left = '-9999px';
    exportRoot.style.top = '-9999px';
    document.body.appendChild(exportRoot);

    const clone = el.cloneNode(true);
    clone.style.width = '1400px';
    clone.style.height = 'max-content';
    clone.style.maxWidth = 'none';
    clone.style.maxHeight = 'none';
    clone.style.overflow = 'visible';
    clone.style.boxSizing = 'border-box';
    clone.style.margin = '0 auto';
    clone.style.transform = 'none';
    clone.style.borderRadius = '0';
    clone.style.boxShadow = 'none';
    exportRoot.appendChild(clone);

    const originalInputs = el.querySelectorAll('input, textarea');
    const clonedInputs = clone.querySelectorAll('input, textarea');
    originalInputs.forEach((input, index) => {
        const cInput = clonedInputs[index];
        if (cInput) {
            cInput.value = input.value;
            const div = document.createElement('div');
            div.textContent = input.value;
            div.className = input.className;
            div.style.border = 'none';
            div.style.outline = 'none';
            div.style.background = 'transparent';
            div.style.display = input.tagName === 'TEXTAREA' ? 'block' : 'inline-block';
            div.style.whiteSpace = 'pre-wrap';
            div.style.wordBreak = 'break-word';
            div.style.letterSpacing = 'normal';
            
            if (input.placeholder === "ÖĞRENCİ ADI SOYADI" || input.placeholder === "ÖĞRENCİ İSMİ GİRİN") {
                div.style.fontSize = '24px';
                div.style.fontWeight = 'bold';
            } else {
                const computed = window.getComputedStyle(input);
                div.style.color = computed.color;
                div.style.fontSize = computed.fontSize;
                div.style.fontWeight = computed.fontWeight;
                div.style.textAlign = computed.textAlign;
                div.style.fontFamily = computed.fontFamily;
            }
            cInput.parentNode.replaceChild(div, cInput);
        }
    });

    try {
      const allElements = clone.querySelectorAll('*');
      allElements.forEach(child => {
         child.style.textRendering = 'optimizeLegibility';
         child.style.fontVariantLigatures = 'none';
         if(child.classList.contains('no-print')) {
             child.style.display = 'none';
         }
      });

      const dataUrl = await toPng(clone, {
        cacheBust: true,
        pixelRatio: 2,
        backgroundColor: '#ffffff'
      });
      
      const pdf = new jsPDF({
        orientation: 'landscape',
        unit: 'mm',
        format: 'a4'
      });
      
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = pdf.internal.pageSize.getHeight();
      const imgRatio = clone.offsetWidth / clone.offsetHeight;
      
      let finalWidth = pdfWidth;
      let finalHeight = finalWidth / imgRatio;
      
      if (finalHeight > pdfHeight) {
          finalHeight = pdfHeight;
          finalWidth = finalHeight * imgRatio;
      }
      
      const xOffset = (pdfWidth - finalWidth) / 2;
      const yOffset = (pdfHeight - finalHeight) / 2;
      
      pdf.addImage(dataUrl, 'PNG', xOffset, yOffset, finalWidth, finalHeight);
      pdf.save(\`Zaman_Planli_Tablo_\${studentName?.replace(/\\s+/g, '_') || 'Ogrenci'}.pdf\`);
    } catch (error) {
      console.error("PDF Download failed", error);
      alert("PDF oluşturulamadı.");
    } finally {
      document.body.removeChild(exportRoot);
    }
  };`;

const filePath = './components/Module11.tsx';
let txt = fs.readFileSync(filePath, 'utf8');

txt = txt.replace(/const handleDownloadPdf = async \(\) => \{[\s\S]*?(?=\n  return \()/g, replacement + "\n\n  ");

fs.writeFileSync(filePath, txt);
console.log('Module11 fixed');
