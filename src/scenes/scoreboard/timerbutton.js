import React, { Component } from 'react';
import styled, { css } from 'styled-components';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import { themeGet } from 'themes/';
import IconTimer from 'assets/icons/ic-timer.svg';
import IconTimerOff from 'assets/icons/ic-timer-off.svg';
import InputManager from '../../util/input-manager';

import UIfx from 'uifx';
import SoundStrike from 'assets/sounds/strike.wav';

import { 
  showTimeUp
} from 'store/actions';

const TIMER_DURATION = 10;
const soundStrike = new UIfx({asset: SoundStrike});

const HtmlFsTimerBlock = styled.span`
  font-size:7rem;

  &:hover{
    cursor: pointer;
  }

  color: ${themeGet('color', 'greyLight')};
  &:hover{
    color: ${themeGet('color', 'blueLight')};
  }

  ${props => props.isActive === true &&
    css`
      color: ${themeGet('color', 'tealLight')};
      
      &:hover{
        color: ${themeGet('color', 'red')};
      }
    `
  }
`

const HtmlTimerBlock = styled.span`
  >*{
    display:inline-block;
    vertical-align:middle;
  }

  span{
    color: ${themeGet('color', 'greyLight')};
    font-weight:normal;
    margin-left:1.5rem;
  }
`

const HtmlIcon = styled.img`
`


class TimerButton extends Component {
  constructor(){
    super();

    this.timer = null;
    this.intervalTimer = null;
    this.state = {
      timerActive: false,
      timeLeft: null,
      timerEnd: null
    };
    
    this.onInput = this.onInput.bind(this);
  }

  componentDidUpdate(prevProps, prevState){
    if(prevProps.roundActive && !this.props.roundActive){
      console.log('ROUND CHANGE')
      this.killIntervalTimer();
    }
  }

  componentDidMount(){
    InputManager.addListeners(['startTimer'], this.onInput);
  }
  componentWillUnmount(){
    InputManager.removeListeners(['startTimer'], this.onInput);
    this.killIntervalTimer();
  }

  onInput(command){
    switch(command.action){
      case 'startTimer': this.toggleTimer();
        break;
    }
  }

  throwTimeUp(){
    soundStrike.setVolume(.5).play();
    if(this.props.isFastMoney){
      this.props.showTimeUp(false);
    }else{
      this.props.showTimeUp(true);
    }
  }

  startIntervalTimer(secondsDuration = 1){
    const duration = secondsDuration * 1000;
    this.killIntervalTimer();

    const timerEnd = new Date().getTime() + duration;
    this.setState({ 
      timerEnd: timerEnd,
      timerActive: true
    });

    this.intervalTimer = global.setInterval(() => {
      let timeLeft = Math.ceil((timerEnd - new Date().getTime()) / 1000);

      if(timeLeft === 0){
        this.killIntervalTimer();
        timeLeft = 0;
        this.throwTimeUp();
      }

      this.setState({
        timeLeft: timeLeft
      });
    }, 100);
  }

  killIntervalTimer(){
    if(this.intervalTimer){
      global.clearInterval(this.intervalTimer);
      this.intervalTimer = null;

      this.setState({
        timerActive: false,
        timerEnd: null
      });
    }
  }

  getFancyTimeLeft(timeLeft){
    let minutes = 0;

    if(timeLeft > 60){
      minutes = Math.floor(timeLeft / 60);
      timeLeft = timeLeft % 60;
    }
    
    if (timeLeft > 9){
      return `${minutes}:${timeLeft}`;
    }else{
      return `${minutes}:0${timeLeft}`;
    }
  }

  renderTimer(){
    if(this.props.isFastMoney){
      if(!this.state.timerActive || this.state.timeLeft === null){
        return (
          <HtmlFsTimerBlock isActive={false}>{this.getFancyTimeLeft(this.props.timeLimit || TIMER_DURATION)}</HtmlFsTimerBlock>
        );
      }else{
        return (
          <HtmlFsTimerBlock isActive={true}>{this.getFancyTimeLeft(this.state.timeLeft)}</HtmlFsTimerBlock>
        );
      }
    }else{
      if(!this.state.timerActive || this.state.timeLeft === null){
        return (
          <HtmlTimerBlock>
            <HtmlIcon src={IconTimer}/>
            <span>{'Start timer'}</span>
            <span>{this.getFancyTimeLeft(this.props.timeLimit || TIMER_DURATION)}</span>
          </HtmlTimerBlock>
        );
      }else{
        return (
          <HtmlTimerBlock>
            <HtmlIcon src={IconTimerOff}/>
            <span>{'Stop timer'}</span>
            <span>{this.getFancyTimeLeft(this.state.timeLeft)}</span>
          </HtmlTimerBlock>
        );
      }
    }
  }

  toggleTimer(){
    if(this.state.timerActive){
      this.killIntervalTimer();
    }else{
      this.startIntervalTimer(this.props.timeLimit || TIMER_DURATION);
    }
  }

  render(){
    return(
      <div onClick={() => this.toggleTimer()}>
        { this.renderTimer() }
      </div>
    );
  }
}

const mapStateToProps = ({ game }) => ({
  roundActive: game.roundActive
});


const mapDispatchToProps = dispatch =>
  bindActionCreators(
    { 
      showTimeUp
    },
    dispatch
  )

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(TimerButton)
