import React from 'react';
import { Flashcard } from '../types';

interface PrintLayoutProps {
  cards: Flashcard[];
  fontFamily: string;
}

// Configuration for A4
// We use a safe printable area to prevent printers from scaling down the page.
// Standard A4 is 210mm x 297mm.
// We'll use a centered grid of 190mm x 270mm.
// This allows for ~10mm margins which fits almost all printers without scaling.
const GRID_WIDTH = '190mm';
const GRID_HEIGHT = '270mm';

const ITEMS_PER_PAGE = 4; // 2x2 grid

export const PrintLayout: React.FC<PrintLayoutProps> = ({ cards, fontFamily }) => {
  // Chunk the cards into pages
  const chunks = [];
  for (let i = 0; i < cards.length; i += ITEMS_PER_PAGE) {
    chunks.push(cards.slice(i, i + ITEMS_PER_PAGE));
  }

  // If a chunk is not full, fill it with empty cards to maintain grid structure
  const processedChunks = chunks.map(chunk => {
    const filledChunk = [...chunk];
    while (filledChunk.length < ITEMS_PER_PAGE) {
      filledChunk.push({ id: `empty-${Math.random()}`, front: '', back: '' });
    }
    return filledChunk;
  });

  return (
    <div className="print-only w-full bg-white" style={{ fontFamily }}>
      {processedChunks.map((chunk, pageIndex) => {
        // Define exact positions for clarity based on user requirement
        // Front: A1, A2, A3, A4
        const A1 = chunk[0];
        const A2 = chunk[1];
        const A3 = chunk[2];
        const A4 = chunk[3];

        // Back: B2, B1, B4, B3 (Mirrored horizontally)
        // Since we are creating a grid that fills Left->Right, Top->Bottom:
        // Slot 1 (Top-Left) gets B2
        // Slot 2 (Top-Right) gets B1
        // Slot 3 (Bottom-Left) gets B4
        // Slot 4 (Bottom-Right) gets B3
        const backPageOrder = [A2, A1, A4, A3];

        return (
          <React.Fragment key={pageIndex}>
            {/* FRONT PAGE */}
            <div className="w-[210mm] h-[297mm] flex items-center justify-center page-break-after bg-white relative">
              {/* 
                  Grid Container 
                  border-l and border-t on container + border-r and border-b on items 
                  creates a perfect shared border grid.
              */}
              <div 
                  className="grid grid-cols-2 grid-rows-2 border-l border-t border-black box-border"
                  style={{ width: GRID_WIDTH, height: GRID_HEIGHT }}
              >
                {chunk.map((card, idx) => (
                  <div 
                    key={`front-${pageIndex}-${idx}`} 
                    className="flex items-center justify-center p-6 text-center overflow-hidden relative border-r border-b border-black box-border"
                  >
                     <div className="break-words w-full max-h-full text-3xl font-medium leading-tight">
                        {card.front}
                     </div>
                  </div>
                ))}
              </div>
              
              {/* Page number hint for user */}
              <div className="absolute bottom-4 right-8 text-xs text-gray-400">
                  Pagina {pageIndex * 2 + 1} (Voorkant - Begrippen)
              </div>
            </div>

            {/* BACK PAGE */}
            <div className="w-[210mm] h-[297mm] flex items-center justify-center page-break-after bg-white relative">
              <div 
                  className="grid grid-cols-2 grid-rows-2 border-l border-t border-black box-border"
                  style={{ width: GRID_WIDTH, height: GRID_HEIGHT }}
              >
                {backPageOrder.map((card, idx) => (
                  <div 
                    key={`back-${pageIndex}-${idx}`} 
                    className="flex items-center justify-center p-6 text-center overflow-hidden relative border-r border-b border-black box-border"
                  >
                    <div className="break-words w-full max-h-full text-2xl text-gray-800 leading-snug">
                        {card ? card.back : ''}
                    </div>
                  </div>
                ))}
              </div>
              
               {/* Page number hint for user */}
               <div className="absolute bottom-4 left-8 text-xs text-gray-400">
                  Pagina {pageIndex * 2 + 2} (Achterkant - Betekenissen)
              </div>
            </div>
          </React.Fragment>
        );
      })}
    </div>
  );
};