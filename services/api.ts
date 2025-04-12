export const TMDB_CONFIG = {
  BASE_URL: "https://api.themoviedb.org/3",
  API_KEY: process.env.EXPO_PUBLIC_TMDB_API_KEY,
  headers: {
    accept: "application/json",
    Authorization: `Bearer ${process.env.EXPO_PUBLIC_TMDB_BEARER_TOKEN}`,
  },
};

import axios from "axios";

export const fetchMovies = async ({ query }: { query: string }) => {
  const endPoint = query
    ? `${TMDB_CONFIG.BASE_URL}/search/movie?query=${encodeURIComponent(query)}&include_adult=true`
    : `${TMDB_CONFIG.BASE_URL}/discover/movie?include_adult=true&include_video=false&language=en-US&page=1&region=IN&sort_by=popularity.desc&with_origin_country=IN&with_original_language=hi`;
  const response = await axios.get(endPoint, {
    headers: TMDB_CONFIG.headers,
  });

  if (response.status !== 200) {
    throw new Error(`Failed to fetch movies: ${response.statusText}`);
  }

  const data = response.data;

  return data.results;
};

export const fetchSeries = async() => {
  const endpoint = `${TMDB_CONFIG.BASE_URL}/discover/tv?include_adult=true&include_null_first_air_dates=false&language=en-US&page=1&sort_by=vote_count.desc&with_origin_country=IN&with_original_language=hi`

  const response = await axios.get(endpoint, {
    headers: TMDB_CONFIG.headers,
  })

  if(response.status !== 200) {
    throw new Error(`Failed to fetch series: ${response.statusText}`);
  }

  const data = response.data;
  return data.results;
}

export const fetchMovieDetails = async (id: string) => {
  try{
    const endpoint = `${TMDB_CONFIG.BASE_URL}/movie/${id}?api_key=${TMDB_CONFIG.API_KEY}`;
    const response = await axios.get(endpoint, {
      headers: TMDB_CONFIG.headers,
    })

    if(response.status !== 200) {
      throw new Error(`Failed to fetch movie details: ${response.statusText}`);
    }

    const data = response.data;
    return data;
  }
  catch (error) {
    console.error("Error fetching movie details:", error);
    throw error;
  }
};

export const fetchSeriesDetails = async (id: string) => {
  try{
    const endpoint = `${TMDB_CONFIG.BASE_URL}/tv/${id}?api_key=${TMDB_CONFIG.API_KEY}`;
    const response = await axios.get(endpoint, {
      headers: TMDB_CONFIG.headers,
    })

    if(response.status !== 200) {
      throw new Error(`Failed to fetch movie details: ${response.statusText}`);
    }

    const data = response.data;
    return data;
  }
  catch (error) {
    console.error("Error fetching movie details:", error);
    throw error;
  }
};

