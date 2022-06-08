/**
 * @author 			ppautasso
 * @description 	description
 */
import * as angular from 'angular';
import states from "./states";
(function () {
	/* Servicios.Config Module */
	const module = angular.module('servicios.config',[]);

	states.init(module);

	module.run(['Logger', function ($log) {
		$log = $log.getInstance('Servicios.Config');
		$log.debug('ON.-');
	}]);
})();