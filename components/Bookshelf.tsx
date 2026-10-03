import React, { useState, useEffect, useRef } from 'react';
import * as pdfjsLib from 'pdfjs-dist';

// Configure PDF.js worker
pdfjsLib.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.js`;

interface FileData {
  name: string;
  author: string;
  year: string;
  subject: string;
  description: string;
  type: string;
  url: string;
}

export const Bookshelf: React.FC = () => {
  const [files, setFiles] = useState<FileData[]>([
    {
      name: "The Kybalion",
      author: "Three Initiates",
      year: "1908",
      subject: "Hermetic Philosophy",
      description: "The foundational treatise outlining the Seven Hermetic Principles of ancient Egypt and Greece.",
      type: "application/pdf",
      url: "https://www.gutenberg.org/files/1420/1420-pdf.pdf"
    },
    {
      name: "The Prince",
      author: "Niccolò Machiavelli",
      year: "1532",
      subject: "Realpolitik & Power",
      description: "The classic, sharp-witted strategic handbook on command, statecraft, and human manipulation.",
      type: "application/pdf",
      url: "https://www.gutenberg.org/files/1232/1232-pdf.pdf"
    },
    {
      name: "Isis Unveiled (Vol. I)",
      author: "Helena P. Blavatsky",
      year: "1877",
      subject: "Theosophy & Occult",
      description: "A master key to the mysteries of ancient and modern science, theology, and esoteric philosophy.",
      type: "application/pdf",
      url: "https://www.gutenberg.org/files/48043/48043-pdf.pdf"
    },
    {
      name: "The Art of War",
      author: "Sun Tzu",
      year: "5th Cent. BC",
      subject: "Military Strategy",
      description: "The ancient wisdom treatise on tactical maneuverability, deception, and psychological triumph.",
      type: "application/pdf",
      url: "https://www.gutenberg.org/files/132/132-pdf.pdf"
    },
    {
      name: "Sufi Spiritual Liberty",
      author: "Hazrat Inayat Khan",
      year: "1914",
      subject: "Sufi Mysticism",
      description: "A poetic introduction to the purification of the heart, inner vibration, and spiritual alignment.",
      type: "application/pdf",
      url: "https://www.gutenberg.org/files/62266/62266-pdf.pdf"
    }
  ]);

  const [selectedFile, setSelectedFile] = useState<FileData | null>(null);
  const [pdfError, setPdfError] = useState<boolean>(false);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const newFile: FileData = {
        name: file.name.replace(/\.[^/.]+$/, ""),
        author: "Uploaded Seeker",
        year: new Date().getFullYear().toString(),
        subject: "Custom Document",
        description: "A customized esoteric or philosophical document added to your local grimoire bookshelf.",
        type: file.type,
        url: URL.createObjectURL(file)
      };
      setFiles([newFile, ...files]);
    }
  };

  const previewPDF = async (file: FileData) => {
    setSelectedFile(file);
    setPdfError(false);
    
    if (file.type !== 'application/pdf') {
      setPdfError(true);
      return;
    }
    
    try {
      const loadingTask = pdfjsLib.getDocument({ url: file.url });
      const pdf = await loadingTask.promise;
      const page = await pdf.getPage(1);
      
      const viewport = page.getViewport({ scale: 0.8 });
      const canvas = canvasRef.current;
      if (!canvas) return;
      
      const context = canvas.getContext('2d');
      if (!context) return;
      
      canvas.height = viewport.height;
      canvas.width = viewport.width;
      
      await page.render({ canvas, canvasContext: context, viewport }).promise;
    } catch (error) {
      console.warn('PDF.js cross-origin or rendering notice:', error);
      // Fallback on CORS blocks
      setPdfError(true);
    }
  };

  return (
    <div className="bg-zinc-950 border border-zinc-900 rounded-2xl p-6 shadow-xl animate-fadeIn space-y-6">
      
      {/* Title */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-zinc-900 pb-4">
        <div>
          <h3 className="text-sm font-bold font-mono uppercase tracking-widest text-[#DC143C]">
            Esoteric Bookshelf
          </h3>
          <p className="text-xs text-zinc-500 mt-0.5">
            A curated library of Hermetic, strategic, and Occult philosophies. Upload files to supplement your grimoire.
          </p>
        </div>

        {/* Upload input */}
        <label className="px-3.5 py-1.5 rounded-lg bg-zinc-900 hover:bg-[#DC143C] border border-zinc-800 text-xs font-mono uppercase text-zinc-300 hover:text-black transition-all cursor-pointer font-bold flex items-center gap-1.5 shadow-md">
          <span>+ Upload Book</span>
          <input 
            type="file" 
            onChange={handleFileUpload} 
            className="hidden" 
            accept=".pdf,.doc,.docx,.epub" 
          />
        </label>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Books shelf grid - Left column */}
        <div className={`space-y-3 lg:col-span-7 ${files.length > 0 ? 'max-h-[550px] overflow-y-auto pr-1' : ''}`}>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {files.map((file, idx) => {
              const isSelected = selectedFile?.name === file.name;
              return (
                <div 
                  key={idx} 
                  onClick={() => previewPDF(file)}
                  className={`p-4 rounded-xl border transition-all cursor-pointer flex flex-col justify-between min-h-[170px] ${
                    isSelected 
                      ? 'bg-zinc-900 border-[#DC143C] shadow-[0_4px_15px_rgba(220,20,60,0.15)] text-white' 
                      : 'bg-black border-zinc-900 hover:border-zinc-850 hover:bg-zinc-950 text-zinc-400 hover:text-zinc-200'
                  }`}
                >
                  <div>
                    <div className="flex justify-between items-start gap-1">
                      <span className="text-[8px] font-mono uppercase tracking-widest px-1.5 py-0.5 bg-zinc-900 border border-zinc-800 rounded-md text-zinc-400">
                        {file.subject}
                      </span>
                      <span className="text-[8px] font-mono text-zinc-600">
                        {file.year}
                      </span>
                    </div>
                    
                    <h4 className="font-syne font-extrabold text-sm uppercase text-[#F8F7F4] mt-2 group-hover:text-[#DC143C]">
                      {file.name}
                    </h4>
                    <span className="text-[10px] font-mono text-zinc-500 italic">
                      by {file.author}
                    </span>
                    
                    <p className="text-[10px] text-zinc-500 font-google-sans leading-relaxed mt-2 line-clamp-2">
                      {file.description}
                    </p>
                  </div>

                  <div className="flex items-center justify-between border-t border-zinc-900/60 pt-3.5 mt-3">
                    <span className="text-[9px] font-mono text-[#DC143C] font-bold">
                      Read Online →
                    </span>
                    <a 
                      href={file.url} 
                      download={`${file.name}.pdf`} 
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={(e) => e.stopPropagation()}
                      className="text-[9px] font-mono text-zinc-500 hover:text-white uppercase tracking-wider hover:underline"
                    >
                      Download Link
                    </a>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Book Preview / Expositions - Right Column */}
        <div className="lg:col-span-5">
          {selectedFile ? (
            <div className="border border-zinc-900 rounded-2xl p-5 bg-black/60 shadow-lg min-h-[300px] flex flex-col justify-between">
              <div>
                <span className="text-[8px] font-mono uppercase text-zinc-500 block mb-1">Preview Cabinet</span>
                <h4 className="font-syne font-extrabold text-sm text-[#F8F7F4] uppercase tracking-wide">
                  {selectedFile.name}
                </h4>
                <p className="text-[10.5px] text-zinc-400 leading-relaxed mt-2 font-google-sans border-b border-zinc-900/60 pb-3">
                  {selectedFile.description}
                </p>

                {/* PDF Canvas Rendering or Fallback */}
                <div className="mt-4 flex justify-center">
                  {!pdfError ? (
                    <div className="border border-zinc-900 rounded-lg overflow-hidden bg-white max-h-[350px] overflow-y-auto">
                      <canvas ref={canvasRef} className="max-w-full h-auto" />
                    </div>
                  ) : (
                    <div className="w-full py-12 px-4 rounded-xl border border-dashed border-zinc-900 bg-zinc-950/60 text-center flex flex-col items-center justify-center gap-3">
                      <span className="text-2xl">📖</span>
                      <div>
                        <span className="text-[10.5px] font-mono text-zinc-400 block uppercase tracking-wider">
                          Gutenberg Portal Available
                        </span>
                        <p className="text-[10px] text-zinc-600 max-w-[220px] leading-relaxed mx-auto mt-1">
                          Browser CORS policies block drawing this public archive PDF inside a canvas. Click the action below to open in your browser.
                        </p>
                      </div>
                      <a 
                        href={selectedFile.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="px-3.5 py-1.5 rounded-lg bg-zinc-900 hover:bg-[#DC143C] hover:text-black border border-zinc-800 text-[10px] font-mono uppercase tracking-wider text-zinc-300 font-bold transition-all shadow-md mt-1.5"
                      >
                        Open In New Tab
                      </a>
                    </div>
                  )}
                </div>
              </div>

              <div className="text-[8.5px] font-mono text-zinc-600 text-center pt-4 border-t border-zinc-900/40">
                AUTHOR: {selectedFile.author.toUpperCase()} · YEAR: {selectedFile.year}
              </div>
            </div>
          ) : (
            <div className="border border-dashed border-zinc-900 rounded-2xl p-12 text-center text-zinc-600 font-mono text-xs uppercase flex flex-col items-center justify-center gap-2 min-h-[300px]">
              <span>📚</span>
              <span>Select a Grimoire to inspect</span>
            </div>
          )}
        </div>

      </div>
    </div>
  );
};
