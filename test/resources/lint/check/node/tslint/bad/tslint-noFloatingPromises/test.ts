// DO NOT CHANGE OR REFORMAT THIS FILE!!!
// https://nodejs.org/docs/latest/api/path.html
import * as path from 'path';
let test = path.delimiter as string;
test = test + test;

const fnt = async (): Promise<string> => {
  return '';
};

const fnt2 = async () => {
  fnt(); // "await" missing
};
fnt2().catch();