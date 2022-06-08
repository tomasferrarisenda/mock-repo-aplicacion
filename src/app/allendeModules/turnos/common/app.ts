
import * as angular from 'angular';

import TurnoDataService from "./services/TurnoDataService";
import CriterioBusquedaTurnoDataService from "./services/criterioBusqueda/criterioBusquedaTurnoDataService";
import TurnosStorageHelperService from "./services/TurnosStorageHelperService";
import TurnosCommonLogicService from "./services/TurnosCommonLogicService";
import TiposDeTurnosDataService from "./services/tiposDeTurnos/TiposDeTurnosDataService";
import ItemsDePlantillaTurnoDataService from "./services/itemsDePlantillaTurno/ItemsDePlantillaTurnoDataService";
import TurnosLogicService from "./services/TurnosLogicService";

import saTurnosPacienteBtn from "./directives/saTurnosPacienteBtn";
import saTurnosPorPacienteComponent from "./components/saTurnosPorPaciente/saTurnosPorPacienteComponent";

import TurnoLogAuditoriaController from "./controllers/TurnoLogAuditoriaController";

import {DisponibilidadDeTurnosDataService,ObservacionesRecursoServicioDataService} from "./services";
import { ListaTurnosGeneradosXRecursoComponent, VerMotivosCancelacionTurnoComponent, RecursosSelectorModalPorMutualComponent, 
	ObservacionPorSucursalesComponent, CancelarTurnoComponent,CalendarioOcupacionTurnosModalComponent } from './components';

import {RecursosSelectorPorMutualComponent } from './components/RecursosSelectorPorMutualComponent';




(function () {
   'use strict';
   
		/* System.Common Module */
		const module = angular.module('turno.common',['turno.config']);

		// constants.init(module);
		// routes.init(module);
		// SubsistemaTurnoHomeController.init(module);
		// SubsistemaTurnoAboutController.init(module);

		//Services
		TurnoDataService.init(module);
		CriterioBusquedaTurnoDataService.init(module);
		TurnosStorageHelperService.init(module);
		TurnosCommonLogicService.init(module);
		TiposDeTurnosDataService.init(module);
		ItemsDePlantillaTurnoDataService.init(module);
		TurnosLogicService.init(module);
		DisponibilidadDeTurnosDataService.init(module);
		ObservacionesRecursoServicioDataService.init(module);

		//controllers
		TurnoLogAuditoriaController.init(module);

		//directives 
		saTurnosPacienteBtn.init(module);

		//components
		saTurnosPorPacienteComponent.init(module);
		ListaTurnosGeneradosXRecursoComponent.init(module);
		VerMotivosCancelacionTurnoComponent.init(module);
		RecursosSelectorPorMutualComponent.init(module);
		RecursosSelectorModalPorMutualComponent.init(module);
		ObservacionPorSucursalesComponent.init(module);
		CancelarTurnoComponent.init(module);
		CalendarioOcupacionTurnosModalComponent.init(module);


		module.run(run);

		run.$inject = ['Logger'];

		function run ($log) {
			$log = $log.getInstance("Turno.Common");
			//$log.debug('ON.-');
		}
	})();