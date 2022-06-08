/**
 * @author 			emansilla
 * @description 	description
 */
import * as angular from 'angular';

import constants from "./config/constants";
import EvolucionDataService from "./services/EvolucionDataService";
import EvolucionLogicService from "./services/EvolucionLogicService";
import EvolucionAuthService from "./services/EvolucionAuthService";
import EvolucionNewController from "./controllers/EvolucionNewController";

(function () {
	/* HistoriaClinica.Evolucion Module */
	const module = angular.module('historiaClinica.evolucion',[]);

	constants.init(module);
	
	EvolucionDataService.init(module);
	EvolucionLogicService.init(module);
	EvolucionAuthService.init(module);
	EvolucionNewController.init(module);

	module.run(run);

	run.$inject = ['Logger'];

	function run ($log) {
		$log = $log.getInstance('HistoriaClinica.Evolucion');
		$log.debug('ON.-');
	}
})();