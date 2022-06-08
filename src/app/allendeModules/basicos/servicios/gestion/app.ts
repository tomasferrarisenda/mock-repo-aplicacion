/**
 * @author 			ppautasso
 * @description 	description
 */
import * as angular from 'angular';

import states from "./config/states";
import constants from "./config/constants";
import permissions from "./config/permissions";
// Services
import ServiciosGestionDataService from "./services/ServiciosGestionDataService";
import ServiciosGestionLogicService from "./services/ServiciosGestionLogicService";
import ServiciosGestionAuthService from "./services/ServiciosGestionAuthService";

// Controllers
import ServicioEditController from "./controllers/ServicioEditController";
import ServicioNewController from "./controllers/ServicioNewController";
import ServicioViewController from "./controllers/ServicioViewController";
import ServiciosGestionListController from "./controllers/ServiciosGestionListController";
import ServicioController from "./controllers/ServicioController";
import BuscadorServicioMedicoController from "./controllers/BuscadorServicioMedicoController";



(function () {
	
	/* Servicios Module */
	const module = angular.module('servicios.gestion', []);

	states.init(module);
	constants.init(module);
	permissions.init(module);
	// Services
	ServiciosGestionDataService.init(module);
	ServiciosGestionLogicService.init(module);
	ServiciosGestionAuthService.init(module);
	// Controllers
	ServicioEditController.init(module);
	ServicioNewController.init(module);
	ServicioViewController.init(module);
	ServiciosGestionListController.init(module);
	ServicioController.init(module);

	BuscadorServicioMedicoController.init(module);

	module.run(['Logger', function($log) {
		$log = $log.getInstance('Servicios.Gestion');
		$log.debug('ON.-');
	}]);

})();