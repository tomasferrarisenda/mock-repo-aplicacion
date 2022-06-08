/**
 * @author:			Ezequiel Mansilla
 * @description:	Modulo para rutas basicas
 * @type:			Module
 **/
import * as angular from 'angular';
import 'angular-ui-router';
import './config/app';

(function () {
	'use strict';
	
	/* Integration.Router Module */
	const ngModule = angular.module('integration.router', [
			'ui.router',
			'integration.router.config'
		]);

	ngModule.run(run);

	run.$inject = ['Logger'];
	function run ($log) {
		$log = $log.getInstance('Integration.Router');
		$log.debug('ON.-');
	}
	
})();