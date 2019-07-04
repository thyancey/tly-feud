import { combineReducers } from 'redux';
import data from './reducers/data';
import game from './reducers/game';

export default combineReducers({
  data,
  game
})
