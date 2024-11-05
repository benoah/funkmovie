// MovieModal.tsx

import React from "react";

type MovieModalProps = {
  movie: Movie;
  open: boolean;
  onClose: () => void;
  autoPlay: boolean;
};
type Movie = {
  id: number;
  title: string;
  poster_path: string;
  backdrop_path: string;
  release_date: string;
  vote_average: number;
  overview: string;
  genre_ids: number[];
  original_language: string;
  production_countries?: { iso_3166_1: string; name: string }[];
};

type Genre = {
  id: number;
  name: string;
};

const MovieModal: React.FC<MovieModalProps> = ({
  movie,
  open,
  onClose,
  autoPlay,
}) => {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-auto bg-black bg-opacity-75 flex">
      <div className="relative p-8 bg-white w-full max-w-md m-auto flex-col flex rounded-lg">
        <button
          onClick={onClose}
          className="absolute top-2 right-2 text-gray-600 hover:text-gray-800"
          aria-label="Close modal"
        >
          <svg
            className="w-6 h-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>
        <h2 className="text-2xl font-bold mb-4">{movie.title}</h2>
        <p className="mb-4">{movie.overview}</p>
        {/* You can include more details like genres, release date, etc. */}
        {/* Example: */}
        <p className="mb-2">
          <strong>Release Date:</strong> {movie.release_date}
        </p>
        <p className="mb-2">
          <strong>Rating:</strong> {movie.vote_average}/10
        </p>
        {/* If you have genre names, you can display them here */}
        {/* If you have a video player, you can include it here */}
      </div>
    </div>
  );
};

export default MovieModal;
