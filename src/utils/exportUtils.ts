import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import { Document, Packer, Paragraph, TextRun, HeadingLevel, TableRow, TableCell, Table } from 'docx';
import { saveAs } from 'file-saver';

// Helper function to convert HTML to docx compatible format
const htmlToDocx = (html: string): (Paragraph | Table)[] => {
  const parser = new DOMParser();
  const doc = parser.parseFromString(html, 'text/html');
  const elements: (Paragraph | Table)[] = [];

  const processNode = (node: Node): Paragraph | Table | null => {
    if (node instanceof HTMLElement) {
      switch (node.nodeName) {
        case 'P':
          return new Paragraph({
            children: Array.from(node.childNodes).map(child => new TextRun((child as Text).textContent || '')),
          });
        case 'H1':
        case 'H2':
        case 'H3':
        case 'H4':
        case 'H5':
        case 'H6':
          return new Paragraph({
            heading: HeadingLevel[node.nodeName as keyof typeof HeadingLevel],
            children: [new TextRun(node.textContent || '')],
          });
        case 'UL':
        case 'OL':
          return new Paragraph({
            children: Array.from(node.childNodes).map(li => new TextRun(`• ${(li as HTMLLIElement).textContent || ''}\n`)),
          });
        case 'TABLE':
          const rows = Array.from(node.querySelectorAll('tr')).map(tr => 
            new TableRow({
              children: Array.from(tr.querySelectorAll('td, th')).map(cell => 
                new TableCell({
                  children: [new Paragraph({children: [new TextRun(cell.textContent || '')]})],
                })
              ),
            })
          );
          return new Table({
            rows: rows,
          });
        default:
          return null;
      }
    }
    return null;
  };

  doc.body.childNodes.forEach(node => {
    const element = processNode(node);
    if (element) {
      elements.push(element);
    }
  });

  return elements;
};

// Improved function to export content as PDF
export const exportToPDF = async (content: string, fileName: string = 'document.pdf'): Promise<void> => {
  try {
    const contentElement = document.createElement('div');
    contentElement.innerHTML = content;
    contentElement.style.width = '210mm'; // A4 width
    contentElement.style.padding = '10mm'; // Add some padding
    contentElement.style.marginBottom = '20mm'; // Add bottom margin
    document.body.appendChild(contentElement);

    const pdf = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: 'a4'
    });

    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = pdf.internal.pageSize.getHeight();
    let currentPage = 1;

    const addPageContent = async (element: HTMLElement) => {
      const canvas = await html2canvas(element, {
        scale: 2, // Increase resolution
        useCORS: true,
        logging: false,
        windowWidth: contentElement.scrollWidth,
        margin: {
          top: 10,
          right: 10,
          bottom: 20, // Increased bottom margin
          left: 10
        }
      });

      const imgData = canvas.toDataURL('image/jpeg', 1.0);
      const imgWidth = pdfWidth - 20; // Subtract margins
      const imgHeight = canvas.height * imgWidth / canvas.width;

      let heightLeft = imgHeight;
      let position = 10; // Start with top margin

      pdf.addImage(imgData, 'JPEG', 10, position, imgWidth, imgHeight, '', 'FAST');
      heightLeft -= (pdfHeight - 30); // Subtract top and bottom margins

      while (heightLeft >= 0) {
        position = heightLeft - imgHeight + 10; // Add top margin for new pages
        pdf.addPage();
        currentPage++;
        pdf.addImage(imgData, 'JPEG', 10, position, imgWidth, imgHeight, '', 'FAST');
        heightLeft -= (pdfHeight - 30); // Subtract margins for new pages
      }
    };

    await addPageContent(contentElement);

    document.body.removeChild(contentElement);
    pdf.save(fileName);
  } catch (error) {
    console.error('Error exporting to PDF:', error);
    throw new Error('Failed to export document as PDF');
  }
};

// Function to export content as Word document
export const exportToWord = async (content: string, fileName: string = 'document.docx'): Promise<void> => {
  try {
    const doc = new Document({
      sections: [{
        properties: {},
        children: htmlToDocx(content),
      }],
    });

    const blob = await Packer.toBlob(doc);
    saveAs(blob, fileName);
  } catch (error) {
    console.error('Error exporting to Word:', error);
    throw new Error('Failed to export document as Word file');
  }
};

// Function to determine file type and call appropriate export function
export const exportDocument = (content: string, fileType: 'pdf' | 'docx', fileName?: string): Promise<void> => {
  switch (fileType) {
    case 'pdf':
      return exportToPDF(content, fileName);
    case 'docx':
      return exportToWord(content, fileName);
    default:
      throw new Error('Unsupported file type');
  }
};

