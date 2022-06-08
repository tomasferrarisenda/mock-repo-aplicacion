/**
 * @author 			emansilla
 * @description 	description
 */
import * as angular from 'angular';
import states from "./config/states";
import constants from "./config/constants";
import permissions from "./config/permissions";
// Services
import ReportesCamaDataService from "./services/ReportesCamaDataService";
// import CamaLogicService from "./services/CamaLogicService";
// import CamaAuthService from "./services/CamaAuthService";

// Controllers
import ReporteCamaOcupacionController from "./controllers/ReporteCamaOcupacionController";

// Directives
import saGridCamaOcupacionDirective from "./directives/saGridCamaOcupacionDirective";
import saChartCamaOcupacionDirective from "./directives/saChartCamaOcupacionDirective";
(function () {
	'use strict';
	/* Reportes Module */
	const module = angular.module('cama.reportes',[]);

	states.init(module);
	constants.init(module);
	permissions.init(module);

	// Services
	ReportesCamaDataService.init(module);
	// Controllers
	ReporteCamaOcupacionController.init(module);
	// Directives 
	saGridCamaOcupacionDirective.init(module);
	saChartCamaOcupacionDirective.init(module);

	module.run(['Logger', function ($log) {
		$log = $log.getInstance('Cama.Reportes');
		$log.debug('ON.-');
	}]);
})();