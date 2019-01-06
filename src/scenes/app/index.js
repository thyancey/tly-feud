import React, { Component } from 'react';
import styled from 'styled-components';

import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { setData } from 'store/actions/index.js';
import { themeGet } from 'themes/';

import TestImage from './assets/loading.gif';

require('themes/app.scss');

const AppHTML = styled.section`
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

  loadStoreData(){
    const url = './data.json';
    console.log(`reading app data from '${url}'`);

    fetch(url).then(response => {
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
      <AppHTML id="app" tabIndex="-1">
        <h1>{ this.props.title || 'Loading..' }</h1>
        <img src={TestImage} alt="loading"/>
      </AppHTML>
    );
  }
}

const mapStateToProps = ({ data }) => ({
  loaded: data.slideIdx,
  title: data.title
})

const mapDispatchToProps = dispatch =>
  bindActionCreators(
    { setData },
    dispatch
  )

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(App)

