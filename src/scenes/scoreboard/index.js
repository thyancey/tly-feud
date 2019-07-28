import React, { Component } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import FastMoneyBoard from './board-fastmoney';
import NormalBoard from './board-normal';

import { createSelector_getSurvey } from 'store/selectors';

class Scoreboard extends Component {
  render(){
    if(this.props.survey.type){
      if(this.props.survey.type === 'normal'){
        return <NormalBoard />
      }else{
        return <FastMoneyBoard />
      }
    }else{
      return null;
    }
  }
}

const makeMapStateToProps = () => {
  const getSurvey = createSelector_getSurvey();
  const mapStateToProps = (state, props) => ({
    survey: getSurvey(state, props)
  });

  return mapStateToProps;
}

const mapDispatchToProps = dispatch =>
  bindActionCreators(
    {},
    dispatch
  )

export default connect(
  makeMapStateToProps,
  mapDispatchToProps
)(Scoreboard)

