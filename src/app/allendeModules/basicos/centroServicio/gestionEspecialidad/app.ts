/**
 * @author 		    ppautasso
 * @description 	description
 */
import * as angular from 'angular';

import states from "./config/states";
// Services
// Controllers
import CentroServicioEspecialidadController from "./controllers/CentroServicioEspecialidadController";

(function () {
	/* Organizacion Module */
	const module = angular.module('centroServiciosEspecialidad.gestion',[]);

	states.init(module);
	// Services

	// Controllers
	CentroServicioEspecialidadController.init(module);


	module.run(['Logger', function ($log) {
		$log = $log.getInstance('Organizacion.Gestion');
		$log.debug('ON.-');
	}]);
})();