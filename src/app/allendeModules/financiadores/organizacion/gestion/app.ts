/**
 * @author 			Aldo Minoldo
 * @description 	description
 */

import * as angular from 'angular';

import OrganizacionGestionDataService from "./services/OrganizacionGestionDataService";
import OrganizacionGestionLogicService from "./services/OrganizacionGestionLogicService";
import states from "./config/states";
import tabs from "./config/tabs";
// Controllers
import OrganizacionEditController from "./controllers/OrganizacionEditController";
import OrganizacionGestionListController from "./controllers/OrganizacionGestionListController";
import GeneralOrganizacionEditController from "./controllers/tabs/GeneralOrganizacionEditController";
import DomicilioOrganizacionEditController from "./controllers/tabs/DomicilioOrganizacionEditController";
import TelefonoOrganizacionEditController from "./controllers/tabs/TelefonoOrganizacionEditController";

(function(){
	'use strict';
	/* Organizacion Module */
	const module = angular.module('financiadores.organizacion.gestion',[]);
	OrganizacionGestionDataService.init(module);
	OrganizacionGestionLogicService.init(module);
	OrganizacionEditController.init(module);
	OrganizacionGestionListController.init(module);
	GeneralOrganizacionEditController.init(module);
	DomicilioOrganizacionEditController.init(module);
	TelefonoOrganizacionEditController.init(module);

	states.init(module);
	tabs.init(module);
	
	module.run(run); 
	run.$inject = ['Logger'];

	function run ($log){
		$log = $log.getInstance('Organizacion.Gestion');
		$log.debug('ON.-');
	}
	})();