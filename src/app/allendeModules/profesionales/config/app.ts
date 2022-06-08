import * as angular from 'angular';
import states from './states';
(function () {
	/* System.Config Module */
	const module = angular.module('profesionales.config', []);

	states.init(module);

	module.run(['Logger',function ($log) {
		$log = $log.getInstance('Profesionales.Config');
	}]);
})();