/**
 * @author:			drobledo
 * @description:	Simuladores de convenio
 * @type:			Module
 **/
import * as angular from 'angular';

import states from "./config/states";
import constants from "../config/constants";

import SimuladorController from "./controllers/SimuladorController";
import SimuladorListaPreciosController from "./controllers/SimuladorListaPreciosController";
import ComparadorPreciosController from "./controllers/ComparadorPreciosController";
import SimuladorPrefacturaAmbulatoriaController from "./controllers/SimuladorPrefacturaAmbulatoriaController";
import SimuladorDataService from "./services/SimuladorDataService";
//import ProgressHubService from "./services/ProgressHubService";

(function () {	
	/* Financiadores.Common Module */
    const module = angular.module('convenios.simulador', []);
    
	SimuladorController.init(module);
	SimuladorListaPreciosController.init(module);
	ComparadorPreciosController.init(module);
	SimuladorDataService.init(module);
	SimuladorPrefacturaAmbulatoriaController.init(module);
	//ProgressHubService.init(module);
	states.init(module);
	constants.init(module);
	
	module.run(run);

	run.$inject = ['Logger'];

	function run ($log) {
		$log = $log.getInstance("Convenios");
	}
})();