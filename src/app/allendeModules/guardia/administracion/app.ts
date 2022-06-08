/**
 * @author 			mastore
 * @description 	description
 */
import * as angular from 'angular';

import states from "./config/states";
import constants from "./config/constants";

import GuardiaAdministracionDataService from "./services/GuardiaAdministracionDataService";
import GuardiaAdministracionLogicService from "./services/GuardiaAdministracionLogicService";
import GuardiaAdministracionAuthService from "./services/GuardiaAdministracionAuthService";


import ListAltaController from "./controllers/ListAltaController";
import PrescripcionDetalleController from "./controllers/PrescripcionDetalleController";
import PrescripcionDetallePrintController from "./controllers/PrescripcionDetallePrintController";
import FojaGuardiaPrintController from "./controllers/FojaGuardiaPrintController";
import PrescripcionFacturacionController from "./controllers/PrescripcionFacturacionController";


(function () {
	'use strict';
	/* Prueba Module */
	const module = angular.module('guardia.administracion', []);

	states.init(module);
	constants.init(module);
	GuardiaAdministracionDataService.init(module);
	GuardiaAdministracionLogicService.init(module);
	GuardiaAdministracionAuthService.init(module);
	ListAltaController.init(module);
	PrescripcionDetalleController.init(module);
	PrescripcionDetallePrintController.init(module);
	FojaGuardiaPrintController.init(module);
	PrescripcionFacturacionController.init(module);
	module.run(['Logger', function ($log) {
		$log = $log.getInstance("Guardia.Administracion");
		$log.debug('ON.-');
	}]);
}
)();