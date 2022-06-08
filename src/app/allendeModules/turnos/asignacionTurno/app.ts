
import * as angular from 'angular';

import states from "./config/states";
import permissions from "./config/permissions";
import AsignacionTurnoListController from "./controllers/AsignacionTurnoListController";
import AsignacionTurnoNuevoController from "./controllers/AsignacionTurnoNuevoController";
import AsignacionTurnoMultiplesController from "./controllers/AsignacionTurnoMultiplesController";
import AsignacionTurnosVariosPacienteController from "./controllers/AsignacionTurnosVariosPacientesController";
import RequerimientosPreparacionesController from "./controllers/RequerimientosPreparacionesController";
import saGridPrimerTurnoDirective from "./directives/saGridPrimerTurnoDirective";
import saTablaTurnosAsignacionDirective from "./directives/saTablaTurnosAsignacionDirective";
import saTablaTurnosAsignacionMultipleDirective from "./directives/saTablaTurnosAsignacionMultipleDirective";
import AsignacionTurnoAuthService from "./services/AsignacionTurnoAuthService";
import AsignacionTurnoDataService from "./services/AsignacionTurnoDataService";
import AsignacionTurnoLogicService from "./services/AsignacionTurnoLogicService";
import AsignacionTurnoModalService from "./services/AsignacionTurnoModalService";
import { AsignacionTurnoStorageHelperService} from "./services/";
import { DetalleTurnoComponent } from "./components";
import { SeleccionarSolicitudEstudiosModalComponent } from './components/seleccionarSolicitudEstudiosModalComponent';


(function () {
   'use strict';
   
		const module = angular.module('turno.asignacionturno', []);

		states.init(module);
		permissions.init(module);

		//controllers
		AsignacionTurnoListController.init(module);
		AsignacionTurnoNuevoController.init(module);
		AsignacionTurnoMultiplesController.init(module);		
		AsignacionTurnosVariosPacienteController.init(module);
		RequerimientosPreparacionesController.init(module);
		AsignacionTurnoModalService.init(module);


		//Directives
		saGridPrimerTurnoDirective.init(module);
		saTablaTurnosAsignacionDirective.init(module);
		saTablaTurnosAsignacionMultipleDirective.init(module);


		//Services
		AsignacionTurnoAuthService.init(module);
		AsignacionTurnoDataService.init(module);
		AsignacionTurnoLogicService.init(module);
		AsignacionTurnoStorageHelperService.init(module);

		DetalleTurnoComponent.init(module);
		SeleccionarSolicitudEstudiosModalComponent.init(module);

		module.run(run);

		run.$inject = ['Logger'];

		function run($log) {
			$log = $log.getInstance("Turno.asignacionTurno");
			//$log.debug('ON.-');
		}

	})();
	