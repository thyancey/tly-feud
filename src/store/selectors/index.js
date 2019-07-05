
import { createSelector } from 'reselect';

export const createSelector_getSurvey = () => {
  return createSelector(
    [ 
      state => state.data.surveys, 
      state => state.game.roundId, 
      state => state.game.revealed, 
      state => state.game.multiplier 
    ],
    (surveys, roundId, revealed, multiplier) => {
      const foundSurvey = surveys && surveys.find(s => s.id === roundId);
      if(foundSurvey){
        let score = 0;

        foundSurvey.answers.map((s, i) => {
          if(revealed.indexOf(i) > -1){
            score += s.points * multiplier;

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
