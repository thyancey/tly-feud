export const SET_DATA = 'SET_DATA';
export const setData = (data) => {
  return dispatch => {
    dispatch({
      type: SET_DATA,
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

