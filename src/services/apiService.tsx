// src/services/apiService.ts

import axios, { AxiosResponse } from "axios";
import {
  TrendingResponse,
  TrendingItem,
  Genre,
  Video,
  MovieVideosResponse,
} from "../types/index";

// Define API key and base URL
const API_KEY = process.env.REACT_APP_TMDB_API_KEY;
const BASE_URL = "https://api.themoviedb.org/3";

// Check if API key is defined
if (!API_KEY) {
  throw new Error(
    "REACT_APP_TMDB_API_KEY is not defined. Please set it in your .env file."
  );
}

// Create an Axios instance with base URL and API key as default parameters
const axiosInstance = axios.create({
  baseURL: BASE_URL,
  params: {
    api_key: API_KEY,
  },
});

// Utility function for GET requests with generic typing
const apiGet = async <T,>(url: string): Promise<T> => {
  try {
    const response: AxiosResponse<T> = await axiosInstance.get(url);
    return response.data;
  } catch (error: unknown) {
    console.error(`Error fetching ${url}:`, error);

    if (axios.isAxiosError(error)) {
      const message =
        (error.response?.data as any)?.status_message ||
        `Failed to fetch ${url}. Status code: ${error.response?.status}`;
      throw new Error(message);
    } else {
      throw new Error("An unexpected error occurred");
    }
  }
};

// Fetch trending movies
export const fetchTrendingMovies = async (
  timeWindow: "day" | "week" = "week"
): Promise<TrendingResponse> => {
  return apiGet<TrendingResponse>(`/trending/movie/${timeWindow}`);
};

// Fetch genres
export const fetchGenres = async (): Promise<Genre[]> => {
  const data = await apiGet<{ genres: Genre[] }>("/genre/movie/list");
  return data.genres;
};

// Fetch movie videos
export const fetchMovieVideos = async (movieId: number): Promise<Video[]> => {
  const data = await apiGet<MovieVideosResponse>(`/movie/${movieId}/videos`);
  return data.results;
};

// Fetch top-rated movies
export const fetchTopRatedMovies = async (): Promise<TrendingResponse> => {
  return apiGet<TrendingResponse>("/movie/top_rated");
};

// Fetch trending series (optional, if needed)
export const fetchTrendingSeries = async (
  timeWindow: "day" | "week" = "week"
): Promise<TrendingResponse> => {
  return apiGet<TrendingResponse>(`/trending/tv/${timeWindow}`);
};
// Henter topprangerte serier
export const fetchTopRatedSeries = async () => {
  try {
    const response = await axiosInstance.get("/tv/top_rated"); // Gjør en GET-forespørsel til /tv/top_rated
    return response.data; // Returnerer dataene fra responsen
  } catch (error) {
    console.error("Error fetching top-rated series:", error); // Logger feilmeldinger
    throw error; // Kaster feilen videre
  }
};
export const fetchPopularSeries = async () => {
  try {
    const response = await axiosInstance.get(`/tv/popular`); // Gjør en GET-forespørsel til /tv/popular
    return response.data;
  } catch (error) {
    console.error("Error fetching popular series:", error);
    throw error;
  }
};
