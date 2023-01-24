import _memoize from 'lodash/memoize';
import { stringifyParams } from '../base';
import getGenres from './getGenres';

export const stringifyFilters = _memoize(
  (filters = {}) => {
    return stringifyParams(filters);
  },
  (filters = {}) => {
    const keys = Object.keys(filters).sort();

    const filtersWithOrderedKeys = {};
    keys.forEach(key => {
      const value = filters[key];

      if (Array.isArray(value)) {
        filtersWithOrderedKeys[key] = [...value].sort();
      } else {
        filtersWithOrderedKeys[key] = filters[key];
      }
    });

    return JSON.stringify(filtersWithOrderedKeys);
  }
);

export const getFilters = _memoize((queryString = '') => {
  

  const withGenres = getGenres(queryString);
  return {
    withGenres
  };
});
