/**
 * @author 			emansilla
 * @description 	description
 */
import * as angular from 'angular';
import states from "./config/states";
import permissions from "./config/permissions";
import tabs from "./config/tabs";

// Services
import AdmisionDataService from "./services/AdmisionDataService";
import AdmisionLogicService from "./services/AdmisionLogicService";
import AdmisionAuthService from "./services/AdmisionAuthService";

// Controllers
import AdmisionListController from "./controllers/AdmisionListController";
import AdmisionNewController from "./controllers/AdmisionNewController";

(function () {
	'use strict';
	
	/* Admision Module */
	const module = angular.module('internacion.admision',[]);

	states.init(module);
	permissions.init(module);
	tabs.init(module);
	// Services
	AdmisionDataService.init(module);
	AdmisionLogicService.init(module);
	AdmisionAuthService.init(module);

	// Controllers
	AdmisionListController.init(module);
	AdmisionNewController.init(module);

	module.run(['Logger',function ($log) {
		$log = $log.getInstance("Internacion.Admision");
		$log.debug('ON.-');
	}]);
})();