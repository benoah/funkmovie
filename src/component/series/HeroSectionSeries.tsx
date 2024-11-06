import React, { useState, useEffect } from "react";
import Slider from "react-slick";
import styled from "styled-components";
import { motion, AnimatePresence } from "framer-motion";
import { fetchTrendingSeries, fetchGenres } from "../../services/apiService";
import { CalendarIcon, StarIcon } from "@heroicons/react/24/solid";

type Series = {
  id: number;
  name?: string;
  backdrop_path: string;
  overview: string;
  first_air_date: string;
  genre_ids: number[];
  vote_average?: number;
};

type Genre = {
  id: number;
  name: string;
};

const HeroSectionSeries: React.FC = () => {
  const [series, setSeries] = useState<Series[]>([]);
  const [genres, setGenres] = useState<Genre[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [currentSeriesIndex, setCurrentSeriesIndex] = useState<number>(0);

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
    const getTrendingSeries = async () => {
      try {
        const data = await fetchTrendingSeries("week");
        setSeries(data.results.slice(0, 5) as Series[]);
        setLoading(false);
      } catch {
        setError("Failed to load series");
        setLoading(false);
      }
    };
    getTrendingSeries();
  }, []);

  if (loading || series.length === 0) {
    return (
      <Section>
        <div className="text-center">
          <div className="loader bg-gray-600 h-12 w-12 rounded-full animate-spin mb-4"></div>
          <p>Loading series...</p>
        </div>
      </Section>
    );
  }

  if (error) {
    return (
      <Section>
        <p className="text-center text-red-500">{error}</p>
      </Section>
    );
  }

  const genreMap: Record<number, string> = genres.reduce((acc, genre) => {
    acc[genre.id] = genre.name;
    return acc;
  }, {} as { [key: number]: string });

  const settings = {
    dots: true,
    infinite: true,
    speed: 800,
    slidesToShow: 1.05,
    centerMode: true,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 5000,
    arrows: false,
    beforeChange: (_: any, next: number) => {
      setCurrentSeriesIndex(next);
    },
  };

  return (
    <div className="relative w-full h-[100vh] mt-24">
      <header className="py-8">
        <h3 className="text-3xl md:text-4xl lg:text-5xl font-bold tracking-wide text-[#dcdccd] mb-4">
          Top Rated Series
        </h3>
        <p className="ml-1 text-sm md:text-base lg:text-lg text-[#ffb1b1] leading-snug tracking-wider font-light italic">
          "Uncover the most binge-worthy stories, handpicked for your next
          marathon!"
        </p>
      </header>
      <Section>
        <Slider {...settings} className="container">
          {series.map((ser, index) => (
            <motion.div
              key={ser.id}
              className="relative h-screen max-h-[800px] transform scale-[0.95] transition-transform duration-300"
              initial={{ opacity: 0 }}
              animate={{ opacity: index === currentSeriesIndex ? 1 : 0.5 }}
              transition={{ duration: 0.6 }}
              style={{ margin: "0 10px" }}
            >
              <BackgroundImage
                src={`https://image.tmdb.org/t/p/original${ser.backdrop_path}`}
                alt={ser.name}
              />
              <EnhancedOverlay />

              <ContentContainer>
                <motion.h1
                  className="text-3xl ml-16 mb-8 sm:text-5xl md:text-6xl lg:text-7xl font-extrabold text-[#ffb1b1] drop-shadow-2xl mb-4"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, delay: 0.2 }}
                >
                  {ser.name}
                </motion.h1>

                <AnimatePresence>
                  <motion.div
                    className="relative z-10 flex flex-col justify-start items-start max-w-screen-xl mx-auto px-6 md:px-8 lg:px-16 space-y-6"
                    initial="initial"
                    animate="animate"
                    exit="exit"
                    transition={{ staggerChildren: 0.3 }}
                  >
                    <motion.div
                      className="flex flex-wrap gap-2 pb-8 ml-1"
                      transition={{ duration: 0.6 }}
                    >
                      {ser.genre_ids.map((id) => (
                        <span
                          key={id}
                          className="bg-[#ffb1b1] bg-opacity-20 text-white px-4 py-1.5 rounded-full text-sm shadow-md transition-transform transform hover:scale-105"
                        >
                          {genreMap[id]}
                        </span>
                      ))}
                    </motion.div>

                    <motion.p
                      className="text-lg md:text-xl lg:text-2xl pl-2 my-8 max-w-3xl text-[#dcdccd] leading-relaxed"
                      transition={{ duration: 0.6 }}
                    >
                      {ser.overview}
                    </motion.p>

                    <motion.div
                      className="flex items-center space-x-8 ml-1"
                      transition={{ duration: 0.6 }}
                    >
                      <span className="flex items-center text-white text-lg transition-all duration-300 hover:text-[#ff7a7a]">
                        <StarIcon className="h-6 w-6 text-[#ffb1b1] mr-2" />
                        {ser.vote_average ? ser.vote_average.toFixed(1) : "N/A"}
                        /10
                      </span>
                      <span className="flex items-center text-white text-lg transition-all duration-300 hover:text-[#ff7a7a]">
                        <CalendarIcon className="h-6 w-6 text-[#ffb1b1] mr-2" />
                        {new Date(ser.first_air_date).toLocaleDateString()}
                      </span>
                    </motion.div>
                  </motion.div>
                </AnimatePresence>
              </ContentContainer>
            </motion.div>
          ))}
        </Slider>
      </Section>
    </div>
  );
};

export default HeroSectionSeries;

// Styled Components
const Section = styled.section`
  position: relative;
  padding: 60px;
  border-radius: 16px;
  color: white;
`;

const BackgroundImage = styled.img`
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
  filter: brightness(0.7);
`;

const EnhancedOverlay = styled.div`
  position: absolute;
  inset: 0;
  background: radial-gradient(
    circle at center,
    rgba(0, 0, 0, 0.7),
    rgba(0, 0, 0, 0.2) 70%
  );
  backdrop-filter: blur(3px);
  z-index: 10;
`;

const ContentContainer = styled.div`
  position: relative;
  z-index: 20;
  padding-top: 32px;
  padding-left: 2rem;
  padding-right: 2rem;
  color: #ffb1b1;
  @media (min-width: 768px) {
    padding-left: 3rem;
    padding-right: 3rem;
  }
  text-align: left;
`;
