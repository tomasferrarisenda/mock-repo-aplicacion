/**
 * @author 			ppautasso
 * @description 	description
 */
import * as angular from 'angular';
import states from "./states";

(function () {
	/* Mutual.Config Module */
	const module = angular.module('prestaciones.config', []);

	states.init(module);

	module.run(['Logger', function ($log) {
		$log = $log.getInstance('Prestaciones.Config');
		$log.debug('ON.-');
	}]);
})();