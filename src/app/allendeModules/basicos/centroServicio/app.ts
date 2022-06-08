/**
 * @author 			ppautasso
 * @description 	app para centro servicios
 */

import * as angular from 'angular';
import "./common/app";
import "./config/app";
import "./gestionPrestacion/app";
import "./gestionEspecialidad/app";


(function(){

	'use strict';
	const ngModule = angular.module('basicos.centroServicios',[
		'centroServicios.common',
		'centroServicios.config',
		'centroServiciosPrestacion.gestion',
		'centroServiciosEspecialidad.gestion',	

	]);

	ngModule.run(run);
	run.$inject = ['Logger'];
	function run ($log) {
		$log = $log.getInstance("CentroServicios");
		$log.info('ON.-');
	}

})();
