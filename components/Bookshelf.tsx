import React, { useState, useEffect, useRef } from 'react';
import * as pdfjsLib from 'pdfjs-dist';

// Configure PDF.js worker
pdfjsLib.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.js`;

interface FileData {
  name: string;
  type: string;
  url: string;
}

export const Bookshelf: React.FC = () => {
  const [files, setFiles] = useState<FileData[]>([]);
  const [selectedFile, setSelectedFile] = useState<FileData | null>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const newFile = {
        name: file.name,
        type: file.type,
        url: URL.createObjectURL(file)
      };
      setFiles([...files, newFile]);
    }
  };

  const previewPDF = async (file: FileData) => {
    if (file.type !== 'application/pdf') {
      alert("PDF preview is only supported for PDF files.");
      return;
    }
    setSelectedFile(file);
    
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
      console.error('Error rendering PDF:', error);
    }
  };

  return (
    <div className="bg-zinc-950 border border-zinc-900 rounded-2xl p-6 shadow-xl animate-fadeIn space-y-6">
      <h3 className="text-sm font-bold font-mono uppercase tracking-widest text-zinc-300">Bookshelf</h3>
      <input type="file" onChange={handleFileUpload} className="text-xs" accept=".pdf,.doc,.docx,.epub" />
      
      <div className="grid grid-cols-2 gap-6">
        <ul className="space-y-2">
          {files.map((file, idx) => (
            <li key={idx} className="flex justify-between items-center bg-zinc-900 p-2 rounded text-xs">
              <button onClick={() => previewPDF(file)} className="text-white hover:text-[#DC143C]">{file.name}</button>
              <a href={file.url} download={file.name} className="text-[#DC143C] hover:underline">Download</a>
            </li>
          ))}
        </ul>

        {selectedFile && (
          <div className="border border-zinc-800 rounded-lg p-2 bg-black">
            <h4 className="text-xs text-zinc-400 mb-2">Preview: {selectedFile.name}</h4>
            <canvas ref={canvasRef} className="max-w-full h-auto" />
          </div>
        )}
      </div>
    </div>
  );
};
