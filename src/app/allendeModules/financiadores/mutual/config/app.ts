/**
 * @author 			emansilla
 * @description 	description
 */
import * as angular from 'angular';
import constants from "./constants";
import states from "./states";

(function () {
	'use strict';
	const module = angular.module('financiadores.mutual.config', []);

	constants.init(module);
	states.init(module);

	module.run(['Logger', function ($log) {
	}]);
})();