/**
 * @author 			jbasiluk
 * @description 	description
 */
import * as angular from 'angular';

import states from "./config/states";
import constants from "./config/constants";
// Services
import LogsGestionAuthService from './services/LogsGestionAuthService';
import LogsGestionDataService from './services/LogsGestionDataService';
import LogsGestionLogicService from './services/LogsGestionLogicService';
// Controllers	
import LogsGestionController from "./controllers/LogsGestionController";
import LogsViewController from "./controllers/LogsViewController";

(function () {
	/* Integraciones.Logs.Gestion Module */
	const module = angular.module('integraciones.logs.gestion',[]);
	states.init(module);
	constants.init(module);
	// Services
	LogsGestionAuthService.init(module);
	LogsGestionDataService.init(module);
	LogsGestionLogicService.init(module);
	// Controllers
	LogsGestionController.init(module);
	LogsViewController.init(module);

	module.run(['Logger', function ($log) {
		$log = $log.getInstance('Integraciones.Logs.Gestion');
		$log.debug('ON.-');
	}]);
})();