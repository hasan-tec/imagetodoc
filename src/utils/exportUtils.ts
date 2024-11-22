import { jsPDF } from 'jspdf';
import { Document, Packer, Paragraph, TextRun } from 'docx';

export async function exportToPDF(content: string) {
  const doc = new jsPDF();
  
  doc.html(content, {
    callback: function(doc) {
      doc.save('document.pdf');
    },
    x: 15,
    y: 15,
    width: 170,
    windowWidth: 650
  });
}

export async function exportToWord(content: string) {
  try {
    // Convert HTML content to plain text
    const tempDiv = document.createElement('div');
    tempDiv.innerHTML = content;
    const plainText = tempDiv.textContent || tempDiv.innerText || '';

    // Create document
    const doc = new Document({
      sections: [{
        properties: {},
        children: [
          new Paragraph({
            children: [
              new TextRun({
                text: plainText,
                size: 24,
              }),
            ],
          }),
        ],
      }],
    });

    // Generate and download file
    const buffer = await Packer.toBlob(doc);
    const url = window.URL.createObjectURL(buffer);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'document.docx';
    link.click();
    window.URL.revokeObjectURL(url);
  } catch (error) {
    console.error('Error exporting to Word:', error);
    throw error;
  }
}