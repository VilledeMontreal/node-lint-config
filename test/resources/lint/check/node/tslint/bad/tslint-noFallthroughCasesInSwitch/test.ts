// DO NOT CHANGE OR REFORMAT THIS FILE!!!
// https://nodejs.org/docs/latest/api/path.html
import * as path from 'path';
let test = path.delimiter as string;
test = test + test;

switch (test) {
  case 'a':
    break;
  case 'b':
    test = test + 'xxx';
  case 'c':
    break;
  default:
    break;
}