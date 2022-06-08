/**
 * @author 			emansilla
 * @description 	description
 */
import * as angular from 'angular';
(function () {
	'use strict';
	/* Nomenclador.Config Module */
	const module = angular.module('nomenclador.config',[]);

	module.run(run);

	run.$inject = ['Logger'];

	function run ($log) {
		$log = $log.getInstance('Nomenclador.Config');
		$log.debug('ON.-');
	}
})();