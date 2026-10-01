// Speech-to-Text (STT) Service using Web Speech API with permission handling

export interface SpeechRecognitionResultHandler {
  onResult: (text: string, isFinal: boolean) => void;
  onError?: (error: string) => void;
  onEnd?: () => void;
  onStart?: () => void;
}

export class SpeechToTextEngine {
  private recognition: any = null;
  private isListeningState: boolean = false;
  private currentHandler: SpeechRecognitionResultHandler | null = null;
  private activeStream: MediaStream | null = null;

  constructor() {
    this.initRecognition();
  }

  private initRecognition() {
    if (typeof window !== 'undefined') {
      const SpeechRecognition =
        (window as any).SpeechRecognition ||
        (window as any).webkitSpeechRecognition;

      if (SpeechRecognition) {
        try {
          this.recognition = new SpeechRecognition();
          this.recognition.continuous = true;
          this.recognition.interimResults = true;
          this.recognition.lang = 'en-US';

          this.recognition.onstart = () => {
            this.isListeningState = true;
            if (this.currentHandler?.onStart) {
              this.currentHandler.onStart();
            }
          };

          this.recognition.onresult = (event: any) => {
            let finalTranscript = '';
            let interimTranscript = '';

            for (let i = 0; i < event.results.length; ++i) {
              const res = event.results[i];
              if (res && res[0]) {
                if (res.isFinal) {
                  finalTranscript += res[0].transcript + ' ';
                } else {
                  interimTranscript += res[0].transcript;
                }
              }
            }

            const combined = (finalTranscript + interimTranscript).trim();
            if (this.currentHandler && combined) {
              this.currentHandler.onResult(combined, Boolean(finalTranscript.trim()));
            }
          };

          this.recognition.onerror = (event: any) => {
            console.warn('Speech recognition notice:', event.error);
            let friendlyError = 'Microphone notice: ' + (event.error || 'Recognition ended');
            
            if (event.error === 'not-allowed' || event.error === 'service-not-allowed') {
              friendlyError = 'Microphone access denied. Please click the camera/microphone icon in your address bar and allow access, or open the app in a new tab.';
            } else if (event.error === 'no-speech') {
              friendlyError = 'No speech detected. Please speak closer to your microphone and try again.';
            } else if (event.error === 'audio-capture') {
              friendlyError = 'No microphone found or your microphone is in use by another program.';
            } else if (event.error === 'network') {
              friendlyError = 'Speech recognition network error. Please verify your connection.';
            }

            if (this.currentHandler?.onError) {
              this.currentHandler.onError(friendlyError);
            }
            this.isListeningState = false;
            this.cleanupStream();
          };

          this.recognition.onend = () => {
            this.isListeningState = false;
            this.cleanupStream();
            if (this.currentHandler?.onEnd) {
              this.currentHandler.onEnd();
            }
          };
        } catch (e) {
          console.warn('Failed to initialize SpeechRecognition instance:', e);
          this.recognition = null;
        }
      }
    }
  }

  private cleanupStream() {
    if (this.activeStream) {
      try {
        this.activeStream.getTracks().forEach((track) => track.stop());
      } catch {
        // ignore
      }
      this.activeStream = null;
    }
  }

  public isSupported(): boolean {
    if (typeof window === 'undefined') return false;
    return Boolean(
      (window as any).SpeechRecognition ||
      (window as any).webkitSpeechRecognition
    );
  }

  public isListening(): boolean {
    return this.isListeningState;
  }

  public async start(handler: SpeechRecognitionResultHandler): Promise<boolean> {
    if (!this.recognition) {
      this.initRecognition();
    }

    if (!this.recognition) {
      if (handler.onError) {
        handler.onError(
          'Speech recognition is not supported in this browser. Please try Chrome, Edge, or Safari, or open the app in a new tab.'
        );
      }
      return false;
    }

    // Stop any existing instance
    if (this.isListeningState) {
      this.stop();
    }

    this.currentHandler = handler;

    // Proactively request browser microphone permission via getUserMedia
    if (typeof navigator !== 'undefined' && navigator.mediaDevices?.getUserMedia) {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        this.activeStream = stream;
      } catch (err: any) {
        console.warn('Microphone permission check returned error:', err);
        if (err.name === 'NotAllowedError' || err.name === 'PermissionDeniedError') {
          if (handler.onError) {
            handler.onError(
              'Microphone access was blocked. Please allow microphone permissions in your browser or address bar.'
            );
          }
          return false;
        }
      }
    }

    try {
      this.recognition.start();
      this.isListeningState = true;
      return true;
    } catch (err: any) {
      console.warn('Speech recognition start failed:', err);
      // If error indicates already started, reset
      try {
        this.recognition.abort();
      } catch {
        // ignore
      }
      this.isListeningState = false;
      this.cleanupStream();
      
      // Attempt single retry after abort
      try {
        setTimeout(() => {
          try {
            this.recognition.start();
            this.isListeningState = true;
          } catch {
            this.isListeningState = false;
          }
        }, 150);
        return true;
      } catch {
        if (handler.onError) {
          handler.onError('Could not activate microphone. Please try clicking again.');
        }
        return false;
      }
    }
  }

  public stop(): void {
    this.isListeningState = false;
    if (this.recognition) {
      try {
        this.recognition.stop();
      } catch {
        try {
          this.recognition.abort();
        } catch {
          // ignore
        }
      }
    }
    this.cleanupStream();
    if (this.currentHandler?.onEnd) {
      this.currentHandler.onEnd();
    }
  }
}

export const speechToTextEngine = new SpeechToTextEngine();

