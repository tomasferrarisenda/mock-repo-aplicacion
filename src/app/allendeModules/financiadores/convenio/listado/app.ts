import * as angular from 'angular';

import states from "./config/states";
import constants from "../config/constants";
import tabs from "./config/tabs";
// Controllers
import ConvenioListController from "./controllers/ConvenioListController";
import ConvenioEditController from "./controllers/ConvenioEditController";
import ClausulaEditController from "./controllers/listClausulaPrecio/ClausulaEditController";
import ListaPrecioEditController from "./controllers/listClausulaPrecio/ListaPrecioEditController";
import CondicionEditTplController from "./controllers/modal/CondicionEditTplController";
import ConsecuenciaEditTplController from "./controllers/modal/ConsecuenciaEditTplController";
import ItemListaPrecioEditTplController from "./controllers/modal/ItemListaPrecioEditTplController";
import UnidadArancelariaEditTplController from "./controllers/modal/UnidadArancelariaEditTplController";
import DimensionableEditTplController from "./controllers/modal/dimensionables/DimensionableEditTplController";
import ListaDimensionableEditTplController from "./controllers/modal/dimensionables/ListaDimensionableEditTplController";
import ClausulaListController from "./controllers/tabs/ClausulaListController";
import ListaPrecioListController from "./controllers/tabs/ListaPrecioListController";
import NormativaEditController from "./controllers/tabs/NormativaEditController";
import UnidadArancelariaListController from "./controllers/tabs/UnidadArancelariaListController";
import ADACEditController from "./controllers/tabs/ADACEditController";
import DocumentoEditController from "./controllers/tabs/DocumentoEditController";
import listaPrecioConvenioController from "./controllers/modal/consecuencias/listaPrecioConvenioController";
import listaRequisitoAdministrativoController from "./controllers/modal/consecuencias/listaRequisitoAdministrativoController";
import ConvenioCopyTplController from "./controllers/modal/ConvenioCopyTplController";
// Services
import ConvenioDataService from "./services/ConvenioDataService";
import ConvenioLogicService from "./services/ConvenioLogicService";

(function () {	
	/* Financiadores.Common Module */
	const module = angular.module('convenios.listado', []);
	states.init(module);
	constants.init(module);
	tabs.init(module);
	ConvenioListController.init(module);
	ConvenioDataService.init(module);
	ConvenioLogicService.init(module);
	ConvenioEditController.init(module);
	CondicionEditTplController.init(module);
	ConsecuenciaEditTplController.init(module);
	ClausulaEditController.init(module);
	ListaPrecioEditController.init(module);
	ItemListaPrecioEditTplController.init(module);
	UnidadArancelariaEditTplController.init(module);
	DimensionableEditTplController.init(module);
	ListaDimensionableEditTplController.init(module);
	ClausulaListController.init(module);
	ListaPrecioListController.init(module);
	NormativaEditController.init(module);
	UnidadArancelariaListController.init(module);
	ADACEditController.init(module);
	DocumentoEditController.init(module);
	listaPrecioConvenioController.init(module);
	listaRequisitoAdministrativoController.init(module);
	ConvenioCopyTplController.init(module);

	module.run(run);

	run.$inject = ['Logger'];

	function run ($log) {
		$log = $log.getInstance("Convenios");
	}
})();