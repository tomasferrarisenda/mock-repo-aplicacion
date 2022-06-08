/**
 * @author:			Ezequiel Mansilla
 * @description:	Mòdulo de gestiòn de loggeo
 * @type:			Module
 **/
import * as angular from 'angular';
import LoggerProvider from "./services/LoggerProvider";
import LoggerDataService from './services/LoggerDataService';
import "./config/app";

(function () {
	'use strict';
	/* Logger Module */
	const ngModule = angular.module('core.logger',['core.logger.config']);

	ngModule.run(run);
	LoggerProvider.init(ngModule);
	LoggerDataService.init(ngModule);

	run.$inject = ['Logger'];

	function run ($log) {
		$log = $log.getInstance('Core.Logger');
		$log.debug('ON.-');
	}

})();