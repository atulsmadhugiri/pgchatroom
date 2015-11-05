import _ from 'underscore';

function getAttributeFromUrlParams(regex) {
  const params = regex.exec(location.search);
  return params && params[1];
}

function convertToMs(mins) {
  return mins * 60 * 1000;
}

function convertToMins(ms) {
  return ms / 1000 / 60;
}

// pred: (v, k) => bool
function filterObject(obj, pred) {
  const keys = _.pairs(obj)
    .filter(pair => pred(pair[1], pair[0]))
    .map(pair => pair[0]);
  return _.pick(obj, keys);
}

// HACKHACKHACK: to allow store updates to trigger other actions
function deferRun(fn) {
  setTimeout(fn, 10);
}

function deferIfUpdated(prevState, state, key, fn) {
  if (!prevState[key] && state[key]) {
    deferRun(fn);
  }
}

export default {
  getAttributeFromUrlParams,
  convertToMs,
  convertToMins,
  filterObject,
  deferIfUpdated,
  deferRun,
};
