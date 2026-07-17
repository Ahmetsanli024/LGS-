const fs = require('fs');

function replaceDownloads(filePath, captureId, filePrefix, isPortrait) {
    if(!fs.existsSync(filePath)) return;
    let content = fs.readFileSync(filePath, 'utf8');

    // First remove generatePlannerHtml entirely as we do direct capture now!
    content = content.replace(/const generatePlannerHtml = \([\s\S]*?\n  \};\n\n/g, "");

    // Find the boundary between the `handleDownload` and `handleAIParse`
    const regex = /const handleDownload(Pdf)? = async \(\) => \{[\s\S]*?const handleAIParse/g;
    
    const replacement = `const handleDownload = async () => {
    const el = document.getElementById('${captureId}');
    if (!el) return;

    // Set data attributes
    const inputs = el.querySelectorAll('input, textarea');
    inputs.forEach((input) => input.setAttribute('data-capture-value', input.value));

    try {
      const canvas = await html2canvas(el, {
        scale: 3,
        useCORS: true,
        backgroundColor: '#ffffff',
        logging: false,
        onclone: (clonedDoc) => {
           const clonedEl = clonedDoc.getElementById('${captureId}');
           if (clonedEl) {
             clonedEl.style.margin = '0 auto';
             clonedEl.style.padding = '40px';
             
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
                // Maintain text color & size
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
      
      const link = document.createElement('a');
      link.download = \`${filePrefix}_\${studentName.replace(/\\s+/g, '_') || 'Ogrenci'}.png\`;
      link.href = canvas.toDataURL('image/png');
      link.click();
    } catch (error) {
      console.error("Download failed", error);
      alert("Resim oluşturulamadı.");
    }
  };

  const handleDownloadPdf = async () => {
    const el = document.getElementById('${captureId}');
    if (!el) return;

    const inputs = el.querySelectorAll('input, textarea');
    inputs.forEach((input) => input.setAttribute('data-capture-value', input.value));

    try {
      const canvas = await html2canvas(el, {
        scale: 2,
        useCORS: true,
        backgroundColor: '#ffffff',
        logging: false,
        onclone: (clonedDoc) => {
           const clonedEl = clonedDoc.getElementById('${captureId}');
           if (clonedEl) {
             clonedEl.style.margin = '0 auto';
             clonedEl.style.padding = '40px';
             
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
                
                if (input.parentNode) {
                    input.parentNode.replaceChild(div, input);
                }
             });
           }
        }
      });
      
      const imgData = canvas.toDataURL('image/jpeg', 1.0);
      const pdf = new jsPDF({
        orientation: '${isPortrait ? "portrait" : "landscape"}',
        unit: 'mm',
        format: 'a4'
      });
      
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (canvas.height * pdfWidth) / canvas.width;
      
      pdf.addImage(imgData, 'JPEG', 0, 0, pdfWidth, pdfHeight);
      pdf.save(\`${filePrefix}_\${studentName.replace(/\\s+/g, '_') || 'Ogrenci'}.pdf\`);
    } catch (error) {
      console.error("PDF Download failed", error);
      alert("PDF oluşturulamadı.");
    }
  };

  const handleAIParse`;

    content = content.replace(regex, replacement);
    fs.writeFileSync(filePath, content);
}

replaceDownloads('./components/Module4.tsx', 'classic-planner-capture', 'Haftalik_Plan', false);
replaceDownloads('./components/Module14.tsx', 'module14-capture', 'Haftalik_Calisma_Programi', false);
replaceDownloads('./components/Module16.tsx', 'module16-capture', 'Haftalik_Plan_DY', false);

console.log("Downloads fixed!");
