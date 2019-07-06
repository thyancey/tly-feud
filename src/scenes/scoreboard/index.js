import React, { Component } from 'react';
import styled from 'styled-components';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import { themeGet } from 'themes/';
import Answer from './answer';
import Scorebox from './scorebox';
import { startRound, revealAnswer, incrementScore, endRound, setActiveTeam } from 'store/actions';
import { createSelector_getSurvey } from 'store/selectors';

import SoundHorn from 'assets/sounds/bikehorn.wav';
import UIfx from 'uifx';
const soundHorn = new UIfx({asset: SoundHorn});


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

  componentDidMount(){
    if(!this.props.roundId){
      this.startRound('1');
    }
  }

  renderSurvey(surveyData){
    if(!surveyData){
      return null;
    }else{
      if(surveyData.answers.length <= 4){
        return (
          <HtmlAnswerGrid>
            <HtmlAnswerColumn>
              { surveyData.answers.map((s, i) => (
                <Answer 
                  key={i} 
                  label={i + 1}
                  revealed={s.revealed}
                  title={s.value} 
                  score={s.points} 
                  onClick={ () => this.onAnswerClick(s.idx) }
                  />
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

  startRound(id){
    this.props.startRound(id);
  }

  onAnswerClick(answerIdx){
    soundHorn.setVolume(.5).play();
    this.props.revealAnswer(answerIdx);
  }

  onTimerClick(){
    this.props.endRound(this.props.survey.score);
  }


  render(){
    return(
      <HtmlContainer id="scoreboard" >
        { this.renderTimer() }
        <h1>{this.props.title}</h1>
        <Scorebox 
          position="left" 
          active={this.props.activeTeam === 'left'}
          name={this.props.teams.left.name} 
          score={this.props.leftScore} 
          strikes={this.props.leftStrikes } 
          onClick={() => this.props.setActiveTeam('left')} />
        { this.renderSurvey(this.props.survey) }
        <Scorebox
          position="right" 
          active={this.props.activeTeam === 'right'}
          name={this.props.teams.right.name} 
          score={this.props.rightScore} 
          strikes={this.props.rightStrikes } 
          onClick={() => this.props.setActiveTeam('right')} />
        <HtmlFooter>
          <h3>{this.props.survey && this.props.survey.title}</h3>
          <p>{`MULTIPLIER: X${this.props.multiplier}`}</p>
        </HtmlFooter>
      </HtmlContainer>
    );
  }
}

const makeMapStateToProps = () => {
  const getSurvey = createSelector_getSurvey();
  const mapStateToProps = (state, props) => ({
    survey: getSurvey(state, props),
    title: state.data.title,
    teams: state.game.teams,
    roundId: state.game.roundId,
    multiplier: state.game.multiplier,
    leftScore: state.game.teams.left.score,
    leftStrikes: state.game.teams.left.strikes,
    rightScore: state.game.teams.right.score,
    rightStrikes: state.game.teams.right.strikes,
    activeTeam: state.game.activeTeam
  });

  return mapStateToProps;
}

const mapDispatchToProps = dispatch =>
  bindActionCreators(
    { startRound, revealAnswer, incrementScore, endRound, setActiveTeam },
    dispatch
  )

export default connect(
  makeMapStateToProps,
  mapDispatchToProps
)(Scoreboard)

