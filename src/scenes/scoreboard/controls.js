import React, { Component } from 'react';
import styled from 'styled-components';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import { themeGet } from 'themes/';
import IconForward from 'assets/icons/ic-arrow-forward.svg';
import IconStar from 'assets/icons/ic-star.svg';
import IconMusicOn from 'assets/icons/ic-music-on.svg';
import IconMusicOff from 'assets/icons/ic-music-off.svg';
import IconVisibility from 'assets/icons/ic-visibility.svg';
import IconVisibilityOff from 'assets/icons/ic-visibility-off.svg';
import ReactSound from 'react-sound';

import TimerButton from './timerbutton';
import SoundTheme from 'assets/sounds/theme.mp3';

import UIfx from 'uifx';
import SoundKaChing from 'assets/sounds/ka-ching.mp3';
import SoundFmBuzzer from 'assets/sounds/fastmoney-tryagain.wav';
import SoundScratch from 'assets/sounds/scratch.mp3';
import InputManager from '../../util/input-manager';

import { 
  awardPoints, 
  toggleQuestion, 
  advanceRound, 
  endRound,
  setGoogleSheetData
} from 'store/actions';
import { createSelector_getSurvey, createSelector_getSurveyType, createSelector_getFastMoneyRound } from 'store/selectors';
const soundKaChing = new UIfx({asset: SoundKaChing});
const soundFmBuzzer = new UIfx({asset: SoundFmBuzzer});
const soundScratch = new UIfx({asset: SoundScratch});

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

const HtmlFmFooterChild = styled.div`
  display:inline-block;
  width:33%;
`

const HtmlButtonChild = styled.div`
  cursor:pointer;
  display:inline-block;
  margin:0rem 1rem;
  padding: 1rem 2rem;

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

  transition: color .1s ease-in-out;
`

class Controls extends Component {
  constructor(){
    super();
    this.state = {
      soundPlaying: false
    };

    this.onInput = this.onInput.bind(this);
  }

  componentDidMount(){
    InputManager.addListeners(['awardPoints', 'nextRound', 'playMusic', 'strike' ], this.onInput);
  }

  componentWillUnmount(){
    InputManager.removeListeners(['awardPoints', 'nextRound', 'playMusic', 'strike' ], this.onInput);
  }

  onInput(command){
    switch(command.action){
      case 'awardPoints': this.endRound();
        break;
      case 'nextRound': this.props.advanceRound();
        break;
      case 'playMusic': this.toggleMusic();
        break;
      case 'strike': if(this.props.surveyType === 'FASTMONEY') soundFmBuzzer.play();
        break;
    }
  }

  endRound(){
    soundKaChing.play();
    this.props.awardPoints(this.props.activeTeam, this.props.survey.score);
    this.props.endRound(); 
  }

  toggleMusic(musicState){
    console.log('ms', musicState)
    if(musicState === undefined){
      musicState = !this.state.soundPlaying;
    }
    console.log('ms2', musicState)
    if(musicState === false){
      soundScratch.setVolume(.4).play();
    }
    this.setState({
      soundPlaying: musicState || false
    })
  }

  componentDidUpdate(prevProps){
    if(prevProps.gameWon !== this.props.gameWon && this.props.gameWon){
      global.setTimeout(() => {
        this.toggleMusic(true);
      }, 4500)
    }
  }

  renderTimerButton(type){
    if(type === 'FASTMONEY'){
      return (
        <HtmlFmFooterChild>
          <TimerButton 
            timeLimit={this.props.fastMoneyRound === 2 ? 25 : 20} 
            isFastMoney={true} />
        </HtmlFmFooterChild>
      );
    }else{
      return(
        <HtmlButtonChild>
          <TimerButton 
            timeLimit={10} 
            isFastMoney={false} />
        </HtmlButtonChild>
      );
    }
  }

  renderFirstColumn(surveyType){
    if(surveyType === 'FASTMONEY'){
      return(
        <HtmlFmFooterChild>
          { this.props.questionShowing ? (
            <HtmlButtonChild onClick={() => this.props.toggleQuestion(false)}>
              <HtmlIcon src={IconVisibilityOff}/>
              <HtmlText>{'Hide scores'}</HtmlText>
            </HtmlButtonChild>
          ):(
            <HtmlButtonChild onClick={() => this.props.toggleQuestion(true)}>
              <HtmlIcon src={IconVisibility}/>
              <HtmlText>{'Show scores'}</HtmlText>
            </HtmlButtonChild>
          ) }
        </HtmlFmFooterChild>
      );
    }else{
      return(
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
          { this.props.activeTeam && this.renderTimerButton() }
        </HtmlFooterChild>
      );
    }
  }

  renderSecondColumn(surveyType){
    if(surveyType === 'FASTMONEY'){
      return (
        <HtmlFmFooterChild>
          <HtmlButtonChild onClick={() => { soundFmBuzzer.play() }}>
            <HtmlIcon src={IconMusicOn}/>
            <HtmlText>{'BUZZ'}</HtmlText>
          </HtmlButtonChild>
          { this.state.soundPlaying ? (
            <HtmlButtonChild onClick={() => this.toggleMusic(false)}>
              <HtmlIcon src={IconMusicOff}/>
              <HtmlText>{'Turn music off'}</HtmlText>
            </HtmlButtonChild>
          ):(
            <HtmlButtonChild onClick={() => this.toggleMusic(true)}>
              <HtmlIcon src={IconMusicOn}/>
              <HtmlText>{'Turn music on'}</HtmlText>
            </HtmlButtonChild>
          ) }
          <HtmlButtonChild onClick={(e) => this.showImportPrompt(e)}>
            <HtmlText>{'+'}</HtmlText>
          </HtmlButtonChild>
        </HtmlFmFooterChild>
      );
    }else{
      return (
        <HtmlFooterChild>
          { this.props.activeTeam && this.props.roundActive && (
            <HtmlButtonChild onClick={() => this.endRound()}>
              <HtmlIcon src={IconStar}/>
              <HtmlText>{'Award points'}</HtmlText>
            </HtmlButtonChild>
          )}
          <HtmlButtonChild onClick={() => this.props.advanceRound()}>
            <HtmlIcon src={IconForward}/>
            <HtmlText>{'Go to next round'}</HtmlText>
          </HtmlButtonChild>
          { this.state.soundPlaying ? (
            <HtmlButtonChild onClick={() => this.toggleMusic(false)}>
              <HtmlIcon src={IconMusicOff}/>
              <HtmlText>{'Turn music off'}</HtmlText>
            </HtmlButtonChild>
          ):(
            <HtmlButtonChild onClick={() => this.toggleMusic(true)}>
              <HtmlIcon src={IconMusicOn}/>
              <HtmlText>{'Turn music on'}</HtmlText>
            </HtmlButtonChild>
          ) }
        </HtmlFooterChild>
      );
    }
  }

  showImportPrompt(e){
    const tabId = global.window.prompt('Enter tabId');
    if(tabId){
      this.props.setGoogleSheetData(null, tabId);
    }else{
      console.warn('no tab id given');
    }
  }

  render(){
    return(
      <HtmlFooter>
        { this.state.soundPlaying && (
          <ReactSound
            url={SoundTheme}
            loop={true}
            playStatus={ReactSound.status.PLAYING}
          />
        )}

        { this.renderFirstColumn(this.props.surveyType) }
        { this.props.surveyType === 'FASTMONEY' && this.renderTimerButton(this.props.surveyType) }
        { this.renderSecondColumn(this.props.surveyType) }
      </HtmlFooter>
    );
  }
}

const makeMapStateToProps = () => {
  const getSurvey = createSelector_getSurvey();
  const getSurveyType = createSelector_getSurveyType();
  const getFastMoneyRound = createSelector_getFastMoneyRound();
  const mapStateToProps = (state, props) => ({
    survey: getSurvey(state, props),
    surveyType: getSurveyType(state, props),
    fastMoneyRound: getFastMoneyRound(state, props),
    activeTeam: state.game.activeTeam,
    roundActive: state.game.roundActive,
    questionShowing: state.game.questionShowing,
    gameWon: state.game.gameWon
  });

  return mapStateToProps;
}

const mapDispatchToProps = dispatch =>
  bindActionCreators(
    { 
      awardPoints, 
      toggleQuestion, 
      advanceRound, 
      endRound,
      setGoogleSheetData
    },
    dispatch
  )

export default connect(
  makeMapStateToProps,
  mapDispatchToProps
)(Controls)

