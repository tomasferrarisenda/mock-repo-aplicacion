/**
 * @author 			emansilla
 * @description 	description
 */
import * as angular from 'angular';
import ServicioMedicoDataService from "./services/ServicioMedicoDataService";
import ServicioMedicoLogicService from "./services/ServicioMedicoLogicService";

(function () {
	/* Support.ServicioMedico Module */
	const module = angular.module('servicios.old',[]);
	ServicioMedicoDataService.init(module);
	ServicioMedicoLogicService.init(module);

	module.run(run);

	run.$inject = ['Logger'];

	function run ($log) {
		$log = $log.getInstance('Support.ServicioMedico');
		$log.debug('ON.-');
	}
})();