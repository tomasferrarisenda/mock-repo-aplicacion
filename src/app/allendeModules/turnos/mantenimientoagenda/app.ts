
import * as angular from 'angular';

import states from "./config/states";
import permissions from "./config/permissions";
import BuscadorRecursoController from "./controllers/BuscadorRecursoController";
import FeriadosListController from "./controllers/FeriadosListController";
import FeriadoEditController from "./controllers/FeriadoEditController";
import RecesosListController from "./controllers/RecesosListController";
import RecesoEditController from "./controllers/RecesoEditController";
import saSelectorRecurso from "./directives/saSelectorRecurso";
import MantenimientoAgendaAuthService from "./services/MantenimientoAgendaAuthService";
import MantenimientoAgendaDataService from "./services/MantenimientoAgendaDataService";
import MantenimientoAgendaLogicService from "./services/MantenimientoAgendaLogicService";
import {TurnoParaRecesoIndividualDataService} from './services/TurnoParaRecesoIndividualDataService';
import { ConsultaRecesosComponent, ConsultaDuracionPrestacionComponent,RecesoIndividualContainerComponent } from "./components";


(function () {
   'use strict';
   
	/* Turno.Common Module */
	const module = angular.module('turno.mantenimientoagenda', []);

	states.init(module);
	permissions.init(module);

	BuscadorRecursoController.init(module);
	FeriadosListController.init(module);
	FeriadoEditController.init(module);
	RecesosListController.init(module);
	RecesoEditController.init(module);
	ConsultaRecesosComponent.init(module);
	ConsultaDuracionPrestacionComponent.init(module);
	RecesoIndividualContainerComponent.init(module);

	saSelectorRecurso.init(module);

	MantenimientoAgendaAuthService.init(module);
	MantenimientoAgendaDataService.init(module);
	MantenimientoAgendaLogicService.init(module);
	TurnoParaRecesoIndividualDataService.init(module);

	module.run(run);

	run.$inject = ['Logger'];

	function run($log) {
		$log = $log.getInstance("Turno.mantenimientoagenda");
		//$log.debug('ON.-');
	}
})();
