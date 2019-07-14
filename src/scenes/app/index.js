import React, { Component } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import styled from 'styled-components';
import CsvParse from 'csv-parse';

import { setData, setSheetData, endRound, startRound } from 'store/actions/index.js';
import { themeGet } from 'themes/';
import Scoreboard from 'scenes/scoreboard';
import Debug from 'scenes/debug';
import Modal from 'scenes/modal';
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

    global.loadSurveyData = (sheetId, tabId) => {
      this.loadSheetData(sheetId, tabId);
    }
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
      this.props.endRound(this.props.survey.score);
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

  loadSheetData(sheetId, tabId){
    const url = `https://docs.google.com/spreadsheets/d/e/${sheetId}/pub?gid=${tabId}&output=csv`;

    fetch(url)
      .then(response => {
          const csv = response.clone().text();
          return csv;
        }, 
        err => {
          console.error('Error fretching url', err);
        }) //- bad url responds with 200/ok? so this doesnt get thrown
      .then(csv => {
          const parsed = CsvParse(csv, {
          }, (err, output) => {
            console.log('sheet data was read successfully')
            this.props.setSheetData(output);
            return output;
          });
        }, 
        err => {
          console.error('Error parsing sheet CSV (or the url was bad)', err);
        });
  }


  render(){
    return(
      <HtmlApp id="app" tabIndex="-1">
        <Modal />
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
    { setData, setSheetData, endRound, startRound },
    dispatch
  )

export default connect(
  makeMapStateToProps,
  mapDispatchToProps
)(App)

