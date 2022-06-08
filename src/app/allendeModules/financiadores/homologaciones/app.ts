import * as angular from 'angular';

import states from "./config/states";
import permissions from "./config/permissions";
import HomologacionesListController from "./controllers/HomologacionesListController";
import HomologacionViewController from "./controllers/HomologacionViewController";
import HomologacionesAuthService from "./services/HomologacionesAuthService";
import HomologacionesDataService from "./services/HomologacionesDataService";
import HomologacionesLogicService from "./services/HomologacionesLogicService";

(function () {
	/* Financiadores.Homologaciones Module */
	const module = angular.module('financiadores.homologaciones', []);
	states.init(module);
	permissions.init(module);
	HomologacionesListController.init(module);
	HomologacionViewController.init(module);
	HomologacionesAuthService.init(module);
	HomologacionesDataService.init(module);
	HomologacionesLogicService.init(module);

	module.run(run);

	run.$inject = ['Logger'];

	function run ($log) {
		$log = $log.getInstance("Financiadores.Homologaciones");
		$log.debug('ON.-');
	}
})();