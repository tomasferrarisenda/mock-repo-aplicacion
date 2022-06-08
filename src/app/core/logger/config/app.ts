/**
 * @author:			Ezequiel Mansilla
 * @description:	Configuración de Core.Logger
 * @type:			Module
 **/
import * as angular from 'angular';
import config from './config';

(function () {
	'use strict';
	/* Core.Logger.Config Module */
	const ngModule = angular.module('core.logger.config',[]);

	ngModule.run(run);
	config.init(ngModule);

	run.$inject = ['Logger'];

	function run ($log) {
		$log = $log.getInstance('Core.Logger.Config');
		$log.debug('ON.-');
	}

})();