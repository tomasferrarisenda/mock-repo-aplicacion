import * as angular from 'angular';
import states from "./config/states";
import constants from "./config/constants";
import PrefacturaInternacionNewController from "./controllers/PrefacturaInternacionNewController";
import PrefacturaInternacionListController from "./controllers/PrefacturaInternacionListController";
import PrefacturaInternacionAuthService from "./services/PrefacturaInternacionAuthService";
import PrefacturaInternacionDataService from "./services/PrefacturaInternacionDataService";
(function () {
	/* Facturacion.Common Module */
	const module = angular.module('facturacion.prefactura.internacion', []);

	states.init(module);
	constants.init(module);
	PrefacturaInternacionNewController.init(module);
	PrefacturaInternacionListController.init(module);
	PrefacturaInternacionAuthService.init(module);
	PrefacturaInternacionDataService.init(module);
	
	module.run(['Logger',function ($log) {
		//$log = $log.getInstance('Facturacion.Internacion.Prefactura');
		//$log.info('ON.-');
	}]);
})();