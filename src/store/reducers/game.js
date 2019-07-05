import { 
  START_ROUND,
  END_ROUND,
  REVEAL_ANSWER,
  INCREMENT_SCORE,
  THROW_STRIKE,
  REVERT_STRIKE,
  SET_ACTIVE_TEAM
} from '../actions';

 
const initialState = {
  roundId: null,
  activeTeam: null,
  roundStart: null,
  revealed: [],
  multiplier: 2,
  teams: {
    left: {
      name: "",
      score: 0,
      strikes: 0
    },
    right: {
      name: "",
      score: 0,
      strikes: 0
    }
  }
}

export default (state = initialState, action) => {
  switch (action.type) {
    case START_ROUND:{
      console.log('START_ROUND', action.payload)
      const now = new Date().getTime();

      const teams = state.teams;
      teams.left.strikes = 0;
      teams.right.strikes = 0;

      return {
        ...state,
        roundId: action.payload,
        roundStart: now,
        revealed: [],
        teams:teams
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

    case SET_ACTIVE_TEAM:{
      return {
        ...state,
        activeTeam: action.payload
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


    case THROW_STRIKE:{
      const teams = state.teams;
      teams[state.activeTeam].strikes += 1;

      return {
        ...state,
        teams: teams
      }
    }

    case REVERT_STRIKE:{
      const teams = state.teams;
      teams[state.activeTeam].strikes -= 1;
      if(teams[state.activeTeam].strikes < 0){
        teams[state.activeTeam].strikes = 0;
      }

      return {
        ...state,
        teams: teams
      }
    }

    default:
      return state
  }
}