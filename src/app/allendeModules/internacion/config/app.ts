/**
 * @author 			emansilla
 * @description 	description
 */
import * as angular from 'angular';
import states from "./states";
import constants from "./constants";
import "./info";

(function () {
	'use strict';
	/* Internacion.Config Module */
	const module = angular.module('internacion.config', ['internacion.info']);

	states.init(module);
	constants.init(module);

	module.run(['Logger', function ($log) {
		$log = $log.getInstance("Internacion.Config");
		$log.debug('ON.-');
	}]);
})();