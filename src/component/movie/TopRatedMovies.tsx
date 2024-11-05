import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { fetchTopRatedMovies, fetchGenres } from "../../services/apiService";
import TopModal from "../shared/TopMovieModal";

export type Genre = {
  id: number;
  name: string;
};

export type Movie = {
  id: number;
  title?: string;
  name?: string; // For series
  poster_path?: string;
  backdrop_path?: string;
  release_date?: string;
  first_air_date?: string; // For series
  vote_average?: number;
  overview?: string;
  genre_ids?: number[];
  genres?: Genre[];
  original_language?: string;
  adult?: boolean;
};
const TopRatedMovies = () => {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [selectedMovie, setSelectedMovie] = useState<Movie | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [genres, setGenres] = useState<Genre[]>([]);
  const [selectedGenreId, setSelectedGenreId] = useState<number | null>(null);
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const getGenres = async () => {
      try {
        const genresData = await fetchGenres();
        setGenres(genresData);
      } catch (error) {
        console.error("Error fetching genres:", error);
      }
    };
    getGenres();
  }, []);

  const getMovies = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await fetchTopRatedMovies();
      setMovies(data.results);
    } catch (error) {
      console.error("Error fetching movies:", error);
      setError("Failed to fetch top-rated movies.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getMovies();
  }, []);

  const openModal = (movie: Movie) => setSelectedMovie(movie);
  const closeModal = () => setSelectedMovie(null);

  const genreMap = genres.reduce((acc, genre) => {
    acc[genre.id] = genre.name;
    return acc;
  }, {} as { [key: number]: string });

  const scrollLeft = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({
        top: 0,
        left: -Math.ceil(window.innerWidth / 1.5),
        behavior: "smooth",
      });
    }
  };

  const scrollRight = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({
        top: 0,
        left: Math.ceil(window.innerWidth / 1.5),
        behavior: "smooth",
      });
    }
  };

  return (
    <div className="container mx-auto px-4 pt-16">
      <h2 className="text-3xl font-bold tracking-wide text-[#dcdccd] mb-8">
        Top Rated Movies
      </h2>

      <div className="flex items-center space-x-2 mb-8 mt-8">
        <select
          id="genre-filter"
          value={selectedGenreId ?? ""}
          onChange={(e) => {
            const value = e.target.value;
            setSelectedGenreId(value ? parseInt(value) : null);
          }}
          className="px-3 py-1 text-sm bg-[#151717]/70 text-gray-400 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#ffb1b1] transition-all cursor-pointer pr-8 backdrop-blur-lg border border-[#ffffff30] hover:text-white shadow-md"
          style={{
            minWidth: "8rem",
            marginTop: "-0.5rem",
          }}
        >
          <option value="" className="text-gray-400">
            All Genres
          </option>
          {genres.map((genre) => (
            <option key={genre.id} value={genre.id} className="text-gray-400">
              {genre.name}
            </option>
          ))}
        </select>
      </div>

      <div className="relative text-white">
        {movies.length > 5 && (
          <button
            onClick={scrollLeft}
            aria-label="Scroll Left"
            className="absolute top-1/2 left-2 z-10 -translate-y-1/2 opacity-70 hover:opacity-100 transition-opacity bg-black/50 rounded-full p-2"
          >
            <svg
              className="w-6 h-6 text-white"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 19l-7-7 7-7"
              />
            </svg>
          </button>
        )}

        <div
          ref={scrollContainerRef}
          className="flex overflow-hidden scrollbar-hide space-x-4 snap-x snap-mandatory scroll-smooth"
        >
          {loading
            ? Array.from({ length: 8 }).map((_, index) => (
                <div
                  key={index}
                  className="snap-center shrink-0 w-[240px] md:w-[280px] lg:w-[320px] animate-pulse"
                >
                  <div className="bg-gray-700 h-[360px] w-full rounded-md"></div>
                  <div className="mt-2 h-6 bg-gray-700 rounded w-3/4"></div>
                  <div className="mt-2 h-4 bg-gray-700 rounded w-1/2"></div>
                  <div className="mt-2 h-4 bg-gray-700 rounded w-1/4"></div>
                </div>
              ))
            : movies
                .filter(
                  (movie) =>
                    selectedGenreId === null ||
                    (movie.genre_ids &&
                      movie.genre_ids.includes(selectedGenreId))
                )
                .map((movie) => (
                  <div
                    key={movie.id}
                    onClick={() => openModal(movie)}
                    className="relative cursor-pointer snap-center shrink-0 w-[240px] md:w-[280px] lg:w-[320px] transform transition-transform duration-300 hover:scale-105 group"
                  >
                    <div className="relative overflow-hidden rounded-md">
                      <img
                        src={
                          movie.backdrop_path
                            ? `https://image.tmdb.org/t/p/w500${movie.backdrop_path}`
                            : "https://via.placeholder.com/500x750?text=No+Image"
                        }
                        alt={movie.title || "Untitled"}
                        loading="lazy"
                        className="w-full h-auto object-cover rounded-md transition-transform duration-300 group-hover:scale-105"
                      />
                      <div className="absolute inset-0 bg-black bg-opacity-70 flex flex-col justify-end opacity-0 transition-opacity duration-300 group-hover:opacity-100 rounded-md p-4 space-y-2">
                        <h3 className="text-xl font-bold text-[#dcdccd] leading-tight">
                          {movie.title || movie.name || "Untitled"}
                        </h3>
                        <p className="text-xs text-gray-400">
                          {movie.release_date || movie.first_air_date
                            ? new Date(
                                movie.release_date || movie.first_air_date || ""
                              ).toLocaleDateString("no-NO", {
                                year: "numeric",
                                month: "long",
                                day: "numeric",
                              })
                            : "Unknown Release Date"}
                        </p>
                        <motion.div
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.3 }}
                        >
                          <p className="text-xs text-gray-300 leading-snug">
                            ⭐ {movie.vote_average?.toFixed(1) || "N/A"} / 10
                          </p>
                        </motion.div>
                        <p className="text-xs text-gray-300 leading-snug">
                          Genres:{" "}
                          <span className="font-semibold text-gray-200">
                            {movie.genre_ids
                              ? movie.genre_ids
                                  .map((id) => genreMap[id])
                                  .filter(Boolean)
                                  .join(", ")
                              : "Unknown"}
                          </span>
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
        </div>

        {movies.length > 5 && (
          <button
            onClick={scrollRight}
            aria-label="Scroll Right"
            className="absolute top-1/2 right-2 z-10 -translate-y-1/2 opacity-70 hover:opacity-100 transition-opacity bg-black/50 rounded-full p-2"
          >
            <svg
              className="w-6 h-6 text-white"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 5l7 7-7 7"
              />
            </svg>
          </button>
        )}
      </div>

      {selectedMovie && (
        <TopModal movie={selectedMovie} open={true} onClose={closeModal} />
      )}
    </div>
  );
};

export default TopRatedMovies;
