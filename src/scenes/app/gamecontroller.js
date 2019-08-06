import React, { Component } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import {  
  startRound, 
  endRound, 
  awardPoints, 
  advanceRound,
  toggleQuestion,
  winGame
} from 'store/actions/index.js';
import { createSelector_getSurvey } from 'store/selectors';

import UIfx from 'uifx';
import SoundGameWin from 'assets/sounds/winmusic.wav';
const soundGameWin = new UIfx({asset: SoundGameWin});


class GameController extends Component {

  constructor(){
    super();
  }

  finalizeRound(team, score){
    console.log('finalizeRound', team, score)
    this.props.awardPoints(team, score)
  }


  nextRound(){
    if(this.props.roundId <= this.props.surveys.length){
      this.props.startRound(this.props.roundId);
    }else{
      this.props.winGame();
      console.log('GAME IS OVER');
    }
  }

  componentDidUpdate(prevProps, prevState){
    if(prevProps.loaded !== this.props.loaded){
      console.log('ADAVANCE')
      this.props.advanceRound();
    }

    if(prevProps.roundId !== this.props.roundId){
      this.nextRound()

      //- for the hacky way im controlling the 'fast money round'
      if(this.props.survey && this.props.survey.type === 'FASTMONEY'){
        this.props.toggleQuestion(true)
      }
    }

    if(this.props.survey){
      if(prevProps.revealed.length !== this.props.revealed.length){
        if(this.props.revealed.length === 1){
          //- attempt to reveal the title if it hasn't been already
          this.props.toggleQuestion(true)
        }
        if(this.props.revealed.length === this.props.survey.answers.length){
          //- all answers have been revealed. But don't end the round automatically, no one likes that
        }
      }
    }

    if(prevProps.gameWon !== this.props.gameWon && this.props.gameWon){
      soundGameWin.setVolume(1).play();
    }
  }
  
  render(){
    return(
      <div/>
    );
  }
}

const makeMapStateToProps = () => {
  const getSurvey = createSelector_getSurvey();
  const mapStateToProps = (state, props) => ({
    survey: getSurvey(state, props),
    surveys: state.data.surveys,
    roundId: state.game.roundId,
    loaded: state.data.loaded,
    revealed: state.game.revealed,
    activeTeam: state.game.activeTeam,
    gameWon: state.game.gameWon
  });

  return mapStateToProps;
}

const mapDispatchToProps = dispatch =>
  bindActionCreators(
    { 
      endRound, 
      startRound, 
      awardPoints, 
      advanceRound,
      toggleQuestion,
      winGame
    },
    dispatch
  )

export default connect(
  makeMapStateToProps,
  mapDispatchToProps
)(GameController)

