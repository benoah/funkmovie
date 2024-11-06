import React, { useState, useEffect } from "react";
import Slider from "react-slick";
import ReactPlayer from "react-player";
import styled from "styled-components";
import { CalendarIcon, StarIcon, HeartIcon } from "@heroicons/react/24/solid";
import {
  fetchTrendingMovies,
  fetchGenres,
  fetchMovieVideos,
} from "../services/apiService";
import { motion, AnimatePresence } from "framer-motion";

// TypeScript types for data
type Movie = {
  id: number;
  title: string;
  backdrop_path: string;
  overview: string;
  release_date: string;
  genre_ids: number[];
  vote_average: number;
};

type Genre = {
  id: number;
  name: string;
};

type Video = {
  key: string;
  type: string;
  site: string;
};

// Styled components for layout
const VideoContainer = styled.div`
  position: relative;
  width: 100%;
  height: 100%;
`;

const MotionVideoContainer = motion(VideoContainer);

interface DarkOverlayProps {
  isAutoPlay: boolean;
}

const DarkOverlay = styled.div<DarkOverlayProps>`
  background: rgba(0, 0, 0, 0.7);
  position: absolute;
  inset: 0;
  backdrop-filter: blur(3px);
  transition: backdrop-filter 0.3s ease;
`;

interface HeroSectionProps {
  className?: string;
}

const AnimatedOverlay = styled.div`
  position: absolute;
  inset: 0;
  background: radial-gradient(
    circle at center,
    rgba(0, 0, 0, 0.4),
    rgba(0, 0, 0, 0.8)
  );
  z-index: 10;
  opacity: 0.5;
  animation: overlayPulse 10s infinite alternate;

  @keyframes overlayPulse {
    0% {
      opacity: 0.4;
    }
    100% {
      opacity: 0.7;
    }
  }
`;

const HeroSection: React.FC<HeroSectionProps> = ({ className }) => {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [genres, setGenres] = useState<Genre[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [videoKey, setVideoKey] = useState<string | null>(null);
  const [currentMovieIndex, setCurrentMovieIndex] = useState<number>(0);
  const [isTrailerLoading, setIsTrailerLoading] = useState<boolean>(false);
  const [isAutoPlay, setIsAutoPlay] = useState(true);
  const [showDetails, setShowDetails] = useState<boolean>(false);
  const [likedMovies, setLikedMovies] = useState<Set<number>>(new Set());

  useEffect(() => {
    const getGenres = async () => {
      try {
        const genresData = await fetchGenres();
        setGenres(genresData);
      } catch {
        setError("Failed to load genres");
      }
    };
    getGenres();
  }, []);

  useEffect(() => {
    const getTrendingMovies = async () => {
      try {
        const data = await fetchTrendingMovies("week");
        setMovies(data.results.slice(0, 5) as Movie[]);
        setLoading(false);
      } catch {
        setLoading(false);
        setError("Failed to load movies");
      }
    };
    getTrendingMovies();
  }, []);

  useEffect(() => {
    const getTrailer = async () => {
      const currentMovie = movies[currentMovieIndex];
      if (currentMovie) {
        try {
          setIsTrailerLoading(true);
          const videos: Video[] = await fetchMovieVideos(currentMovie.id);
          const trailer = videos.find(
            (video) => video.type === "Trailer" && video.site === "YouTube"
          );
          setVideoKey(trailer ? trailer.key : null);
        } catch {
          setError("Failed to load movie trailer");
        } finally {
          setIsTrailerLoading(false);
        }
      }
    };
    getTrailer();
  }, [currentMovieIndex, movies]);

  const toggleLike = (movieId: number) => {
    setLikedMovies((prev) => {
      const updatedLikes = new Set(prev);
      if (updatedLikes.has(movieId)) {
        updatedLikes.delete(movieId);
      } else {
        updatedLikes.add(movieId);
      }
      return updatedLikes;
    });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="loader bg-gray-600 h-12 w-12 rounded-full animate-spin mb-4"></div>
          <p>Loading movies...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-center text-red-500">{error}</p>
      </div>
    );
  }

  const settings = {
    dots: false,
    infinite: true,
    speed: 800,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: false,
    arrows: false,
    beforeChange: (_: any, next: number) => {
      setCurrentMovieIndex(next);
      setShowDetails(false);
    },
  };

  const fadeInUp = {
    initial: { y: 30, opacity: 0 },
    animate: { y: 0, opacity: 1 },
    exit: { y: -30, opacity: 0 },
  };

  const staggerContainer = {
    animate: {
      transition: {
        staggerChildren: 0.2,
      },
    },
  };

  return (
    <div className="relative w-full h-[100vh]">
      <Slider {...settings}>
        {movies.map((movie, index) => (
          <div key={movie.id} className="relative w-full h-[80vh]">
            <div className="absolute inset-0">
              {isTrailerLoading ? (
                <div className="flex items-center justify-center h-full">
                  <div className="loader bg-gray-600 h-12 w-12 rounded-full animate-spin"></div>
                </div>
              ) : videoKey && index === currentMovieIndex ? (
                <MotionVideoContainer
                  animate={{ scale: 1.05 }}
                  transition={{
                    duration: 20,
                    ease: "linear",
                    repeat: Infinity,
                  }}
                >
                  <ReactPlayer
                    url={`https://www.youtube.com/watch?v=${videoKey}`}
                    playing
                    muted
                    loop
                    width="100%"
                    height="100%"
                    className="react-player"
                    config={{
                      youtube: {
                        playerVars: { showinfo: 0, controls: 0, autoplay: 1 },
                      },
                    }}
                  />
                  <DarkOverlay isAutoPlay={isAutoPlay} />
                </MotionVideoContainer>
              ) : (
                <img
                  src={`https://image.tmdb.org/t/p/original${movie.backdrop_path}`}
                  alt={movie.title}
                  className="w-full h-full object-cover"
                />
              )}
              <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent"></div>
            </div>

            <motion.div
              className="relative z-10 flex flex-col justify-center items-start h-full container mx-auto px-6 md:px-8 lg:px-16 max-w-screen-xl"
              variants={staggerContainer}
              initial="initial"
              animate="animate"
            >
              <motion.h1
                className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-extrabold text-[#ffb1b1] drop-shadow-2xl mb-6"
                variants={{
                  initial: { opacity: 0, scale: 0.95 },
                  animate: { opacity: 1, scale: 1 },
                }}
                transition={{ duration: 0.8, delay: 0.3 }}
              >
                {movie.title}
              </motion.h1>

              <AnimatePresence>
                {showDetails && (
                  <>
                    <motion.div
                      className="flex flex-wrap gap-3 mb-6"
                      variants={{
                        initial: { opacity: 0, scale: 0.95 },
                        animate: { opacity: 1, scale: 1 },
                      }}
                      transition={{ duration: 0.6, delay: 0.4 }}
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
                      className="text-base ml-1 sm:text-lg md:text-xl lg:text-2xl max-w-3xl text-[#dcdccd] mb-8 leading-loose"
                      variants={{
                        initial: { opacity: 0, scale: 0.95 },
                        animate: { opacity: 1, scale: 1 },
                      }}
                      transition={{ duration: 0.8, delay: 0.5 }}
                    >
                      {movie.overview}
                    </motion.p>

                    <motion.div
                      className="flex ml-1 flex-wrap items-center space-x-8 mb-10"
                      variants={{
                        initial: { opacity: 0, scale: 0.95 },
                        animate: { opacity: 1, scale: 1 },
                      }}
                      transition={{ duration: 0.6, delay: 0.6 }}
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
                            likedMovies.has(movie.id)
                              ? "text-red-500"
                              : "text-[#ffb1b1]"
                          }`}
                        />
                      </span>
                    </motion.div>
                  </>
                )}
              </AnimatePresence>

              <motion.button
                className={`px-10 py-3 bg-transparent text-[#ffb1b1] border border-[#ff7a7a] rounded-full hover:bg-[#ff7a7a] hover:text-white transition duration-300 ease-in-out ${
                  showDetails ? "mt-4" : "mb-6"
                }`}
                onClick={() => setShowDetails(!showDetails)}
                variants={{
                  initial: { opacity: 0, scale: 0.95 },
                  animate: { opacity: 1, scale: 1 },
                }}
                transition={{ duration: 0.8, delay: 1.1 }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                {showDetails ? "View Less" : "View More"}
              </motion.button>
            </motion.div>
          </div>
        ))}
      </Slider>
    </div>
  );
};

export default HeroSection;
