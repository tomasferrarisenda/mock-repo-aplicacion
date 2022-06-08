/**
 * @author 			emansilla
 * @description 	description
 */
import * as angular from 'angular';
(function () {
	/* HistoriaClinica.Common Module */
	const module = angular.module('historiaClinica.common',['historiaClinica.config']);

	module.run(run);

	run.$inject = ['Logger'];

	function run ($log) {
		$log = $log.getInstance('HistoriaClinica.Common');
		$log.debug('ON.-');
	}
})();