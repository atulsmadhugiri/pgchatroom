import _ from 'underscore';

function assert(condition, message = 'Assertion failed.') {
  if (!condition) {
    throw new Error(`[AssertionError]: ${message}`);
  }
}

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

export default {
  assert,
  getAttributeFromUrlParams,
  convertToMs,
  convertToMins,
  filterObject,
};
