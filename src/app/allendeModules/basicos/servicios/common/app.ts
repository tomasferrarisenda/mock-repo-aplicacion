/**
 * @author 			ppautasso
 * @description 	description
 */
import * as angular from 'angular';

import saTableServiciosComponent from './components/saTableServicios/saTableServiciosComponent';
import {SelectorMultipleServiciosModalComponent} from './components/selectorMultipleServicios';
import {ServicioMedicoCommonLogicService} from './services'

(function () {		
	/* Servicios.Common Module */
	const module = angular.module('servicios.common', []);

	module.run(run);

	//component
	saTableServiciosComponent.init(module);
	SelectorMultipleServiciosModalComponent.init(module);
	ServicioMedicoCommonLogicService.init(module);

	run.$inject = ['Logger'];

	function run ($log) {
		$log = $log.getInstance("Servicios.Common");
		$log.debug('ON.-');
	}
})();