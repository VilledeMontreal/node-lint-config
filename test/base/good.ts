// tslint:disable:no-unused-expression

declare var require: any;

import 'tslint';
import 'tslint-config-airbnb';
require('tslint');

const variable = '';
const singleConcat = 'a' + 'b';
const array: number[] = [1];

if (true) {
  /**/
}

class MyClass {
  public static defaultName: string;
  protected static defaultAge: string;
  private static defaultSalary: number;

  public static doSomethingStatic1() {
    /**/
  }

  protected static doSomethingStatic2() {
    /**/
  }

  private static doSomethingStatic3() {
    /**/
  }

  public name: string;
  protected age: string;
  private salary: number;
  private _hidden: number;

  constructor() {
    /**/
  }

  // No order for the functions visibility...
  protected doSomething2() {
    /**/
  }
  public doSomething1() {
    /**/
  }
  private doSomething3() {
    /**/
  }
}

interface IMyInterface {
  name: string;
}
