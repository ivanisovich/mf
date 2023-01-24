import { combineReducers } from "redux";

import moviesByDiscoverOptions from "./moviesByDiscoverOptions";

const pagination = combineReducers({
  moviesByDiscoverOptions,
});

export default pagination;
