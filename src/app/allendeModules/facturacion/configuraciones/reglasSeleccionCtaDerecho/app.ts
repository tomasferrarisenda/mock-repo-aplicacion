import * as angular from 'angular';
import states from "./config/states";
	// Controllers
import ReglasSeleccionCtaDerechoListController from "./controllers/ReglasSeleccionCtaDerechoListController";
import ReglasSeleccionCtaDerechoEditController from "./controllers/modal/ReglasSeleccionCtaDerechoEditController";

	// Services
import ReglasSeleccionCtaDerechoDataService from "./services/ReglasSeleccionCtaDerechoDataService";
import ReglasSeleccionCtaDerechoLogicService from "./services/ReglasSeleccionCtaDerechoLogicService";

(function () {
	/* Facturacion.Common Module */
	const module = angular.module('facturacion.configuraciones.reglaSeleccionCuentaDerecho', []);

	states.init(module);

	ReglasSeleccionCtaDerechoListController.init(module);
	ReglasSeleccionCtaDerechoEditController.init(module);
	ReglasSeleccionCtaDerechoDataService.init(module);
	ReglasSeleccionCtaDerechoLogicService.init(module);

	module.run(run);

	run.$inject = ['Logger'];

	function run ($log) {
		$log = $log.getInstance("facturacion.configuraciones.reglaSeleccionCuentaDerecho");
	}
})();

