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
  'MULTIPLIER': 3
}

const getSurveyObj = (idx, start, end, csvData) => {
  const resp = {
    id: String(idx + 1),
    title: csvData[start][SHEET.SURVEY],
    multiplier: +csvData[start][SHEET.MULTIPLIER],
    answers:[]
  };

  for(let i = start + 1; i < end; i++){
    const answer = csvData[i][SHEET.ANSWER];
    if(answer === ''){
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

const parseSheetCsv = (csvData) => {
  const idxs = [];
  csvData.map((row, ri) => { 
    if(ri !== 0 && row[0] !== ''){
      idxs.push(ri);
    }
  })

  const surveys = [];
  for(let i = 0; i < idxs.length; i++){
    const start = idxs[i];
    let end = start + 9;
    
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
      console.log('parsedData:', parsedData)
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