import React, { Component } from 'react';
import styled from 'styled-components';

import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
// import { setData } from 'store/actions/index.js';
import { themeGet } from 'themes/';

// require('themes/app.scss');

import Answer from './answer';

const HtmlContainer = styled.div`
  position:absolute;
  left:10%;
  top:10%;
  right:10%;
  bottom:10%;
  overflow:hidden;

  border-radius: 3rem;

  background-color:  ${themeGet('color', 'purple')};
  color: ${themeGet('color', 'blue')};
`

const HtmlAnswers = styled.div`
  background-color: ${themeGet('color', 'green')};
  width:50%;
  display:inline-block;
`

class Scoreboard extends Component {

  constructor(){
    super();
  }

  renderSurvey(surveyData){
    if(!surveyData){
      return null;
    }else{
      return (
        <ul>
          { surveyData.answers.map((s, i) => (
            <li key={i}>
              <Answer title={s.value} score={s.points} />
            </li>
          ))}
        </ul>
      );
    }
  }

  render(){
    console.log('got survey: ', this.props.survey)
    return(
      <HtmlContainer id="scoreboard" >
        <h1>{this.props.title}</h1>
        <HtmlAnswers>
          { this.renderSurvey(this.props.survey) }
        </HtmlAnswers>
      </HtmlContainer>
    );
  }
}

const makeMapStateToProps = () => {
  // const isActivePlayer = createSelector_isActivePlayer();
  const mapStateToProps = (state, props) => ({
    // isHost: state.data.myClientId === state.data.hostId,
    // phaseId: state.game.phase.id,
    // isActivePlayer: isActivePlayer(state, props)
    // loaded: state.data.slideIdx,
    title: state.data.title,
    survey: state.data.surveys && state.data.surveys.find(s => s.id === '1')
  });

  return mapStateToProps;
}

// const mapStateToProps = ({ data }) => ({
//   loaded: data.slideIdx,
//   title: data.title
// })

const mapDispatchToProps = dispatch =>
  bindActionCreators(
    {},
    dispatch
  )

export default connect(
  makeMapStateToProps,
  mapDispatchToProps
)(Scoreboard)

