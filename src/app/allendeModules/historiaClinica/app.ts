/**
 * @author 			emansilla
 * @description 	description
 */
import * as angular from 'angular';

import "./config/app";
import "./common/app";
import "./evolucion/app";
import "./templates/app";
(function () {
	/* HistoriaClinica Module */
	const module = angular.module('historiaClinica', [
		'historiaClinica.config',
		'historiaClinica.common',
		'historiaClinica.evolucion',
		'historiaClinica.templates'
	]);

	module.run(run);

	run.$inject = ['Logger'];

	function run ($log) {
		$log = $log.getInstance('HistoriaClinica');
		$log.info('ON.-');
	}
})();