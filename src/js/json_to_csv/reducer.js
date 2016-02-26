import { handleActions } from 'redux-actions';
// {
//   study: 'ProjectA',
//   displayOption: 'MESSAGES',
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
  study: '',
  displayOption: '',
  data: null,
};

const jsonCsvApp = handleActions({
  SET_STUDY: (state, action) => ({ study: action.payload }),

  SET_DISPLAY_OPTION: (state, action) =>
    ({ displayOption: action.payload }),

  START_DATA_FETCH: (state, action) => ({ fetchingData: true }),

  SET_DATA: (state, action) => ({ fetchingData: false, data: action.payload }),
}, defaultState);

export default jsonCsvApp;
