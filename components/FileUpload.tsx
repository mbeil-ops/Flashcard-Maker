import React, { useCallback, useState } from 'react';
import { Upload, FileSpreadsheet, Loader2 } from 'lucide-react';
import { parseExcelFile } from '../utils/excelParser';
import { Flashcard } from '../types';

interface FileUploadProps {
  onDataLoaded: (cards: Flashcard[]) => void;
}

export const FileUpload: React.FC<FileUploadProps> = ({ onDataLoaded }) => {
  const [isDragging, setIsDragging] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleFile = async (file: File) => {
    setIsLoading(true);
    setError(null);
    try {
      const cards = await parseExcelFile(file);
      if (cards.length === 0) {
        setError("Geen geldige data gevonden. Zorg dat je Excel twee kolommen heeft (Begrip en Betekenis).");
      } else {
        onDataLoaded(cards);
      }
    } catch (e) {
      console.error(e);
      setError("Fout bij het lezen van het bestand. Probeer een geldig .xlsx of .xls bestand.");
    } finally {
      setIsLoading(false);
    }
  };

  const onDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const onDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const onDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const files = e.dataTransfer.files;
    if (files.length > 0) {
      handleFile(files[0]);
    }
  }, []);

  const onInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      handleFile(e.target.files[0]);
    }
  };

  return (
    <div 
      className={`border-2 border-dashed rounded-xl p-10 transition-colors text-center cursor-pointer
        ${isDragging ? 'border-blue-500 bg-blue-50' : 'border-gray-300 hover:border-gray-400 bg-white'}
      `}
      onDragOver={onDragOver}
      onDragLeave={onDragLeave}
      onDrop={onDrop}
      onClick={() => document.getElementById('fileInput')?.click()}
    >
      <input 
        type="file" 
        id="fileInput" 
        accept=".xlsx, .xls" 
        className="hidden" 
        onChange={onInputChange}
      />
      
      <div className="flex flex-col items-center gap-4">
        {isLoading ? (
          <Loader2 className="w-12 h-12 text-blue-500 animate-spin" />
        ) : (
          <FileSpreadsheet className={`w-12 h-12 ${isDragging ? 'text-blue-500' : 'text-gray-400'}`} />
        )}
        
        <div>
          <p className="text-lg font-medium text-gray-700">
            {isLoading ? 'Bestand verwerken...' : 'Sleep je Excel bestand hierheen'}
          </p>
          <p className="text-sm text-gray-500 mt-1">
            of klik om te uploaden
          </p>
        </div>

        {!isLoading && (
            <div className="text-xs text-gray-400 bg-gray-100 px-4 py-2 rounded-lg text-left mt-2">
                <p className="font-semibold mb-1">Excel Formaat:</p>
                <p>Kolom A: Begrip (Voorzijde)</p>
                <p>Kolom B: Betekenis (Achterzijde)</p>
            </div>
        )}
      </div>

      {error && (
        <div className="mt-4 p-3 bg-red-50 text-red-600 text-sm rounded-lg border border-red-100">
          {error}
        </div>
      )}
    </div>
  );
};