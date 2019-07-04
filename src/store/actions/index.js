export const SET_DATA = 'SET_DATA';
export const setData = (data) => {
  return dispatch => {
    dispatch({
      type: SET_DATA,
      payload: data
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
export const endRound = (team, points) => {
  return dispatch => {
    dispatch({
      type: END_ROUND,
      payload: {
        team: team,
        points: points
      }
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