import React, { useState, useEffect } from 'react';
import { 
  PastSpreadReading, 
  getPastSpreadReadings, 
  deletePastSpreadReading, 
  clearAllPastSpreadReadings, 
  exportPastSpreadReadings,
  updatePastSpreadReadingNotes 
} from '../services/pastReadingsStorage';
import { voiceEngine } from '../services/voiceSynthesis';

interface PastReadingsSidebarProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectReading: (reading: PastSpreadReading) => void;
  currentLoadedReadingId?: string | null;
}

export const PastReadingsSidebar: React.FC<PastReadingsSidebarProps> = ({
  isOpen,
  onClose,
  onSelectReading,
  currentLoadedReadingId
}) => {
  const [readings, setReadings] = useState<PastSpreadReading[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [editingNotesId, setEditingNotesId] = useState<string | null>(null);
  const [tempNotes, setTempNotes] = useState<string>('');
  const [confirmClearAll, setConfirmClearAll] = useState(false);
  const [itemToDelete, setItemToDelete] = useState<string | null>(null);

  const refreshReadings = () => {
    setReadings(getPastSpreadReadings());
  };

  useEffect(() => {
    refreshReadings();
    const handleUpdate = () => refreshReadings();
    window.addEventListener('laevus_past_readings_updated', handleUpdate);
    return () => window.removeEventListener('laevus_past_readings_updated', handleUpdate);
  }, []);

  const filteredReadings = readings.filter(r => 
    r.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
    r.readingText.toLowerCase().includes(searchQuery.toLowerCase()) ||
    r.cards.some(c => c.name.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-black/70 backdrop-blur-sm animate-fadeIn font-google-sans">
      <div className="w-full max-w-md bg-zinc-950 border-l border-zinc-900 flex flex-col h-full shadow-2xl">
        {/* Header */}
        <div className="p-4 border-b border-zinc-900 flex items-center justify-between bg-black/60">
          <div className="flex items-center gap-2">
            <span className="text-xl">⏱</span>
            <div>
              <h3 className="text-sm font-bold font-syne text-[#F8F7F4] uppercase tracking-wider">
                Past Spread Archives
              </h3>
              <span className="text-[10px] font-mono text-zinc-500">
                {readings.length} Saved Physical Readings
              </span>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg bg-zinc-900 text-zinc-400 hover:text-white transition-colors cursor-pointer text-xs"
          >
            ✕
          </button>
        </div>

        {/* Search & Actions */}
        <div className="p-4 border-b border-zinc-900/60 space-y-3 bg-zinc-950">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search past questions or cards..."
            className="w-full bg-black border border-zinc-800 focus:border-[#DC143C] px-3 py-2 rounded-xl text-xs text-zinc-200 placeholder-zinc-600 outline-none font-mono"
          />

          <div className="flex items-center justify-between text-[11px] font-mono">
            {readings.length > 0 && (
              <>
                <button
                  onClick={exportPastSpreadReadings}
                  className="text-zinc-400 hover:text-[#DC143C] transition-colors cursor-pointer flex items-center gap-1"
                >
                  <span>↓</span> Export JSON
                </button>
                <button
                  onClick={() => setConfirmClearAll(true)}
                  className="text-red-400/80 hover:text-red-400 transition-colors cursor-pointer"
                >
                  Clear All
                </button>
              </>
            )}
          </div>
        </div>

        {/* Readings List */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          {filteredReadings.length === 0 ? (
            <div className="text-center py-16 text-zinc-600 text-xs font-mono">
              No saved spread readings found.
            </div>
          ) : (
            filteredReadings.map((reading) => {
              const isSelected = currentLoadedReadingId === reading.id;
              return (
                <div
                  key={reading.id}
                  className={`p-4 rounded-xl border transition-all space-y-2.5 ${
                    isSelected
                      ? 'bg-zinc-900/80 border-[#DC143C] shadow-[0_0_15px_rgba(220,20,60,0.2)]'
                      : 'bg-black border-zinc-900 hover:border-zinc-800'
                  }`}
                >
                  <div className="flex items-center justify-between text-[10px] font-mono text-zinc-500">
                    <span>{reading.formattedDate}</span>
                    <span className="text-[#DC143C] font-semibold">{reading.voiceSettings.persona}</span>
                  </div>

                  <h4 className="text-xs font-bold font-syne text-[#F8F7F4] line-clamp-1">
                    "{reading.question}"
                  </h4>

                  <div className="flex items-center gap-1.5 flex-wrap">
                    {reading.cards.map((c, i) => (
                      <span key={i} className="text-[10px] bg-zinc-900 px-2 py-0.5 rounded border border-zinc-800 text-zinc-300 font-mono">
                        {c.name}
                      </span>
                    ))}
                  </div>

                  <div className="flex items-center justify-between pt-2 border-t border-zinc-900 text-[11px]">
                    <button
                      onClick={() => {
                        onSelectReading(reading);
                        onClose();
                      }}
                      className="px-3 py-1 rounded bg-[#DC143C] hover:bg-[#B81132] text-white font-bold text-xs uppercase tracking-wider transition-colors cursor-pointer font-mono"
                    >
                      {isSelected ? 'Loaded' : 'Load Reading'}
                    </button>

                    <button
                      onClick={() => setItemToDelete(reading.id)}
                      className="text-zinc-600 hover:text-red-400 text-xs font-mono transition-colors cursor-pointer"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {itemToDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-xs">
          <div className="bg-zinc-950 border border-zinc-800 p-6 rounded-2xl max-w-sm w-full mx-4 space-y-4">
            <h4 className="text-sm font-bold font-syne text-white uppercase tracking-wider">Delete Saved Reading?</h4>
            <p className="text-xs text-zinc-400 font-google-sans">This action cannot be undone.</p>
            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                onClick={() => setItemToDelete(null)}
                className="px-3 py-1.5 rounded-lg bg-zinc-900 text-zinc-300 hover:text-white text-xs font-mono uppercase cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  deletePastSpreadReading(itemToDelete);
                  setItemToDelete(null);
                  refreshReadings();
                }}
                className="px-3 py-1.5 rounded-lg bg-red-600 hover:bg-red-700 text-white font-bold text-xs font-mono uppercase cursor-pointer"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Clear All Confirmation Modal */}
      {confirmClearAll && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-xs">
          <div className="bg-zinc-950 border border-zinc-800 p-6 rounded-2xl max-w-sm w-full mx-4 space-y-4">
            <h4 className="text-sm font-bold font-syne text-white uppercase tracking-wider">Clear All Archives?</h4>
            <p className="text-xs text-zinc-400 font-google-sans">All past saved physical spread readings will be permanently deleted.</p>
            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                onClick={() => setConfirmClearAll(false)}
                className="px-3 py-1.5 rounded-lg bg-zinc-900 text-zinc-300 hover:text-white text-xs font-mono uppercase cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  clearAllPastSpreadReadings();
                  setConfirmClearAll(false);
                  refreshReadings();
                }}
                className="px-3 py-1.5 rounded-lg bg-red-600 hover:bg-red-700 text-white font-bold text-xs font-mono uppercase cursor-pointer"
              >
                Clear All
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
