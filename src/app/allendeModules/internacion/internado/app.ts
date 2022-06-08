/**
 * @author 			emansilla
 * @description 	description
 */
import * as angular from 'angular';
import states from "./config/states";
import constants from "./config/constants";
import permissions from "./config/permissions";
import tabs from "./config/tabs";

import InternadoAuthService from "./services/InternadoAuthService";
import MovimientoCamaService from "./services/MovimientoCamaService";
import InternadoLogicService from "./services/InternadoLogicService";

import InternadoListController from "./controllers/InternadoListController";
import InternadoEditController from "./controllers/InternadoEditController";
import InternadoEditInterceptorController from "./controllers/InternadoEditInterceptorController";
import InternadoPrintController from "./controllers/InternadoPrintController";
import InternadoShowController from "./controllers/InternadoShowController";
import InternadoViewController from "./controllers/InternadoViewController";
import InternadoAltaController from "./controllers/InternadoAltaController";
import InternadoLevantarAltaController from "./controllers/InternadoLevantarAltaController";
import InternadoListPartosController from "./controllers/InternadoListPartosController";
import InternadoCensoController from "./controllers/InternadoCensoController";
import BusquedaInternadoController from "./controllers/BusquedaInternadoController";

import saBusquedaInternado from "./directives/saBusquedaInternado";

(function () {
	'use strict';
	/* Admision Module */
	const module = angular.module('internacion.internado',[]);

	constants.init(module);
	states.init(module);
	permissions.init(module);
	tabs.init(module);
	
	// Services
	MovimientoCamaService.init(module);
	InternadoAuthService.init(module);
	InternadoLogicService.init(module);
	// Controllers
	InternadoListController.init(module);
	InternadoEditController.init(module);
	InternadoPrintController.init(module);
	InternadoShowController.init(module);
	InternadoViewController.init(module);
	InternadoAltaController.init(module);
	InternadoLevantarAltaController.init(module);
	InternadoListPartosController.init(module);
	InternadoCensoController.init(module);
	InternadoEditInterceptorController.init(module);
	BusquedaInternadoController.init(module);


	saBusquedaInternado.init(module);
	
	module.run(['Logger',function ($log) {
		$log = $log.getInstance("Internacion.Internado");
		$log.debug('ON.-');
	}]);
})();