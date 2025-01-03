import { useMemo } from 'react';
import { Question } from '../types';

export function useFilteredQuestions(
  questions: Question[],
  selectedSpecialties: string[],
  selectedDifficulties: string[],
  viewedFilter: string,
  viewedQuestions: string[]
) {
  return useMemo(() => {
    let filtered = questions;
    
    if (selectedSpecialties.length > 0) {
      filtered = filtered.filter(q => selectedSpecialties.includes(q.specialty));
    }
    
    if (selectedDifficulties.length > 0) {
      filtered = filtered.filter(q => selectedDifficulties.includes(q.difficulty));
    }
    
    if (viewedFilter !== 'all') {
      filtered = filtered.filter(q => {
        const normalizedPath = q.filepath.split('/').filter(Boolean).join('/');
        const isViewed = viewedQuestions.includes(normalizedPath);
        return viewedFilter === 'viewed' ? isViewed : !isViewed;
      });
    }

    return filtered;
  }, [questions, selectedSpecialties, selectedDifficulties, viewedFilter, viewedQuestions]);
}
