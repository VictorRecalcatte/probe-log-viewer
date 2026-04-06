import { useState, useCallback } from 'react';
import { Inspection } from '@/types/inspection';

const STORAGE_KEY = 'robo-inspections';

function loadInspections(): Inspection[] {
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    return data ? JSON.parse(data) : [];
  } catch {
    return [];
  }
}

function saveInspections(inspections: Inspection[]) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(inspections));
}

export function useInspectionStore() {
  const [inspections, setInspections] = useState<Inspection[]>(loadInspections);

  const addInspection = useCallback((inspection: Inspection) => {
    setInspections(prev => {
      const next = [inspection, ...prev];
      saveInspections(next);
      return next;
    });
  }, []);

  const updateInspection = useCallback((id: string, updates: Partial<Inspection>) => {
    setInspections(prev => {
      const next = prev.map(i => i.id === id ? { ...i, ...updates } : i);
      saveInspections(next);
      return next;
    });
  }, []);

  const deleteInspection = useCallback((id: string) => {
    setInspections(prev => {
      const next = prev.filter(i => i.id !== id);
      saveInspections(next);
      return next;
    });
  }, []);

  const getInspection = useCallback((id: string) => {
    return inspections.find(i => i.id === id);
  }, [inspections]);

  return { inspections, addInspection, updateInspection, deleteInspection, getInspection };
}
