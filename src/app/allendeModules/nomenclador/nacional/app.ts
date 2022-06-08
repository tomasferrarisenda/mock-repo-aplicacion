/**
 * @author 			emansilla
 * @description 	description
 */
import * as angular from 'angular';
import PracticaMedicaDataService from "./services/PracticaMedicaDataService";
import PracticaMedicaLogicService from "./services/PracticaMedicaLogicService";
import PracticaMedicaSelectorController from "./controllers/PracticaMedicaSelectorController";

(function () {
	'use strict';
	/* Nomenclador.Nacional Module */
	const module = angular.module('nomenclador.nacional',[]);

	PracticaMedicaDataService.init(module);
	PracticaMedicaLogicService.init(module);
	PracticaMedicaSelectorController.init(module);
	
	module.run(run);

	run.$inject = ['Logger'];

	function run ($log) {
		$log = $log.getInstance('Nomenclador.Nacional');
		$log.debug('ON.-');
	}
})();