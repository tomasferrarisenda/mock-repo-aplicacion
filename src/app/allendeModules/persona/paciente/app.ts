/**
 * @author 			emansilla
 * @description 	description
 */
import * as angular from 'angular';
import states from "./config/states";
import constants from "./config/constants";
import permissions from "./config/permissions";
import tabs from "./config/tabs";
import { PacienteDataService } from './services';

import {VerDatosContactoPacienteModalComponent} from './components';

import PacienteAuthService from "./services/PacienteAuthService";
import PacienteLogicService from "./services/PacienteLogicService";
import PacienteNewController from "./controllers/PacienteNewController";
import PacienteListController from "./controllers/PacienteListController";
import PacienteEditController from "./controllers/PacienteEditController";
import PacienteBabyNewController from "./controllers/PacienteBabyNewController";
import PacienteListSelectorController from "./controllers/PacienteListSelectorController";
import PacienteListSelectorRelacionController from "./controllers/PacienteListSelectorRelacionController";
import PacienteInterceptorController from "./controllers/PacienteInterceptorController";
import saPacientePrint from "./directives/saPacientePrint";
import saBuscadorPaciente from "./directives/saBuscadorPaciente";

(function () {
	'use strict';

	/* Persona.Paciente Module */
	const module = angular.module('persona.paciente',[]);

	constants.init(module);
	states.init(module);
	permissions.init(module);
	tabs.init(module);

	PacienteDataService.init(module);
	PacienteAuthService.init(module);
	PacienteLogicService.init(module);
	
	PacienteNewController.init(module);
	PacienteListController.init(module);
	PacienteEditController.init(module);
	PacienteBabyNewController.init(module);
	PacienteListSelectorController.init(module);
	PacienteListSelectorRelacionController.init(module);
	PacienteInterceptorController.init(module);

	//components
	VerDatosContactoPacienteModalComponent.init(module);

	saPacientePrint.init(module);
	saBuscadorPaciente.init(module);

	module.run(['Logger', function ($log) {
		$log = $log.getInstance('Persona.Paciente');
		$log.debug('ON.-');
	}]);
})();