import React, { useEffect, useState } from 'react';
import Search from './components/Search.jsx';
import MovieCard from './components/MovieCard.jsx';
import SkeletonCard from './components/SkeletonCard.jsx';
import Modal from './components/Modal.jsx';
import MovieDetails from './components/MovieDetails.jsx';

//Api - application programming interface = 
// a set of rules that allows one piece of software to interact with another.

const API_BASE_URL = 'https://api.themoviedb.org/3';
const API_KEY = import.meta.env.VITE_TMDB_API_KEY; // Use Vite's environment variable
const API_OPTIONS = {
  method: 'GET',
  headers: {
    accept: 'application/json',
    Authorization: `Bearer ${API_KEY}`
  },
}


const App = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [movieList, setMovieList] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedMovie, setSelectedMovie] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [trendingMovies, setTrendingMovies] = useState([]);
  const [newReleases, setNewReleases] = useState([]);
  const [mostWatched, setMostWatched] = useState([]);
  const [isLoadingNewReleases, setIsLoadingNewReleases] = useState(true);

  const fetchMovies = async (endpoint) => {
    const response = await fetch(endpoint, API_OPTIONS);
    if (!response.ok) throw new Error('Failed to fetch movies');
    return response.json();
  };

  const searchMovies = async (query) => {
    setIsLoading(true);
    setErrorMessage('');
    try {
      const endpoint = query
        ? `${API_BASE_URL}/search/movie?query=${encodeURIComponent(query)}&include_adult=false&language=en-US&page=${currentPage}`
        : `${API_BASE_URL}/discover/movie?sort_by=popularity.desc&page=${currentPage}`;
      const response = await fetchMovies(endpoint);

      if (!response.results || response.results.length === 0) {
        setErrorMessage('No movies found');
        setMovieList([]);
        return;
      }

      setMovieList(response.results);
      setTotalPages(response.total_pages);
    } catch (error) {
      console.error("Error fetching movies:", error);
      setErrorMessage('Failed to fetch movies. Please try again later.');
      setMovieList([]);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchTrendingMovies = async () => {
    try {
      const data = await fetchMovies(`${API_BASE_URL}/trending/movie/week`);
      setTrendingMovies(data.results);
    } catch (error) {
      console.error("Error fetching trending movies:", error);
    }
  };

  const fetchNewReleases = async () => {
    setIsLoadingNewReleases(true);
    try {
      const today = new Date().toISOString().split('T')[0];
      const monthAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];
      const data = await fetchMovies(
        `${API_BASE_URL}/discover/movie?primary_release_date.gte=${monthAgo}&primary_release_date.lte=${today}&sort_by=release_date.desc&include_adult=false&include_video=false&with_runtime.gte=0&vote_count.gte=10&with_poster=true`
      );
      // Filter out any movies that might still not have posters
      const moviesWithPosters = data.results.filter(movie => movie.poster_path);
      setNewReleases(moviesWithPosters);
    } catch (error) {
      console.error("Error fetching new releases:", error);
    } finally {
      setIsLoadingNewReleases(false);
    }
  };

  const fetchMostWatched = async () => {
    try {
      const data = await fetchMovies(
        `${API_BASE_URL}/discover/movie?sort_by=vote_count.desc`
      );
      setMostWatched(data.results);
    } catch (error) {
      console.error("Error fetching most watched movies:", error);
    }
  };

  useEffect(() => {
    const delayDebounce = setTimeout(() => {
      searchMovies(searchTerm);
    }, 500);

    return () => clearTimeout(delayDebounce);
  }, [searchTerm, currentPage]);

  useEffect(() => {
    fetchTrendingMovies();
    fetchNewReleases();
    fetchMostWatched();
  }, []);

  const renderMovieSection = (title, movies, isLoading = false) => (
    <section className="movie-section">
      <h2>{title}</h2>
      <div className="movie-rows">
        <div className="movie-row">
          {movies.slice(0, 5).map((movie) => (
            <MovieCard key={movie.id} movie={movie} onClick={setSelectedMovie} />
          ))}
        </div>
        <div className="movie-row">
          {movies.slice(5, 10).map((movie) => (
            <MovieCard key={movie.id} movie={movie} onClick={setSelectedMovie} />
          ))}
        </div>
      </div>
    </section>
  );

  const renderPagination = () => (
    <div className="pagination">
      <button
        onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
        disabled={currentPage === 1}
        className="pagination-button"
      >
        Previous
      </button>
      <span className="page-info">Page {currentPage} of {totalPages}</span>
      <button
        onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
        disabled={currentPage === totalPages}
        className="pagination-button"
      >
        Next
      </button>
    </div>
  );

  return (
    <main>
      <div className='pattern' />
      <div className='wrapper'>
        <header>
          <img src="/hero.png" alt="Hero Banner" />
          <h1>Find <span className="text-gradient">Movies </span>You'll Enjoy without the Hustle</h1>
          <Search searchTerm={searchTerm} setSearchTerm={setSearchTerm} />
        </header>

        {!searchTerm && (
          <>
            {renderMovieSection("Trending This Week", trendingMovies)}
            {isLoadingNewReleases ? (
              <section className="movie-section">
                <h2>New Releases</h2>
                <div className="movie-rows">
                  <div className="movie-row">
                    {[...Array(5)].map((_, index) => (
                      <SkeletonCard key={`skeleton-new-1-${index}`} />
                    ))}
                  </div>
                  <div className="movie-row">
                    {[...Array(5)].map((_, index) => (
                      <SkeletonCard key={`skeleton-new-2-${index}`} />
                    ))}
                  </div>
                </div>
              </section>
            ) : (
              renderMovieSection("New Releases", newReleases)
            )}
            {renderMovieSection("Most Watched", mostWatched)}
          </>
        )}

        <section className='all-movies'>
          <h2>{searchTerm ? 'Search Results' : 'All Movies'}</h2>

          {isLoading ? (
            <ul>
              {[...Array(8)].map((_, index) => (
                <li key={`skeleton-${index}`}>
                  <SkeletonCard />
                </li>
              ))}
            </ul>
          ) : errorMessage ? (
            <div className='error'>
              <p className='text-red-500'>{errorMessage}</p>
            </div>
          ) : (
            <>
              <ul>
                {movieList.map((movie) => (
                  <li key={movie.id}>
                    <MovieCard movie={movie} onClick={setSelectedMovie} />
                  </li>
                ))}
              </ul>
              {renderPagination()}
            </>
          )}
        </section>
      </div>

      <Modal isOpen={!!selectedMovie} onClose={() => setSelectedMovie(null)}>
        {selectedMovie && <MovieDetails movie={selectedMovie} />}
      </Modal>
    </main>
  );
}

export default App;

