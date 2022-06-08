/**
 * @author 			ppautasso
 * @description 	description
 */
import * as angular from 'angular';
import states from "./config/states";
import constants from "./config/constants";

// Services
import CamaGestionDataService from "./services/CamaGestionDataService";
import HabitacionGestionDataService from "./services/HabitacionGestionDataService";
import HabitacionGestionLogicService from "./services/HabitacionGestionLogicService";
import HabitacionGestionAuthService from "./services/HabitacionGestionAuthService";

// Controllers
import SelectAllCamaController from "./controllers/SelectAllCamaController";
import HabitacionGestionListController from "./controllers/HabitacionGestionListController";
import HabitacionNewController from "./controllers/HabitacionNewController";
import HabitacionEditController from "./controllers/HabitacionEditController";
import CamaNewController from "./controllers/CamaNewController";

(function () {
	'use strict';
	
	/* Admision Module */
	const module = angular.module('cama.gestion',[]);

	constants.init(module);
	states.init(module);
	// Services
	CamaGestionDataService.init(module);
	HabitacionGestionDataService.init(module);
	HabitacionGestionLogicService.init(module);
	HabitacionGestionAuthService.init(module);
	// Controllers
	SelectAllCamaController.init(module);
	HabitacionGestionListController.init(module);
	HabitacionNewController.init(module);
	HabitacionEditController.init(module);
	CamaNewController.init(module);

	// AdmisionNewController.init(module);

	module.run(['Logger',function ($log) {
		$log = $log.getInstance("Cama.Gestion");
		$log.debug('ON.-');
	}]);
})();