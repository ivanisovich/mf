import { schema } from 'normalizr';

const movieSchema = new schema.Entity('movies');

const Schemas = {
  MOVIE: movieSchema,
  MOVIE_ARRAY: [movieSchema],
};

export default Schemas;
