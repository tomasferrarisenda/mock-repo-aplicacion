import * as angular from 'angular';

import states from "./config/states";
import tabs from "./config/tabs";

import ProfesionalesListController from "./controllers/ProfesionalesListController";
import ProfesionalEditController from "./controllers/ProfesionalEditController";
import DistribucionesProfesionalEditController from "./controllers/tabs/DistribucionesProfesionalEditController";
import DomicilioProfesionalEditController from "./controllers/tabs/DomicilioProfesionalEditController";
import TelefonoProfesionalEditController from "./controllers/tabs/TelefonoProfesionalEditController";
import NacionalidadProfesionalEditController from "./controllers/tabs/NacionalidadProfesionalEditController";
import GeneralProfesionalEditController from "./controllers/tabs/GeneralProfesionalEditController";
import SegurosProfesionalEditController from "./controllers/tabs/SegurosProfesionalEditController";
import DocumentoProfesionalEditController from "./controllers/tabs/DocumentoProfesionalEditController";
import ProfesionalDefectoEditController from "./controllers/tabs/ProfesionalDefectoEditController";

import ProfesionalesLogicService from "./services/ProfesionalesLogicService";

import { ProfesionalesDataService } from "./services";

import SegurosTplController from "./controllers/modal/SegurosTplController";
import ConfiguracionProfesionalDefectoTplController from "./controllers/modal/ConfiguracionProfesionalDefectoTplController";


(function () {	
    const module = angular.module('profesionales.profesionales', []);
    
	ProfesionalesListController.init(module);
	ProfesionalEditController.init(module);
	ProfesionalesDataService.init(module);
	ProfesionalesLogicService.init(module);	
	DistribucionesProfesionalEditController.init(module);
	DomicilioProfesionalEditController.init(module);
	TelefonoProfesionalEditController.init(module);
	NacionalidadProfesionalEditController.init(module);
	GeneralProfesionalEditController.init(module);
	SegurosProfesionalEditController.init(module);
	SegurosTplController.init(module);
	ConfiguracionProfesionalDefectoTplController.init(module);
	DocumentoProfesionalEditController.init(module);
	ProfesionalDefectoEditController.init(module);
	
	states.init(module);
	tabs.init(module);
	
	module.run(run);

	run.$inject = ['Logger'];

	function run ($log) {
		$log = $log.getInstance("Profesionales");
	}
})();