/**
 * @author 			emansilla
 * @description 	description
 */
import * as angular from 'angular';
import states from './states';
(function () {
	'use strict';
	const module = angular.module('persona.config', []);

	states.init(module);
	
	module.run(['Logger', function ($log) {
		$log = $log.getInstance('Persona.Config');
		$log.debug('ON.-');
	}]);
})();