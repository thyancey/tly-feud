import { 
  SET_DATA,
  SET_SHEET_DATA
} from '../actions';
import { SET_TRANSITION } from '../actions/transition';

//- initialState data is overwritten from an external json file in public/data.json
const ALLOWED_STORED_FIELDS = [ 'title', 'surveys', 'teams' ];
 
const initialState = {
  loaded: false,
  title: 'loading',
  teams: {
    left:'',
    right:''
  },
  surveys: []
}

const SHEET = {
  'SURVEY': 0,
  'ANSWER': 1,
  'POINTS': 2,
  'MULTIPLIER': 3,
  'TYPE': 4
}

const getSurveyObj = (idx, start, end, csvData) => {
  const type = csvData[start][SHEET.TYPE] || 'NORMAL';
  const resp = {
    id: idx + 1,
    title: csvData[start][SHEET.SURVEY],
    multiplier: +csvData[start][SHEET.MULTIPLIER],
    type: type,
    answers:[]
  };

  for(let i = start + 1; i < end; i++){
    const answer = csvData[i][SHEET.ANSWER];
    if(answer === '' && type !== 'FASTMONEY'){
      break;
    }else{
      resp.answers.push({
        value: answer,
        points: +csvData[i][SHEET.POINTS]
      });
    }
  }

  return resp;
}

const getSurveyType = (rowIdx, csvData) => ( csvData[rowIdx][SHEET.TYPE] || 'NORMAL' );

const parseSheetCsv = (csvData) => {
  const surveyIdxs = [];
  // const type = csvData[start][SHEET.TYPE];

  csvData.map((row, ri) => { 
    //- if not the header and the first cell has something,
    //- then its a survey title
    if(ri !== 0 && row[0] !== ''){
      surveyIdxs.push(ri);
    }
  })

  const surveys = [];
  for(let i = 0; i < surveyIdxs.length; i++){
    const type = getSurveyType(surveyIdxs[i], csvData);

    const start = surveyIdxs[i];

    let end;
    if(type === 'FASTMONEY'){
      end = start + 11;
    }else{
      end = start + 9;
    }
    if (end > csvData.length) end = csvData.length;

    surveys.push(getSurveyObj(i, start, end, csvData))
  }

  return surveys;
}

export default (state = initialState, action) => {
  switch (action.type) {
    case SET_DATA:{
      const cleanObj = {};
      const parsedData = action.payload;
      for(let key in parsedData){
        if(ALLOWED_STORED_FIELDS.indexOf(key) === -1){
          console.error(`stored dataField "${key}" is not a valid key`);
        }else{
          cleanObj[key] = parsedData[key];
        }
      }

      return {
        ...state,
        ...cleanObj,
        loaded: true
      }
    }

    case SET_SHEET_DATA:{
      const parsedData = action.payload;
      if(!parsedData){
        return {
          ...state
        }
      }else{
        const surveyJson = parseSheetCsv(parsedData);
        return {
          ...state,
          surveys: surveyJson
        }
      }
    }

    case SET_TRANSITION:{
      return {
        ...state,
        transitionLabel: action.payload.label
      }
    }

    default:
      return state
  }
}