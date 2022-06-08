import * as angular from 'angular';

import states from "./config/states";
import tabs from "./config/tabs";

import AparatosListController from "./controllers/AparatosListController";
import AparatoEditController from "./controllers/AparatoEditController";
import AparatoGeneralController from "./controllers/tabs/AparatoGeneralController";
import AparatoProfesionalController from "./controllers/tabs/AparatoProfesionalController";
import AparatoProfesionalAtencionController from "./controllers/tabs/AparatoProfesionalAtencionController";
import ConfiguracionDefectoAparatoTplController from "./controllers/modal/ConfiguracionDefectoAparatoTplController";
import {RecursoTecnologicoRisLegacyDataService} from './services';
import AparatosDataService from "./services/AparatosDataService";
import AparatoLogicService from "./services/AparatoLogicService";

(function () {	
	/* Financiadores.Common Module */
    const module = angular.module('profesionales.aparatos', []);
    
	AparatosListController.init(module);
	AparatoEditController.init(module);
	AparatoGeneralController.init(module);
	AparatoProfesionalController.init(module);
	AparatoProfesionalAtencionController.init(module);
	ConfiguracionDefectoAparatoTplController.init(module);
	AparatosDataService.init(module);
	AparatoLogicService.init(module);
	RecursoTecnologicoRisLegacyDataService.init(module);
	
	states.init(module);
	tabs.init(module);

	module.run(run);

	run.$inject = ['Logger'];

	function run ($log) {
		$log = $log.getInstance("Aparatos");
	}
})();