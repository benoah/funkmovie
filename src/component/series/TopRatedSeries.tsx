import React, { useEffect, useRef, useState } from "react";
import { fetchGenres, fetchTopRatedSeries } from "../../services/apiService";
import { motion } from "framer-motion";
import { HeartIcon, PlayCircleIcon } from "@heroicons/react/24/solid";

type Series = {
  id: number;
  name: string;
  poster_path: string;
  backdrop_path: string;
  first_air_date: string;
  vote_average: number;
  overview: string;
  genre_ids: number[];
};

const TopRatedSeries = () => {
  const [series, setSeries] = useState<Series[]>([]);
  const [selectedSeries, setSelectedSeries] = useState<Series | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [genres, setGenres] = useState<{ id: number; name: string }[]>([]);
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

  const getSeries = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await fetchTopRatedSeries();
      setSeries(data.results);
    } catch (error) {
      console.error("Error fetching series:", error);
      setError("Failed to fetch top-rated series.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getSeries();
  }, []);

  const openModal = (series: Series) => setSelectedSeries(series);
  const closeModal = () => setSelectedSeries(null);

  const genreMap = genres.reduce((acc, genre) => {
    acc[genre.id] = genre.name;
    return acc;
  }, {} as { [key: number]: string });

  const scrollLeft = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({
        left: -300,
        behavior: "smooth",
      });
    }
  };

  const scrollRight = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({
        left: 300,
        behavior: "smooth",
      });
    }
  };

  return (
    <div className="container mx-auto">
      <header className="">
        <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold tracking-wide text-[#dcdccd] mb-4">
          Top Series
        </h2>
        <p className="ml-1 text-sm md:text-base lg:text-lg text-[#ffb1b1] leading-snug tracking-wider font-light italic mb-6">
          "Uncover the most binge-worthy stories, handpicked for your next
          marathon!"
        </p>
        <div className="flex items-center mb-8">
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
        {series.length > 5 && (
          <>
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
                </div>
              ))
            : series
                .filter(
                  (serie) =>
                    selectedGenreId === null ||
                    serie.genre_ids.includes(selectedGenreId)
                )
                .map((serie) => (
                  <div
                    key={serie.id}
                    onClick={() => openModal(serie)}
                    className="relative cursor-pointer snap-center shrink-0 w-[240px] md:w-[280px] lg:w-[320px] transform transition-transform duration-300 hover:scale-105 group"
                  >
                    <div className="relative overflow-hidden rounded-md group">
                      <img
                        src={
                          serie.backdrop_path
                            ? `https://image.tmdb.org/t/p/w500${serie.backdrop_path}`
                            : "https://via.placeholder.com/500x750?text=No+Image"
                        }
                        alt={serie.name}
                        loading="lazy"
                        className="w-full h-auto object-cover rounded-md transition-transform duration-300 group-hover:scale-105"
                      />
                      <div className="absolute inset-0 bg-black bg-opacity-70 flex flex-col justify-end opacity-0 transition-opacity duration-300 group-hover:opacity-100 rounded-md p-4 space-y-2">
                        <h3 className="text-lg md:text-xl font-bold text-[#ffb1b1] leading-tight shadow-md mb-2">
                          {serie.name}
                        </h3>
                        <p className="text-xs text-gray-400 mb-1">
                          {new Date(serie.first_air_date).toLocaleDateString(
                            "no-NO",
                            {
                              year: "numeric",
                              month: "long",
                              day: "numeric",
                            }
                          )}
                        </p>
                        <p className="text-xs text-[#ffb1b1] mb-1">
                          ⭐ {serie.vote_average.toFixed(1)} / 10
                        </p>
                        <p className="text-xs text-gray-300 leading-snug mb-1">
                          Genres:{" "}
                          <span className="font-semibold text-gray-200">
                            {serie.genre_ids
                              .map((id) => genreMap[id])
                              .filter(Boolean)
                              .join(", ")}
                          </span>
                        </p>
                        <motion.div
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.3 }}
                          className="flex items-center space-x-4 mt-4"
                        >
                          <p className="flex items-center text-gray-200 text-sm leading-snug cursor-pointer hover:text-[#ffb1b1] transition-colors duration-200">
                            <HeartIcon
                              className="h-5 w-5 text-[#ffb1b1] mr-1"
                              aria-hidden="true"
                            />
                            <span className="hover:text-[#ffb1b1]">Like</span>
                          </p>

                          <p className="flex items-center text-gray-200 text-sm leading-snug cursor-pointer hover:text-[#ffb1b1] transition-colors duration-200">
                            <PlayCircleIcon
                              className="h-5 w-5 text-[#ffb1b1] mr-1"
                              aria-hidden="true"
                            />
                            <span className="hover:text-[#ffb1b1]">
                              Watch Trailer
                            </span>
                          </p>
                        </motion.div>
                      </div>
                    </div>
                  </div>
                ))}
        </div>
      </div>
    </div>
  );
};

export default TopRatedSeries;
