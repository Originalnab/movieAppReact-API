import React from 'react';

const MovieDetails = ({ movie }) => {
    const posterUrl = movie.poster_path
        ? `https://image.tmdb.org/t/p/w500${movie.poster_path}`
        : '/no-movie.png';

    return (
        <div className="movie-details">
            <div className="movie-details-content">
                <div className="movie-poster">
                    <img src={posterUrl} alt={movie.title} />
                </div>
                <div className="movie-info">
                    <h2>{movie.title}</h2>
                    <div className="movie-meta">
                        <span className="release-date">{new Date(movie.release_date).getFullYear()}</span>
                        <span className="rating">
                            <img src="/star.svg" alt="rating" />
                            {movie.vote_average.toFixed(1)}
                        </span>
                        <span className="language">{movie.original_language.toUpperCase()}</span>
                    </div>
                    <p className="overview">{movie.overview}</p>
                    <div className="additional-info">
                        <div className="info-item">
                            <span className="label">Release Date:</span>
                            <span>{new Date(movie.release_date).toLocaleDateString()}</span>
                        </div>
                        <div className="info-item">
                            <span className="label">Vote Count:</span>
                            <span>{movie.vote_count}</span>
                        </div>
                        <div className="info-item">
                            <span className="label">Popularity:</span>
                            <span>{movie.popularity.toFixed(1)}</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default MovieDetails;
