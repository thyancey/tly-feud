import React, { Component } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import styled from 'styled-components';

import { setData, endRound, startRound } from 'store/actions/index.js';
import { themeGet } from 'themes/';
import Scoreboard from 'scenes/scoreboard';
import Debug from 'scenes/debug';
import TestImage from './assets/loading.gif';
import { createSelector_getSurvey } from 'store/selectors';

require('themes/app.scss');

const HtmlApp = styled.section`
  position:absolute;
  left:0;
  top:0;
  right:0;
  bottom:0;
  overflow:hidden;

  background-color:  ${themeGet('color', 'black')};
  color: ${themeGet('color', 'blue')};
`

class App extends Component {

  constructor(){
    super();

    this.loadStoreData();
  }

  setDefaultData(){
    this.props.setData({
      title: 'testing'
    });
  }

  getNextRoundId(){
    const foundIdx = this.props.surveys.findIndex(s => s.id === this.props.roundId);
    if(foundIdx > -1){
      let nextIdx = 0;
      if(this.props.surveys[foundIdx + 1]){
        nextIdx = foundIdx + 1;
      }

      return this.props.surveys[nextIdx].id;
    }else{
      return this.props.roundId;
    }
  }

  onEndOfRound(advance){
    if(advance){
      const newId = this.getNextRoundId();
      this.props.startRound(newId);
    }else{
      this.props.endRound(this.props.activeTeam, this.props.survey.score);
    }
  }

  loadStoreData(){
    const url = './data.json';
    console.log(`reading app data from '${url}'`);

    fetch(url)
      .then(response => {
          return response.json();
        }, 
        err => {
          console.error('Error fretching url, using default data', err);
          this.setDefaultData();
        }) //- bad url responds with 200/ok? so this doesnt get thrown
      .then(json => {
          console.log('data was read successfully')
          this.props.setData(json);
          // this.setDefaultData();
          return true;
        }, 
        err => {
          console.error('Error parsing store JSON (or the url was bad), using default data', err);
          this.setDefaultData();
        });
  }

  render(){
    return(
      <HtmlApp id="app" tabIndex="-1">
        <h1>{ this.props.title || 'Loading..' }</h1>
        <img src={TestImage} alt="loading"/>
        <Debug onEndOfRound={(advance) => this.onEndOfRound(advance)}/>
        <Scoreboard onEndOfRound={(advance) => this.onEndOfRound(advance)}/>
      </HtmlApp>
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
    loaded: state.data.slideIdx,
    title: state.data.title,
    activeTeam: state.game.activeTeam
  });

  return mapStateToProps;
}

const mapDispatchToProps = dispatch =>
  bindActionCreators(
    { setData, endRound, startRound },
    dispatch
  )

export default connect(
  makeMapStateToProps,
  mapDispatchToProps
)(App)

