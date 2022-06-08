/**
 * @author 			emansilla
 * @description 	description
 */
import * as angular from 'angular';
import states from "./config/states";
import constants from "./config/constants";
import permissions from "./config/permissions";
import CamaDataService from "./services/CamaDataService";
import CamaLogicService from "./services/CamaLogicService";
import CamaAuthService from "./services/CamaAuthService";
import CamaListSelectorController from "./controllers/CamaListSelectorController";
import CamaInterceptorController from "./controllers/CamaInterceptorController";
import CamaStateListController from "./controllers/CamaStateListController";
(function () {
	'use strict';
	/* Cama Module */
	const module = angular.module('cama.estado',[]);

	states.init(module);
	constants.init(module);
	permissions.init(module);
	// Services
	CamaDataService.init(module);
	CamaLogicService.init(module);
	CamaAuthService.init(module);

	// Controllers
	CamaListSelectorController.init(module);
	CamaInterceptorController.init(module);
	CamaStateListController.init(module);

	module.run(['Logger', function ($log) {
		$log = $log.getInstance('Cama.Estado');
		$log.debug('ON.-');
	}]);
})();