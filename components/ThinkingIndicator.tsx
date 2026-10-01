import React from 'react';

interface ThinkingIndicatorProps {
  personaName?: string;
}

export const ThinkingIndicator: React.FC<ThinkingIndicatorProps> = ({ personaName = 'LAEVUS' }) => {
  return (
    <div className="w-full flex flex-col items-center justify-center py-6 my-2 animate-fadeIn font-google-sans">
      <div className="inline-flex flex-col items-center gap-2.5 px-6 py-3.5 rounded-2xl bg-zinc-950/80 border border-[#DC143C]/30 shadow-[0_0_25px_rgba(220,20,60,0.15)]">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-[#DC143C] animate-bounce [animation-delay:-0.3s]" />
          <span className="w-2 h-2 rounded-full bg-[#DC143C] animate-bounce [animation-delay:-0.15s]" />
          <span className="w-2 h-2 rounded-full bg-[#DC143C] animate-bounce" />
        </div>
        <div className="text-[10px] font-mono text-zinc-400 uppercase tracking-[0.2em] flex items-center gap-1.5">
          <span className="text-[#DC143C] font-bold">✦ {personaName}</span>
          <span>is channelling response...</span>
        </div>
      </div>
    </div>
  );
};
