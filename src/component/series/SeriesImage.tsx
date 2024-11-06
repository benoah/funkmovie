import React, { useState } from "react";

type SeriesImageProps = {
  posterPath: string | null;
  name: string;
};

const SeriesImage: React.FC<SeriesImageProps> = ({ posterPath, name }) => {
  const [loaded, setLoaded] = useState(false);

  return (
    <div className="relative w-full h-full">
      <img
        src={
          posterPath
            ? `https://image.tmdb.org/t/p/w500${posterPath}`
            : "https://via.placeholder.com/500x750?text=No+Image"
        }
        alt={`Poster of ${name}`}
        loading="lazy"
        onLoad={() => setLoaded(true)}
        className={`w-full h-auto object-cover rounded-md transition-opacity duration-500 ${
          loaded ? "opacity-100" : "opacity-0"
        }`}
      />
      {!posterPath && (
        <div className="absolute inset-0 bg-gray-800 text-white flex items-center justify-center text-sm font-bold">
          No Image Available
        </div>
      )}
    </div>
  );
};

export default SeriesImage;
