/**
 * @author:			Ezequiel Mansilla
 * @description:	Configuracion de router
 * @type:			Module
 **/
import * as angular from 'angular';
import config from './config';

(function () {
	'use strict';
		
	/* Integration.Router.Config Module */
	const ngModule = angular.module('integration.router.config', []);

	config.init(ngModule);
	ngModule.run(runMethod);

	runMethod.$inject = ['Logger'];

	function runMethod ($log) {
		$log = $log.getInstance('Integration.Router.Config');
		$log.debug('ON.-');
	}
})();