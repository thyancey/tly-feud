import React, { Component } from 'react';
import styled from 'styled-components';

import { themeGet } from 'themes/';

const HtmlAnswer = styled.div`
  background-color: 'blue';
  border: .25rem dashed black;
`

class Answer extends Component {

  constructor(){
    super();
  }

  render(){
    return(
      <HtmlAnswer>
        <h1>{this.props.title}</h1>
        <span>{this.props.score}</span>
      </HtmlAnswer>
    );
  }
}
export default Answer

