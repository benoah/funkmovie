// src/types/index.ts

// src/types/index.ts

export interface Genre {
  id: number;
  name: string;
}

export interface ProductionCountry {
  iso_3166_1: string;
  name: string;
}

export interface TrendingItem {
  id: number;
  title?: string;
  name?: string;
  poster_path?: string;
  backdrop_path?: string;
  release_date?: string;
  first_air_date?: string; // Added this field for series
  vote_average?: number;
  overview?: string;
  genre_ids?: number[];
  original_language?: string;
  production_countries?: ProductionCountry[];
}

export interface TrendingResponse {
  page: number;
  results: TrendingItem[];
  total_pages: number;
  total_results: number;
}

export interface Video {
  id: string;
  key: string;
  name: string;
  site: string;
  type: string;
}

export interface MovieVideosResponse {
  id: number;
  results: Video[];
}

// Movie can extend TrendingItem to inherit common properties
export interface Movie extends TrendingItem {
  title: string; // Made required for Movie
  original_language: string; // Assuming it's always available for Movie
}

export interface Series extends TrendingItem {
  name: string; // Made required for Series
  first_air_date: string; // Made required for Series
}

export interface ProductionCountry {
  iso_3166_1: string;
  name: string;
}

export interface TrendingItem {
  id: number;
  title?: string;
  name?: string;
  poster_path?: string;
  backdrop_path?: string;
  release_date?: string;
  vote_average?: number;
  overview?: string;
  genre_ids?: number[];

  production_countries?: ProductionCountry[];
}

export interface TrendingResponse {
  page: number;
  results: TrendingItem[];
  total_pages: number;
  total_results: number;
}

export interface Video {
  id: string;
  key: string;
  name: string;
  site: string;
  type: string;
}

export interface MovieVideosResponse {
  id: number;
  results: Video[];
}

export interface Movie extends TrendingItem {
  // original_language is already inherited and required
}
export interface Movie {
  id: number;
  title: string; // Made required
  poster_path?: string;
  backdrop_path?: string;
  release_date?: string;
  vote_average?: number;
  overview?: string;
  genre_ids?: number[];
  original_language: string; // Assuming it's always available
  production_countries?: { iso_3166_1: string; name: string }[];
}

export interface TrendingItem {
  id: number;
  title?: string;
  name?: string;
  poster_path?: string;
  backdrop_path?: string;
  release_date?: string;
  vote_average?: number;
  overview?: string;
  genre_ids?: number[];

  production_countries?: ProductionCountry[];
  // Add any other properties as needed
}
export interface ProductionCountry {
  iso_3166_1: string;
  name: string;
}

export interface TrendingItem {
  id: number;
  title?: string; // Make this optional or required based on API data
  name?: string;
  poster_path?: string;
  backdrop_path?: string;
  release_date?: string;
  vote_average?: number;
  overview?: string;
  genre_ids?: number[];
  original_language?: string;
  production_countries?: ProductionCountry[];
  // Add any other properties as needed
}

export interface TrendingResponse {
  page: number;
  results: TrendingItem[];
  total_pages: number;
  total_results: number;
}

export interface Genre {
  id: number;
  name: string;
}

export interface Video {
  id: string;
  key: string;
  name: string;
  site: string;
  type: string;
}

export interface MovieVideosResponse {
  id: number;
  results: Video[];
}

// If you have a Movie interface, ensure it's correctly defined
export interface Movie extends TrendingItem {
  // Add any additional properties specific to Movie
}
