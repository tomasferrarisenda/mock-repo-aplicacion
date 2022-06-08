/**
 * @author 			jbasiluk
 * @description 	description
 */
import * as angular from 'angular';
import states from "./states";
import permissions from "./permissions";

(function () {
	/** Integraciones.Logs.Config Module*/
	const module = angular.module('integraciones.logs.config',[]);

	permissions.init(module);
	states.init(module);

	module.run(['Logger', function ($log) {
		$log = $log.getInstance('Integraciones.Logs.Config');
		$log.debug('ON.-');
	}]);
})();