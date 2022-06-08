import * as angular from 'angular';
import states from "./config/states";
	// Controllers
import CuentasDefectoDerechosListController from "./controllers/CuentasDefectoDerechosListController";
import CuentasDefectoDerechosEditController from "./controllers/modal/CuentasDefectoDerechosEditController";

	// Services
import CuentasDefectoDerechosDataService from "./services/CuentasDefectoDerechosDataService";
import CuentasDefectoDerechosLogicService from "./services/CuentasDefectoDerechosLogicService";

(function () {
	/* Facturacion.Common Module */
	const module = angular.module('facturacion.configuraciones.cuentasDefectoDerechos', []);

	states.init(module);

	CuentasDefectoDerechosListController.init(module);
	CuentasDefectoDerechosEditController.init(module);
	CuentasDefectoDerechosDataService.init(module);
	CuentasDefectoDerechosLogicService.init(module);

	module.run(run);

	run.$inject = ['Logger'];

	function run ($log) {
		$log = $log.getInstance("facturacion.configuraciones.cuentasDefectoDerechos");
	}
})();

