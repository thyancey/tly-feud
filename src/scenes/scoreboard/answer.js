import React, { Component } from 'react';
import styled from 'styled-components';

import { themeGet } from 'themes/';

const HtmlAnswer = styled.li`
  background-color: ${themeGet('color', 'white')};

  margin: 2rem;
  padding: 1rem;
  display:block;

  h1{
    display:inline-block;
    width:80%;
    vertical-align:middle;
  }
  span{
    display:inline-block;
    width:20%;
    text-align:center;
    vertical-align:middle;
    border-left: 2px solid purple;
    height:100%;
  }
`

const HtmlCovered = styled.li`
  cursor: pointer;
  background-color: ${themeGet('color', 'blue')};
  color: ${themeGet('color', 'white')};
  text-align:center;

  margin: 2rem;
  padding: 1rem;
  display:block;

  h1{
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
        <HtmlAnswer>
          <div >
            <h1>{this.props.title}</h1>
            <span>{this.props.score}</span>
          </div>
        </HtmlAnswer>
      );
    }else{
      return(
        <HtmlCovered onClick={this.props.onClick}>
          <div >
            <h1>{this.props.label}</h1>
          </div>
        </HtmlCovered>
      );
    }

  }
}
export default Answer

