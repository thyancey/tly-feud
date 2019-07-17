import React, { Component } from 'react';
import styled, { css } from 'styled-components';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import { themeGet } from 'themes/';
import Scorebox from '../scoreboard/scorebox';

import { } from 'store/actions';
import { createSelector_getWinningTeam } from 'store/selectors';


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


class EndScreen extends Component {

  render(){
    global.winningTeam = this.props.winningTeam;
    return(
      <HtmlContainer >
        <HtmlRoundBox>
          <h1>{'WINNER'}</h1>
        </HtmlRoundBox>
        <Scorebox 
            position={this.props.winningTeam.position}
            active={true}
            name={this.props.winningTeam.name}
            score={this.props.winningTeam.score} />
      </HtmlContainer>
    );
  }
}

const makeMapStateToProps = () => {
  const getWinningTeam = createSelector_getWinningTeam();
  const mapStateToProps = (state, props) => ({
    winningTeam: getWinningTeam(state, props),
    teams: state.game.teams,
    leftScore: state.game.teams.left.score,
    roundActive: state.game.roundActive,
    rightScore: state.game.teams.right.score
  });

  return mapStateToProps;
}

const mapDispatchToProps = dispatch =>
  bindActionCreators(
    {},
    dispatch
  )

export default connect(
  makeMapStateToProps,
  mapDispatchToProps
)(EndScreen)

