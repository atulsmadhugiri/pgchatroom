import { createAction } from 'redux-actions';
import fetch from 'isomorphic-fetch';

export const setStudy = createAction('SET_STUDY');
export const setDisplayOption = createAction('SET_DISPLAY_OPTION');
export const startDataFetch = createAction('START_DATA_FETCH');
export const setData = createAction('SET_DATA');

export function setStudyAndStartFetch(study) {
  return (dispatch) => {
    dispatch(setStudy(study));
    dispatch(startDataFetch(study));

    return fetch(`https://research-chat-room.firebaseio.com/${study}.json`)
      .then(response => response.json())
      .then(json => dispatch(setData(json)));
  };
}
