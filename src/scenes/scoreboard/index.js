import React, { Component } from 'react';
import styled from 'styled-components';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { createSelector } from 'reselect';

import { themeGet } from 'themes/';
import Answer from './answer';

const HtmlContainer = styled.div`
  position:absolute;
  left:10%;
  top:10%;
  right:10%;
  bottom:10%;
  overflow:hidden;

  display: grid;
  grid-template-columns: 15% 1fr 15%;
  grid-template-rows: 15% 1fr 15%;


  border-radius: 3rem;

  background-color:  ${themeGet('color', 'purple')};
  color: ${themeGet('color', 'blue')};
`

const HtmlAnswerGrid = styled.div`
  grid-column: 2 / span 1;
  grid-row: 2 / span 1;

  display:grid;
  grid-template-columns: 1fr 1fr;
  grid-template-rows: 1fr;
  
  border:.5rem solid red;
`

const HtmlAnswerColumn = styled.ul`
  grid-column: 1 / span 2;
  grid-row: 1 / span 1;

  border: 2px solid white;
  height:100%;

  margin:0;
  padding:0;
`

const HtmlAnswerColumnDouble = styled(HtmlAnswerColumn)`
  grid-column: ${props => props.position} / span 1;
`



const HtmlTimer = styled.div`
  grid-column: 2 / span 1;
  grid-row: 1 / span 1;

  top:50%;
  transform: translateY(-50%);
  position:absolute;
  width:100%;
  text-align:center;
  border:.5rem solid blue;
`

const HtmlScoreBlock = styled.div`
  grid-column: ${props => props.position} / span 1;
  grid-row: 2 / span 1;

  top:50%;
  transform: translateY(-50%);
  position:absolute;
  left:0;
  right:0;
  text-align:center;
  vertical-align:middle;
  border:.5rem solid yellow;
`

const HtmlFooter = styled.div`
  grid-column: 1 / span 3;
  grid-row: 3 / span 1;

  top:50%;
  transform: translateY(-50%);
  position:absolute;
  width:100%;
  text-align:center;
  border:.5rem solid blue;
`

class Scoreboard extends Component {
  constructor(){
    super();
  }

  renderSurvey(surveyData){
    if(!surveyData){
      return null;
    }else{
      if(surveyData.answers.length < 4){
        return (
          <HtmlAnswerGrid>
            <HtmlAnswerColumn>
              { surveyData.answers.map((s, i) => (
                <Answer key={i} title={s.value} score={s.points} />
              ))}
            </HtmlAnswerColumn>
          </HtmlAnswerGrid>
        );
      }else{
        //- odd
        return (
          <HtmlAnswerGrid>
            <HtmlAnswerColumnDouble position="1">
              { surveyData.answers.filter((s, i) => (
                i % 2 === 0
              )).map((s, i) => (
                <Answer key={i} title={s.value} score={s.points} />
              ))}
            </HtmlAnswerColumnDouble>
            <HtmlAnswerColumnDouble position={2}>
            { surveyData.answers.filter((s, i) => (
                i % 2 !== 0
              )).map((s, i) => (
                <Answer key={i} title={s.value} score={s.points} />
              ))}
            </HtmlAnswerColumnDouble>
          </HtmlAnswerGrid>
        );
      }

    }
  }

  renderTimer(startTime, endTime){
    const time = '00:13';
    return (
      <HtmlTimer>
        <h2>{time}</h2>
      </HtmlTimer>
    );
  }

  render(){
    console.log('got survey: ', this.props.survey)
    return(
      <HtmlContainer id="scoreboard" >
        { this.renderTimer() }
        <h1>{this.props.title}</h1>
        <HtmlScoreBlock position={1}>
          <h3>{221}</h3>
        </HtmlScoreBlock>
        { this.renderSurvey(this.props.survey) }
        <HtmlScoreBlock position={3}>
          <h3>{345}</h3>
        </HtmlScoreBlock>
        <HtmlFooter>
          <h3>{this.props.survey && this.props.survey.title}</h3>
        </HtmlFooter>
      </HtmlContainer>
    );
  }
}


export const createSelector_getSurvey = () => {
  return createSelector(
    [ state => state.data.surveys, state => state.data.game.activeId ],
    (surveys, activeId) => {
      const foundSurvey = surveys && surveys.find(s => s.id === activeId);
      if(foundSurvey) return foundSurvey;
      return false;
    }
  )
}

const makeMapStateToProps = () => {
  const getSurvey = createSelector_getSurvey();
  const mapStateToProps = (state, props) => ({
    survey: getSurvey(state, props),
    title: state.data.title
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

