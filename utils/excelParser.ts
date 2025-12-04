import * as XLSX from 'xlsx';
import { Flashcard } from '../types';

export const parseExcelFile = (file: File): Promise<Flashcard[]> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = (e) => {
      try {
        const data = e.target?.result;
        if (!data) return;

        const workbook = XLSX.read(data, { type: 'binary' });
        const sheetName = workbook.SheetNames[0];
        const sheet = workbook.Sheets[sheetName];
        
        // Convert to array of arrays
        const jsonData = XLSX.utils.sheet_to_json(sheet, { header: 1 }) as string[][];

        // Process data
        // We assume Row 1 is header, or if not, we try to detect. 
        // We'll just take the first two valid columns found.
        
        const cards: Flashcard[] = [];
        let startIndex = 0;

        // Simple heuristic: If the first row looks like "Term/Definition" or "Front/Back", skip it.
        if (jsonData.length > 0) {
            const firstRow = jsonData[0];
            if (firstRow && firstRow.length >= 2) {
                const s = firstRow[0].toLowerCase();
                if (s.includes('term') || s.includes('begrip') || s.includes('front') || s.includes('vraag')) {
                    startIndex = 1;
                }
            }
        }

        for (let i = startIndex; i < jsonData.length; i++) {
          const row = jsonData[i];
          if (row && row.length >= 2 && (row[0] || row[1])) {
             // Generate a simple unique ID
             cards.push({
               id: `card-${i}`,
               front: row[0] ? String(row[0]) : '',
               back: row[1] ? String(row[1]) : '',
             });
          }
        }

        resolve(cards);
      } catch (err) {
        reject(err);
      }
    };

    reader.onerror = (err) => reject(err);
    reader.readAsBinaryString(file);
  });
};