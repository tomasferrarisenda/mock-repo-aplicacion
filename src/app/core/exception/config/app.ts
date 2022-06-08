/**
 * @author 			emansilla
 * @description 	description
 */

 import * as angular from 'angular';
 import constants from './constants';
 (function () {
	 'use strict';
	/* Core.Exception.Config Module */
	const ngModule = angular.module('core.exception.config', []);

	constants.init(ngModule);

	ngModule.run(['Logger', function ($log) {
		$log = $log.getInstance('Core.Exception.Config');
		$log.debug('ON.-');
	}]);

})();