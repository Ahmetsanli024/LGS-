const fs = require('fs');

const generateImageReplacement = (landscapeLogic, widthLogic, filenameStr) => `const handleDownload = async () => {
    if (!captureRef.current) return;
    const el = captureRef.current;
    ${landscapeLogic}

    const exportRoot = document.createElement('div');
    exportRoot.style.position = 'absolute';
    exportRoot.style.left = '-9999px';
    exportRoot.style.top = '-9999px';
    document.body.appendChild(exportRoot);

    const clone = el.cloneNode(true);
    clone.style.width = ${widthLogic};
    clone.style.height = 'max-content';
    clone.style.maxWidth = 'none';
    clone.style.maxHeight = 'none';
    clone.style.overflow = 'visible';
    clone.style.boxSizing = 'border-box';
    clone.style.margin = '0 auto';
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
            
            if (input.placeholder === "ÖĞRENCİ ADI SOYADI" || input.placeholder === "OKUL ADI GİRİNİZ") {
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
        pixelRatio: 3,
        backgroundColor: '#ffffff'
      });
      
      const link = document.createElement('a');
      link.download = ${filenameStr};
      link.href = dataUrl;
      link.click();
    } catch (error) {
      console.error('Download failed:', error);
      alert('Görüntü oluşturulurken bir hata oluştu. Lütfen tekrar deneyin.');
    } finally {
      document.body.removeChild(exportRoot);
    }
  };`;


function processMod10() {
    let txt = fs.readFileSync('./components/Module10.tsx', 'utf8');
    const logic = `const isLandscape = sortedSchedule.length <= 7;`;
    const wLogic = `isLandscape ? Math.max(el.scrollWidth, 1123) + 'px' : Math.max(el.scrollWidth, 794) + 'px'`;
    const fname = `\`Odev_Programi_\${studentName.replace(/\\s+/g, '_') || 'Ogrenci'}.png\``;
    txt = txt.replace(/const handleDownload = async \(\) => \{[\s\S]*?(?=\n  const handleDownloadPdf = async)/g, generateImageReplacement(logic, wLogic, fname) + "\n\n  ");
    fs.writeFileSync('./components/Module10.tsx', txt);
}

function processMod11() {
    let txt = fs.readFileSync('./components/Module11.tsx', 'utf8');
    const logic = ``;
    const wLogic = `'1400px'`;
    const fname = `\`Zaman_Planli_Tablo_\${studentName.replace(/\\s+/g, '_') || 'Ogrenci'}.png\``;
    txt = txt.replace(/const handleDownload = async \(\) => \{[\s\S]*?(?=\n  const handleDownloadPdf = async)/g, generateImageReplacement(logic, wLogic, fname) + "\n\n  ");
    fs.writeFileSync('./components/Module11.tsx', txt);
}

processMod10();
processMod11();
console.log("Image downloads fixed");
