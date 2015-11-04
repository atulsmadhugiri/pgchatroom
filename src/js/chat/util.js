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

export default {
  getAttributeFromUrlParams,
  convertToMs,
  convertToMins,
};
