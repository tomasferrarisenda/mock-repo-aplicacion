import * as angular from 'angular';
import states from "./config/states";
import tabs from "./config/tabs";

import ContratosInternosListController from "./controllers/ContratosInternosListController";
import EditContratosInternosController from "./controllers/EditContratosInternosController";
import GeneralController from "./controllers/tabs/GeneralController";
import AjusteController from "./controllers/tabs/AjusteController";
import PagosController from "./controllers/tabs/PagosController";
import RetencionController from "./controllers/tabs/RetencionController";
import CuentasController from "./controllers/tabs/CuentasController";
import ParticipacionController from "./controllers/tabs/ParticipacionController";
import CuentasDefectoContratoTplController from "./controllers/modal/CuentasDefectoContratoTplController";
import ParticipacionTplController from "./controllers/modal/ParticipacionTplController";
import DocumentoContratoEditController from "./controllers/tabs/DocumentoContratoEditController";
import FacturaDirectoController from './controllers/tabs/FacturaDirectoController';
import ContratosInternosDataService from "./services/ContratosInternosDataService";
import ContratosInternosLogicService from "./services/ContratosInternosLogicService";
import facturaDirectoEditController from "./controllers/modal/facturaDirectoEditController";

(function () {	
	/* Financiadores.Common Module */
    const module = angular.module('profesionales.contratosInternos', []);
	states.init(module);
	tabs.init(module);

	ContratosInternosListController.init(module);
	EditContratosInternosController.init(module);
	GeneralController.init(module);
	AjusteController.init(module);
	ContratosInternosDataService.init(module);
	ContratosInternosLogicService.init(module);
	PagosController.init(module);
	RetencionController.init(module);
	CuentasController.init(module);
	ParticipacionController.init(module);
	CuentasDefectoContratoTplController.init(module);
	ParticipacionTplController.init(module);
	DocumentoContratoEditController.init(module);
	FacturaDirectoController.init(module);
	facturaDirectoEditController.init(module);
	module.run(run);

	run.$inject = ['Logger'];

	function run ($log) {
		$log = $log.getInstance("Profesionales.contratosInternos");
	}
})();