import React, { Component } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import styled from 'styled-components';

import { setData, setSheetData, setGoogleSheetData } from 'store/actions/index.js';
import { themeGet } from 'themes/';
import Board from './board';
import Modal from 'scenes/modal';
import GameController from './gamecontroller';
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

    this.refGameController = React.createRef();

    // this.loadDefaultData();
    global.refreshSheetData = this.refreshSheetData;
  }
  getSurveyParams(){
    const params = new URLSearchParams(window.location.search);
    const sheetId = params.get('sheet');
    const tabId = params.get('tab');

    if(!sheetId) window.alert('missing required queryParam "?sheet"');
    if(!tabId) window.alert('missing required queryParam "?tab"');

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
    if(this.props.sheetId && this.props.tabId){
      this.loadGoogleSheetData(this.props.sheetId, this.props.tabId);
    }
  }

  setDefaultData(){
    this.props.setData({
      title: 'testing'
    });
  }

  componentDidUpdate(prevProps){
    if(prevProps.tabId !== this.props.tabId || prevProps.sheetId !== this.props.sheetId){
      this.refreshSheetData();
    }
  }


  loadDefaultData(){
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
      this.props.setGoogleSheetData(sheetData.sheetId, sheetData.tabId);
    }
  }
  
  convertSheetMatrixToFeudData(rawRawData){
    // return rawData.rows;
    // data comes in as
    // ['HEADER1', 'HEADER2']
    // ['ROWV1','ROWV2']

    // so first make an array of objects?
    const headerValues = rawRawData.shift();
    const rawData = rawRawData.map(rawRowOfColumns => {
      let rowObj = {};
      for(let c = 0; c < rawRowOfColumns.length; c++){
        rowObj[headerValues[c]] = rawRowOfColumns[c];
      }
      return rowObj;
    });

    console.log('rawData is ', rawData)
    
    const surveys = [];
    let curSurvey = null;
    for(let r = 0; r < rawData.length; r++){
      const row = rawData[r];
      
      if(row['TYPE']){
        if(row['TYPE'] === 'END'){
          break;
        }
        if(curSurvey && curSurvey.title){
          surveys.push(curSurvey);
        }
  
        curSurvey = {
          id: surveys.length + 1,
          type: row['TYPE'],
          title: row['SURVEY'],
          multiplier: parseInt(row['MULTIPLIER'] || 1),
          answers: []
        };
      }else if(row['ANSWER']){
        curSurvey.answers.push({
          value: row['ANSWER'],
          points: parseInt(row['POINTS'] || 0),
          populated: row['ANSWER'] !== "-"
        });
      }
    }
  
    if(curSurvey && curSurvey.title){
      surveys.push(curSurvey);
    }
    
    return {
      "title":"",
      "teams":{
        "left":"",
        "right":""
      },
      surveys: surveys
    };
  }

  loadGoogleSheetData(sheetId, tabId){
    const appsScriptDeployment = 'https://script.google.com/macros/s/AKfycbxrYRu0rDa4lSeGOybsAWrANpDa6DnGYE5EsX58cR16Yky2p0nt2rxqkQAHw03Yze5-/exec';
    const url = `${appsScriptDeployment}?sheet=${sheetId}&tab=${tabId}`;
    console.log('loadGoogleSheetData from url:', url);

    fetch(url, { cache: 'no-cache' })
      .then(response => response.json(), 
        err => {
          console.error('Error fetching url', err);
        }) //- bad url responds with 200/ok? so this doesnt get thrown
      .then(data => {
        if(!data){
          global.window.alert('Sheet data was not loaded correctly. Ensure the sheet and tab IDs are valid, your google sheet is published, and try again.');
        }
        console.log('received raw data from AppsScript', data);
        const convertedData = this.convertSheetMatrixToFeudData(data.data)
        console.log('converted to feudData', convertedData);
        this.props.setSheetData({ type:'json', data: convertedData });
      });
  }

  render(){
    return(
      <HtmlApp id="app" tabIndex="-1">
        <Modal />
        <GameController />
        <Board
          dataLoaded={this.props.dataLoaded}
          survey={this.props.survey}
        />
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
    dataLoaded: state.game.dataLoaded,
    loaded: state.data.slideIdx,
    title: state.data.title,
    activeTeam: state.game.activeTeam,
    tabId: state.data.tabId,
    sheetId: state.data.sheetId
  });

  return mapStateToProps;
}

const mapDispatchToProps = dispatch =>
  bindActionCreators(
    { setData, setSheetData, setGoogleSheetData },
    dispatch
  )

export default connect(
  makeMapStateToProps,
  mapDispatchToProps
)(App)

