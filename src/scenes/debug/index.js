import React, { Component } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import styled from 'styled-components';

import { themeGet } from 'themes/';
import { throwStrike, revertStrike, endRound, startRound } from 'store/actions';

const HtmlDebug = styled.div`
  cursor:pointer;
  position: absolute;
  left:2rem;
  bottom:2rem;
`

const HtmlStrikeButton = styled.div`
  cursor:pointer;
  width:6rem;
  height:4rem;
  border: .25rem solid red;
  font-size:4rem;
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
    this.props.throwStrike();
  }
  revertStrike(){
    this.props.revertStrike();
  }

  render(){
    return(
      <HtmlDebug >
        <HtmlEndRoundButton onClick={() => this.props.onEndOfRound()}>
          <span>{'R'}</span>
        </HtmlEndRoundButton>
        <HtmlEndRoundButton onClick={() => this.props.onEndOfRound(true)}>
          <span>{'R>'}</span>
        </HtmlEndRoundButton>
        <HtmlRevertStrikeButton onClick={() => this.revertStrike()}>
          <span>{'X-'}</span>
        </HtmlRevertStrikeButton>
        <HtmlStrikeButton onClick={() => this.throwStrike()}>
          <span>{'X+'}</span>
        </HtmlStrikeButton>
      </HtmlDebug>
    );
  }
}


const mapStateToProps = ({ data }) => ({
})

const mapDispatchToProps = dispatch =>
  bindActionCreators(
    { throwStrike, revertStrike, endRound, startRound },
    dispatch
  )

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Debug)

