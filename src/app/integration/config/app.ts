/**
 * @author:			Ezequiel Mansilla
 * @description:	Modulo de configuración de integration
 * @type:			Module
 **/
import * as angular from 'angular';

(function () {
	'use strict';
	/* Integration.Config Module */
	const ngModule = angular.module('integration.config', []);

	ngModule.run(run);

	run.$inject = ['Logger'];

	function run ($log) {
		$log = $log.getInstance('Integration.Config');
		$log.debug('ON.-');
	}
})();