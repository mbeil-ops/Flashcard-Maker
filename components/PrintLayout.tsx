import React from 'react';
import { Flashcard } from '../types';

interface PrintLayoutProps {
  cards: Flashcard[];
  fontFamily: string;
}

// Configuration for A4
// A4 is 210mm x 297mm.
// We want a grid that covers the page.
// 2 columns x 2 rows = 4 cards per page.
const ROWS = 2;
const COLS = 2;
const ITEMS_PER_PAGE = ROWS * COLS;

export const PrintLayout: React.FC<PrintLayoutProps> = ({ cards, fontFamily }) => {
  // Chunk the cards into pages
  const chunks = [];
  for (let i = 0; i < cards.length; i += ITEMS_PER_PAGE) {
    chunks.push(cards.slice(i, i + ITEMS_PER_PAGE));
  }

  // If a chunk is not full, fill it with empty cards to maintain grid structure
  // This is important for the back-side alignment logic.
  const processedChunks = chunks.map(chunk => {
    const filledChunk = [...chunk];
    while (filledChunk.length < ITEMS_PER_PAGE) {
      filledChunk.push({ id: `empty-${Math.random()}`, front: '', back: '' });
    }
    return filledChunk;
  });

  return (
    <div className="print-only w-full bg-white" style={{ fontFamily }}>
      {processedChunks.map((chunk, pageIndex) => (
        <React.Fragment key={pageIndex}>
          {/* FRONT PAGE */}
          {/* 
             We use border-l and border-t on the container, and border-r and border-b on the items.
             This ensures exactly 1px border between cards (shared borders) and around the outside.
             Using 'border-black' for clear cut lines (snijlijnen).
          */}
          <div className="w-[210mm] h-[297mm] grid grid-cols-2 grid-rows-2 border-l border-t border-black box-border page-break-after bg-white">
            {chunk.map((card) => (
              <div 
                key={`front-${card.id}`} 
                className="flex items-center justify-center p-8 text-center text-xl overflow-hidden relative border-r border-b border-black box-border"
              >
                 <div className="break-words max-w-full max-h-full">
                    {card.front}
                 </div>
              </div>
            ))}
          </div>

          {/* BACK PAGE */}
          {/* 
            MIRRORING LOGIC FOR DOUBLE SIDED PRINTING (Long Edge Flip):
            Visual representation on screen:
            [Row 1 Col 1] [Row 1 Col 2]
            
            When printed on back:
            [Row 1 Col 2 Back] [Row 1 Col 1 Back]
            
            So we need to swap the columns for every row.
          */}
          <div className="w-[210mm] h-[297mm] grid grid-cols-2 grid-rows-2 border-l border-t border-black box-border page-break-after bg-white">
            {Array.from({ length: ROWS }).map((_, rowIndex) => {
              // Get the two items for this row
              const leftItemIndex = rowIndex * 2;
              const rightItemIndex = rowIndex * 2 + 1;
              const leftItem = chunk[leftItemIndex];
              const rightItem = chunk[rightItemIndex];

              // Render them swapped: Right Item first, then Left Item
              return (
                <React.Fragment key={`back-row-${rowIndex}`}>
                  {/* Slot 1 (physically left on back page = right on front page) */}
                  <div className="flex items-center justify-center p-8 text-center text-xl overflow-hidden relative border-r border-b border-black box-border">
                    <div className="break-words max-w-full max-h-full">
                        {rightItem ? rightItem.back : ''}
                    </div>
                  </div>

                  {/* Slot 2 (physically right on back page = left on front page) */}
                  <div className="flex items-center justify-center p-8 text-center text-xl overflow-hidden relative border-r border-b border-black box-border">
                    <div className="break-words max-w-full max-h-full">
                        {leftItem ? leftItem.back : ''}
                    </div>
                  </div>
                </React.Fragment>
              );
            })}
          </div>
        </React.Fragment>
      ))}
    </div>
  );
};