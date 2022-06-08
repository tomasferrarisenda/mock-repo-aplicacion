/**
 * @author 		    ppautasso
 * @description 	description
 */
import * as angular from 'angular';

import states from "./config/states";
// Services
// Controllers
import CentroServicioController from "./controllers/CentroServicioController";

(function () {
	/* Organizacion Module */
	const module = angular.module('centroServiciosPrestacion.gestion',[]);

	states.init(module);
	// Services

	// Controllers
	CentroServicioController.init(module);


	module.run(['Logger', function ($log) {
		$log = $log.getInstance('Organizacion.Gestion');
		$log.debug('ON.-');
	}]);
})();