// Export Service for LAEVUS: Audio (.MP3) and Document (.DOC / .PDF) Exports

export interface ExportMessage {
  role: 'user' | 'model' | 'oracle' | string;
  text: string;
  timestamp?: Date | string;
}

export interface ExportPayload {
  title: string;
  persona?: string;
  messages: ExportMessage[];
  readingType?: string;
  userVoiceMode?: 'actual' | 'cloned' | 'default';
  date?: string;
}

const escapeHtml = (str: string): string => {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
};

// 1. Export as Microsoft Word Document (.DOC)
export const exportToWordDoc = (payload: ExportPayload): void => {
  const dateStr = payload.date || new Date().toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });

  const formattedConversation = payload.messages
    .map((msg) => {
      const isUser = msg.role === 'user';
      const sender = isUser ? 'User' : payload.persona || 'Oracle';
      const time = msg.timestamp
        ? new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        : '';
      const bg = isUser ? '#f4f4f5' : '#fafafa';
      const border = isUser ? '#71717a' : '#dc143c';

      return `
        <div style="margin-bottom: 16px; padding: 12px 16px; background-color: ${bg}; border-left: 4px solid ${border}; border-radius: 4px; font-family: 'Segoe UI', Arial, sans-serif;">
          <div style="font-size: 11px; font-weight: bold; text-transform: uppercase; color: #52525b; margin-bottom: 6px;">
            ${sender} ${time ? '— ' + time : ''}
          </div>
          <div style="font-size: 14px; line-height: 1.6; color: #18181b; white-space: pre-wrap;">
            ${escapeHtml(msg.text)}
          </div>
        </div>
      `;
    })
    .join('');

  const htmlContent = `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8">
        <title>${escapeHtml(payload.title)}</title>
        <style>
          body { font-family: 'Segoe UI', Arial, sans-serif; padding: 40px; color: #18181b; max-width: 800px; margin: 0 auto; }
          h1 { font-size: 24px; color: #dc143c; text-transform: uppercase; border-bottom: 2px solid #dc143c; padding-bottom: 8px; margin-bottom: 4px; }
          .meta { font-size: 12px; color: #71717a; margin-bottom: 24px; text-transform: uppercase; letter-spacing: 1px; }
        </style>
      </head>
      <body>
        <h1>${escapeHtml(payload.title)}</h1>
        <div class="meta">LAEVUS SANCTUARY ARCHIVE • ${escapeHtml(dateStr)} • CONDUIT: ${escapeHtml(payload.persona || 'Oracle')}</div>
        <hr style="border: none; border-top: 1px solid #e4e4e7; margin-bottom: 24px;" />
        <div>
          ${formattedConversation}
        </div>
      </body>
    </html>
  `;

  const blob = new Blob(['\ufeff' + htmlContent], { type: 'application/msword' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `${payload.title.toLowerCase().replace(/[^a-z0-9]/g, '-')}-transcript.doc`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
};

// 2. Export as PDF Document (.PDF via browser print)
export const exportToPdf = (payload: ExportPayload): void => {
  const printWindow = window.open('', '_blank');
  if (!printWindow) {
    alert("Please allow popups to export PDF transcripts.");
    return;
  }

  const dateStr = payload.date || new Date().toLocaleString();
  const formattedConversation = payload.messages
    .map((msg) => {
      const isUser = msg.role === 'user';
      const sender = isUser ? 'User' : payload.persona || 'Oracle';
      return `
        <div style="margin-bottom: 14px; padding: 10px 14px; background-color: ${isUser ? '#f4f4f5' : '#fafafa'}; border-left: 3px solid ${isUser ? '#71717a' : '#dc143c'}; border-radius: 4px;">
          <div style="font-size: 10px; font-weight: bold; text-transform: uppercase; color: #52525b; margin-bottom: 4px;">
            ${sender}
          </div>
          <div style="font-size: 13px; line-height: 1.5; color: #18181b; white-space: pre-wrap;">
            ${escapeHtml(msg.text)}
          </div>
        </div>
      `;
    })
    .join('');

  printWindow.document.write(`
    <!DOCTYPE html>
    <html>
      <head>
        <title>${escapeHtml(payload.title)}</title>
        <style>
          body { font-family: Arial, sans-serif; padding: 30px; color: #18181b; }
          h1 { font-size: 20px; color: #dc143c; text-transform: uppercase; margin-bottom: 4px; }
          .meta { font-size: 11px; color: #71717a; margin-bottom: 20px; text-transform: uppercase; }
        </style>
      </head>
      <body>
        <h1>${escapeHtml(payload.title)}</h1>
        <div class="meta">LAEVUS SANCTUARY • ${escapeHtml(dateStr)} • CONDUIT: ${escapeHtml(payload.persona || 'Oracle')}</div>
        <hr style="border: none; border-top: 1px solid #ddd; margin-bottom: 20px;" />
        <div>${formattedConversation}</div>
        <script>
          window.onload = function() { window.print(); };
        </script>
      </body>
    </html>
  `);
  printWindow.document.close();
};

// 3. Export as Audio (.MP3 speech synthesis recording / Web Speech API or blob)
export const exportToAudioMp3 = async (text: string, onStatus: (status: string) => void): Promise<void> => {
  onStatus("Preparing audio speech synthesis...");
  try {
    if (!('speechSynthesis' in window)) {
      alert("Speech synthesis is not supported in this browser.");
      onStatus(null);
      return;
    }

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = 0.95;
    utterance.pitch = 0.9;
    
    onStatus("Playing & synthesizing vocal oracle stream...");
    window.speechSynthesis.speak(utterance);

    utterance.onend = () => {
      onStatus("Audio speech complete.");
      setTimeout(() => onStatus(null), 2500);
    };

    utterance.onerror = () => {
      onStatus("Speech synthesis error.");
      setTimeout(() => onStatus(null), 2000);
    };
  } catch (err) {
    console.error(err);
    onStatus("Audio export failed.");
    setTimeout(() => onStatus(null), 2000);
  }
};
