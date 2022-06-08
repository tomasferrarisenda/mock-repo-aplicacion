/**
 * @author 			ppautasso
 * @description 	description
 */
import * as angular from 'angular';

import states from "./config/states";
import constants from "./config/constants";
// Services
import EspecialidadMedicaDataService from "./services/EspecialidadMedicaDataService";
import EspecialidadMedicaLogicService from "./services/EspecialidadMedicaLogicService";
import EspecialidadMedicaAuthService from "./services/EspecialidadMedicaAuthService";

// Controllers
//"./controllers/EspecialidadMedicaEditController",
//"./controllers/EspecialidadMedicaNewController",
//"./controllers/EspecialidadMedicaViewController",
// "./controllers/EspecialidadAsignarController",
// "./controllers/EspecialidadMedicaListController"
import EspecialidadesGestionListController from "./controllers/EspecialidadesGestionListController";

(function () {
	/* Servicios Module */
	const module = angular.module('especialidades.gestion',[]);

	states.init(module);
	constants.init(module);
	// Services
	EspecialidadMedicaDataService.init(module);
	EspecialidadMedicaLogicService.init(module);
	EspecialidadMedicaAuthService.init(module);

	// Controllers
//	EspecialidadMedicaEditController.init(module);
//	EspecialidadMedicaNewController.init(module);
//	EspecialidadMedicaViewController.init(module);
	// EspecialidadAsignarController.init(module)
	// EspecialidadMedicaListController.init(module);
	EspecialidadesGestionListController.init(module);

	module.run(['Logger', function ($log) {
		$log = $log.getInstance('Especialidades.Gestion');
		$log.debug('ON.-');
	}]);
})();