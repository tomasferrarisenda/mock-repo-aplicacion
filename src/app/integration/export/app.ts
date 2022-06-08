/**
 * @author:			Ezequiel Mansilla
 * @description:	Modulo de exportacion
 * @type:			Module
 **/
import * as angular from 'angular';
import './csv/app';

(function () {
	'use strict';
	/* Integration.Export Module */
	const ngModule = angular.module('integration.export', [
			'integration.export.csv'
		]);

	ngModule.run(run);

	run.$inject = ['Logger'];

	function run ($log) {
		$log = $log.getInstance('Integration.Export');
		$log.debug('ON.-');
	}
})();