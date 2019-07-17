import React, { Component } from 'react';
import styled, { css } from 'styled-components';

import { themeGet } from 'themes/';

import Strikebox from './strikebox';

const HtmlScoreBlock = styled.div`
  cursor:pointer;
  grid-column: ${props => props.position} / span 1;
  grid-row: 2 / span 1;

  background-color: ${themeGet('color', 'greyDark')};

  top:50%;
  transform: translateY(-50%);
  position:absolute;
  left:0;
  height:16rem;
  right:0;
  text-align:center;
  vertical-align:middle;
  padding:.5rem;

  ${props => props.position === 1 ?
    css`
      border-radius: 2rem 0 0 2rem;
      padding-right:0;
    ` :
    css`
      border-radius: 0 2rem 2rem 0;
      padding-left:0;
    `
  }
`

const HtmlTop = styled.div`
  height:100%;
  color:white;
  position:relative;
  transition: background-color .2s ease-out;

  ${props => props.active ?
    css`
      background-color: ${themeGet('color', 'yellow')};
      &:hover{
        background-color: ${themeGet('color', 'yellow')};
      }
    ` : 
    css`
      background-color: ${themeGet('color', 'greyDark')};
      &:hover{
        background-color: ${themeGet('color', 'greyLight')};
      }
    `
  }

  padding:.5rem;

  ${props => props.position === 1 ?
    css`
      ${'' /* padding-right:0; */}
      border-radius: 1.5rem 0 0 1.5rem;
    ` :
    css`
      ${'' /* padding-left:0; */}
      border-radius: 0 1.5rem 1.5rem 0;
    `
  }


  div{
    height:100%;
    padding-top:2rem;
    
    ${props => props.position === 1 ?
      css`border-radius: 1rem 0 0 1rem;` :
      css`border-radius: 0 1rem 1rem 0;`
    }

    text-align:center;
    background-color: ${themeGet('color', 'blue')};

    span{
      font-size:8rem;
      font-weight:400;
    }
  }
`

const HtmlStrikeContainer = styled.div`
  margin-left: -.5rem;
  margin-top: 2rem;
  position:relative;
`

class Scorebox extends Component {
  constructor(){
    super();
  }

  renderStrikeboxes(numStrikes){
    const strikes = [];
    for(let i = 1; i < 4; i++){
      strikes.push(
        <Strikebox key={i} onRemoveStrike={this.props.onRemoveStrike} onAddStrike={this.props.onAddStrike} isActive={ i <= numStrikes ? true : false } />
      );
    }
    return strikes;
  }

  render(){
    return (
      <HtmlScoreBlock 
        position={this.props.position === 'left' ? 1 : 3}
        onClick={this.props.onClick} >
        <HtmlTop 
          active={this.props.active} 
          position={this.props.position === 'left' ? 1 : 3}>
          <div>
            <span>{this.props.score}</span>
          </div>
        </HtmlTop>
        <HtmlStrikeContainer>
          { this.renderStrikeboxes(this.props.strikes) }
        </HtmlStrikeContainer>
      </HtmlScoreBlock>
    );
  }
}
export default Scorebox

