/**
 * @author 			jbasiluk
 * @description 	description
 */
import * as angular from 'angular';

import "./config/app";
import "./gestion/app";

(function () {
	/** Integraciones.Logs Module  */
	const module = angular.module('integraciones.logs', [
		'integraciones.logs.config',
		'integraciones.logs.gestion'
	]);

	module.run(['Logger', function($log) {
		$log = $log.getInstance("Integraciones.Logs");
		$log.debug('ON.-');
	}]);
})();