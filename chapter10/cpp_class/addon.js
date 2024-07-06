const MyCalc = require('./build/Release/mycalc');
console.log(MyCalc);
const calc = new MyCalc(10);
calc.addOne(5);
console.log(calc.getValue());//15