import { useState, useEffect } from 'react';
import { DisputeCase, EvidenceItem, TimelineEvent, CaseStatus } from '../types/case';
import { INITIAL_MOCK_CASES } from '../data/mockCases';

const STORAGE_KEY = 'resolveit_cases_v1';

export function useCaseStore() {
  const [cases, setCases] = useState<DisputeCase[]>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        return JSON.parse(stored);
      }
    } catch (e) {
      console.warn('Failed to parse stored cases, using initial demo', e);
    }
    return INITIAL_MOCK_CASES;
  });

  const [activeCaseId, setActiveCaseId] = useState<string | null>(cases[0]?.id || null);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(cases));
    } catch (e) {
      console.error('Failed to persist cases to localStorage', e);
    }
  }, [cases]);

  const activeCase = cases.find(c => c.id === activeCaseId) || cases[0] || null;

  const createCase = (newCase: DisputeCase) => {
    setCases(prev => [newCase, ...prev]);
    setActiveCaseId(newCase.id);
  };

  const updateCase = (id: string, updates: Partial<DisputeCase>) => {
    setCases(prev =>
      prev.map(c => (c.id === id ? { ...c, ...updates, updatedAt: new Date().toISOString().split('T')[0] } : c))
    );
  };

  const deleteCase = (id: string) => {
    setCases(prev => {
      const filtered = prev.filter(c => c.id !== id);
      if (activeCaseId === id) {
        setActiveCaseId(filtered[0]?.id || null);
      }
      return filtered;
    });
  };

  const toggleActionStep = (caseId: string, stepId: string) => {
    setCases(prev =>
      prev.map(c => {
        if (c.id !== caseId) return c;
        const updatedSteps = c.actionSteps.map(step =>
          step.id === stepId ? { ...step, isCompleted: !step.isCompleted } : step
        );
        return { ...c, actionSteps: updatedSteps };
      })
    );
  };

  const addEvidence = (caseId: string, item: EvidenceItem) => {
    setCases(prev =>
      prev.map(c => {
        if (c.id !== caseId) return c;
        return {
          ...c,
          evidence: [...c.evidence, item],
          updatedAt: new Date().toISOString().split('T')[0]
        };
      })
    );
  };

  const addTimelineEvent = (caseId: string, event: TimelineEvent) => {
    setCases(prev =>
      prev.map(c => {
        if (c.id !== caseId) return c;
        const newTimeline = [...c.timeline, event].sort(
          (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
        );
        return {
          ...c,
          timeline: newTimeline,
          updatedAt: new Date().toISOString().split('T')[0]
        };
      })
    );
  };

  const updateCaseStatus = (caseId: string, status: CaseStatus) => {
    updateCase(caseId, { status });
  };

  const resetToDemo = () => {
    setCases(INITIAL_MOCK_CASES);
    setActiveCaseId(INITIAL_MOCK_CASES[0].id);
    localStorage.removeItem(STORAGE_KEY);
  };

  return {
    cases,
    activeCase,
    activeCaseId,
    setActiveCaseId,
    createCase,
    updateCase,
    deleteCase,
    toggleActionStep,
    addEvidence,
    addTimelineEvent,
    updateCaseStatus,
    resetToDemo
  };
}
