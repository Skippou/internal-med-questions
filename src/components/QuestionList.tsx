import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import FilterPanel from './FilterPanel';
import QuestionCard from './QuestionCard';
import { Question } from '../types';

export default function QuestionList() {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [searchParams, setSearchParams] = useSearchParams();
  const [viewedQuestions, setViewedQuestions] = useState<string[]>(() => {
    return JSON.parse(localStorage.getItem('viewedQuestions') || '[]');
  });

  useEffect(() => {
    const isGitHubPages = window.location.hostname.includes('github.io');
    const basePath = isGitHubPages ? '/internal-med-questions' : '';
    
    fetch(`${basePath}/questionIndex.json`)
      .then(res => res.json())
      .then(setQuestions);
  }, []);

  const filteredQuestions = questions.filter(question => {
    const selectedSpecialties = searchParams.getAll('specialty');
    const selectedDifficulties = searchParams.getAll('difficulty');
    const viewedFilter = searchParams.get('viewed') || 'all';

    const matchesSpecialty = selectedSpecialties.length === 0 || 
      selectedSpecialties.includes(question.specialty);
    const matchesDifficulty = selectedDifficulties.length === 0 || 
      selectedDifficulties.includes(question.difficulty);
    const matchesViewed = viewedFilter === 'all' || 
      (viewedFilter === 'viewed') === viewedQuestions.includes(question.filepath);

    return matchesSpecialty && matchesDifficulty && matchesViewed;
  });

  return (
    <div className="question-list">
      <h1>Internal Medicine Questions</h1>
      <FilterPanel 
        questions={questions}
        searchParams={searchParams}
        setSearchParams={setSearchParams}
      />
      <div id="questionCount" className="question-count">
        Showing {filteredQuestions.length} question{filteredQuestions.length !== 1 ? 's' : ''}
      </div>
      <div className="questions">
        {filteredQuestions.map(question => (
          <QuestionCard 
            key={question.filepath}
            question={question}
            isViewed={viewedQuestions.includes(question.filepath)}
            onView={() => {
              const newViewed = [...viewedQuestions, question.filepath];
              setViewedQuestions(newViewed);
              localStorage.setItem('viewedQuestions', JSON.stringify(newViewed));
            }}
          />
        ))}
      </div>
    </div>
  );
}
