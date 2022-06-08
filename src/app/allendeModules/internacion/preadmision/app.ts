/**
 * @author 			emansilla
 * @description 	description
 */
import * as angular from 'angular';
import states from "./config/states";
import constants from "./config/constants";
import tabs from "./config/tabs";
import permissions from "./config/permissions";
// Controllers
import PreadmisionListController from "./controllers/PreadmisionListController";
import PreadmisionEditController from "./controllers/PreadmisionEditController";
import PreadmisionNewController from "./controllers/PreadmisionNewController";
import PreadmisionViewController from "./controllers/PreadmisionViewController";
import PreadmisionDeleteController from "./controllers/PreadmisionDeleteController";
import PreadmisionInterceptorController from "./controllers/PreadmisionInterceptorController";
import PreadmisionCantidadDiasController from "./controllers/PreadmisionCantidadDiasController";
import PreadmisionTemplateListController from "./controllers/PreadmisionTemplateListController";
import ProtesisPresupuestoPrintController from "./controllers/ProtesisPresupuestoPrintController";
import PrequirurgicoViewController from "./controllers/PrequirurgicoViewController";
import PrequirurgicoPrintController from "./controllers/PrequirurgicoPrintController";

// Services
import PreadmisionDataService from "./services/PreadmisionDataService";
import PreadmisionLogicService from "./services/PreadmisionLogicService";
import PreadmisionAuthService from "./services/PreadmisionAuthService";
import { PreadmisionStorageService } from './services';

(function () {
	'use strict';
	
	/* Preadmision Module */
	const module = angular.module('internacion.preadmision',[]);

	states.init(module);
	constants.init(module);
	tabs.init(module);
	permissions.init(module);

	// Services
	PreadmisionDataService.init(module);
	PreadmisionLogicService.init(module);
	PreadmisionAuthService.init(module);
	PreadmisionStorageService.init(module);

	// Controllers
	PreadmisionListController.init(module);
	PreadmisionEditController.init(module);
	PreadmisionNewController.init(module);
	PreadmisionViewController.init(module);
	PreadmisionDeleteController.init(module);
	PreadmisionInterceptorController.init(module);
	PreadmisionCantidadDiasController.init(module);
	PreadmisionTemplateListController.init(module);
	ProtesisPresupuestoPrintController.init(module);
	PrequirurgicoViewController.init(module);
	PrequirurgicoPrintController.init(module);

	module.run(['Logger',function ($log) {
		$log = $log.getInstance("Internacion.Preadmision");
		$log.debug('ON.-');
	}]);
})();