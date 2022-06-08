import * as angular from 'angular';
import states from "./config/states";
	// Controllers
import ReglasAgrupacionParticipantesListController from "./controllers/ReglasAgrupacionParticipantesListController";
import ReglasAgrupacionParticipantesEditController from "./controllers/modal/ReglasAgrupacionParticipantesEditController";

	// Services
import ReglasAgrupacionParticipantesDataService from "./services/ReglasAgrupacionParticipantesDataService";
import ReglasAgrupacionParticipantesLogicService from "./services/ReglasAgrupacionParticipantesLogicService";

(function () {
	/* Facturacion.Common Module */
	const module = angular.module('facturacion.configuraciones.reglaAgrupacionParticipantes', []);

	states.init(module);

	ReglasAgrupacionParticipantesListController.init(module);
	ReglasAgrupacionParticipantesEditController.init(module);
	ReglasAgrupacionParticipantesDataService.init(module);
	ReglasAgrupacionParticipantesLogicService.init(module);

	module.run(run);

	run.$inject = ['Logger'];

	function run ($log) {
		$log = $log.getInstance("facturacion.configuraciones.reglaAgrupacionParticipantes");
	}
})();

