import React, { Component } from 'react';
import styled from 'styled-components';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import { themeGet } from 'themes/';
import IconTimer from 'assets/icons/ic-timer.svg';
import IconTimerOff from 'assets/icons/ic-timer-off.svg';

import UIfx from 'uifx';
import SoundStrike from 'assets/sounds/strike.wav';

import { 
  showTimeUp
} from 'store/actions';

const TIMER_DURATION = 15;
const soundStrike = new UIfx({asset: SoundStrike});

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
  }

  throwTimeUp(){
    soundStrike.setVolume(.5).play();
    this.props.showTimeUp(null, true);
  }

  startIntervalTimer(duration = 1){
    this.killIntervalTimer();

    this.setState({ 
      timerEnd: new Date().getTime() + duration,
      timerActive: true
    });

    this.intervalTimer = global.setInterval(() => {
      let timeLeft = Math.ceil((this.state.timerEnd - new Date().getTime()) / 1000);

      if(timeLeft === 0){
        this.killIntervalTimer();
        timeLeft = 0;
        
        console.log('TIMER COMPLETE!');
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
      })
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
    if(!this.state.timerActive || this.state.timeLeft === null){
      return (
        <HtmlTimerBlock>
          <HtmlIcon src={IconTimer}/>
          <span>{'Start timer'}</span>
          <span>{this.getFancyTimeLeft(TIMER_DURATION)}</span>
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

  toggleTimer(){
    if(this.state.timerActive){
      this.killIntervalTimer();
    }else{
      this.startIntervalTimer(TIMER_DURATION * 1000);
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


const mapDispatchToProps = dispatch =>
  bindActionCreators(
    { 
      showTimeUp
    },
    dispatch
  )

export default connect(
  () => {},
  mapDispatchToProps
)(TimerButton)
