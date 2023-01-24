import client from "./client";

async function getMovieInfo(movieId, options = {}) {
  return await client.get(`/movie/${movieId}`, options);
}

async function discoverMovies(options = {}) {
  return await client.get("/discover/movie", options);
}

export default {
  getMovieInfo,
  discoverMovies,
};
