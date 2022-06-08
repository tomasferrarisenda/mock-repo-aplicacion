/**
 * @author 			emansilla
 * @description 	description
 */
import * as angular from 'angular';
import ExceptionHandler from "./services/ExceptionHandler";
import AllendeException from "./services/AllendeException";
import "./config/app";

(function () {
	'use strict';
	/* Core.Exception Module */
	const ngModule = angular.module('core.exception', ['core.exception.config']);

	ExceptionHandler.init(ngModule);
	AllendeException.init(ngModule);

	ngModule.run(['Logger', function ($log) {
		$log = $log.getInstance('Core.Exception');
		$log.debug('ON.-');
	}]);

})();