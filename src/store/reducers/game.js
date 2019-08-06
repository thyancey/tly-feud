import { 
  START_ROUND,
  END_ROUND,
  SET_SHEET_DATA,
  ADVANCE_ROUND,
  REVEAL_ANSWER,
  HIDE_ANSWER,
  TOGGLE_QUESTION,
  INCREMENT_SCORE,
  THROW_STRIKE,
  REVERT_STRIKE,
  AWARD_POINTS,
  SET_ACTIVE_TEAM,
  WIN_GAME
} from '../actions';

import {
  SET_TRANSITION
} from '../actions/transition';
 
const initialState = {
  roundId: 0,
  activeTeam: null,
  roundStart: null,
  roundActive: false,
  revealed: [],
  questionShowing: false,
  gameWon: false,
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
    case SET_SHEET_DATA:{
      const parsedData = action.payload;
      if(!parsedData){
        return {
          ...state
        }
      }else{
        return {
          ...state,
          roundId: 1
        }
      }
    }

    case START_ROUND:{
      console.log('START_ROUND', action.payload)
      const now = new Date().getTime();

      const teams = state.teams;
      teams.left.strikes = 0;
      teams.right.strikes = 0;

      return {
        ...state,
        roundActive: true,
        roundStart: now,
        revealed: [],
        teams:teams,
        transitionLabel:null,
        activeTeam: null
      }
    }

    case AWARD_POINTS:{
      const teams = state.teams;
      teams[action.payload.team].score += action.payload.points;

      return {
        ...state,
        teams: teams
      }
    }

    case TOGGLE_QUESTION:{
      return {
        ...state,
        questionShowing: action.payload || false
      }
    }
    
    case END_ROUND:{
      console.log('END_ROUND')
      return {
        ...state,
        roundActive: false
      }
    }

    case ADVANCE_ROUND:{
      return {
        ...state,
        roundId: state.roundId + 1,
        activeTeam: null,
        questionShowing: false
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

    case HIDE_ANSWER:{
      if(state.revealed.indexOf(action.payload) > -1){
        return {
          ...state,
          revealed: state.revealed.filter(s => s !== action.payload)
        }
      }else{
        return {
          ...state
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
      if(!teams[state.activeTeam]){
        return { ...state }
      }else{
        if(teams[state.activeTeam].strikes < 3){
          teams[state.activeTeam].strikes += 1;
        }

        return {
          ...state,
          teams: teams
        }
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

    case WIN_GAME:{
      return {
        ...state,
        gameWon: true
      }
    }

    case SET_TRANSITION:{
      console.log('transitionLabel:', action.payload.label);
      return {
        ...state,
        transitionLabel: action.payload.label
      }
    }


    default:
      return state
  }
}