import React, { Component } from 'react';
import styled from 'styled-components';

import { themeGet } from 'themes/';


const HtmlAnswer = styled.li`
  background-color: ${themeGet('color', 'white')};

  margin: 2rem;
  display:block;

  min-height:9rem;
  position:relative;

  div{
    position:absolute;
    top:50%;
    transform:translateY(-50%);
    width:100%;
    padding:1rem;
  }

  h1,h2{
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
  min-height:9rem;
  display:block;
  position:relative;

  div{
    position:absolute;
    top:50%;
    transform:translateY(-50%);
    width:100%;
  }

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
            <h2>{this.props.title}</h2>
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

