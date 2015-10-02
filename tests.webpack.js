// Look for _test.js files in src/__tests__
var context = require.context('./src/__tests__', true, /_test\.js$/);
context.keys().forEach(context);
