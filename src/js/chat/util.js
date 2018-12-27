import _ from 'underscore';

export function assert(condition, message = 'Assertion failed.') {
  if (!condition) {
    throw new Error(`[AssertionError]: ${message}`);
  }
}

export function getAttributeFromUrlParams(regex) {
  const params = regex.exec(location.search);
  return params && params[1];
}

export function convertToMs(mins) {
  return mins * 60 * 1000;
}

export function convertToMins(ms) {
  return ms / 1000 / 60;
}

// pred: (v, k) => bool
export function filterObject(obj, pred) {
  const keys = _.pairs(obj)
    .filter(pair => pred(pair[1], pair[0]))
    .map(pair => pair[0]);
  return _.pick(obj, keys);
}

export function findLowestUserId(userIds) {
  return Math.min(...userIds);
}

export default {
  assert,
  getAttributeFromUrlParams,
  convertToMs,
  convertToMins,
  filterObject,
  findLowestUserId,
};
