import { 
  SET_DATA
} from '../actions';
import { SET_TRANSITION } from '../actions/transition';

//- initialState data is overwritten from an external json file in public/data.json
const ALLOWED_STORED_FIELDS = [ 'title', 'surveys' ];
 
const initialState = {
  loaded: false,
  title: 'loading',
  game: {
    activeId: -1,
    activeTeam: null,
    roundStart: null,
    roundEnd: null
  }
}

export default (state = initialState, action) => {
  switch (action.type) {
    case SET_DATA:{
      const cleanObj = {};
      const parsedData = action.payload;
      for(let key in parsedData){
        if(ALLOWED_STORED_FIELDS.indexOf(key) === -1){
          console.error(`stored dataField "${key}" is not a valid key`);
        }else{
          cleanObj[key] = parsedData[key];
        }
      }

      return {
        ...state,
        ...cleanObj,
        loaded: true
      }
    }

    case SET_TRANSITION:{
      return {
        ...state,
        transitionLabel: action.payload.label
      }
    }

    default:
      return state
  }
}