export const CHAIN_ACTIONS = 'CHAIN_ACTIONS';
export const chainActions = (actionInstructions) => {
  return dispatch => {
    executeInstructions(actionInstructions, dispatch);
  }
}

//- used by the chainActions action
//- actionInstructions should be [ { action:function, payload:optional }, ... ]
export const executeInstructions = (actionInstructions, dispatch) => {
  return setTimeout(() => {
    actionInstructions[0].action(actionInstructions[0].payload)(dispatch);
    actionInstructions.shift();

    if(actionInstructions.length > 0){
      executeInstructions(actionInstructions, dispatch);
    }
  }, actionInstructions[0].delay || 0);
}


//- example transition action
export const SET_TRANSITION = 'SET_TRANSITION';
export const setTransition = (transitionData) => {
  return dispatch => {
    dispatch({
      type: SET_TRANSITION,
      payload: transitionData
    });
  }
}