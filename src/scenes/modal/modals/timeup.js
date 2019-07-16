import React, { Component } from 'react';
import styled from 'styled-components';
import { themeGet } from 'themes/';

const HtmlTimeUp = styled.div`
  position:absolute;
  width:100%;
  text-align:center;
  top:50%;
  transform: translateY(-50%);
`

const HtmlMessage = styled.p`
  font-size:20rem;
  color:${themeGet('color', 'tealLight')};
  display:inline-block;
  margin:6rem;
`

class TimeUp extends Component {
  render(){
    return(
      <HtmlTimeUp>
        <HtmlMessage>{'OUT OF TIME'}</HtmlMessage>
      </HtmlTimeUp>
    );
  }
}

export default TimeUp;

