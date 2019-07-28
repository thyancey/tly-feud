import React, { Component } from 'react';
import styled from 'styled-components';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import { themeGet } from 'themes/';
import Answer from './answer';
import Scorebox from './scorebox';
import GameControls from './controls';

import { 
  startRound, 
  revealAnswer, 
  hideAnswer,
  setActiveTeam, 
  throwStrike, 
  showStrike, 
  revertStrike 
} from 'store/actions';
import { createSelector_getSurvey } from 'store/selectors';

import UIfx from 'uifx';
import SoundReveal from 'assets/sounds/reveal.wav';
import SoundStrike from 'assets/sounds/strike.wav';
const soundReveal = new UIfx({asset: SoundReveal});
const soundStrike = new UIfx({asset: SoundStrike});


const HtmlContainer = styled.div`
  position:absolute;
  left:.5rem;
  top:.5rem;
  right:.5rem;
  bottom:.5rem;
  overflow:hidden;
  padding:1rem;

  display: grid;
  grid-template-columns: 21rem 1fr 21rem;
  grid-template-rows: 21rem 1fr 1fr;

  border-radius: 10rem;

  background-color:  ${themeGet('color', 'tealDark')};
  border: 1rem solid ${themeGet('color', 'tealLight')};
  color: ${themeGet('color', 'blue')};
`

const HtmlAnswerGrid = styled.div`
  grid-column: 2 / span 1;
  grid-row: 2 / span 1;

  display:grid;
  grid-template-columns: 1fr 1fr;
  grid-template-rows: 1fr;
  padding:2rem;
  border-radius:3.2rem;
  
  background-color:  ${themeGet('color', 'greyDark')};
`

const HtmlAnswerColumn = styled.ul`
  grid-column: 1 / span 2;
  grid-row: 1 / span 1;

  height:100%;

  margin:0;
  padding:0;
`

const HtmlAnswerColumnDouble = styled(HtmlAnswerColumn)`
  grid-column: ${props => props.position} / span 1;
`

const HtmlRoundBox = styled.div`
  grid-column: 2 / span 1;
  grid-row: 1 / span 1;

`


const HtmlRoundLabel = styled.div`
  font-size: 3rem;
  height:5rem;
  text-align:center;
`

const HtmlRoundTitle = styled.div`
  height:calc(100% - 5rem);
  font-size: 5rem;
  margin-left:10%;
  width:80%;
  border-radius: 2rem 2rem 0 0;
  background-color: ${themeGet('color', 'greyDark')};
  padding:1.5rem;
  padding-bottom:0;
  
  text-shadow: ${themeGet('shadow', 'text')};

  div{
    height:100%;
    padding:1rem 2rem;
    border-radius: 1rem 1rem 0 0;
    background-image: linear-gradient(to bottom, #0090ff, #006dc7);

    position:relative;

    span{
      position:absolute;
      top:50%;
      transform:translateY(-50%);
    }
  }
`

class Scoreboard extends Component {

  renderAnswer(answerObj, i){
    return (
      <Answer 
        key={i} 
        label={answerObj.idx + 1}
        revealed={answerObj.revealed}
        title={answerObj.value} 
        score={answerObj.points} 
        onClick={ () => this.onAnswerClick(answerObj.idx, answerObj.revealed) }
      />) 
  }

  renderAnswerColumn(answers, column){
    if(column === 'left'){
      return answers.filter((a,i) => i < 4).map((a,i) => (
        this.renderAnswer(a, i)
      ));
    }else{
      return answers.filter((a,i) => i > 3).map((a,i) => (
        this.renderAnswer(a, i)
      ));
    }

  }

  renderSurvey(surveyData){
    if(!surveyData){
      return null;
    }else{
      if(surveyData.answers.length <= 4){
        //- single column survey
        return (
          <HtmlAnswerGrid>
            <HtmlAnswerColumn>
              { this.renderAnswerColumn(surveyData.answers, 'left') }
            </HtmlAnswerColumn>
          </HtmlAnswerGrid>
        );
      }else{

        //- double column survey
        return (
          <HtmlAnswerGrid>
            <HtmlAnswerColumnDouble position="1">
              { this.renderAnswerColumn(surveyData.answers, 'left') }
            </HtmlAnswerColumnDouble>
            <HtmlAnswerColumnDouble position="2">
              { this.renderAnswerColumn(surveyData.answers, 'right') }
            </HtmlAnswerColumnDouble>
          </HtmlAnswerGrid>
        );
      }
    }
  }

  startRound(id){
    this.props.startRound(id);
  }

  onAnswerClick(answerIdx, revealed){
    if(revealed){
      this.props.hideAnswer(answerIdx);
    }else{
      soundReveal.setVolume(.5).play();
      this.props.revealAnswer(answerIdx);
    }
  }

  renderRoundBox(survey, questionShowing){
    if(!survey){
      return (
        <HtmlRoundBox>
          <span></span>
        </HtmlRoundBox>
      );
    }else{
      return (
        <HtmlRoundBox>
          <HtmlRoundLabel>
            <span>{`Round ${survey.id} (x${this.props.survey.multiplier})`}</span>
          </HtmlRoundLabel>
          <HtmlRoundTitle>
            <div>
              { questionShowing && (
                <span>{survey.title}</span>
              )}
            </div>
          </HtmlRoundTitle>
        </HtmlRoundBox>
      );
    }

  }

  throwStrike(){
    soundStrike.setVolume(.5).play();
    this.props.showStrike(throwStrike, null, true);
  }
  revertStrike(){
    this.props.revertStrike();
  }

  render(){
    return(
      <HtmlContainer id="scoreboard" >
        { this.renderRoundBox(this.props.survey, this.props.questionShowing) }
        <Scorebox 
          position="left" 
          active={this.props.activeTeam === 'left'}
          name={this.props.teams.left.name} 
          score={this.props.leftScore} 
          strikes={this.props.leftStrikes } 
          onAddStrike={() => this.throwStrike()}
          onRemoveStrike={() => this.revertStrike()}
          onClick={() => this.props.setActiveTeam('left')} />
        { this.renderSurvey(this.props.survey) }
        <Scorebox
          position="right" 
          active={this.props.activeTeam === 'right'}
          name={this.props.teams.right.name} 
          score={this.props.rightScore} 
          strikes={this.props.rightStrikes } 
          onAddStrike={() => this.throwStrike()}
          onRemoveStrike={() => this.revertStrike()}
          onClick={() => this.props.setActiveTeam('right')} />
        <GameControls />
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
    leftScore: state.game.teams.left.score,
    roundActive: state.game.roundActive,
    leftStrikes: state.game.teams.left.strikes,
    rightScore: state.game.teams.right.score,
    rightStrikes: state.game.teams.right.strikes,
    activeTeam: state.game.activeTeam,
    questionShowing: state.game.questionShowing
  });

  return mapStateToProps;
}

const mapDispatchToProps = dispatch =>
  bindActionCreators(
    { 
      startRound, 
      revealAnswer, 
      hideAnswer, 
      setActiveTeam, 
      throwStrike, 
      showStrike, 
      revertStrike 
    },
    dispatch
  )

export default connect(
  makeMapStateToProps,
  mapDispatchToProps
)(Scoreboard)

