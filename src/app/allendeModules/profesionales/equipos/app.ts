import * as angular from 'angular';

import states from "./config/states";
import tabs from "./config/tabs";

import EquiposListController from "./controllers/EquiposListController";
import EquipoEditController from "./controllers/EquipoEditController";
import EquipoGeneralController from "./controllers/tabs/EquipoGeneralController";
import EquipoProfesionalController from "./controllers/tabs/EquipoProfesionalController";
import EquipoProfesionalAtencionController from "./controllers/tabs/EquipoProfesionalAtencionController";
import ConfiguracionDefectoEquipoTplController from "./controllers/modal/ConfiguracionDefectoEquipoTplController";
import EquiposDataService from "./services/EquiposDataService";
import EquipoLogicService from "./services/EquipoLogicService";

(function () {	
	/* Financiadores.Common Module */
    const module = angular.module('profesionales.equipos', []);
    
	EquiposListController.init(module);
	EquipoEditController.init(module);
	EquipoGeneralController.init(module);
	EquipoProfesionalController.init(module);
	EquipoProfesionalAtencionController.init(module);
	ConfiguracionDefectoEquipoTplController.init(module);
	EquiposDataService.init(module);
	EquipoLogicService.init(module);
	
	states.init(module);
	tabs.init(module);

	module.run(run);

	run.$inject = ['Logger'];

	function run ($log) {
		$log = $log.getInstance("Equipos");
	}
})();