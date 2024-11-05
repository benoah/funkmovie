// Trending.tsx

import React, { useState, useEffect, useRef, useCallback } from "react";
import { fetchGenres, fetchTrendingMovies } from "../services/apiService";
import { motion } from "framer-motion";
import MovieModal from "./shared/MovieModal";
import { TrendingItem } from "../types";

// Define Movie and Genre types
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

const Trending = () => {
  // State to store movies, selected movie, and genre data
  const [movies, setMovies] = useState<Movie[]>([]);
  const [selectedMovie, setSelectedMovie] = useState<Movie | null>(null);
  const [autoPlay, setAutoPlay] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [timeWindow, setTimeWindow] = useState<"day" | "week">("week");
  const [genres, setGenres] = useState<Genre[]>([]);
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  // Fetch genres when the component mounts
  useEffect(() => {
    const getGenres = async () => {
      try {
        const genresData = await fetchGenres();
        setGenres(genresData);
      } catch (error) {
        console.error("Error fetching genres:", error);
        setError("Failed to fetch genres.");
      }
    };
    getGenres();
  }, []);

  // Function to fetch trending movies based on timeWindow (day/week)
  const getMovies = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await fetchTrendingMovies(timeWindow);

      // Transform the data to match the Movie type
      const moviesData: Movie[] = data.results.map((item: TrendingItem) => ({
        id: item.id,
        title: item.title || item.name || "Untitled",
        poster_path: item.poster_path || "",
        backdrop_path: item.backdrop_path || "",
        release_date: item.release_date || "",
        vote_average: item.vote_average || 0,
        overview: item.overview || "",
        genre_ids: item.genre_ids || [],
        original_language: item.original_language || "en",
        production_countries: item.production_countries || [],
      }));

      setMovies(moviesData);
    } catch (error) {
      console.error("Error fetching trending movies:", error);
      setError("Failed to fetch trending movies.");
    } finally {
      setLoading(false);
    }
  }, [timeWindow]);

  // Re-fetch movies when the timeWindow changes
  useEffect(() => {
    getMovies();
  }, [timeWindow, getMovies]);

  // Scroll functions for the carousel
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

  // Functions for opening and closing the modal
  const openModal = (movie: Movie, autoPlay = false) => {
    setSelectedMovie(movie);
    setAutoPlay(autoPlay);
  };
  const closeModal = () => {
    setSelectedMovie(null);
    setAutoPlay(false);
  };

  // Map genres for quick lookup based on genre IDs
  const genreMap = genres.reduce((acc, genre) => {
    acc[genre.id] = genre.name;
    return acc;
  }, {} as { [key: number]: string });

  return (
    <div className="container pt-0">
      <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold tracking-wide text-[#dcdccd] mb-6">
        Trending Now
      </h2>
      <div className="flex space-x-2 mb-8">
        <button
          className={`py-1 px-2 text-sm transition-all ${
            timeWindow === "day"
              ? "border-b-2 border-[#ffb1b1] font-semibold"
              : "border-b-2 border-transparent text-gray-400 hover:text-white"
          }`}
          onClick={() => setTimeWindow("day")}
          aria-label="Show today's trending movies"
        >
          Today
        </button>
        <button
          className={`px-4 py-1 text-sm transition-all ${
            timeWindow === "week"
              ? "border-b-2 border-[#ffb1b1] text-white font-semibold"
              : "border-b-2 border-transparent text-gray-400 hover:text-white"
          }`}
          onClick={() => setTimeWindow("week")}
          aria-label="Show this week's trending movies"
        >
          This Week
        </button>
      </div>

      {error && (
        <div className="text-center text-red-500 mb-4">
          <p>{error}</p>
          <button
            onClick={getMovies}
            className="mt-2 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            Try Again
          </button>
        </div>
      )}

      <div className="relative group">
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

        <div
          ref={scrollContainerRef}
          className="flex overflow-x-scroll space-x-4 py-4 scroll-smooth scrollbar-hide"
          aria-live="polite"
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
            : movies.map((movie) => (
                <div
                  key={movie.id}
                  className="relative snap-center shrink-0 w-[240px] md:w-[280px] lg:w-[320px] transform transition-transform duration-300 hover:scale-105"
                >
                  <img
                    src={
                      movie.poster_path
                        ? `https://image.tmdb.org/t/p/w500${movie.poster_path}`
                        : "https://via.placeholder.com/500x750?text=No+Image"
                    }
                    alt={`Poster of ${movie.title}`}
                    loading="lazy"
                    className="w-full h-auto object-cover rounded-md"
                  />
                  <button
                    onClick={() => openModal(movie, true)}
                    className="absolute inset-0 flex items-center justify-center text-white text-4xl opacity-0 hover:opacity-100 transition-opacity bg-black bg-opacity-50 rounded-md"
                    aria-label={`Open trailer for ${movie.title}`}
                  >
                    <svg
                      className="w-12 h-12 text-white"
                      fill="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path d="M4 2v20l17-10L4 2z" />
                    </svg>
                  </button>
                </div>
              ))}
        </div>

        {/* MovieModal component for displaying selected movie details */}
        {selectedMovie && (
          <MovieModal
            movie={selectedMovie}
            open={true}
            onClose={closeModal}
            autoPlay={autoPlay}
          />
        )}
      </div>
    </div>
  );
};

export default Trending;
