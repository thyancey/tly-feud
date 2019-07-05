import React, { Component } from 'react';
import styled, { css } from 'styled-components';

import { themeGet } from 'themes/';


const HtmlScoreBlock = styled.div`
  cursor:pointer;
  grid-column: ${props => props.position} / span 1;
  grid-row: 2 / span 1;

  top:50%;
  transform: translateY(-50%);
  position:absolute;
  left:0;
  height:20rem;
  right:0;
  text-align:center;
  vertical-align:middle;

  ${props => props.active ?
    css`border:.5rem solid yellow;` :
    css`border:.5rem solid blue;`
  }
`

const HtmlTop = styled.div`

`

const HtmlStrikes = styled.div`

`

const HtmlStrike = styled.div`
  display: inline-block;
  width:2rem;
  height:2rem;
  font-size:2rem;
  color:red;
  text-align:center;
  line-height:1.75rem;

  &:hover{
    color:white;
  }
`


class Scorebox extends Component {
  constructor(){
    super();
  }

  renderStrikes(numStrikes){
    const strikes = [];
    for(let i = 0; i < numStrikes; i++){
      strikes.push(<HtmlStrike key={i}>{'X'}</HtmlStrike>);
    }
    return strikes;
  }

  render(){
    return (
      <HtmlScoreBlock 
        active={this.props.active} 
        position={this.props.position === 'left' ? 1 : 3}
        onClick={this.props.onClick} >
        <HtmlTop>
          <p>{this.props.name}</p>
          <h3>{this.props.score}</h3>
        </HtmlTop>
        <HtmlStrikes>
          { this.renderStrikes(this.props.strikes) }
        </HtmlStrikes>
      </HtmlScoreBlock>
    );
  }
}
export default Scorebox

