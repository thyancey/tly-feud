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

class Answer extends Component {

  constructor(){
    super();
  }

  render(){
    return(
      <HtmlAnswer>
        <div>
          <h1>{this.props.title}</h1>
          <span>{this.props.score}</span>
        </div>
      </HtmlAnswer>
    );
  }
}
export default Answer

