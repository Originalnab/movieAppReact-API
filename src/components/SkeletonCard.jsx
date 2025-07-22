import React from 'react';

const SkeletonCard = () => {
    return (
        <div className="movie-card animate-pulse">
            <div className="skeleton-image"></div>
            <div className="content">
                <div className="skeleton-title"></div>
                <div className="skeleton-rating"></div>
                <div className="skeleton-details"></div>
            </div>
        </div>
    );
};

export default SkeletonCard;
