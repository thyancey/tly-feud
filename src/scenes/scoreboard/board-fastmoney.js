import React, { Component } from 'react';
import styled from 'styled-components';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import { themeGet } from 'themes/';
import Answer from './answer-fastmoney';
import Scorebox from './scorebox';
import GameControls from './controls';

import { 
  startRound, 
  revealAnswer, 
  hideAnswer,
  setActiveTeam
} from 'store/actions';
import { createSelector_getSurvey } from 'store/selectors';

import UIfx from 'uifx';
import SoundFastMoneyAnswer from 'assets/sounds/fastmoney-answer.wav';
import SoundFastMoneyScore from 'assets/sounds/fastmoney-score.wav';
import SoundFastMoney0 from 'assets/sounds/fastmoney-0.wav';
import SoundFastMoneyStrike from 'assets/sounds/fastmoney-tryagain.wav';

const soundFastMoneyAnswer = new UIfx({asset: SoundFastMoneyAnswer});
const soundFastMoneyScore = new UIfx({asset: SoundFastMoneyScore});
const soundFastMoney0 = new UIfx({asset: SoundFastMoney0});
const soundFastMoneyStrike = new UIfx({asset: SoundFastMoneyStrike});


const HtmlContainer = styled.div`
  position:absolute;
  left:.5rem;
  top:.5rem;
  right:.5rem;
  bottom:.5rem;
  overflow:hidden;
  padding:1rem;

  display: grid;
  grid-template-columns: 5.5rem 1fr 5.5rem;
  grid-template-rows: 5.5rem 1fr 1fr;

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
  
  background-blend-mode: overlay;
  background-image: linear-gradient(
    to bottom, 
    ${themeGet('color', 'blueLight')}, 
    ${themeGet('color', 'blue')}), 
    radial-gradient(circle at 50% 0, ${themeGet('color', 'teal')}, ${themeGet('color', 'blue')}
  );

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

const HtmlScoreBox = styled.li`
  position:relative;
  display:block;
  overflow:hidden;
  font-size:7rem;
  line-height:4.5rem;

  padding:.5rem;
  margin-top: .5rem;

  >div{
    height:11rem;
    padding:3rem;
    background-color: ${themeGet('color', 'blueDarkest')};

    >span{
      float:right;
      text-shadow: ${themeGet('shadow', 'text')};

      &:first-child{
        float:left;
      }
    }
  }
`

class FastMoneyBoard extends Component {

  constructor(){
    super();

    this.state = {
      revealedScores: []
    }
  }

  renderAnswer(answerObj, i){
    //- hacky way to hide 1st player answers in fast money
    const allowedToShow = this.props.questionShowing || answerObj.idx > 4

    return (
      <Answer 
        key={i} 
        label={answerObj.idx + 1}
        revealed={allowedToShow && answerObj.revealed}
        scoreRevealed={allowedToShow && this.state.revealedScores.indexOf(answerObj.idx) > -1}
        title={answerObj.value} 
        score={answerObj.points} 
        onScoreClick = { () => this.onScoreClick(answerObj.idx, answerObj.revealed)}
        onClick={ () => this.onAnswerClick(answerObj.idx, answerObj.revealed) }
      />) 
  }

  renderAnswerColumn(answers, column){
    if(column === 'left'){
      return answers.filter((a,i) => i < 5).map((a,i) => (
        this.renderAnswer(a, i)
      ));
    }else{
      return answers.filter((a,i) => i > 4).map((a,i) => (
        this.renderAnswer(a, i)
      ));
    }

  }

  getFastScore(){
    let score = 0;
    this.state.revealedScores.map(sIdx => {
      score += this.props.survey.answers[sIdx].points;
    })

    return score;
  }

  renderSurvey(surveyData){
    if(!surveyData){
      return null;
    }else{
      return (
        <HtmlAnswerGrid>
          <HtmlAnswerColumnDouble position="1">
            { this.renderAnswerColumn(surveyData.answers, 'left') }
          </HtmlAnswerColumnDouble>
          <HtmlAnswerColumnDouble position="2">
            { this.renderAnswerColumn(surveyData.answers, 'right') }
            <HtmlScoreBox>
              <div>
                <span>{'Total'}</span>
                <span>{this.getFastScore()}</span>
              </div>
            </HtmlScoreBox>
          </HtmlAnswerColumnDouble>
        </HtmlAnswerGrid>
      );
    }
  }

  startRound(id){
    this.props.startRound(id);
  }

  onAnswerClick(answerIdx, revealed){
    if(revealed){
      this.props.hideAnswer(answerIdx);
    }else{
      soundFastMoneyAnswer.setVolume(.5).play();
      this.props.revealAnswer(answerIdx);
    }
  }

  showAnswerScore(answerIdx, revealedScores){
    const answerObj = this.props.survey.answers[answerIdx];
    if(answerObj.points > 0){
      soundFastMoneyScore.setVolume(.5).play();
    }else{
      soundFastMoney0.setVolume(.5).play();
    }
    this.setState({
      revealedScores: revealedScores.concat(answerIdx)
    })
  }

  hideAnswerScore(answerIdx, revealedScores){
    this.setState({
      revealedScores: revealedScores.filter(s => s !== answerIdx)
    })
  }
  
  onScoreClick(answerIdx, answerRevealed){
    if(this.state.revealedScores.indexOf(answerIdx) === -1){
      if(answerRevealed){
        this.showAnswerScore(answerIdx, this.state.revealedScores);
      }
    }else{
      this.hideAnswerScore(answerIdx, this.state.revealedScores);
    }
  }

  renderHeader(survey, questionShowing){
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
          <span>{survey.title}</span>
          </HtmlRoundLabel>
        </HtmlRoundBox>
      );
    }

  }

  render(){
    return(
      <HtmlContainer id="scoreboard" >
        { this.renderHeader(this.props.survey, this.props.questionShowing) }
        { this.renderSurvey(this.props.survey) }
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
    roundActive: state.game.roundActive,
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
      setActiveTeam
    },
    dispatch
  )

export default connect(
  makeMapStateToProps,
  mapDispatchToProps
)(FastMoneyBoard)

