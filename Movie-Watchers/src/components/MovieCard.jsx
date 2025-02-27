import React from "react";

const MovieCard = ({ movie }) => {
  const { title, vote_average, poster_path, release_date, original_language } =
    movie;
  return (
    <div className="movie-card p-2">
      <img
        src={
          poster_path
            ? `https://image.tmdb.org/t/p/w500/${poster_path}`
            : `/no-movie.png`
        }
        alt={title}
      />
      <div className="mt-4">
        <h3>{title}</h3>
        <div className="content">
          <div className="rating">
            <img src="star.svg" alt="Star Icon" />
            <p>{vote_average ? vote_average.toFixed(1) : `N/A`}</p>
          </div>
          <span>|</span>
          <p className="lang font-bold text-white">{original_language}</p>
          <span>|</span>
          <p className="year font-bold text-white">
            {release_date ? release_date.slice(0, 4) : `N/A`}
          </p>
        </div>
      </div>
    </div>
  );
};

export default MovieCard;
