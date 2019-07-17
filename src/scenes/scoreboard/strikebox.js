import React, { Component } from 'react';
import styled, { css } from 'styled-components';

import { themeGet } from 'themes/';

const HtmlStrikebox = styled.div`
  display: inline-block;
  margin:0 .5rem;
  width:5rem;
  height:5rem;
  border: .5rem solid ${themeGet('color', 'red')};
  text-align:center;
  position:relative;

  transition: border-color .2s ease-in-out;
  >div{
    transition: color .1s ease-in-out;
  }
  
  ${props => props.isActive === true ?
    css`
      border-color: ${themeGet('color', 'red')};
      >div{
        color:${themeGet('color', 'red')};
      }
      
      &:hover{
        border-color: ${themeGet('color', 'greyDark')};
        >div{
          color: ${themeGet('color', 'greyDark')};
        }
      }
    `:
    css`
      border-color: ${themeGet('color', 'greyDark')};
      >div{
        color:${themeGet('color', 'greyDark')};
      }
      
      &:hover{
        border-color: ${themeGet('color', 'red')};
        >div{
          color: ${themeGet('color', 'red')};
        }
      }
    `
  }
`
const HtmlStrike = styled.div`
  position: absolute;
  left:0;
  right:0;
  top:50%;
  transform:translateY(-50%);
  display: inline-block;
  font-size:5rem;
`

class Strikebox extends Component {
  constructor(){
    super();
  }

  onStrikeboxClick(isActive){
    if(isActive){
      this.props.onRemoveStrike()
    }else{
      this.props.onAddStrike()
    }
  }

  render(){
    return (
      <HtmlStrikebox onClick={() => this.onStrikeboxClick(this.props.isActive)} isActive={this.props.isActive}>
        { this.props.isActive && (
          <HtmlStrike>{'X'}</HtmlStrike>
        ) }
      </HtmlStrikebox>
    );
  }
}
export default Strikebox

