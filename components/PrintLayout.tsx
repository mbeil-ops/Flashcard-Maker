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
        // User Requirement:
        // Front Page Layout:
        // [ A1 ] [ A2 ]
        // [ A3 ] [ A4 ]
        const frontPageItems = [chunk[0], chunk[1], chunk[2], chunk[3]];

        // Back Page Layout (Mirrored for Long-Edge Duplex Printing):
        // The top-left of the back page (B2) is behind the top-right of the front page (A2).
        // [ B2 ] [ B1 ]
        // [ B4 ] [ B3 ]
        const backPageItems = [chunk[1], chunk[0], chunk[3], chunk[2]];

        return (
          <React.Fragment key={pageIndex}>
            {/* FRONT PAGE (Terms) */}
            <div className="w-[210mm] h-[297mm] flex items-center justify-center page-break-after bg-white relative">
              {/* 
                  Grid Container 
                  border-l and border-t on container + border-r and border-b on items 
                  creates a perfect shared border grid.
                  Using dashed gray lines as cutting guides.
              */}
              <div 
                  className="grid grid-cols-2 grid-rows-2 border-l border-t border-gray-400 border-dashed box-border"
                  style={{ width: GRID_WIDTH, height: GRID_HEIGHT }}
              >
                {frontPageItems.map((card, idx) => (
                  <div 
                    key={`front-${pageIndex}-${idx}`} 
                    className="flex items-center justify-center p-6 text-center overflow-hidden relative border-r border-b border-gray-400 border-dashed box-border"
                  >
                     <div className="break-words w-full max-h-full text-3xl font-medium leading-tight text-gray-900">
                        {card.front}
                     </div>
                  </div>
                ))}
              </div>
              
              {/* Footer / Page Number (Outside Cut Area) */}
              <div className="absolute bottom-4 right-8 text-[10px] text-gray-400 font-sans">
                  Pagina {pageIndex * 2 + 1} (Voorkant - Begrippen)
              </div>
            </div>

            {/* BACK PAGE (Definitions) */}
            <div className="w-[210mm] h-[297mm] flex items-center justify-center page-break-after bg-white relative">
              <div 
                  className="grid grid-cols-2 grid-rows-2 border-l border-t border-gray-400 border-dashed box-border"
                  style={{ width: GRID_WIDTH, height: GRID_HEIGHT }}
              >
                {backPageItems.map((card, idx) => (
                  <div 
                    key={`back-${pageIndex}-${idx}`} 
                    className="flex items-center justify-center p-6 text-center overflow-hidden relative border-r border-b border-gray-400 border-dashed box-border"
                  >
                    <div className="break-words w-full max-h-full text-2xl text-gray-800 leading-snug">
                        {card.back}
                    </div>
                  </div>
                ))}
              </div>
              
               {/* Footer / Page Number (Outside Cut Area) */}
               <div className="absolute bottom-4 left-8 text-[10px] text-gray-400 font-sans">
                  Pagina {pageIndex * 2 + 2} (Achterkant - Betekenissen)
              </div>
            </div>
          </React.Fragment>
        );
      })}
    </div>
  );
};