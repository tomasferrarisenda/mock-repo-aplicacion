/**
 * @author 		    ppautasso
 * @description 	description
 */
import * as angular from 'angular';

import states from "./config/states";
// Services
import RecursosAuthService from "./services/RecursosAuthService";
import RecursosDataService from "./services/RecursosDataService";
import RecursosLogicService from "./services/RecursosLogicService";

// Controllers
import RecursosGestionListController from "./controllers/RecursosGestionListController";
import RecursoAsignarController from "./controllers/RecursoAsignarController";

(function () {
	/* Organizacion Module */
	const module = angular.module('recursos.gestion',[]);

	states.init(module);
	// Services
	RecursosAuthService.init(module);
	RecursosDataService.init(module);
	RecursosLogicService.init(module);

	// Controllers
	RecursosGestionListController.init(module);
	RecursoAsignarController.init(module);


	module.run(['Logger', function ($log) {
		$log = $log.getInstance('Organizacion.Gestion');
		$log.debug('ON.-');
	}]);
})();