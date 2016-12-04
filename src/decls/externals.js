/* @flow */
declare var it: any;
declare var xit: any;
declare var context: any;
declare var describe: any;
declare var assert: any;
declare var beforeEach: any;
declare var afterEach: any;

declare module "enzyme" {
  declare function shallow(component: any): any;
}

