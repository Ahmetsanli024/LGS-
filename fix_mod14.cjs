const fs = require('fs');
let txt = fs.readFileSync('./components/Module14.tsx', 'utf8');

// remove generatePlannerHtml
txt = txt.replace(/const generatePlannerHtml = \(\) => \{[\s\S]*?\n  \};\n/g, "");

const replacement = `const handleDownloadPdf = async () => {
    const el = document.getElementById('module14-capture');
    if (!el) return;

    const inputs = el.querySelectorAll('input, textarea');
    inputs.forEach((input) => input.setAttribute('data-capture-value', input.value));

    try {
      const canvas = await html2canvas(el, {
        scale: 2,
        useCORS: true,
        backgroundColor: '#ffffff',
        logging: false,
        windowWidth: el.scrollWidth,
        windowHeight: el.scrollHeight,
        onclone: (clonedDoc) => {
           const clonedEl = clonedDoc.getElementById('module14-capture');
           if (clonedEl) {
             clonedEl.style.margin = '0 auto';
             
             // Replace inputs
             const clonedInputs = clonedEl.querySelectorAll('input, textarea');
             clonedInputs.forEach((input) => {
                const val = input.getAttribute('data-capture-value') || '';
                const div = clonedDoc.createElement('div');
                div.textContent = val;
                div.className = input.className;
                div.style.border = 'none';
                div.style.outline = 'none';
                div.style.background = 'transparent';
                div.style.display = 'flex';
                div.style.alignItems = 'center';
                div.style.whiteSpace = 'pre-wrap';
                if(input.tagName === 'TEXTAREA') {
                    div.style.whiteSpace = 'pre-wrap';
                    div.style.wordBreak = 'break-word';
                }
                if (input.placeholder === "ÖĞRENCİ ADI SOYADI" || input.placeholder === "ÖĞRENCİ İSMİ GİRİN") {
                    div.style.fontSize = '24px';
                    div.style.fontWeight = '900';
                }
                const computed = window.getComputedStyle(input);
                div.style.color = computed.color;
                div.style.fontSize = computed.fontSize;
                div.style.fontWeight = computed.fontWeight;
                
                if (input.parentNode) {
                    input.parentNode.replaceChild(div, input);
                }
             });
           }
        }
      });
      
      const imgData = canvas.toDataURL('image/jpeg', 1.0);
      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4'
      });
      
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = pdf.internal.pageSize.getHeight();
      
      const imgRatio = canvas.width / canvas.height;
      const pdfRatio = pdfWidth / pdfHeight;
      
      let finalWidth = pdfWidth;
      let finalHeight = finalWidth / imgRatio;
      
      if (finalHeight > pdfHeight) {
          finalHeight = pdfHeight;
          finalWidth = finalHeight * imgRatio;
      }
      
      const xOffset = (pdfWidth - finalWidth) / 2;
      const yOffset = (pdfHeight - finalHeight) / 2;
      
      pdf.addImage(imgData, 'JPEG', xOffset, yOffset, finalWidth, finalHeight);
      pdf.save(\`Haftalik_Calisma_Programi_\${studentName.replace(/\\s+/g, '_') || 'Ogrenci'}.pdf\`);
    } catch (error) {
      console.error("PDF Download failed", error);
      alert("PDF oluşturulamadı.");
    }
  };`;

// replace handleDownloadPdf completely
txt = txt.replace(/const handleDownloadPdf = async \(\) => \{[\s\S]*?\n  \};\n\n  const currentSchedule/g, replacement + "\n\n  const currentSchedule");

fs.writeFileSync('./components/Module14.tsx', txt);
console.log("Fixed Module14 Downloads");
