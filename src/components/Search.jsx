import React from 'react'

const Search = ({ searchTerm, setSearchTerm }) => {
    const handleSearch = (e) => {
        setSearchTerm(e.target.value);
    };

    return (
        <div className='search'>
            <div>
                <img src="/search.svg" alt="search" />
                <input
                    type="text"
                    placeholder='Search for movies...'
                    value={searchTerm}
                    onChange={handleSearch}
                    className='text-white'
                />
                {searchTerm && (
                    <button
                        onClick={() => setSearchTerm('')}
                        className="clear-button"
                        aria-label="Clear search"
                    >
                        ×
                    </button>
                )}
            </div>
        </div>
    )
}

export default Search