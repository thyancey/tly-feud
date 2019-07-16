import React, { Component } from 'react';
import styled from 'styled-components';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import { themeGet } from 'themes/';
import IconForward from 'assets/icons/ic-arrow-forward.svg';
import IconStar from 'assets/icons/ic-star.svg';
import IconVisibility from 'assets/icons/ic-visibility.svg';
import IconVisibilityOff from 'assets/icons/ic-visibility-off.svg';

import TimerButton from './timerbutton';

import { 
  awardPoints, 
  toggleQuestion, 
  advanceRound, 
  endRound
} from 'store/actions';
import { createSelector_getSurvey } from 'store/selectors';

const HtmlFooter = styled.div`
  grid-column: 1 / span 3;
  grid-row: 3 / span 1;

  position:absolute;
  bottom:0;
  width:100%;
  text-align:center;
`

const HtmlFooterChild = styled.div`
  display:inline-block;
  width:50%;
`

const HtmlButtonChild = styled.div`
  cursor:pointer;
  display:inline-block;
  margin:0rem 2rem;

  &:hover{
    span{
      color: ${themeGet('color', 'blueLight')};
    }
  }

  >*{
    display: inline-block;
    vertical-align: middle;
  }
`

const HtmlIcon = styled.img`
`

const HtmlText = styled.span`
  color: ${themeGet('color', 'greyLight')};
  margin-left:1.25rem;
  font-weight:normal;
`

class Controls extends Component {
  constructor(){
    super();

    this.timer = null;
    this.state = {
      timerActive: false,
      timerEnd: null
    };
  }

  endRound(){
    this.props.awardPoints(this.props.activeTeam, this.props.survey.score);
    this.props.endRound(); 
  }

  startTimer(duration = 1){
    this.killTimer();
    this.setState({ 
      timerEnd: new Date().getTime() + duration,
    });
    this.timer = global.setTimeout(() => {
      this.onTimer();
    }, duration)
  }

  onTimer(){
    console.log('ON TIMER');
    this.setState({
      timerActive: false,
      timerEnd: null
    })
  }

  killTimer(){
    if(this.timer){
      global.clearTimeout(this.timer);
      this.timer = null;
    }
  }

  renderTimer(){
    if(!this.timer){
      return null;
    }else{
      const timeLeft = parseInt((this.state.timerEnd - new Date().getTime()) / 1000);
      return (
        <p>{':' + timeLeft}</p>
      );
    }
  }

  render(){
    return(
      <HtmlFooter>
        <HtmlFooterChild>
          { this.props.questionShowing ? (
            <HtmlButtonChild onClick={() => this.props.toggleQuestion(false)}>
              <HtmlIcon src={IconVisibilityOff}/>
              <HtmlText>{'Hide question'}</HtmlText>
            </HtmlButtonChild>
          ):(
            <HtmlButtonChild onClick={() => this.props.toggleQuestion(true)}>
              <HtmlIcon src={IconVisibility}/>
              <HtmlText>{'Show question'}</HtmlText>
            </HtmlButtonChild>
          ) }
          <HtmlButtonChild>
            <TimerButton/>
          </HtmlButtonChild>
        </HtmlFooterChild>
        <HtmlFooterChild>
          { this.props.activeTeam && (
            <HtmlButtonChild onClick={() => this.endRound()}>
              <HtmlIcon src={IconStar}/>
              <HtmlText>{'Award points'}</HtmlText>
            </HtmlButtonChild>
          )}
          <HtmlButtonChild onClick={() => this.props.advanceRound()}>
            <HtmlIcon src={IconForward}/>
            <HtmlText>{'Go to next round'}</HtmlText>
          </HtmlButtonChild>
        </HtmlFooterChild>
      </HtmlFooter>
    );
  }
}

const makeMapStateToProps = () => {
  const getSurvey = createSelector_getSurvey();
  const mapStateToProps = (state, props) => ({
    survey: getSurvey(state, props),
    activeTeam: state.game.activeTeam,
    questionShowing: state.game.questionShowing
  });

  return mapStateToProps;
}

const mapDispatchToProps = dispatch =>
  bindActionCreators(
    { 
      awardPoints, 
      toggleQuestion, 
      advanceRound, 
      endRound
    },
    dispatch
  )

export default connect(
  makeMapStateToProps,
  mapDispatchToProps
)(Controls)

