// hello.js
const addon = require('./build/Release/hello_nan');

console.log(addon.hello());
// Prints: 'world'