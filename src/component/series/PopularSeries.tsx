import React, { useState, useEffect, useRef } from "react";
import { fetchGenres, fetchPopularSeries } from "../../services/apiService";
import { motion } from "framer-motion";
import SeriesImage from "./SeriesImage";

type Series = {
  id: number;
  name: string;
  poster_path: string;
  backdrop_path: string;
  first_air_date: string;
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

const PopularSeries = () => {
  const [series, setSeries] = useState<Series[]>([]);
  const [selectedSeries, setSelectedSeries] = useState<Series | null>(null);
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
        setError("Failed to fetch genres.");
      }
    };
    getGenres();
  }, []);

  const getSeries = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await fetchPopularSeries();
      setSeries(data.results);
    } catch (error) {
      console.error("Error fetching popular series:", error);
      setError("Failed to fetch popular series.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getSeries();
  }, []);

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
    <div className="container mx-auto pt-16">
      <header className="py-8">
        <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold tracking-wide text-[#dcdccd] mb-4 md:mb-4">
          Popular Series
        </h2>
        <p className="text-shadow text-[#ffb1b1]">
          Discover the top-rated series loved by fans worldwide.
        </p>
      </header>

      <div className="flex items-center space-x-4 mb-6 md:mb-8">
        <select
          value={selectedGenreId ?? ""}
          onChange={(e) =>
            setSelectedGenreId(e.target.value ? parseInt(e.target.value) : null)
          }
          className={`px-3 py-2 text-sm transition-all rounded-md shadow-md ${
            selectedGenreId
              ? "border-b-2 border-[#ffb1b1] text-[#ffb1b1] bg-[#ffb1b1]/20"
              : "border-b-2 border-transparent text-gray-400 hover:text-white"
          } bg-[#151717]/70 focus:outline-none focus:ring-2 focus:ring-[#ffb1b1] backdrop-blur-lg border border-[#ffffff30] cursor-pointer pr-8`}
          style={{
            minWidth: "8rem",
            appearance: "none",
            backgroundImage:
              "url('data:image/svg+xml;charset=UTF-8,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 16 16' fill='%23ffb1b1'%3E%3Cpath d='M1 4l7 7 7-7z'/%3E%3C/svg%3E')",
            backgroundRepeat: "no-repeat",
            backgroundPosition: "right 10px center",
            backgroundSize: "1.5em",
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
        {series.length > 5 && (
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

        <motion.div
          ref={scrollContainerRef}
          className="flex overflow-x-scroll space-x-4 py-6 snap-x snap-mandatory scroll-smooth scrollbar-hide"
          initial="hidden"
          animate="visible"
          variants={{
            hidden: { opacity: 0 },
            visible: { opacity: 1, transition: { staggerChildren: 0.1 } },
          }}
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
            : series.map((serie) => (
                <motion.div
                  key={serie.id}
                  className="relative cursor-pointer snap-center shrink-0 w-[240px] md:w-[280px] lg:w-[320px] transform transition-transform duration-300 hover:scale-105"
                  onClick={() => setSelectedSeries(serie)}
                >
                  <SeriesImage
                    posterPath={serie.poster_path}
                    name={serie.name}
                  />
                  <div className="absolute inset-0 bg-black bg-opacity-80 flex flex-col justify-end opacity-0 transition-opacity duration-300 hover:opacity-100 rounded-md p-4">
                    <h3 className="text-lg font-bold text-[#ffb1b1] mb-2">
                      {serie.name}
                    </h3>
                    <p className="text-sm text-gray-200">
                      {serie.overview || "No description available"}
                    </p>
                  </div>
                </motion.div>
              ))}
        </motion.div>

        {series.length > 5 && (
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
    </div>
  );
};

export default PopularSeries;
