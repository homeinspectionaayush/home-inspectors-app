import React from 'react';
import { pdfGenerator } from '@/lib/pdfGenerator';
import { storageService } from '@/lib/storageService';
export default function ExportPage(){
  const run = async () => {
    const entries = await storageService.getEntries();
    await pdfGenerator.generateInspectionReport(entries);
  };
  return <div style={{padding:12}}><h3>Export</h3><button className="button" onClick={run}>Generate PDF</button></div>;
}
