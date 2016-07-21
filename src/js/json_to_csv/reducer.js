import { handleActions } from 'redux-actions';
// {
//   studyList: null,
//   study: 'ProjectA',
//   displayOption: 'MESSAGES',
//   fetchingStudyList: true,
//   fetchingData: false,
//   data: {
//     "weather" : {
//       "rooms" : {
//         "-K9iOKI837ZfK-lRNpGu" : {
//           "createdAt" : 1454624822528,
//           "messages" : {
//             "-K9iOM5Jz4k5gvwBmv_W" : {
//               "message" : "Hello world",
//               "userId" : "123"
//             },
//             "-K9iOMrvO1B0bkCgEdQt" : {
//               "message" : "Hello, 123",
//               "userId" : "1234"
//             },
//           },
//         }
//       },
//       "users" : {
//         "123" : "-K9iOKI837ZfK-lRNpGu",
//         "1234" : "-K9iOKI837ZfK-lRNpGu",
//         "12321" : "early-done",
//         "12345" : "-K9iOKI837ZfK-lRNpGu"
//       }
//     }
//   }
// }

const defaultState = {
  studyList: [],
  study: '',
  fetchingStudyList: true,
  displayOption: 'USERS',
  fetchingData: false,
  data: null,
  error: null,
};

const jsonCsvApp = handleActions({
  SET_STUDY_LIST: (state, action) => ({
    ...state,
    studyList: action.payload,
    fetchingStudyList: false,
  }),

  SET_STUDY: (state, action) => ({ ...state, study: action.payload }),

  SET_DISPLAY_OPTION: (state, action) =>
    ({ ...state, displayOption: action.payload }),

  START_DATA_FETCH: (state, action) => ({ ...state, fetchingData: true }),

  SET_DATA: (state, action) =>
    ({ ...state, fetchingData: false, data: action.payload }),

  FAILED_DATA_FETCH: (state, action) => ({
    ...state,
    fetchingData: false,
    data: null,
    error: action.payload.toString(),
  }),

}, defaultState);

export default jsonCsvApp;
