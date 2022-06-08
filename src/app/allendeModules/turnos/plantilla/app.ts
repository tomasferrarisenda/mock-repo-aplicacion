
import * as angular from 'angular';

import tabs from "./config/tabs"

import states from "./config/states";
import permissions from "./config/permissions";
import saSelectorServicioMedico from "./directives/saSelectorServicioMedico";
import PlantillaListController from "./controllers/PlantillaListController";
import PlantillaEditController from "./controllers/PlantillaEditController";
import PlantillaModalNewController from "./controllers/PlantillaModalNewController";
import PlantillaModalViewController from "./controllers/PlantillaModalViewController";
import DuracionesTurnosListController from "./controllers/DuracionesTurnosListController";
import DuracionesTurnosEditController from "./controllers/DuracionesTurnosEditController";
import ReglasDeCantidadesListController from "./controllers/ReglasDeCantidadesListController";
import ReglasDeCantidadesEditController from "./controllers/ReglasDeCantidadesEditController";
import ImpactoAplicarPlantillaController from "./controllers/ImpactoAplicarPlantillaController";
import PlantillaModalItemCopiarController from "./controllers/PlantillaModalItemCopiarController";
import TurnosPorGenerarController from "./controllers/TurnosPorGenerarController";
import PlantillaAuthService from "./services/PlantillaAuthService";
import PlantillaDataService from "./services/PlantillaDataService";
import PlantillaLogicService from "./services/PlantillaLogicService";
import {ReglasDeTurnosConsultaComponent,PrestacionesPorRecursoYServicioModalComponent} from "./components";


(function () {
   'use strict';
   

		const module = angular.module('turno.plantilla', []);

		states.init(module);
		permissions.init(module);
		tabs.init(module);


		saSelectorServicioMedico.init(module);

		PlantillaListController.init(module);
		PlantillaEditController.init(module);
		PlantillaModalNewController.init(module);
		PlantillaModalViewController.init(module);
		DuracionesTurnosListController.init(module);
		DuracionesTurnosEditController.init(module);
		ReglasDeCantidadesListController.init(module);
		ReglasDeCantidadesEditController.init(module);
		ImpactoAplicarPlantillaController.init(module);
		PlantillaModalItemCopiarController.init(module);
		TurnosPorGenerarController.init(module);

		ReglasDeTurnosConsultaComponent.init(module);
		PrestacionesPorRecursoYServicioModalComponent.init(module);

		PlantillaAuthService.init(module);
		PlantillaDataService.init(module);
		PlantillaLogicService.init(module);

		module.run(run);

		run.$inject = ['Logger'];

		function run($log) {
			$log = $log.getInstance("Turno.plantilla");
			//$log.debug('ON.-');
		}

	})();
	