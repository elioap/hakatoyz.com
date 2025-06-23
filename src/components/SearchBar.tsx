import React, { useState } from 'react';

interface SearchBarProps {
  placeholder?: string;
  onSearch?: (query: string) => void;
  className?: string;
}

const SearchBar: React.FC<SearchBarProps> = ({ placeholder = "搜索商品...", onSearch, className = "" }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const handleSearch = () => {
    if (onSearch && searchQuery.trim()) {
      onSearch(searchQuery.trim());
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  const toggleSearch = () => {
    setIsOpen(!isOpen);
    if (isOpen) {
      setSearchQuery('');
    }
  };

  return (
    <div className={`search-container ${isOpen ? 'open' : ''} ${className}`}>
      {!isOpen ? (
        <button 
          className="search-icon-btn" 
          onClick={toggleSearch}
          aria-label="Open search"
        >
          <i className="fas fa-search" />
        </button>
      ) : (
        <>
          <input
            type="text"
            className="search-input"
            placeholder={placeholder}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyPress={handleKeyPress}
            autoFocus
          />
          <button 
            className="search-close-btn" 
            onClick={toggleSearch}
            aria-label="Close search"
          >
            <i className="fas fa-times" />
          </button>
        </>
      )}
    </div>
  );
};

export default SearchBar; 