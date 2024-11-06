import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { fetchTopRatedMovies, fetchGenres } from "../../services/apiService";
import TopMovieModal from "../shared/TopMovieModal";
import { StarIcon, HeartIcon, PlayCircleIcon } from "@heroicons/react/24/solid";

export type Genre = {
  id: number;
  name: string;
};

export type Movie = {
  id: number;
  title?: string;
  name?: string;
  poster_path?: string;
  backdrop_path?: string;
  release_date?: string;
  first_air_date?: string;
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
  const [likedMovies, setLikedMovies] = useState<Set<number>>(new Set());
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

  const toggleLike = (movieId: number) => {
    setLikedMovies((prevLikedMovies) => {
      const updatedLikes = new Set(prevLikedMovies);
      updatedLikes.has(movieId)
        ? updatedLikes.delete(movieId)
        : updatedLikes.add(movieId);
      return updatedLikes;
    });
  };

  const openModal = (movie: Movie) => setSelectedMovie(movie);
  const closeModal = () => setSelectedMovie(null);

  const genreMap = genres.reduce((acc, genre) => {
    acc[genre.id] = genre.name;
    return acc;
  }, {} as { [key: number]: string });

  const scrollLeft = () => {
    scrollContainerRef.current?.scrollBy({
      top: 0,
      left: -Math.ceil(window.innerWidth / 1.5),
      behavior: "smooth",
    });
  };

  const scrollRight = () => {
    scrollContainerRef.current?.scrollBy({
      top: 0,
      left: Math.ceil(window.innerWidth / 1.5),
      behavior: "smooth",
    });
  };

  return (
    <div className="container mx-auto mt-24">
      <header className="py-8">
        <h3 className="text-3xl md:text-4xl lg:text-5xl font-bold tracking-wide text-[#dcdccd] mb-4">
          Top Rated Movies
        </h3>
        <p className=" text-1xl md:text-base lg:text-lg text-[#ffb1b1] font-light italic mb-6">
          "Discover the Best of Cinema"
        </p>
        <div className="flex items-center">
          <select
            id="genre-filter"
            value={selectedGenreId ?? ""}
            onChange={(e) =>
              setSelectedGenreId(
                e.target.value ? parseInt(e.target.value) : null
              )
            }
            className="py-2 px-4 text-sm rounded-md bg-[#151717]/70 text-[#ffb1b1] border border-[#ffffff30] cursor-pointer transition-all"
            style={{
              minWidth: "8rem",
              backgroundImage:
                "url('data:image/svg+xml,%3Csvg xmlns=%27http://www.w3.org/2000/svg%27 viewBox=%270 0 16 16%27 fill=%27%23ffb1b1%27%3E%3Cpath d=%27M1 4l7 7 7-7z%27/%3E%3C/svg%3E')",
              backgroundRepeat: "no-repeat",
              backgroundPosition: "right 10px center",
              backgroundSize: "1.5em",
              appearance: "none",
            }}
          >
            <option value="">All Genres</option>
            {genres.map((genre) => (
              <option key={genre.id} value={genre.id}>
                {genre.name}
              </option>
            ))}
          </select>
        </div>
      </header>

      <div className="relative text-white">
        {movies.length > 5 && (
          <>
            <button
              onClick={scrollLeft}
              aria-label="Scroll Left"
              className="absolute top-1/2 left-2 z-10 -translate-y-1/2 opacity-70 hover:opacity-100 transition-opacity bg-black/50 rounded-full p-2"
            >
              <svg className="w-6 h-6 text-white" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 19l-7-7 7-7"
                />
              </svg>
            </button>

            <button
              onClick={scrollRight}
              aria-label="Scroll Right"
              className="absolute top-1/2 right-2 z-10 -translate-y-1/2 opacity-70 hover:opacity-100 transition-opacity bg-black/50 rounded-full p-2"
            >
              <svg className="w-6 h-6 text-white" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 5l7 7-7 7"
                />
              </svg>
            </button>
          </>
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
                    className="relative cursor-pointer snap-center shrink-0 w-[240px] md:w-[280px] lg:w-[320px] transition-transform duration-300 hover:scale-105 group"
                  >
                    <div className="relative overflow-hidden rounded-md">
                      <img
                        src={
                          movie.backdrop_path
                            ? `https://image.tmdb.org/t/p/w500${movie.backdrop_path}`
                            : "https://via.placeholder.com/500x750?text=No+Image"
                        }
                        alt={movie.title || "Untitled"}
                        className="w-full h-auto object-cover rounded-md transition-transform duration-300 group-hover:scale-105"
                        loading="lazy"
                      />
                      <div className="absolute inset-0 bg-black bg-opacity-80 flex flex-col justify-end opacity-0 transition-opacity duration-300 group-hover:opacity-100 rounded-md p-4 sm:p-6 lg:p-8">
                        <h3 className="text-lg md:text-xl font-bold text-[#ffb1b1] leading-tight mb-2">
                          {movie.title || movie.name || "Untitled"}
                        </h3>
                        <p className="text-sm text-gray-200 mb-2">
                          {movie.genre_ids?.map((id) => (
                            <span
                              key={id}
                              className="bg-[#ffb1b1]/20 text-[#ffb1b1] px-3 py-1 rounded-full text-xs font-medium"
                            >
                              {genreMap[id]}
                            </span>
                          ))}
                        </p>
                        <div className="flex items-center space-x-4 mt-6">
                          <p className="flex items-center text-gray-200 text-sm cursor-pointer hover:text-[#ffb1b1]">
                            <HeartIcon className="h-5 w-5 text-[#ffb1b1] mr-1" />
                            Like
                          </p>
                          <p className="flex items-center text-gray-200 text-sm cursor-pointer hover:text-[#ffb1b1]">
                            <PlayCircleIcon className="h-5 w-5 text-[#ffb1b1] mr-1" />
                            Watch Trailer
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
        </div>
      </div>

      {selectedMovie && (
        <TopMovieModal
          movie={selectedMovie}
          open={true}
          onClose={closeModal}
          toggleLike={toggleLike}
          likedMovies={likedMovies}
        />
      )}
    </div>
  );
};

export default TopRatedMovies;
