import Firebase from 'firebase';
import { createAction } from 'redux-actions';

import { ROOT_URL, STUDIES_URL } from '../constants';

const ROOT_FB = new Firebase(ROOT_URL);
const STUDIES_FB = new Firebase(STUDIES_URL);

export const setStudyList = createAction('SET_STUDY_LIST');
export const setStudy = createAction('SET_STUDY');
export const setDisplayOption = createAction('SET_DISPLAY_OPTION');
export const startDataFetch = createAction('START_DATA_FETCH');
export const setData = createAction('SET_DATA');

export function fetchStudyList() {
  return (dispatch) => {
    return STUDIES_FB.once('value')
      .then(response => dispatch(setStudyList(response.val())));
  };
}

export function setStudyAndStartFetch(study) {
  return (dispatch) => {
    dispatch(setStudy(study));
    dispatch(startDataFetch(study));

    return ROOT_FB.child(study).once('value')
      .then(response => dispatch(setData(response.val())));
  };
}
