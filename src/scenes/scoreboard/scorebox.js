import React, { Component } from 'react';
import styled, { css } from 'styled-components';

import { themeGet } from 'themes/';


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

  ${props => props.active ?
    css`background-color: ${themeGet('color', 'yellow')};` :
    css`background-color: ${themeGet('color', 'greyDark')};`
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
  margin-left:1rem;
  position:relative;

  >div{
    position:absolute;
    width:100%;
    top:2rem;
    text-align:left;
  }

`

const HtmlStrikeBoxes = styled.div`

  div{
    display: inline-block;
    margin:0 .5rem;
    width:5rem;
    height:5rem;
    border: .5rem solid ${themeGet('color', 'greyDark')};
  }
`

const HtmlStrikes = styled.div`


`

const HtmlStrike = styled.div`
  display: inline-block;
  width:5rem;
  height:5rem;
  font-size:5rem;
  color:red;
  text-align:center;

  margin: -.5rem .5rem 0 .5rem;

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
          <HtmlStrikeBoxes>
            <div/>
            <div/>
            <div/>
          </HtmlStrikeBoxes>
          <HtmlStrikes>
            { this.renderStrikes(this.props.strikes) }
          </HtmlStrikes>
        </HtmlStrikeContainer>
      </HtmlScoreBlock>
    );
  }
}
export default Scorebox

