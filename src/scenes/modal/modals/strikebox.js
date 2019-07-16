import React, { Component } from 'react';
import styled from 'styled-components';
import { themeGet } from 'themes/';

const HtmlStrikeBox = styled.div`
  position:absolute;
  width:100%;
  text-align:center;
  top:50%;
  transform: translateY(-50%);
`
const HtmlImg = styled.img`
  width:20rem;
  height:20rem;
`

const HtmlStrikeX = styled.p`
  font-size:50rem;
  color: ${themeGet('color', 'tealLight')};
  display:inline-block;
  margin:6rem;
`

class StrikeBox extends Component {
  renderStrikes(numStrikes){
    const strikes = [];
    for(let i = 0; i < numStrikes; i++){
      strikes.push(<HtmlStrikeX key={i}>{'X'}</HtmlStrikeX>)
    }
    return strikes;
  }

  render(){
    return(
      <HtmlStrikeBox>
        { this.renderStrikes(this.props.numStrikes)}
      </HtmlStrikeBox>
    );
  }
}


export default StrikeBox;

