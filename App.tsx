import React, { useState, useEffect } from 'react';
import { FileUpload } from './components/FileUpload';
import { PrintLayout } from './components/PrintLayout';
import { Flashcard, FONTS, FontOption } from './types';
import { FileDown, Type, Download, PlusCircle } from 'lucide-react';
import * as XLSX from 'xlsx';

function App() {
  const [cards, setCards] = useState<Flashcard[]>([]);
  const [selectedFont, setSelectedFont] = useState<FontOption>(FONTS[1]); // Default to Roboto

  // Load Google Font dynamically when selected
  useEffect(() => {
    if (selectedFont.family.includes('sans-serif') && !selectedFont.family.includes("'")) {
        // Standard font, no need to load
        return;
    }
    
    // We rely on the preconnects in index.html, but we need to fetch the CSS for specific fonts
    const fontName = selectedFont.name.replace(/ /g, '+');
    const linkId = 'dynamic-font-loader';
    
    let link = document.getElementById(linkId) as HTMLLinkElement;
    if (!link) {
        link = document.createElement('link');
        link.id = linkId;
        link.rel = 'stylesheet';
        document.head.appendChild(link);
    }
    
    link.href = `https://fonts.googleapis.com/css2?family=${fontName}:wght@400;700&display=swap`;

  }, [selectedFont]);

  const handleDownloadPDF = (e: React.MouseEvent) => {
    e.preventDefault();
    // Timeout ensures fonts are loaded and layout is stable before print dialog
    setTimeout(() => {
        window.print();
    }, 500);
  };

  const handleReset = () => {
    if (confirm('Weet je zeker dat je opnieuw wilt beginnen? Alle data wordt gewist.')) {
      setCards([]);
    }
  };

  const downloadTemplate = () => {
    const ws = XLSX.utils.json_to_sheet([
        { "Begrip": "Hond", "Betekenis": "Een trouw huisdier dat blaft." },
        { "Begrip": "Kat", "Betekenis": "Een eigenzinnig huisdier dat miauwt." },
        { "Begrip": "Olifant", "Betekenis": "Het grootste landdier met een slurf." },
        { "Begrip": "Muis", "Betekenis": "Een klein knaagdier dat van kaas houdt." },
        { "Begrip": "Vogel", "Betekenis": "Een dier met veren dat eieren legt." },
        { "Begrip": "Vis", "Betekenis": "Een dier dat onder water ademt via kieuwen." }
    ]);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Flashcards");
    XLSX.writeFile(wb, "flashcard_template.xlsx");
  };

  return (
    <div className="min-h-screen">
      {/* Screen Layout */}
      <div className="no-print max-w-5xl mx-auto p-6 space-y-8">
        
        {/* Header */}
        <header className="flex flex-col md:flex-row md:items-center justify-between pb-6 border-b border-gray-200 gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Flashcard Maker</h1>
            <p className="text-gray-500 mt-1">Maak eenvoudig printbare A4 flashcards vanuit Excel.</p>
          </div>
          <div className="flex gap-2">
            <button 
                onClick={downloadTemplate}
                className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-blue-600 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors"
            >
                <Download size={16} /> Template
            </button>
            {cards.length > 0 && (
                <button 
                    onClick={handleReset}
                    className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors shadow-sm"
                >
                    <PlusCircle size={16} /> Nieuwe flashcards maken
                </button>
            )}
          </div>
        </header>

        {/* Configuration or Upload */}
        {cards.length === 0 ? (
          <section className="animate-in fade-in slide-in-from-bottom-4 duration-500">
            <FileUpload onDataLoaded={setCards} />
          </section>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            
            {/* Sidebar Controls */}
            <div className="space-y-6 lg:col-span-1">
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 sticky top-6">
                <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
                    <Type size={20} className="text-blue-500"/> Opmaak
                </h2>
                
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Kies een lettertype
                    </label>
                    <div className="relative">
                        <select 
                            value={selectedFont.name}
                            onChange={(e) => {
                                const font = FONTS.find(f => f.name === e.target.value);
                                if (font) setSelectedFont(font);
                            }}
                            className="block w-full rounded-lg border-gray-300 border bg-white px-4 py-2 pr-8 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm appearance-none cursor-pointer hover:border-blue-400 transition-colors"
                        >
                            {FONTS.map(f => (
                                <option key={f.name} value={f.name}>{f.name}</option>
                            ))}
                        </select>
                         <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                            <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/></svg>
                        </div>
                    </div>
                  </div>

                  <div className="pt-4 border-t border-gray-100">
                    <div className="flex items-center justify-between text-sm text-gray-600 mb-2">
                        <span>Aantal kaarten:</span>
                        <span className="font-mono font-bold text-gray-900">{cards.length}</span>
                    </div>
                     <div className="flex items-center justify-between text-sm text-gray-600 mb-2">
                        <span>Pagina's (A4):</span>
                        {/* 4 cards per page, 2 sides (front+back) per batch */}
                        <span className="font-mono font-bold text-gray-900">{Math.ceil(cards.length / 4) * 2}</span>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <button 
                        onClick={handleDownloadPDF}
                        className="w-full flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl shadow-lg shadow-blue-200 transition-all transform hover:scale-[1.02] font-semibold"
                    >
                        <FileDown size={20} /> Print / Opslaan als PDF
                    </button>
                    <p className="text-xs text-center text-gray-500 leading-relaxed bg-blue-50 p-2 rounded border border-blue-100">
                        <strong>Instructie:</strong><br/>
                        1. Kies bestemming <strong>"Opslaan als PDF"</strong>.<br/>
                        2. Zet marges op <strong>"Geen"</strong>.<br/>
                        3. Vink "Achtergrondgrafieken" aan (indien nodig).
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Preview Area */}
            <div className="lg:col-span-2 space-y-6">
                <div className="flex justify-between items-center">
                    <h2 className="text-lg font-semibold text-gray-800">Voorbeeld (Eerste 4 kaarten)</h2>
                    <span className="text-sm text-gray-500 italic" style={{ fontFamily: selectedFont.family }}>
                        Font voorbeeld: De snelle bruine vos...
                    </span>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                    {cards.slice(0, 4).map((card, idx) => (
                        <div key={card.id} className="aspect-[3/2] flex flex-col shadow-sm rounded-lg overflow-hidden border border-gray-200 bg-white">
                            <div className="flex-1 bg-blue-50 flex items-center justify-center p-4 border-b border-gray-100">
                                <span style={{ fontFamily: selectedFont.family }} className="text-center font-bold text-gray-800 text-xl">
                                    {card.front}
                                </span>
                            </div>
                            <div className="flex-1 bg-white flex items-center justify-center p-4">
                                <span style={{ fontFamily: selectedFont.family }} className="text-center text-gray-600">
                                    {card.back}
                                </span>
                            </div>
                             <div className="bg-gray-50 px-2 py-1 text-[10px] text-gray-400 text-center uppercase tracking-wider">
                                Kaart {idx + 1}
                            </div>
                        </div>
                    ))}
                </div>
                {cards.length > 4 && (
                    <p className="text-center text-gray-400 text-sm">... en nog {cards.length - 4} andere kaarten.</p>
                )}
            </div>

          </div>
        )}
      </div>

      {/* Hidden Print Layout */}
      {cards.length > 0 && (
        <PrintLayout cards={cards} fontFamily={selectedFont.family} />
      )}
    </div>
  );
}

export default App;