// tslint:disable:max-classes-per-file

// All lines should be in error, except the one with a comment

import 'tslint-config-airbnb'; // Line is ok
import 'tslint';
import 'tslint';

var noVar = '';
let preferConst = '';
const multipleConcat = 'a' + 'b' + 'c';
const array: Array<number> = [1];

if (true) console.log();

function unused() {
  /**/
}
(function() {
  /**/
})();

class notPascalCased {}

class NotWellOrdered {
  // Line is ok
  doSomething4() {
    /**/
  }
  private doSomething3() {
    /**/
  } // Line is ok

  constructor() {
    /**/
  }

  private salary: number;
  protected age: string;
  public name: string;

  public static defaultName: string;
  protected static defaultAge: string;
  private static defaultSalary: number;

  public doSomething1() {
    /**/
  }
  protected doSomething2() {
    /**/
  }

  public static doSomethingStatic1() {
    /**/
  }
  protected static doSomethingStatic2() {
    /**/
  }
  private static doSomethingStatic3() {
    /**/
  }
}

interface notPascalCased {}
interface NotStartingWithAnI {
  name: string; // Line is ok
}
interface IEmptyInterface {}
