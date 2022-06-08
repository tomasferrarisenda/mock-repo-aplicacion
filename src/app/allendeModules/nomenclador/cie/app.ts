/**
 * @author 			emansilla
 * @description 	description
 */
import * as angular from 'angular';
import CieDataService from "./services/CieDataService";
import CieLogicService from "./services/CieLogicService";
import CieAuthService from "./services/CieAuthService";
import CieListController from "./controllers/CieListController";
import CieListSelectorController from "./controllers/CieListSelectorController";
import saDiagnosticoCie from "./directives/saDiagnosticoCie";
import "./config/app";

(function () {
	'use strict';
			
	/* Nomenclador.Cie Module */
	const module = angular.module('nomenclador.cie',['nomenclador.cie.config']);
	
	CieDataService.init(module);
	CieLogicService.init(module);
	CieAuthService.init(module);

	CieListController.init(module);
	CieListSelectorController.init(module);

	saDiagnosticoCie.init(module);

	module.run(run);

	run.$inject = ['Logger'];

	function run ($log) {
		$log = $log.getInstance('Nomenclador.Cie');
		$log.debug('ON.-');
	}
})();