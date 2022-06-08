import * as angular from 'angular';

import saContratableSelector from "./directives/saContratableSelector";
import saCuentaProfesional from "./directives/saCuentaProfesional";
import saMatriculaProfesional from "./directives/saMatriculaProfesional";
import contratableDataService from "./services/ContratableDataService";
import contratableLogicService from "./services/ContratableLogicService";
import SearchContratablesController from "./controllers/searchContratablesController";
import SearchCuentaProfesionalController from "./controllers/SearchCuentaProfesionalController";
import SearchMatriculaProfesionalController from "./controllers/SearchMatriculaProfesionalController";
import SearchProfesionalAtencionController from "./controllers/SearchProfesionalAtencionController";
import saTecnico from "./directives/saTecnico";
import SearchTecnicoController from "./controllers/SearchTecnicoController";
import {SelectorProfesionalAtiendeComponent} from './components'

(function () {	
	/* Financiadores.Common Module */
    const module = angular.module('profesionales.common', []);
    
	saContratableSelector.init(module);
	saCuentaProfesional.init(module);
	saMatriculaProfesional.init(module);
	contratableDataService.init(module);
	contratableLogicService.init(module);
	SearchContratablesController.init(module);
	SearchCuentaProfesionalController.init(module);
	SearchMatriculaProfesionalController.init(module);
	SearchProfesionalAtencionController.init(module);
	saTecnico.init(module);
	SearchTecnicoController.init(module)
	SelectorProfesionalAtiendeComponent.init(module);

	module.run(run);

	run.$inject = ['Logger'];

	function run ($log) {
		$log = $log.getInstance("Profesionales.Common");
	}
})();