const getAttributeFromUrlParams = (regex) => {
  const params = regex.exec(location.search);
  return params[1];
};

export default {
  getAttributeFromUrlParams,
};
