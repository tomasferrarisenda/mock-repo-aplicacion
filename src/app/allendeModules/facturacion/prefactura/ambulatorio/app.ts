import * as angular from 'angular';
import states from "./config/states";
import constants from "./config/constants";
import PrefacturaAmbulatorioNewController from "./controllers/PrefacturaAmbulatorioNewController";
import PrefacturaAmbulatorioListController from "./controllers/PrefacturaAmbulatorioListController";
import PrefacturaAmbulatorioDataService from "./services/PrefacturaAmbulatorioDataService";
import PrefacturaAmbulatorioLogicService  from "./services/PrefacturaAmbulatorioLogicService";
import PrefacturaAmbulatorioStorageHelperService  from "./services/PrefacturaAmbulatorioStorageHelperService";
import {prefacturaEditarItemComponent} from './modal/prefacturaEditarItemComponent';
import { validarCscEnPrefacturaModalComponent } from './modal';

(function () {
	/* Facturacion.Common Module */
	const module = angular.module('facturacion.prefactura.ambulatorio', []);

	states.init(module);
	constants.init(module);
	PrefacturaAmbulatorioNewController.init(module);
	PrefacturaAmbulatorioListController.init(module);
	PrefacturaAmbulatorioDataService.init(module);
	PrefacturaAmbulatorioLogicService.init(module);
	PrefacturaAmbulatorioStorageHelperService.init(module);
	prefacturaEditarItemComponent.init(module);
	validarCscEnPrefacturaModalComponent.init(module);
	
	module.run(['Logger',function ($log) {
	}]);
})();