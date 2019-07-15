import React, { Component } from 'react';
import styled from 'styled-components';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import { themeGet } from 'themes/';
import Answer from './answer';
import Scorebox from './scorebox';
import { startRound, revealAnswer, incrementScore, endRound, setActiveTeam } from 'store/actions';
import { createSelector_getSurvey } from 'store/selectors';

import SoundReveal from 'assets/sounds/reveal.wav';
import UIfx from 'uifx';
const soundReveal = new UIfx({asset: SoundReveal});


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

  position:absolute;
  bottom:0;
  width:100%;
  text-align:center;
`

const HtmlFooterChild = styled.div`
  display:inline-block;
  width:50%;
`

const HtmlFooterLeft = styled(HtmlFooterChild)`

`

const HtmlFooterRight = styled(HtmlFooterChild)`

`

const HtmlButtonChild = styled.div`
  color:white;
  display:inline-block;
  margin:0rem 2rem;
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
                  label={i + 1 + Math.ceil(surveyData.answers.length / 2)}
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
    soundReveal.setVolume(.5).play();
    this.props.revealAnswer(answerIdx);
  }

  onTimerClick(){
    this.props.endRound(this.props.survey.score);
  }

  renderRoundBox(survey){
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
            <span>{'Round 1'}</span>
          </HtmlRoundLabel>
          <HtmlRoundTitle>
            <div>
              <span>{survey.title}</span>
            </div>
          </HtmlRoundTitle>
        </HtmlRoundBox>
      );
    }

  }

  render(){
    return(
      <HtmlContainer id="scoreboard" >
        { this.renderRoundBox(this.props.survey) }
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
          <HtmlFooterLeft>
            <HtmlButtonChild>
              {'Hide question'}
            </HtmlButtonChild>
            <HtmlButtonChild>
              {'Start timer'}
            </HtmlButtonChild>
          </HtmlFooterLeft>
          <HtmlFooterRight>
            <HtmlButtonChild>
              {'Award points'}
            </HtmlButtonChild>
            <HtmlButtonChild>
              {'Go to next round'}
            </HtmlButtonChild>
          </HtmlFooterRight>
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

