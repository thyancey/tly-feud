import React, { Component } from 'react';

import Scoreboard from 'scenes/scoreboard';
import EndScreen from 'scenes/endscreen';
import LoadingScreen from 'scenes/app/loadingscreen';

class Board extends Component {
  render(){
    if(this.props.survey){
      return (<Scoreboard />);
    }

    if(!this.props.dataLoaded){
      return (<LoadingScreen />);
    }

    return (<EndScreen />);
  }
}

export default Board;

