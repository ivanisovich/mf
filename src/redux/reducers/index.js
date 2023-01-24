import { combineReducers } from 'redux';
import entities from './entities';
import pagination from './pagination';

const rootReducer = combineReducers({
  entities,
  pagination,

});

export default rootReducer;
