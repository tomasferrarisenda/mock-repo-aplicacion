/**
 * @author 			ppautasso
 * @description 	description
 */
import * as angular from 'angular';
import states from './states';

(function () {
	/* CentroServicios.Config Module */
	const module = angular.module('centroServicios.config', []);

	states.init(module);

	module.run(['Logger', function ($log) {
		$log = $log.getInstance('CentroServicios.Config');
		$log.debug('ON.-');
	}]);
})();