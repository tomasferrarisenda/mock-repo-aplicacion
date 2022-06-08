import * as angular from 'angular';

import states from "./config/states";
import tabs from "./config/tabs";

import SociedadProfesionalesListController from "./controllers/SociedadProfesionalesListController";
import SociedadProfesionalesEditController from "./controllers/SociedadProfesionalesEditController";
import DistribucionesSociedadEditController from "./controllers/tabs/DistribucionesSociedadEditController";
import DomicilioSociedadEditController from "./controllers/tabs/DomicilioSociedadEditController";
import TelefonoSociedadEditController from "./controllers/tabs/TelefonoSociedadEditController";
import GeneralSociedadEditController from "./controllers/tabs/GeneralSociedadEditController";
import DocumentoSociedadEditController from "./controllers/tabs/DocumentoSociedadEditController";

import SociedadProfesionalesDataService from "./services/SociedadProfesionalesDataService";
import SociedadProfesionalesLogicService from "./services/SociedadProfesionalesLogicService";

(function () {	
	/* Financiadores.Common Module */
    const module = angular.module('profesionales.sociedadProfesionales', []);
    
	SociedadProfesionalesListController.init(module);
	SociedadProfesionalesEditController.init(module);
	SociedadProfesionalesDataService.init(module);
	SociedadProfesionalesLogicService.init(module);	
	DistribucionesSociedadEditController.init(module);
	DomicilioSociedadEditController.init(module);
	TelefonoSociedadEditController.init(module);
	GeneralSociedadEditController.init(module);
	DocumentoSociedadEditController.init(module);

	states.init(module);
	tabs.init(module);
	
	module.run(run);

	run.$inject = ['Logger'];

	function run ($log) {
		$log = $log.getInstance("SociedadProfesionales");
	}
})();