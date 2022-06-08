/**
 * @author 			jbasiluk
 * @description 	description
 */
import * as angular from 'angular';
(function () {		
	/* Integraciones.Common Module */
	const module = angular.module('integraciones.common', []);

	module.run(run);

	run.$inject = ['Logger'];

	function run ($log) {
		$log = $log.getInstance("Integraciones.Common");
		$log.debug('ON.-');
	}
})();