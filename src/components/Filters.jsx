import React from 'react';

export function Filters({ 
  activeFilter, 
  onFilterChange, 
  searchQuery, 
  onSearchChange 
}) {
  return (
    <div className="filters">
      <div className="filter-buttons">
        <button
          className={`filter-button ${activeFilter === 'all' ? 'active' : ''}`}
          onClick={() => onFilterChange('all')}
        >
          Все
        </button>
        <button
          className={`filter-button ${activeFilter === 'today' ? 'active' : ''}`}
          onClick={() => onFilterChange('today')}
        >
          Сегодня
        </button>
        <button
          className={`filter-button ${activeFilter === 'tomorrow' ? 'active' : ''}`}
          onClick={() => onFilterChange('tomorrow')}
        >
          Завтра
        </button>
      </div>
      
      <div className="search-container">
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder="Поиск задач..."
          className="search-input"
        />
        <span className="search-icon">🔍</span>
      </div>
    </div>
  );
}

