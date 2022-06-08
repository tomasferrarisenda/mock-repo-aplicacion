/**
 * @author:			Ezequiel Mansilla
 * @description:	Modulo de gestión de mutuales
 * @type:			Module
 **/
import * as angular from 'angular';
import tabs from "./config/tabs";

//Services
import MutualGestionDataService from "./services/MutualGestionDataService";
import MutualGestionLogicService from "./services/MutualGestionLogicService";

//Controllers
import MutualGestionListController from "./controllers/MutualGestionListController";
import MutualEditController from "./controllers/MutualEditController";
import GeneralMutualEditController from "./controllers/tabs/GeneralMutualEditController";
import PlanMutualEditController from "./controllers/tabs/PlanMutualEditController";
import DomicilioMutualEditController from "./controllers/tabs/DomicilioMutualEditController";
import TelefonoMutualEditController from "./controllers/tabs/TelefonoMutualEditController";
import DocumentoMutualEditController from "./controllers/tabs/DocumentoMutualEditController";
import ReglasNroAfiliadoMutualEditController from "./controllers/tabs/ReglasNroAfiliadoMutualEditController";
import ListaFacturacionMutualEditController from "./controllers/tabs/ListaFacturacionMutualEditController";
import ListaEditFacturacionMutualController from "./controllers/listadoFacturacion/ListaEditFacturacionMutualController";
import ItemListaFacturacionMutualEditController from "./controllers/modal/ItemListaFacturacionMutualEditController";


(function () {
	'use strict';
	const module = angular.module('financiadores.mutual.gestion',[]);

	tabs.init(module);
	MutualGestionDataService.init(module);
	MutualGestionLogicService.init(module);
	MutualGestionListController.init(module);
	MutualEditController.init(module);
	GeneralMutualEditController.init(module);
	PlanMutualEditController.init(module);
	DomicilioMutualEditController.init(module);
	TelefonoMutualEditController.init(module);
	DocumentoMutualEditController.init(module);
	ReglasNroAfiliadoMutualEditController.init(module);
	ListaFacturacionMutualEditController.init(module);
	ListaEditFacturacionMutualController.init(module);
	ItemListaFacturacionMutualEditController.init(module);

	module.run(run);

	run.$inject = ['Logger'];

	function run ($log) {
		$log = $log.getInstance('Financiadores.Gestion');
		$log.debug('ON.-');
	}
})();