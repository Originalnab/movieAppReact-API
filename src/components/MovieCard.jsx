import React from 'react'

const MovieCard = ({ movie, onClick }) => {
    const POSTER_BASE_URL = 'https://image.tmdb.org/t/p/w500';

    return (
        <div className="movie-card" onClick={() => onClick(movie)}>
            <img
                src={movie.poster_path ? `${POSTER_BASE_URL}${movie.poster_path}` : '/no-movie.png'}
                alt={movie.title}
            />
            <div className="content">
                <h3>{movie.title}</h3>
                <div className="rating">
                    <img src="/star.svg" alt="rating" />
                    <p>{movie.vote_average.toFixed(1)}</p>
                    <span>({movie.vote_count} votes)</span>
                </div>
                <div className="details">
                    <span className="year">{new Date(movie.release_date).getFullYear()}</span>
                    <span className="lang">{movie.original_language.toUpperCase()}</span>
                </div>
            </div>
        </div>
    )
}

export default MovieCard
