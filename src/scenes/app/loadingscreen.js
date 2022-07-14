import React, { Component } from 'react';
import styled from 'styled-components';
import { themeGet } from 'themes/';
import { } from 'store/actions';

const HtmlContainer = styled.div`
  position:absolute;
  left:.5rem;
  top:.5rem;
  right:.5rem;
  bottom:.5rem;
  overflow:hidden;
  padding:1rem;

  display: grid;
  grid-template-columns: 21rem 1fr 21rem;
  grid-template-rows: 21rem 1fr 1fr;

  border-radius: 10rem;

  background-color:  ${themeGet('color', 'tealDark')};
  border: 1rem solid ${themeGet('color', 'tealLight')};
  color: ${themeGet('color', 'blue')};
`

const HtmlRoundBox = styled.div`
  grid-column: 2 / span 1;
  grid-row: 1 / span 1;

  h1{
    font-size: 20rem;
    width:100%;
    text-align:center;
  }
`


class LoadingScreen extends Component {
  render(){
    return(
      <HtmlContainer >
        <HtmlRoundBox>
          <h1>{'LOADING'}</h1>
        </HtmlRoundBox>
      </HtmlContainer>
    );
  }
}

export default LoadingScreen;

