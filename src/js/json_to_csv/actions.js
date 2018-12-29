import Firebase from 'firebase';
import { createAction } from 'redux-actions';

import {
  ROOT_URL, AUTH_DOMAIN, API_KEY,
} from '../constants';

const config = {
  apiKey: API_KEY,
  authDomain: AUTH_DOMAIN,
  databaseURL: ROOT_URL,
};
Firebase.initializeApp(config);
const ROOT_FB = Firebase.database().ref();
const STUDIES_FB = Firebase.database().ref('/studies');

export const setStudyList = createAction('SET_STUDY_LIST');
export const setStudy = createAction('SET_STUDY');
export const setDisplayOption = createAction('SET_DISPLAY_OPTION');
export const startDataFetch = createAction('START_DATA_FETCH');
export const setData = createAction('SET_DATA');
export const failedDataFetch = createAction('FAILED_DATA_FETCH');

export function fetchStudyList() {
  return dispatch => STUDIES_FB.once('value')
    .then(response => dispatch(setStudyList(response.val())));
}

export function setStudyAndStartFetch(study) {
  return (dispatch) => {
    dispatch(setStudy(study));
    dispatch(startDataFetch(study));

    return ROOT_FB.child(study).once('value')
      .then(response => dispatch(setData(response.val())))
      .catch(err => dispatch(failedDataFetch(err)));
  };
}
