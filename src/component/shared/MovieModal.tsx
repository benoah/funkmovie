import React, { useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { StarIcon, CalendarIcon, HeartIcon } from "@heroicons/react/24/solid";

type MovieModalProps = {
  movie: Movie;
  open: boolean;
  onClose: () => void;
  autoPlay: boolean;
  genres: Genre[];
  likedMovies: Set<number>;
  toggleLike: (movieId: number) => void;
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
  genres,
  likedMovies,
  toggleLike,
}) => {
  // Close modal on Escape key press
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onClose();
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [onClose]);

  if (!open) return null;
  //Prevent click events from propagating to the overlay when clicking inside the modal
  const handleContentClick = (e: React.MouseEvent) => {
    e.stopPropagation();
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-[var(--overlay-color)] backdrop-blur-lg"
      onClick={onClose} // Close modal when clicking outside the content area
    >
      <motion.div
        className="relative w-full max-w-3xl rounded-lg overflow-hidden shadow-lg bg-gradientShift border border-[var(--border-color)]"
        onClick={handleContentClick}
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.9 }}
        transition={{ duration: 0.3 }}
      >
        <motion.button
          onClick={onClose}
          className="absolute top-3 right-3 text-[var(--text-color)] hover:text-[var(--hover-color)]"
          aria-label="Close modal"
          whileHover={{ scale: 1.2, rotate: 90 }}
          whileTap={{ scale: 0.9, rotate: -90 }}
          transition={{ type: "spring", stiffness: 300 }}
        >
          <svg
            className="w-6 h-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <motion.path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </motion.button>

        <div className="relative w-full h-[50vh]">
          <img
            src={`https://image.tmdb.org/t/p/original${movie.backdrop_path}`}
            alt={movie.title}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[var(--background-color)] via-transparent to-transparent z-10"></div>
        </div>

        <div className="p-6 relative z-20">
          <motion.h2
            className="text-[#ffb1b1] text-4xl font-bold drop-shadow-2xl mb-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            {movie.title}
          </motion.h2>

          <motion.div
            className="flex flex-wrap gap-3 mb-6"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            {movie.genre_ids.map((id) => (
              <span
                key={id}
                className="bg-[#ffb1b1] bg-opacity-20 text-white px-4 py-1.5 rounded-full text-sm shadow-sm"
              >
                {genres.find((genre) => genre.id === id)?.name}
              </span>
            ))}
          </motion.div>

          <motion.p
            className="text-lg text-[var(--text-color)] mb-8 leading-loose"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            {movie.overview}
          </motion.p>

          <motion.div
            className="flex flex-wrap items-center space-x-8 mb-10"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.5 }}
          >
            <span className="flex items-center text-white text-lg">
              <StarIcon className="h-6 w-6 text-[#ffb1b1] mr-2" />
              {movie.vote_average.toFixed(1)}/10
            </span>
            <span className="flex items-center text-white text-lg">
              <CalendarIcon className="h-6 w-6 text-[#ffb1b1] mr-2" />
              {new Date(movie.release_date).toLocaleDateString()}
            </span>
            <span
              className="flex items-center text-white text-lg cursor-pointer"
              onClick={() => toggleLike(movie.id)}
            >
              <HeartIcon
                className={`h-6 w-6 mr-2 ${
                  likedMovies.has(movie.id) ? "text-red-500" : "text-[#ffb1b1]"
                }`}
              />
            </span>
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
};

export default MovieModal;
