// src/types/movie.ts

export type Genre = {
  id: number;
  name: string;
};

export type Movie = {
  id: number;
  title?: string; // For movies
  name?: string; // For TV series
  poster_path?: string;
  backdrop_path?: string;
  release_date?: string; // For movies
  first_air_date?: string; // For TV series
  vote_average?: number;
  overview?: string;
  genre_ids?: number[]; // Genre IDs (used in some API responses)
  genres?: Genre[]; // Full genre information (used in detailed API responses)
  original_language?: string;
  adult?: boolean;
};
