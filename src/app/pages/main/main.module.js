'use strict';

import route from './main.route';
import './main.less'

const mainPageModule = angular.module('main-module', [
  'ui.router',
  // core
  require("../../core/core.module").name
]);

mainPageModule
    .config(route);

export default mainPageModule;