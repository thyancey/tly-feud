import { chainActions, setTransition } from './transition';

export const SET_DATA = 'SET_DATA';
export const setData = (data) => {
  return dispatch => {
    dispatch({
      type: SET_DATA,
      payload: data
    });
  }
}

export const SET_SHEET_DATA = 'SET_SHEET_DATA';
export const setSheetData = (data) => {
  return dispatch => {
    dispatch({
      type: SET_SHEET_DATA,
      payload: data
    });
  }
}

export const SET_TEAMS = 'SET_TEAMS';
export const setTeams = (teamLeft, teamRight) => {
  return dispatch => {
    dispatch({
      type: SET_TEAMS,
      payload: {
        left: teamLeft,
        right: teamRight
      }
    });
  }
}

export const SET_ACTIVE_TEAM = 'SET_ACTIVE_TEAM';
export const setActiveTeam = (team) => {
  return dispatch => {
    dispatch({
      type: SET_ACTIVE_TEAM,
      payload: team
    });
  }
}

export const START_ROUND = 'START_ROUND';
export const startRound = (payload) => {
  return dispatch => {
    dispatch({
      type: START_ROUND,
      payload: payload
    });
  }
}


export const REVEAL_ANSWER = 'REVEAL_ANSWER';
export const revealAnswer = (payload) => {
  return dispatch => {
    dispatch({
      type: REVEAL_ANSWER,
      payload: payload
    });
  }
}


export const END_ROUND = 'END_ROUND';
export const endRound = (payload) => {
  return dispatch => {
    dispatch({
      type: END_ROUND,
      payload: payload
    });
  }
}

export const ADVANCE_ROUND = 'ADVANCE_ROUND';
export const advanceRound = (payload) => {
  return dispatch => {
    dispatch({
      type: ADVANCE_ROUND,
      payload: payload
    });
  }
}

export const INCREMENT_SCORE = 'INCREMENT_SCORE';
export const incrementScore = (team, points) => {
  return dispatch => {
    dispatch({
      type: INCREMENT_SCORE,
      payload: {
        team: team,
        points: points
      }
    });
  }
}


export const THROW_STRIKE = 'THROW_STRIKE';
export const throwStrike = (payload) => {
  return dispatch => {
    dispatch({
      type: THROW_STRIKE,
      payload: payload
    });
  }
}

export const REVERT_STRIKE = 'REVERT_STRIKE';
export const revertStrike = (payload) => {
  return dispatch => {
    dispatch({
      type: REVERT_STRIKE,
      payload: payload
    });
  }
}

export const AWARD_POINTS = 'AWARD_POINTS';
export const awardPoints = (team, points) => {
  return dispatch => {
    dispatch({
      type: AWARD_POINTS,
      payload: {
        team: team,
        points: points
      }
    });
  }
}


export const TOGGLE_QUESTION = 'TOGGLE_QUESTION';
export const toggleQuestion = (toggleState) => {
  return dispatch => {
    dispatch({
      type: TOGGLE_QUESTION,
      payload: toggleState
    });
  }
}


export const SHOW_STRIKE = 'SHOW_STRIKE';
export const showStrike = (action, payload, delayed) => {

  if(!delayed){
    return dispatch => {
      action(payload)(dispatch);
    }
  }else{
    return dispatch => {
      strikeTransition(action, payload, dispatch);
    }
  }
}

export const strikeTransition = (action, payload, dispatch) => {
  chainActions([
    {
      delay: 0,
      action: setTransition,
      payload: {
        label: 'strikePopupOpen'
      }
    },
    {
      delay: 0,
      action: action,
      payload: payload
    },
    {
      delay: 1000,
      action: setTransition,
      payload: {
        label: ''
      }
    }
  ])(dispatch);
}

export const SHOW_TIMEUP = 'SHOW_TIMEUP';
export const showTimeUp = (payload, delayed) => {

  if(!delayed){
    return dispatch => {
      throwStrike(payload)(dispatch);
    }
  }else{
    return dispatch => {
      timeupTransition(throwStrike, payload, dispatch);
    }
  }
}

export const timeupTransition = (action, payload, dispatch) => {
  chainActions([
    {
      delay: 0,
      action: setTransition,
      payload: {
        label: 'timeupPopupOpen'
      }
    },
    {
      delay: 0,
      action: action,
      payload: payload
    },
    {
      delay: 1000,
      action: setTransition,
      payload: {
        label: ''
      }
    }
  ])(dispatch);
}

