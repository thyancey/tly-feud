import React, { Component } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import { setData, setSheetData, endRound, startRound, awardPoints, advanceRound } from 'store/actions/index.js';
import { createSelector_getSurvey } from 'store/selectors';


class GameController extends Component {

  constructor(){
    super();
  }

  finalizeRound(team, score){
    console.log('finalizeRound', team, score)
    this.props.awardPoints(team, score)
  }


  nextRound(){
    console.log('nextRound', this.props.roundId, this.props.surveys.length)
    if(this.props.roundId <= this.props.surveys.length){
      this.props.startRound(this.props.roundId);
    }else{
      console.log('GAME IS OVER')
    }
  }

  componentDidUpdate(prevProps, prevState){
    if(prevProps.loaded !== this.props.loaded){
      console.log('ADAVANCE')
      this.props.advanceRound();
    }

    if(prevProps.roundId !== this.props.roundId){
      this.nextRound()
    }

    if(prevProps.roundActive && !this.props.roundActive){
      this.finalizeRound(this.props.activeTeam, this.props.survey.score);
    }

    if(this.props.survey){
      if(prevProps.revealed.length !== this.props.revealed.length){
        if(this.props.revealed.length === this.props.survey.answers.length){
          this.props.endRound();
        }
      }
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
    surveys: state.data.surveys,
    loaded: state.data.loaded,
    title: state.data.title,
    activeTeam: state.game.activeTeam,
    roundActive: state.game.roundActive,
    revealed: state.game.revealed
  });

  return mapStateToProps;
}

const mapDispatchToProps = dispatch =>
  bindActionCreators(
    { setData, setSheetData, endRound, startRound, awardPoints, advanceRound },
    dispatch
  )

export default connect(
  makeMapStateToProps,
  mapDispatchToProps
)(GameController)

