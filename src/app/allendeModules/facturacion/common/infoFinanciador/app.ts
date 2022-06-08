import * as angular from 'angular';
import InfoFinanciadorController from "./controllers/InfoFinanciadorController";
import FinanciadorLogicService from "./services/FinanciadorLogicService";

(function(){
		/* Facturacion.Common Module */
		const module = angular.module('facturacion.common.infoFinanciador', []);

		InfoFinanciadorController.init(module);
		FinanciadorLogicService.init(module);
		module.run(run);

		run.$inject = ['Logger'];

		function run ($log) {
			$log = $log.getInstance("common");
			//$log.debug('ON.-');
		}
	}
)();

