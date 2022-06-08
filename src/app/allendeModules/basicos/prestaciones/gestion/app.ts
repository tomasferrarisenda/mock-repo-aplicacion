/**
 * @author 			ppautasso
 * @description 	description
 */
import * as angular from 'angular';

import states from "./config/states";
import constants from "./config/constants";
import permissions from "./config/permissions";
// Services
import PrefacturacionControllerDataService from "./services/PrefacturacionControllerDataService";
import PrefacturableDataService from "./services/PrefacturableDataService";
import PrestacionGestionDataService from "./services/PrestacionGestionDataService";
import PrestacionGestionLogicService from "./services/PrestacionGestionLogicService";
import PrestacionGestionAuthService from "./services/PrestacionGestionAuthService";

// Directives
// "./directives/saPrestacionList",

// Controllers
import PrestacionEditController from "./controllers/PrestacionEditController";
import PrestacionNewController from "./controllers/PrestacionNewController";
import PrestacionViewController from "./controllers/PrestacionViewController";
import PrestacionAsignarController from "./controllers/PrestacionAsignarController";
import PrestacionGestionListController from "./controllers/PrestacionGestionListController";

(function () {
	/* Servicios Module */
	const module = angular.module('prestaciones.gestion',[]);

	states.init(module);
	constants.init(module);
	permissions.init(module);
	// Services
	PrefacturacionControllerDataService.init(module);
	PrefacturableDataService.init(module);
	PrestacionGestionDataService.init(module);
	PrestacionGestionLogicService.init(module);
	PrestacionGestionAuthService.init(module);

	//Directives
	// saPrestacionList.init(module);

	// Controllers
	PrestacionEditController.init(module);
	PrestacionNewController.init(module);
	PrestacionViewController.init(module);
	PrestacionAsignarController.init(module);
	PrestacionGestionListController.init(module);

	module.run(['Logger', function ($log) {
		$log = $log.getInstance('Servicios.Prestacion');
		$log.debug('ON.-');
	}]);
})();