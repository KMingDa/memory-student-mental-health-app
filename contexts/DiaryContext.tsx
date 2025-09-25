import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { createContext, useContext, useEffect, useState } from 'react';

interface DiaryContextType {
  diaryEntries: {[key: string]: string};
  updateDiaryEntry: (date: string, text: string) => void;
  getDiaryEntry: (date: string) => string;
}

const DiaryContext = createContext<DiaryContextType | undefined>(undefined);

export const DiaryProvider: React.FC<{children: React.ReactNode}> = ({ children }) => {
  const [diaryEntries, setDiaryEntries] = useState<{[key: string]: string}>({});

  useEffect(() => {
    loadEntries();
  }, []);

  useEffect(() => {
    saveEntries();
  }, [diaryEntries]);

  const loadEntries = async () => {
    try {
      const stored = await AsyncStorage.getItem('diaryEntries');
      if (stored) {
        setDiaryEntries(JSON.parse(stored));
      }
    } catch (error) {
      console.error('Error loading entries:', error);
    }
  };

  const saveEntries = async () => {
    try {
      await AsyncStorage.setItem('diaryEntries', JSON.stringify(diaryEntries));
    } catch (error) {
      console.error('Error saving entries:', error);
    }
  };

  const updateDiaryEntry = (date: string, text: string) => {
    setDiaryEntries(prev => ({
      ...prev,
      [date]: text
    }));
  };

  const getDiaryEntry = (date: string) => {
    return diaryEntries[date] || '';
  };

  return (
    <DiaryContext.Provider value={{
      diaryEntries,
      updateDiaryEntry,
      getDiaryEntry
    }}>
      {children}
    </DiaryContext.Provider>
  );
};

export const useDiary = () => {
  const context = useContext(DiaryContext);
  if (!context) {
    throw new Error('useDiary must be used within DiaryProvider');
  }
  return context;
};
