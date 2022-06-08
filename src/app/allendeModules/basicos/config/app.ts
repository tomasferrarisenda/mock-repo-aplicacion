/**
 * @author 			emansilla
 * @description 	description
 */
import * as angular from 'angular';

import states from "./states";
(function () {
	/* Basicos.Config Module */
	const module = angular.module('basicos.config', []);

	states.init(module);

	module.run(['Logger', function ($log) {
		$log = $log.getInstance("Basicos.Config");
		$log.debug('ON.-');
	}]);
})();