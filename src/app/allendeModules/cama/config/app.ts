/**
 * @author 			emansilla
 * @description 	description
 */
import * as angular from 'angular';
import states from "./states";

(function () {
	'use strict';	
	/* Cama.Config Module */
	const module = angular.module('cama.config',[]);

	states.init(module);

	module.run(['Logger', function ($log) {
		$log = $log.getInstance('Cama.Config');
		$log.debug('ON.-');
	}]);
})();