import React, { Component } from 'react';
import styled from 'styled-components';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { createSelector } from 'reselect';

import { themeGet } from 'themes/';
import Answer from './answer';
import { startRound, revealAnswer, incrementScore, endRound } from 'store/actions';

const HtmlContainer = styled.div`
  position:absolute;
  left:10%;
  top:10%;
  right:10%;
  bottom:10%;
  overflow:hidden;

  display: grid;
  grid-template-columns: 15% 1fr 15%;
  grid-template-rows: 15% 1fr 15%;

  border-radius: 3rem;

  background-color:  ${themeGet('color', 'purple')};
  color: ${themeGet('color', 'blue')};
`

const HtmlAnswerGrid = styled.div`
  grid-column: 2 / span 1;
  grid-row: 2 / span 1;

  display:grid;
  grid-template-columns: 1fr 1fr;
  grid-template-rows: 1fr;
  
  border:.5rem solid red;
`

const HtmlAnswerColumn = styled.ul`
  grid-column: 1 / span 2;
  grid-row: 1 / span 1;

  border: 2px solid white;
  height:100%;

  margin:0;
  padding:0;
`

const HtmlAnswerColumnDouble = styled(HtmlAnswerColumn)`
  grid-column: ${props => props.position} / span 1;
`



const HtmlTimer = styled.div`
  grid-column: 2 / span 1;
  grid-row: 1 / span 1;

  top:50%;
  transform: translateY(-50%);
  position:absolute;
  width:100%;
  text-align:center;
  border:.5rem solid blue;
`

const HtmlScoreBlock = styled.div`
  grid-column: ${props => props.position} / span 1;
  grid-row: 2 / span 1;

  top:50%;
  transform: translateY(-50%);
  position:absolute;
  left:0;
  right:0;
  text-align:center;
  vertical-align:middle;
  border:.5rem solid yellow;
`

const HtmlFooter = styled.div`
  grid-column: 1 / span 3;
  grid-row: 3 / span 1;

  top:50%;
  transform: translateY(-50%);
  position:absolute;
  width:100%;
  text-align:center;
  border:.5rem solid blue;
`

class Scoreboard extends Component {
  constructor(){
    super();
  }

  renderSurvey(surveyData){
    if(!surveyData){
      return null;
    }else{
      if(surveyData.answers.length < 4){
        return (
          <HtmlAnswerGrid>
            <HtmlAnswerColumn>
              { surveyData.answers.map((s, i) => (
                <Answer key={i} title={s.value} score={s.points} />
              ))}
            </HtmlAnswerColumn>
          </HtmlAnswerGrid>
        );
      }else{
        //- odd
        return (
          <HtmlAnswerGrid>
            <HtmlAnswerColumnDouble position="1">
              { surveyData.answers.filter((s, i) => (
                i < surveyData.answers.length / 2
              )).map((s, i) => (
                <Answer 
                  key={i} 
                  label={i + 1}
                  revealed={s.revealed}
                  title={s.value} 
                  score={s.points} 
                  onClick={ () => this.onAnswerClick(s.idx) }
                  />
              ))}
            </HtmlAnswerColumnDouble>
            <HtmlAnswerColumnDouble position={2}>
            { surveyData.answers.filter((s, i) => (
              i >= surveyData.answers.length / 2
              )).map((s, i) => (
                <Answer 
                  key={i} 
                  label={i + 1}
                  revealed={s.revealed}
                  title={s.value} 
                  score={s.points} 
                  onClick={ () => this.onAnswerClick(s.idx) }
                  />
              ))}
            </HtmlAnswerColumnDouble>
          </HtmlAnswerGrid>
        );
      }

    }
  }

  renderTimer(startTime, endTime){
    const time = '00:13';
    return (
      <HtmlTimer onClick={() => this.onTimerClick()}>
        <h2>{time}</h2>
      </HtmlTimer>
    );
  }

  startRound(){
    this.props.startRound({ id: "2", team:  "jibbles"});
  }

  onAnswerClick(answerIdx){
    this.props.revealAnswer(answerIdx);
  }

  onTimerClick(){
    this.props.endRound(this.props.activeTeam, this.props.survey.score);
  }


  render(){
    return(
      <HtmlContainer id="scoreboard" >
        { this.renderTimer() }
        <h1>{this.props.title}</h1>
        <HtmlScoreBlock position={1}>
          <p>{this.props.teams.left.name}</p>
          <h3>{this.props.leftScore}</h3>
        </HtmlScoreBlock>
        { this.renderSurvey(this.props.survey) }
        <HtmlScoreBlock position={3}>
          <p>{this.props.teams.right.name}</p>
          <h3>{this.props.rightScore}</h3>
        </HtmlScoreBlock>
        <HtmlFooter>
          <h3>{this.props.survey && this.props.survey.title}</h3>
          <p>{`MULTIPLIER: X${this.props.multiplier}`}</p>
        </HtmlFooter>
      </HtmlContainer>
    );
  }
}

export const createSelector_getSurvey = () => {
  return createSelector(
    [ 
      state => state.data.surveys, 
      state => state.game.activeId, 
      state => state.game.revealed, 
      state => state.game.multiplier 
    ],
    (surveys, activeId, revealed, multiplier) => {
      const foundSurvey = surveys && surveys.find(s => s.id === activeId);
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

const makeMapStateToProps = () => {
  const getSurvey = createSelector_getSurvey();
  const mapStateToProps = (state, props) => ({
    survey: getSurvey(state, props),
    title: state.data.title,
    teams: state.game.teams,
    multiplier: state.game.multiplier,
    leftScore: state.game.teams.left.score,
    rightScore: state.game.teams.right.score,
    activeTeam: state.game.activeTeam
  });

  return mapStateToProps;
}

const mapDispatchToProps = dispatch =>
  bindActionCreators(
    { startRound, revealAnswer, incrementScore, endRound },
    dispatch
  )

export default connect(
  makeMapStateToProps,
  mapDispatchToProps
)(Scoreboard)

