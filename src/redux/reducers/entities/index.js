import _merge from "lodash/merge";

const entities = (state = { movies: {} }, action) => {
  const entities =
    action.response && action.response.data && action.response.data.entities;

  if (entities) {
    return _merge({}, state, entities);
  }
  return state;
};

export default entities;
