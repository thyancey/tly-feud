import React, { Component } from 'react';
import styled, { css } from 'styled-components';

import { themeGet } from 'themes/';

const HtmlContainer = styled.li`
  position:relative;
  display:block;
  height:11rem;
  overflow:hidden;
`

const HtmlAnswer = styled.div`
  top:.5rem;
  position: absolute;
  width: 100%;

  display:block;
  height:10.5rem;

  padding:.5rem;
`

const HtmlAnswerChild = styled.div`
  cursor:pointer;
  border-top: 2px solid ${themeGet('color', 'blue')};
  border-left: 2px solid ${themeGet('color', 'blue')};
  border-bottom: 3px solid ${themeGet('color', 'blueWhite')};
  border-right: 3px solid ${themeGet('color', 'blueWhite')};
  display:inline-block;
  height:100%;
  vertical-align:middle;
  position:relative;
  
  background-color: ${themeGet('color', 'blueDarkest')};


  span{
    display:block;
    text-shadow: ${themeGet('shadow', 'text')};

    position: absolute;
    top:50%;
    transform: translateY(-50%);
    width:100%;
  }
`

const HtmlAnswerLeft = styled(HtmlAnswerChild)`
  padding:0rem 1.5rem;
  width:calc(100% - 122px);
  text-align:left;
  font-size:7rem;
`

const HtmlAnswerRight = styled(HtmlAnswerChild)`
  width:110px;
  text-align:center;

  font-size:7rem;
  margin-left:1rem;
`

const HtmlAnswerCover = styled.div`
  position:absolute;
  left:0%;
  right:0;
  top:0;
  bottom:0;
  z-index:1;

  background-color: ${themeGet('color', 'blueDarkest')};
  &:hover{
    box-shadow: 2px 2px 2px ${themeGet('color', 'white')};
  }

  transition: left .2s ease-in-out;

  
  ${props => props.isShowing === true ?
    css`
      left:100%;
    ` :
    css`
      left:0%
    `
  }

  
  ${props => props.isPopulated === true ?
    css`
    ` :
    css`
      cursor:default;
      background-color: ${themeGet('color', 'blueLight')};
    `
  }
`

class FastMoneyAnswer extends Component {
  constructor(){
    super();
  }

  render(){
    return(
      <HtmlContainer>
        <HtmlAnswer>
          <HtmlAnswerLeft onClick={this.props.onClick} >
            <HtmlAnswerCover isShowing={this.props.revealed} isPopulated={this.props.populated}/>
            <span>{this.props.title}</span>
          </HtmlAnswerLeft>
          <HtmlAnswerRight onClick={this.props.onScoreClick}>
            <HtmlAnswerCover isShowing={this.props.scoreRevealed} isPopulated={this.props.populated}/>
            <span>{this.props.score}</span>
          </HtmlAnswerRight>
        </HtmlAnswer>
      </HtmlContainer>
    );
  }
}
export default FastMoneyAnswer

