import React, { Component } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import styled from 'styled-components';
import CsvParse from 'csv-parse';

import { setData, setSheetData, setGoogleSheetData } from 'store/actions/index.js';
import { themeGet } from 'themes/';
import Scoreboard from 'scenes/scoreboard';
import EndScreen from 'scenes/endscreen';
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
  }

  getSurveyParams(){
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
    if(this.props.sheetId && this.props.tabId){
      this.loadGlitchData(this.props.sheetId, this.props.tabId);
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

  loadGlitchData(sheetId, tabId){
    const url = `https://tly-sheet-reader.glitch.me/${sheetId}/${tabId}`;
    console.log('loadSheetData:', url)

    fetch(url, { cache: 'no-cache' })
      .then(response => response.json(), 
        err => {
          console.error('Error fretching url', err);
        }) //- bad url responds with 200/ok? so this doesnt get thrown
      .then(data => {
        console.log('got', data);
        this.props.setSheetData({ type:'json', data: data });
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
            console.log('sheet data was read successfully', output);
            if(!output){
              global.window.alert('Sheet data was not loaded correctly. Check the query params and try again.')
            }
            this.props.setSheetData({ type:'csv', data: output });
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

