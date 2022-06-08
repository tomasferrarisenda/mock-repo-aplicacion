/**
 * @author 			emansilla
 * @description 	description
 */
import * as angular from 'angular';
import states from "./config/states";

import InternacionReportesDataService from "./services/InternacionReportesDataService";
import InternacionReportesLogicService from "./services/InternacionReportesLogicService";
import InternacionReportesAuthService from "./services/InternacionReportesAuthService";
import InternacionHistoricoHelperService from "./services/InternacionHistoricoHelperService";

import saGridReporteProtesisDirective from "./directives/saGridReporteProtesisDirective";
import saChartReporteProtesisEntregadasDirective from "./directives/saChartReporteProtesisEntregadasDirective";
import saChartReporteProtesisAutorizadasDirective from "./directives/saChartReporteProtesisAutorizadasDirective";
import saGridReporteFlujoCamasDirective from "./directives/saGridReporteFlujoCamasDirective";
import saGridReporteInternacionHistoricoDirective from "./directives/saGridReporteInternacionHistoricoDirective";

import InternacionHistoricoController from "./controllers/InternacionHistoricoController";
import ProtesisReporteTotalController from "./controllers/ProtesisReporteTotalController";
import InternacionFlujoCamasController from "./controllers/InternacionFlujoCamasController";

(function () {
	'use strict';
	
	/* Internacion.Reportes Module */
	const module = angular.module('internacion.reportes',['common']);

	states.init(module);

	InternacionReportesDataService.init(module);
	InternacionReportesLogicService.init(module);
	InternacionReportesAuthService.init(module);

	InternacionHistoricoHelperService.init(module);

	saGridReporteProtesisDirective.init(module);
	saChartReporteProtesisEntregadasDirective.init(module);
	saChartReporteProtesisAutorizadasDirective.init(module);
	saGridReporteFlujoCamasDirective.init(module);
	saGridReporteInternacionHistoricoDirective.init(module);

	InternacionHistoricoController.init(module);
	ProtesisReporteTotalController.init(module);
	InternacionFlujoCamasController.init(module);

	module.run(run);

	run.$inject = ['Logger'];

	function run ($log) {
		$log = $log.getInstance("Internacion.Reportes");
		$log.debug('ON.-');
	}
})();