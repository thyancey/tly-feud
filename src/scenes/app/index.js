import React, { Component } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import styled from 'styled-components';
import CsvParse from 'csv-parse';

import { setData, setSheetData } from 'store/actions/index.js';
import { themeGet } from 'themes/';
import Scoreboard from 'scenes/scoreboard';
import EndScreen from 'scenes/endscreen';
import Modal from 'scenes/modal';
import TestImage from './assets/loading.gif';
import GameController from './gamecontroller';
import { createSelector_getSurvey } from 'store/selectors';
import { objectExpression } from '@babel/types';

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

    this.refGameController = React.createRef();

    this.loadStoreData();
    this.state = {
      sheetId: null,
      tabId: null
    }

    global.loadSurveyData = (sheetId, tabId) => {
      this.setState({
        sheetId: sheetId,
        tabId: tabId
      });
    }
  }

  getSurveyParams = () => {
    const params = new URLSearchParams(window.location.search);
    const sheetId = params.get('sheet');
    const tabId = params.get('tab');

    if(sheetId && tabId){
      return {
        sheetId: sheetId,
        tabId: tabId
      }
    }else{
      return null;
    }
  }

  refreshSheetData(){
    if(this.state.sheetId && this.state.tabId){
      this.loadSheetData(this.state.sheetId, this.state.tabId);
    }
  }

  setDefaultData(){
    this.props.setData({
      title: 'testing'
    });
  }

  componentDidUpdate(prevProps, prevState){
    if(prevState.tabId !== this.state.tabId || prevState.sheetId !== this.state.sheetId){
      this.refreshSheetData();
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

  componentDidMount(){
    const sheetData = this.getSurveyParams();
    if(sheetData){
      this.setState({
        sheetId: sheetData.sheetId,
        tabId: sheetData.tabId
      });
    }

    document.addEventListener('keydown', (e) => {
      if(e.ctrlKey){
        if(e.key === 'S'){
          e.preventDefault();
          e.stopPropagation();

          const splitId = global.window.prompt('Enter splitId in the format of "SHEET_ID|TAB_ID"');
          if(splitId){
            const sheetId = splitId.split('|')[0];
            const tabId = splitId.split('|')[1];
            this.setState({
              sheetId: sheetId,
              tabId: tabId
            });
          }else{
            console.warn('no splitId given');
          }

        }else if(e.key === 'D'){
          e.preventDefault();
          e.stopPropagation();

          const tabId = global.window.prompt('Enter tabId');
          if(tabId){
            this.setState({
              tabId: tabId
            });
          }else{
            console.warn('no tab id given');
          }
        }
      }
    })
  }

  loadSheetData(sheetId, tabId){
    const url = `https://docs.google.com/spreadsheets/d/e/${sheetId}/pub?gid=${tabId}&output=csv`;
    console.log('loadSheetData:', url)

    fetch(url, { cache: 'no-cache' })
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
        <GameController />
        { this.props.survey ? (
          <Scoreboard />
        ):(
          <EndScreen />
        )}
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
    { setData, setSheetData },
    dispatch
  )

export default connect(
  makeMapStateToProps,
  mapDispatchToProps
)(App)

