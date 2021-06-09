// DO NOT CHANGE OR REFORMAT THIS FILE!!!
// https://nodejs.org/docs/latest/api/path.html
import * as path from 'path';
let test = path.delimiter as string;
test = test + test;

let someConst = 123; // tslint error
if (someConst === 123) {
    let stromgol = 42; // prettier error
  if (stromgol) {
    stromgol += someConst;
  }
}
