/**
 * @author 			emansilla
 * @description 	description
 */
import * as angular from 'angular';
(function () {
	'use strict';
	/* Core Module */
	const ngModule = angular.module('core.config', []);
	
	ngModule.run(['Logger', function ($log) {
		$log = $log.getInstance('Core.Config');
		$log.debug('ON.-');
	}]);

})();