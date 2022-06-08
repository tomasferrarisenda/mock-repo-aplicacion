/**
 * @author 			emansilla
 * @description 	description
 */
import * as angular from 'angular';
import config from "./config";
import constants from "./constants";
export default (function () {
	'use strict';
	/* Core.Http.Config Module */
	const ngModule = angular.module('core.http.config', []);

	config.init(ngModule);
	constants.init(ngModule);

	ngModule.run(['Logger', function ($log) {
		$log = $log.getInstance('Core.Http.Config');
		$log.debug('ON.-');
	}]);
})();