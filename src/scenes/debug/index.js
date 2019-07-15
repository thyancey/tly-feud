import React, { Component } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import styled from 'styled-components';
import { themeGet } from 'themes/';
import { throwStrike, showStrike, revertStrike, endRound, advanceRound } from 'store/actions';

import SoundStrike from 'assets/sounds/strike.wav';
import UIfx from 'uifx';

const soundStrike = new UIfx({asset: SoundStrike});

const HtmlDebug = styled.div`
  cursor:pointer;
  position: absolute;
  left:2rem;
  bottom:2rem;
  background-color:black;
  border:.5rem dashed white;

  z-index:1;
`

const HtmlStrikeButton = styled.div`
  cursor:pointer;
  height:4rem;
  border: .25rem solid red;
  font-size:2rem;
  color:red;
  text-align:center;
  line-height:3.5rem;

  &:hover{
    color:white;
    border-color: white;
  }
`

const HtmlRevertStrikeButton = styled(HtmlStrikeButton)`
  color:green;
  border-color:green;
`
const HtmlEndRoundButton = styled(HtmlStrikeButton)`
  color:blue;
  border-color:blue;
`

class Debug extends Component {

  throwStrike(){
    soundStrike.setVolume(.5).play();
    this.props.showStrike(throwStrike, null, true);
  }
  revertStrike(){
    this.props.revertStrike();
  }

  render(){
    return(
      <HtmlDebug >
        { this.props.activeTeam && (
          <div>
          <h2>{'THE DEBUG DADDY'}</h2>
          <HtmlEndRoundButton onClick={() => this.props.endRound()}>
            <span>{'End round and award points'}</span>
          </HtmlEndRoundButton>
          <HtmlEndRoundButton onClick={() => this.props.advanceRound()}>
            <span>{'Next round'}</span>
          </HtmlEndRoundButton>
          <HtmlRevertStrikeButton onClick={() => this.revertStrike()}>
            <span>{'X-'}</span>
          </HtmlRevertStrikeButton>
          <HtmlStrikeButton onClick={() => this.throwStrike()}>
            <span>{'X+'}</span>
          </HtmlStrikeButton>
          </div>
        )}
      </HtmlDebug>
    );
  }
}


const mapStateToProps = ({ game }) => ({
  activeTeam: game.activeTeam
})

const mapDispatchToProps = dispatch =>
  bindActionCreators(
    { throwStrike, showStrike, revertStrike, endRound, advanceRound },
    dispatch
  )

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Debug)

