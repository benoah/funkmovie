import { motion } from "framer-motion";
import HeroSection from "../component/HeroSection";
import Trending from "../component/Trending";
import TopRatedMovies from "../component/movie/TopRatedMovies";
import AnimatedSection from "../component/AnimatedSection";
import TopRatedSeries from "../component/series/TopRatedSeries";
import HeroSectionSeries from "../component/series/HeroSectionSeries";
import PopularSeries from "../component/series/PopularSeries";

export default function Home() {
  return (
    <motion.div
      className="w-full min-h-screen px-4 sm:px-6 md:px-8 lg:px-16 py-8"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 1 }}
    >
      {/* Hero Section */}
      <HeroSection />

      {/* Trending and TopRatedMovies Sections */}
      <div className="relative w-full">
        <AnimatedSection delay={0.2} duration={0.8}>
          <Trending />
        </AnimatedSection>
        <AnimatedSection delay={0.2} duration={0.8}>
          <TopRatedMovies />
        </AnimatedSection>
        <AnimatedSection delay={0.2} duration={0.8}>
          <HeroSectionSeries />
        </AnimatedSection>
        <AnimatedSection>
          <PopularSeries />
        </AnimatedSection>
      </div>
    </motion.div>
  );
}

/*

   <AnimatedSection className="mt-16">
   <TopRatedMovies />
 </AnimatedSection>

 <AnimatedSection className="mt-16">
   <PopularSeries />
 </AnimatedSection>
 */
