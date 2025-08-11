import jsPDF from 'jspdf';
import JSZip from 'jszip';
import { saveAs } from 'file-saver';
import { InspectionEntry } from '@/types';

export const pdfGenerator = {
  async generateInspectionReport(entries: InspectionEntry[]) {
    const doc = new jsPDF();
    doc.setFontSize(16);
    doc.text('Home Inspectors Report', 10, 20);
    let y = 30;
    entries.forEach((e, i) => {
      doc.setFontSize(10);
      doc.text(`${i+1}. [${e.room}] ${new Date(e.timestamp).toLocaleString()}`, 10, y);
      y += 6;
      if (e.notes) {
        const split = doc.splitTextToSize(e.notes, 180);
        doc.text(split, 10, y);
        y += split.length * 5;
      }
      y += 6;
      if (y > 260) { doc.addPage(); y = 20; }
    });
    doc.save('inspection-report.pdf');
  }
};
