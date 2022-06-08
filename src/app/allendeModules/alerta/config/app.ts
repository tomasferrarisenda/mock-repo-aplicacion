/**
 * @author 			mastore
 * @description 	description
 */
import * as angular from 'angular';
import states from "./states";
(function () {
   'use strict';
   /* Alerta.Config Module */
	const module = angular.module('alerta.config', []);

	states.init(module);
	
	module.run(['Logger', function ($log) {
		$log = $log.getInstance('Alerta.Config');
		$log.debug('ON.-');
	}]);
})();

		
