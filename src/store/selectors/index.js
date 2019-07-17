
import { createSelector } from 'reselect';

export const createSelector_getSurvey = () => {
  return createSelector(
    [ 
      state => state.data.surveys, 
      state => state.game.roundId, 
      state => state.game.revealed
    ],
    (surveys, roundId, revealed) => {
      const foundSurvey = surveys && surveys.find(s => s.id === roundId);
      if(foundSurvey){
        let score = 0;

        foundSurvey.answers.map((s, i) => {
          if(revealed.indexOf(i) > -1){
            score += s.points * foundSurvey.multiplier;

            s.revealed = true;
            s.idx = i;
            return s;
          }else{
            s.revealed = false;
            s.idx = i;
            return s;
          }
        });

        foundSurvey.score = score;

        return {
          ...foundSurvey
        }
      }

      return null;
    }
  )
}

export const createSelector_getWinningTeam = () => {
  return createSelector(
    [ 
      state => state.game.teams 
    ],
    (teams) => {
      if(teams.left && teams.right){
        if(teams.left.score > teams.right.score){
          return {
            ...teams.left,
            position: 'left'
          };
        }else{
          return {
            ...teams.right,
            position: 'right'
          };
        }  
      }else{
        return null;
      }
    }
  )
}