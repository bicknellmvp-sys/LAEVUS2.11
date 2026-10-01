export interface SpreadCardData {
  name: string;
  symbol: string;
  description: string;
  meaning: string;
  image: string;
}

export interface PastSpreadSlotCard {
  slot: 'slotA' | 'slotB' | 'slotC' | 'slotD' | string;
  positionName: string;
  card: SpreadCardData;
}

export interface PastSpreadReading {
  id: string;
  date: string;
  formattedDate: string;
  question: string;
  hasQuestion?: boolean;
  includeInsightCard?: boolean;
  cards: PastSpreadSlotCard[];
  readingText: string;
  voiceSettings: {
    persona: string;
    pitch: number;
    speed: number;
    enabled?: boolean;
  };
  notes?: string;
}

export const getPastSpreadReadings = (): PastSpreadReading[] => {
  try {
    const data = localStorage.getItem('laevus_past_spread_readings_v1');
    if (!data) return [];
    return JSON.parse(data);
  } catch (e) {
    return [];
  }
};

export const savePastSpreadReading = (reading: Omit<PastSpreadReading, 'id' | 'date' | 'formattedDate'>): PastSpreadReading => {
  const readings = getPastSpreadReadings();
  const now = new Date();
  const newReading: PastSpreadReading = {
    ...reading,
    id: crypto.randomUUID(),
    date: now.toISOString(),
    formattedDate: now.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric', hour: '2-digit', minute: '2-digit' })
  };
  readings.unshift(newReading);
  localStorage.setItem('laevus_past_spread_readings_v1', JSON.stringify(readings));
  window.dispatchEvent(new Event('laevus_past_readings_updated'));
  return newReading;
};

export const deletePastSpreadReading = (id: string): void => {
  const readings = getPastSpreadReadings().filter(r => r.id !== id);
  localStorage.setItem('laevus_past_spread_readings_v1', JSON.stringify(readings));
  window.dispatchEvent(new Event('laevus_past_readings_updated'));
};

export const clearAllPastSpreadReadings = (): void => {
  localStorage.removeItem('laevus_past_spread_readings_v1');
  window.dispatchEvent(new Event('laevus_past_readings_updated'));
};

export const exportPastSpreadReadings = (): void => {
  const readings = getPastSpreadReadings();
  const blob = new Blob([JSON.stringify(readings, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `laevus-past-spreads-${new Date().toISOString().slice(0, 10)}.json`;
  a.click();
  URL.revokeObjectURL(url);
};

export const updatePastSpreadReadingNotes = (id: string, notes: string): void => {
  const readings = getPastSpreadReadings();
  const updated = readings.map(r => r.id === id ? { ...r, notes } : r);
  localStorage.setItem('laevus_past_spread_readings_v1', JSON.stringify(updated));
  window.dispatchEvent(new Event('laevus_past_readings_updated'));
};
