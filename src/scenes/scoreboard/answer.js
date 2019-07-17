import React, { Component } from 'react';
import styled from 'styled-components';

import { themeGet } from 'themes/';

const HtmlContainer = styled.li`
  position:relative;
  display:block;
  padding: .5rem;
  margin: 1rem .5rem;
  border: .5rem solid ${themeGet('color', 'greyLight')};
  height:12.5rem;
`

const HtmlAnswer = styled.div`
  background-color: ${themeGet('color', 'white')};

  display:block;
  position:relative;
  height:10.5rem;
`

const HtmlAnswerChild = styled.div`
  display:inline-block;
  height:100%;
  text-align:center;
  vertical-align:middle;
  position:relative;

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
  width:calc(100% - 110px);

  box-shadow: inset 3px 3px 8px 0 rgba(0, 84, 153, 0.7);
  background-image: linear-gradient(to top, #006dc7, #005499);

  font-size:4rem;
  line-height:4.5rem;
`

const HtmlAnswerRight = styled(HtmlAnswerChild)`
  width:110px;

  box-shadow: inset -3px 3px 8px 0 #005499;
  background-image: linear-gradient(to bottom, #0090ff, #006dc7);

  font-size:7rem;
`


const HtmlCovered = styled.div`
  height:10.5rem;
  cursor: pointer;
  padding:1rem;
  box-shadow: inset 3px 3px 8px 0 ${themeGet('color', 'blueDark')};
  background-blend-mode: overlay;
  background-image: linear-gradient(
    to bottom, 
    ${themeGet('color', 'blueLight')}, 
    ${themeGet('color', 'blue')}), 
    radial-gradient(circle at 50% 0, ${themeGet('color', 'teal')}, ${themeGet('color', 'blue')});

  color: ${themeGet('color', 'white')};
  text-align:center;

  padding: 1rem;

  div{
    margin: 0 auto;
    margin-top:-.5rem;

    border-radius:50%;
    width: 127px;
    height: 96px;
    box-shadow: inset 0 5px 6px 0 rgba(0, 0, 0, 0.4);
    border: solid 2px #007ee6;
    background-color: #005499;
  }

  h1{
    margin-top:2.25rem;
    width:100%;
    vertical-align:middle;
  }
`

class Answer extends Component {
  constructor(){
    super();
  }

  render(){
    if(this.props.revealed){
      return(
        <HtmlContainer>
          <HtmlAnswer>
            <HtmlAnswerLeft>
              <span>{this.props.title}</span>
            </HtmlAnswerLeft>
            <HtmlAnswerRight>
              <span>{this.props.score}</span>
            </HtmlAnswerRight>
          </HtmlAnswer>
        </HtmlContainer>
      );
    }else{
      return(
        <HtmlContainer>
          <HtmlCovered onClick={this.props.onClick}>
            <div >
              <h1>{this.props.label}</h1>
            </div>
          </HtmlCovered>
        </HtmlContainer>
      );
    }

  }
}
export default Answer

