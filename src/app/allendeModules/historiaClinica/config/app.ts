/**
 * @author 			emansilla
 * @description 	description
 */
import * as angular from 'angular';

(function () {
	/* HistoriaClinica.Config Module */
	const module = angular.module('historiaClinica.config', []);

	module.run(['Logger', function ($log) {
		$log = $log.getInstance('HistoriaClinica.Config');
		$log.debug('ON.-');
	}]);
})();