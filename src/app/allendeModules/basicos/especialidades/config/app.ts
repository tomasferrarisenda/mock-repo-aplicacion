/**
 * @author 			ppautasso
 * @description 	description
 */
import * as angular from 'angular';
import states from "./states";

(function () {
	/* Mutual.Config Module */
	const module = angular.module('especialidades.config', []);

	states.init(module);

	module.run(['Logger', function ($log) {
		$log = $log.getInstance('Especialidades.Config');
		$log.debug('ON.-');
	}]);
})();