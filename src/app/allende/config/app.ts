/**
 * @author 			emansilla
 * @description 	description
 */
import * as angular from 'angular';
(function () {
	'use strict';
	/* Allende Module */
	const ngModule = angular.module('allende.config', []);
	
	ngModule.run(['Logger', function ($log) {
		$log = $log.getInstance('Allende.Config');
		$log.debug('ON.-');
	}]);
})();