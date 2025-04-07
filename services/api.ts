export const TMDB_CONFIG = {
  BASE_URL: "https://api.themoviedb.org/3",
  API_KEY: process.env.EXPO_PUBLIC_TMDB_API_KEY,
  headers: {
    accept: "application/json",
    Authorization: `Bearer ${process.env.EXPO_PUBLIC_TMDB_BEARER_TOKEN}`,
  },
};

import axios from "axios";

// const options = {
//   method: 'GET',
//   url: 'https://api.themoviedb.org/3/discover/movie?include_adult=false&include_video=false&language=en-US&page=1&sort_by=popularity.desc',
//   headers: {
//     accept: 'application/json',
//     Authorization: 'Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiJlM2Y0ODE0ZmEzNDk3M2YwNGI0MmUzYmNiNjNmMzVlZSIsIm5iZiI6MTc0NDA0MTk3MS4wOTksInN1YiI6IjY3ZjNmN2YzN2I0M2JkY2UyMGFkNDA2YSIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.qVNx8AQRnNkGThJ6htFfryuaEVBEwWcCvWScFQzz88w'
//   }
// };

// axios
//   .request(options)
//   .then(res => console.log(res.data))
//   .catch(err => console.error(err));

export const fetchMovies = async ({ query }: { query?: string }) => {
  const endPoint = query
    ? `${TMDB_CONFIG.BASE_URL}/search/movie?query=${encodeURIComponent(query)}`
    : `${TMDB_CONFIG.BASE_URL}/discover/movie?include_adult=true&include_video=false&language=en-US&page=1&sort_by=popularity.desc`;
  const response = await axios.get(endPoint, {
    headers: TMDB_CONFIG.headers,
  });

  if (response.status !== 200) {
    throw new Error(`Failed to fetch movies: ${response.statusText}`);
  }

  const data = response.data;

  return data.results;
};
