// Look for -test.js files in src/__tests__
var context = require.context('./src/__tests__', true, /-test\.js$/);
context.keys().forEach(context);
