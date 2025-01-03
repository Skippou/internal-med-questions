import React from 'react';
import { Link } from 'react-router-dom';
import { QuestionCardProps } from '../types';

export default function QuestionCard({ question, isViewed, onView }: QuestionCardProps) {
  const handleUnmarkViewed = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    const viewedQuestions = JSON.parse(localStorage.getItem('viewedQuestions') || '[]');
    // Normalize the path to match how it's stored
    const normalizedPath = question.filepath.split('/').filter(Boolean).join('/');
    const newViewed = viewedQuestions.filter((path: string) => path !== normalizedPath);
    localStorage.setItem('viewedQuestions', JSON.stringify(newViewed));
    
    // Dispatch both storage and custom event
    window.dispatchEvent(new Event('storage'));
    window.dispatchEvent(new Event('viewedStatusUpdate'));
  };

  return (
    <div className={`question-item ${isViewed ? 'viewed' : ''}`}>
      <h3>
        {question.title}
        {isViewed && (
          <span className="viewed-controls">
            <span className="viewed-indicator">Viewed</span>
            <button className="unmark-viewed" onClick={handleUnmarkViewed} title="Unmark as viewed">×</button>
          </span>
        )}
      </h3>
      <p>Specialty: {question.specialty}</p>
      <p>Topic: {question.topic}</p>
      <p>Difficulty: {question.difficulty}</p>
      <Link 
        to={`/questions/${question.filepath.replace('questions/', '').replace('.md', '.html')}`}
        onClick={() => {
          // Store the full path including search params
          const currentPath = window.location.pathname.replace(/^\//, '');
          const searchParams = window.location.search;
          sessionStorage.setItem('lastFilterState', `${currentPath}${searchParams}`);
          onView();
        }}
      >
        View Question
      </Link>
    </div>
  );
}
