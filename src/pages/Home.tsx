import { motion } from "framer-motion";
import HeroSection from "../component/HeroSection";
import Trending from "../component/Trending";
import TopRatedMovies from "../component/movie/TopRatedMovies";
import TopRatedSeries from "../component/series/TopRatedSeries";
import PopularSeries from "../component/series/PopularSeries";
import AnimatedSection from "../component/AnimatedSection";

export default function Home() {
  return (
    <motion.div
      className="w-full min-h-screen px-4 md:px-8 mt-12"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 1 }}
    >
      <HeroSection />
      <AnimatedSection>
        <Trending />
      </AnimatedSection>
      <AnimatedSection>
        <TopRatedMovies />
      </AnimatedSection>
      <AnimatedSection>
        <PopularSeries />
      </AnimatedSection>
    </motion.div>
  );
}
