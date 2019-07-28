// import { css } from 'styled-components';

export const themeGet = (...args) => props => {
  let current = props.theme;
  for (const arg of args) {
    if (!current[arg]) {
      console.error('[Theming] Could not find', arg, 'in', current); // eslint-disable-line no-console
      return '';
    }
    current = current[arg];
  }
  return current;
};

export default {
  color:{
    black: '#000000',
    white : '#ffffff',
    greyLight: '#dcdcdd',
    grey: '#8b8b8d',
    greyDark: '#595f64',
    blueLight: '#0090ff',
    blue: '#006dc7',
    blueDark: '#005499',
    blueDarkest: '#001c33',
    tealLight: '#00dbc5',
    teal: '#4db2ff',
    tealDark: '#1a242d',
    red: '#d10000',
    yellow: '#fff200'
  },
  shadow:{
    z2: '-0.1rem 0.1rem .25rem .1rem rgba(0,0,0,0.36)',
    z3: '-.2rem .5rem 1rem .2rem rgba(0,0,0,.36)',
    text: '0 2px 4px rgba(0, 0, 0, 0.5)'
  },
  value:{
    headerHeight: '7.5rem'
  },
  mixins:{}
};