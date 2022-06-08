/**
 * @author 			mastore
 * @description 	description
 */
import * as angular from 'angular';

import states from "./config/states";
import constants from "./config/constants";

import GuardiaAtencionDataService from "./services/GuardiaAtencionDataService";
import GuardiaAtencionLogicService from "./services/GuardiaAtencionLogicService";
import GuardiaAtencionAuthService from "./services/GuardiaAtencionAuthService";

import saDetallePrescripcion from "./directives/saDetallePrescripcion";

import GuardiaListController from "./controllers/GuardiaListController";
import GuardiaNewController from "./controllers/GuardiaNewController";
import GuardiaEditController from "./controllers/GuardiaEditController";
import PrescripcionAltaController from "./controllers/PrescripcionAltaController";
import GuardiaNewInterceptorController from "./controllers/GuardiaNewInterceptorController";
import PrescripcionViewController from "./controllers/PrescripcionViewController";
import PrescripcionDetalleEditController from "./controllers/PrescripcionDetalleEditController";
import PedidoUrgenciaController from "./controllers/PedidoUrgenciaController";
import PedidosDetalleController from "./controllers/PedidosDetalleController";
import NewFojaGuardiaController from "./controllers/NewFojaGuardiaController";
import NewFojaGuardiaDetalleController from "./controllers/NewFojaGuardiaDetalleController";

(function () {
	'use strict';
		/* Prueba Module */
		const module = angular.module('guardia.atencion',[]);

		states.init(module);
		constants.init(module);
		GuardiaAtencionDataService.init(module);
		GuardiaAtencionLogicService.init(module);
		GuardiaAtencionAuthService.init(module);
		saDetallePrescripcion.init(module);
		GuardiaListController.init(module);
		GuardiaNewController.init(module);
		// ViewController.init(module);
		GuardiaEditController.init(module);
		PrescripcionAltaController.init(module);
		GuardiaNewInterceptorController.init(module);
		PrescripcionViewController.init(module);
		PrescripcionDetalleEditController.init(module);
		PedidoUrgenciaController.init(module);
		PedidosDetalleController.init(module);
		NewFojaGuardiaController.init(module);
		NewFojaGuardiaDetalleController.init(module);

		module.run(['Logger',function ($log) {
			$log = $log.getInstance("Guardia.Atencion");
			$log.debug('ON.-');
		}]);
	}
)();