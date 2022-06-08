/**
 * @author 			emansilla
 * @description 	description
 */
import * as angular from 'angular';
import states from "./config/states";
import constants from "./config/constants";
// Services
import AutorizacionInternadoLogicService from "./services/AutorizacionInternadoLogicService";

// Controllers
import AutorizacionInternadoNewController from "./controllers/AutorizacionInternadoNewController";
import AutorizacionInternadoEditController from "./controllers/AutorizacionInternadoEditController";
import AutorizacionInternadoPrintController from "./controllers/AutorizacionInternadoPrintController";
import AutorizacionInternadoViewController from "./controllers/AutorizacionInternadoViewController";
import AutorizacionInternadoEditInterceptorController from "./controllers/AutorizacionInternadoEditInterceptorController";

(function () {
	'use strict';
	/* Admision Module */
	const module = angular.module('internacion.autorizacion',[]);

	constants.init(module);
	states.init(module);
	// Services
	AutorizacionInternadoLogicService.init(module);
	// Controllers
	AutorizacionInternadoNewController.init(module);
	AutorizacionInternadoEditController.init(module);
	AutorizacionInternadoPrintController.init(module);
	AutorizacionInternadoViewController.init(module);
	AutorizacionInternadoEditInterceptorController.init(module);
	
	module.run(['Logger',function ($log) {
		$log = $log.getInstance("Internacion.Autorizacion");
		$log.debug('ON.-');
	}]);
})();