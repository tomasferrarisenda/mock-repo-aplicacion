/**
 * @author:			Ezequiel Mansilla
 * @description:	Modulo de configuración  para ui.bootstrap
 * @type:			Module
 **/
import * as angular from 'angular';
import config from './config';

(function () {
	'use strict';
	/* Integration.Bootstrap.Config2 Module */
	const ngModule = angular.module('integration.bootstrap.config', []);
	
	config.init(ngModule);

	ngModule.run(run);

	run.$inject = ['Logger'];

	function run ($log) {
		$log = $log.getInstance('Integration.Bootstrap.Config');
		$log.debug('ON.-');
	}
	
})();