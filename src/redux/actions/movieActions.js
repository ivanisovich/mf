import { decamelizeKeys } from "humps";
import Schemas from "../schemas";
import { movieAPI } from "../../api";
import { stringifyFilters } from "../../utils/queryString";

const LOAD_MOVIE_INFO_REQUEST = "LOAD_MOVIE_INFO_REQUEST";
const LOAD_MOVIE_INFO_SUCCESS = "LOAD_MOVIE_INFO_SUCCESS";
const LOAD_MOVIE_INFO_FAILURE = "LOAD_MOVIE_INFO_FAILURE";

export function loadMovieInfo(movieId, options = {}, requiredFields = []) {
  return {
    types: [
      LOAD_MOVIE_INFO_REQUEST,
      LOAD_MOVIE_INFO_SUCCESS,
      LOAD_MOVIE_INFO_FAILURE,
    ],
    payload: { movieId, options },
    schema: Schemas.MOVIE,
    callAPI: () => movieAPI.getMovieInfo(movieId, decamelizeKeys(options)),
    shouldCallAPI: (state) => {
      const movie = state.entities.movies[movieId];

      if (movie && requiredFields.every((key) => movie.hasOwnProperty(key))) {
        return false;
      }

      return true;
    },
  };
}

const DISCOVER_MOVIES_REQUEST = "DISCOVER_MOVIES_REQUEST";
const DISCOVER_MOVIES_SUCCESS = "DISCOVER_MOVIES_SUCCESS";
const DISCOVER_MOVIES_FAILURE = "DISCOVER_MOVIES_FAILURE";

export function discoverMovies(options = {}) {
  return {
    types: [
      DISCOVER_MOVIES_REQUEST,
      DISCOVER_MOVIES_SUCCESS,
      DISCOVER_MOVIES_FAILURE,
    ],
    payload: { options },
    schema: Schemas.MOVIE_ARRAY,
    callAPI: () => movieAPI.discoverMovies(decamelizeKeys(options)),
    shouldCallAPI: (state) => {
      const { page, ...filters } = options;
      const query = stringifyFilters(filters);
      const { pages = {} } =
        state.pagination.moviesByDiscoverOptions[query] || {};
      const movieIdsOfSelectedPage = pages[options.page];
      return !movieIdsOfSelectedPage;
    },
  };
}

const SIMILAR_MOVIES_REQUEST = "SIMILAR_MOVIES_REQUEST";
const SIMILAR_MOVIES_SUCCESS = "SIMILAR_MOVIES_SUCCESS";
const SIMILAR_MOVIES_FAILURE = "SIMILAR_MOVIES_FAILURE";

export function getSimilarMovies(movieId, options = {}) {
  return {
    types: [
      SIMILAR_MOVIES_REQUEST,
      SIMILAR_MOVIES_SUCCESS,
      SIMILAR_MOVIES_FAILURE,
    ],
    payload: { movieId, options },
    schema: Schemas.MOVIE_ARRAY,
    callAPI: () => movieAPI.getSimilarMovies(movieId, decamelizeKeys(options)),
    shouldCallAPI: (state) => {
      const { page, ...filters } = options;
      const query = stringifyFilters(filters);
      const { pages = {} } =
        state.pagination.moviesByDiscoverOptions[query] || {};
      const movieIdsOfSelectedPage = pages[options.page];
      return !movieIdsOfSelectedPage;
    },
  };
}

export const MovieActionTypes = {
  SIMILAR_MOVIES_REQUEST,
  SIMILAR_MOVIES_SUCCESS,
  SIMILAR_MOVIES_FAILURE,
  LOAD_MOVIE_INFO_REQUEST,
  LOAD_MOVIE_INFO_SUCCESS,
  LOAD_MOVIE_INFO_FAILURE,
  DISCOVER_MOVIES_REQUEST,
  DISCOVER_MOVIES_SUCCESS,
  DISCOVER_MOVIES_FAILURE,
};
