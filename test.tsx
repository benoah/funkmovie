/*
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
*/
