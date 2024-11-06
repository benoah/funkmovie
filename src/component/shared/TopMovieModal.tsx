import React, { useEffect, useState } from "react";
import ReactPlayer from "react-player";
import { motion } from "framer-motion";
import { StarIcon } from "@heroicons/react/24/solid";
import { CalendarIcon } from "@heroicons/react/24/solid";
import { HeartIcon } from "@heroicons/react/24/solid";

type TopMovieModalProps = {
  movie: any;
  open: boolean;
  onClose: () => void;
  toggleLike: (movieId: number) => void;
  likedMovies: Set<number>;
};

const TopMovieModal: React.FC<TopMovieModalProps> = ({
  movie,
  open,
  onClose,
  toggleLike,
  likedMovies,
}) => {
  const [trailerKey, setTrailerKey] = useState<string | null>(null);
  const [isTrailerPlaying, setIsTrailerPlaying] = useState(false);

  useEffect(() => {
    if (open) {
      const fetchTrailer = async () => {
        try {
          const response = await fetch(
            `https://api.themoviedb.org/3/movie/${movie.id}/videos?api_key=YOUR_API_KEY`
          );
          const data = await response.json();
          const trailer = data.results.find(
            (video: any) => video.type === "Trailer" && video.site === "YouTube"
          );
          setTrailerKey(trailer ? trailer.key : null);
        } catch (error) {
          console.error("Failed to fetch trailer", error);
        }
      };
      fetchTrailer();
    }
  }, [movie, open]);

  if (!open) return null;

  const handleContentClick = (e: React.MouseEvent) => e.stopPropagation();

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-[var(--overlay-color)] backdrop-blur-lg"
      onClick={onClose}
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
          {isTrailerPlaying && trailerKey ? (
            <ReactPlayer
              url={`https://www.youtube.com/watch?v=${trailerKey}`}
              playing={true}
              controls={true}
              width="100%"
              height="100%"
              className="rounded-md"
            />
          ) : (
            <img
              src={`https://image.tmdb.org/t/p/original${movie.backdrop_path}`}
              alt={movie.title || "Movie image"}
              className="w-full h-full object-cover rounded-md"
            />
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-[var(--background-color)] via-transparent to-transparent z-10"></div>
        </div>

        <div className="p-6 relative z-20">
          <motion.h2
            className="text-[#ffb1b1] text-4xl font-bold drop-shadow-2xl mb-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            {movie.title || movie.name}
          </motion.h2>

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

export default TopMovieModal;
