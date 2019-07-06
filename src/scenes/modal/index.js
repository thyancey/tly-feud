import React, { Component } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import styled from 'styled-components';

import { themeGet } from 'themes/';

import StrikeBox from './modals/strikebox';

import { } from 'store/actions';

const HtmlModalContainer = styled.div`
  position: absolute;
  left:2rem;
  top:2rem;
  right:2rem;
  bottom:2rem;
`

const HtmlModal = styled.div`
  position: absolute;
  width:100%;
  height:100%;

  background-color:blue;
  border-radius: 2rem;
  z-index:1;
`

class ModalContainer extends Component {

  render(){
    if(this.props.transitionLabel === 'strikePopupOpen'){
      const numStrikes = this.props.activeTeam === 'left' ? this.props.leftStrikes : this.props.rightStrikes;

      return(
        <HtmlModalContainer >
          <HtmlModal>
            <StrikeBox numStrikes={numStrikes}/>
          </HtmlModal>
        </HtmlModalContainer>
      );
    }else{
      return null;
    }
  }
}


const mapStateToProps = ({ game }) => ({
  transitionLabel: game.transitionLabel,
  leftStrikes: game.teams.left.strikes,
  rightStrikes: game.teams.right.strikes,
  activeTeam: game.activeTeam
})

const mapDispatchToProps = dispatch =>
  bindActionCreators(
    {},
    dispatch
  )

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ModalContainer)

