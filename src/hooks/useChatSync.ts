import React, { useEffect, useRef } from 'react';
import { db } from '../../services/firebase';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { User } from 'firebase/auth';
import { handleFirestoreError, OperationType } from '../../services/firebaseErrors';

interface Message {
  id: string;
  role: 'user' | 'model';
  text: string;
  timestamp: Date;
  mode?: 'laevus' | 'tarot' | 'tarot-persona' | 'tarot-physical';
}

interface TranscriptRecord {
  id: string;
  category: 'tarot' | 'madam' | string;
  title: string;
  date: string;
  content: string;
  querentPrompt?: string;
  drawnCards?: any[];
  madamBlavatskyReply?: string;
}

interface UseChatSyncProps {
  currentUser: User | null;
  messages: Message[];
  setMessages: React.Dispatch<React.SetStateAction<Message[]>>;
  transcripts: TranscriptRecord[];
  setTranscripts: React.Dispatch<React.SetStateAction<TranscriptRecord[]>>;
  sentimentScores: number[];
  setSentimentScores: React.Dispatch<React.SetStateAction<number[]>>;
  readingCount: number;
  setReadingCount: React.Dispatch<React.SetStateAction<number>>;
  setIsLoadingHistory?: (loading: boolean) => void;
}

export const useChatSync = ({
  currentUser,
  messages,
  setMessages,
  transcripts,
  setTranscripts,
  sentimentScores,
  setSentimentScores,
  readingCount,
  setReadingCount,
  setIsLoadingHistory
}: UseChatSyncProps) => {
  const isInitialLoad = useRef(true);
  const lastSavedPayload = useRef<string>('');

  // 1. Load chat history from Firestore on initial mount when user logs in
  useEffect(() => {
    if (!currentUser) {
      isInitialLoad.current = true;
      return;
    }

    const loadHistory = async () => {
      const userPath = `users/${currentUser.uid}`;
      if (setIsLoadingHistory) setIsLoadingHistory(true);
      try {
        const docRef = doc(db, 'users', currentUser.uid);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          const data = docSnap.data();
          if (data.messages && Array.isArray(data.messages) && data.messages.length > 0) {
            const parsedMessages: Message[] = data.messages.map((m: any) => ({
              ...m,
              timestamp: m.timestamp ? new Date(m.timestamp) : new Date()
            }));
            setMessages(parsedMessages);
          }
          if (data.transcripts && Array.isArray(data.transcripts)) {
            setTranscripts(data.transcripts);
          }
          if (data.sentimentScores && Array.isArray(data.sentimentScores)) {
            setSentimentScores(data.sentimentScores);
          }
          if (typeof data.readingCount === 'number') {
            setReadingCount(data.readingCount);
          }
        }
      } catch (error) {
        handleFirestoreError(error, OperationType.GET, userPath);
      } finally {
        if (setIsLoadingHistory) setIsLoadingHistory(false);
        isInitialLoad.current = false;
      }
    };

    loadHistory();
  }, [currentUser?.uid]);

  // 2. Save chat history periodically (every 15 seconds) or when changes occur
  useEffect(() => {
    if (!currentUser || isInitialLoad.current) return;

    const saveHistory = async () => {
      const userPath = `users/${currentUser.uid}`;
      const payload = JSON.stringify({
        messages: messages.map(m => ({ ...m, timestamp: m.timestamp.toISOString() })),
        transcripts,
        sentimentScores,
        readingCount,
        updatedAt: new Date().toISOString()
      });

      if (payload === lastSavedPayload.current) return;

      try {
        const docRef = doc(db, 'users', currentUser.uid);
        await setDoc(docRef, {
          uid: currentUser.uid,
          email: currentUser.email || '',
          messages: messages.map(m => ({ ...m, timestamp: m.timestamp.toISOString() })),
          transcripts,
          sentimentScores,
          readingCount,
          lastActiveAt: new Date().toISOString()
        }, { merge: true });

        lastSavedPayload.current = payload;
      } catch (error) {
        handleFirestoreError(error, OperationType.WRITE, userPath);
      }
    };

    // Periodic sync interval (every 15 seconds)
    const intervalId = setInterval(saveHistory, 15000);

    const handleBeforeUnload = () => {
      saveHistory();
    };
    window.addEventListener('beforeunload', handleBeforeUnload);

    return () => {
      clearInterval(intervalId);
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, [currentUser, messages, transcripts, sentimentScores, readingCount]);
};
