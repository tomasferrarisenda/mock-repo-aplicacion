import * as angular from 'angular';
import states from './states';

(function () {
	/* Integraciones.Config Module */
	const module = angular.module('integraciones.config', []);

	states.init(module);

	module.run(['Logger', function ($log) {
		$log = $log.getInstance("Integraciones.Config");
		$log.debug('ON.-');
		}]);
})();