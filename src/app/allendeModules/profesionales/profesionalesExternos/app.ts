import * as angular from 'angular';
import states from "./config/states";

// Controllers
import ProfesionalesExternosListController from "./controllers/ProfesionalesExternosListController";
import ProfesionalesExternosEditController from "./controllers/modal/ProfesionalesExternosEditController";

// Services
import ProfesionalesExternosDataService from "./services/ProfesionalesExternosDataService";
import ProfesionalesExternosLogicService from "./services/ProfesionalesExternosLogicService";

(function () {
	const module = angular.module('profesionales.profesionalesExternos', []);

	states.init(module);

	ProfesionalesExternosListController.init(module);
	ProfesionalesExternosEditController.init(module);
	ProfesionalesExternosDataService.init(module);
	ProfesionalesExternosLogicService.init(module);

	module.run(run);

	run.$inject = ['Logger'];

	function run ($log) {
		$log = $log.getInstance("profesionales.profesionalesExternos");
	}
})();
