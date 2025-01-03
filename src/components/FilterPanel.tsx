import React from 'react';
import { FilterPanelProps } from '../types';

export default function FilterPanel({ questions, searchParams, setSearchParams }: FilterPanelProps) {
  const specialties = [...new Set(questions.map(q => q.specialty))].sort();
  const difficulties = ['easy', 'medium', 'hard', 'ultra-hard'];

  const handleSpecialtyChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const selected = Array.from(event.target.selectedOptions).map(opt => opt.value);
    const newParams = new URLSearchParams(searchParams);
    newParams.delete('specialty');
    selected.forEach(s => newParams.append('specialty', s));
    setSearchParams(newParams);
  };

  const handleDifficultyChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const selected = Array.from(event.target.selectedOptions).map(opt => opt.value);
    const newParams = new URLSearchParams(searchParams);
    newParams.delete('difficulty');
    selected.forEach(d => newParams.append('difficulty', d));
    setSearchParams(newParams);
  };

  const handleViewedChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const newParams = new URLSearchParams(searchParams);
    if (event.target.value === 'all') {
      newParams.delete('viewed');
    } else {
      newParams.set('viewed', event.target.value);
    }
    setSearchParams(newParams);
  };

  const toggleAll = (selectId: string, paramName: string) => {
    const select = document.getElementById(selectId) as HTMLSelectElement;
    const allSelected = Array.from(select.options).every(opt => opt.selected);
    const newParams = new URLSearchParams(searchParams);
    
    // Clear existing params for this filter
    newParams.delete(paramName);
    
    if (!allSelected) {
      // If not all selected, select all options
      Array.from(select.options).forEach(opt => {
        newParams.append(paramName, opt.value);
      });
    }
    // If all were selected, we've already cleared the params above
    
    setSearchParams(newParams);
  };

  return (
    <div className="filters">
      <div className="filter-group">
        <label htmlFor="specialty">Filter by Specialty:</label>
        <button className="toggle-all" onClick={() => toggleAll('specialty', 'specialty')}>
          Select All/None
        </button>
        <select
          id="specialty"
          multiple
          value={searchParams.getAll('specialty')}
          onChange={handleSpecialtyChange}
        >
          {specialties.map(specialty => (
            <option key={specialty} value={specialty}>
              {specialty.charAt(0).toUpperCase() + specialty.slice(1)}
            </option>
          ))}
        </select>
      </div>

      <div className="filter-group">
        <label htmlFor="difficulty">Filter by Difficulty:</label>
        <button className="toggle-all" onClick={() => toggleAll('difficulty', 'difficulty')}>
          Select All/None
        </button>
        <select
          id="difficulty"
          multiple
          value={searchParams.getAll('difficulty')}
          onChange={handleDifficultyChange}
        >
          {difficulties.map(difficulty => (
            <option key={difficulty} value={difficulty}>
              {difficulty.charAt(0).toUpperCase() + difficulty.slice(1)}
            </option>
          ))}
        </select>
      </div>

      <div className="filter-group">
        <label htmlFor="viewedFilter">Filter by Viewed:</label>
        <select
          id="viewedFilter"
          value={searchParams.get('viewed') || 'all'}
          onChange={handleViewedChange}
        >
          <option value="all">All Questions</option>
          <option value="viewed">Viewed Only</option>
              <option value="unviewed">Unviewed Only</option>

        </select>
      </div>
    </div>
  );
};
