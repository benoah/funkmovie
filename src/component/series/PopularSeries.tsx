import React, { useState, useEffect, useRef } from "react";
import { fetchGenres, fetchPopularSeries } from "../../services/apiService";

// Define Series and Genre types
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
  const [autoPlay, setAutoPlay] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [genres, setGenres] = useState<Genre[]>([]);
  const [selectedGenreId, setSelectedGenreId] = useState<number | null>(null);
  const [selectedLanguage, setSelectedLanguage] = useState<string | null>(null);
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

  const filteredSeries = series.filter(
    (serie) =>
      (selectedGenreId ? serie.genre_ids.includes(selectedGenreId) : true) &&
      (selectedLanguage ? serie.original_language === selectedLanguage : true)
  );

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

  const openModal = (series: Series, autoPlay = false) => {
    setSelectedSeries(series);
    setAutoPlay(autoPlay);
  };

  const closeModal = () => {
    setSelectedSeries(null);
    setAutoPlay(false);
  };

  const languages = Array.from(
    new Set(series.map((serie) => serie.original_language))
  );

  return (
    <div className="container mx-auto pt-16">
      <header className="py-8 ">
        <h2 className="text-3xl md:text-4xl font-bold tracking-wide text-[#dcdccd]">
          Popular Series
        </h2>
        <h5 className="text-gray-400 mt-4  text-shadow">
          Discover the top-rated series loved by fans worldwide.
        </h5>
      </header>

      {/* Filters */}
      {/* Filters */}
      <div className="flex space-x-4 pb-2">
        {/* Genre Filter */}
        <select
          value={selectedGenreId ?? ""}
          onChange={(e) =>
            setSelectedGenreId(e.target.value ? parseInt(e.target.value) : null)
          }
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

        {/* Language Filter */}
        <select
          value={selectedLanguage ?? ""}
          onChange={(e) => setSelectedLanguage(e.target.value || null)}
          className="px-3 py-1 text-sm bg-[#151717]/70 text-gray-400 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#ffb1b1] transition-all cursor-pointer pr-8 backdrop-blur-lg border border-[#ffffff30] hover:text-white shadow-md"
          style={{
            minWidth: "8rem",
            marginTop: "-0.5rem",
          }}
        >
          <option value="" className="text-gray-400">
            All Languages
          </option>
          {languages.map((language) => (
            <option key={language} value={language} className="text-gray-400">
              {language.toUpperCase()}
            </option>
          ))}
        </select>
      </div>

      {/* Error Message */}
      {error && (
        <div className="text-center text-red-500 mb-4">
          <p>{error}</p>
          <button
            onClick={getSeries}
            className="mt-2 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            Try Again
          </button>
        </div>
      )}

      {/* Series List */}
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
          className="flex overflow-x-scroll space-x-4 py-6 scroll-smooth scrollbar-hide"
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
            : filteredSeries.map((series, index) => (
                <div
                  key={series.id}
                  className="relative snap-center shrink-0 w-[240px] md:w-[280px] lg:w-[320px] transform transition-transform duration-300 hover:scale-105"
                >
                  {/* Rank Badge */}
                  <div
                    className="absolute -bottom-6 left-2 sm:left-4 bg-white/10 text-white font-extrabold text-3xl w-16 h-16 sm:w-20 sm:h-20 sm:text-4xl flex items-center justify-center backdrop-blur-md border border-white/30 shadow-lg transform transition-transform duration-300 hover:scale-110 z-20"
                    aria-label={`Rank ${index + 1}`}
                  >
                    {index + 1}
                  </div>
                  <img
                    src={
                      series.poster_path
                        ? `https://image.tmdb.org/t/p/w500${series.poster_path}`
                        : "https://via.placeholder.com/500x750?text=No+Image"
                    }
                    alt={`Poster of ${series.name}`}
                    loading="lazy"
                    className="w-full h-auto object-cover rounded-md"
                  />
                  <button
                    onClick={() => openModal(series, true)}
                    className="absolute inset-0 flex items-center justify-center text-white text-4xl opacity-0 hover:opacity-100 transition-opacity bg-black bg-opacity-50 rounded-md"
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
      </div>
    </div>
  );
};

export default PopularSeries;
