import { 
  START_ROUND,
  END_ROUND,
  REVEAL_ANSWER,
  INCREMENT_SCORE
} from '../actions';

 
const initialState = {
  activeId: "1",
  activeTeam: "left",
  roundStart: null,
  revealed: [],
  multiplier: 2,
  teams: {
    left: {
      name: "The Wining Team",
      score: 0
    },
    right: {
      name: "The Chris Team",
      score: 0
    }
  }
}

export default (state = initialState, action) => {
  switch (action.type) {
    case START_ROUND:{
      const now = new Date().getTime();

      return {
        ...state,
        activeId: action.payload.id,
        activeTeam: action.payload.team,
        roundStart: now
      }
    }

    case REVEAL_ANSWER:{
      if(state.revealed.indexOf(action.payload) > -1){
        return {
          ...state
        }
      }else{

        return {
          ...state,
          revealed: [].concat(state.revealed, action.payload)
        }
      }
    }
    
    case INCREMENT_SCORE:{
      const teams = state.teams;
      teams[action.payload.team].score += action.payload.points;

      return {
        ...state,
        teams: teams
      } 
    }

    case END_ROUND:{
      console.log('its over', action.payload.team)
      const teams = state.teams;

      teams[action.payload.team].score += action.payload.points;

      return {
        ...state,
        roundStart: -1,
        teams: teams
      }
    }

    default:
      return state
  }
}