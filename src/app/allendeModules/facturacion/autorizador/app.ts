import * as angular from 'angular';
import states from "./config/states";
import permissions from "./config/permissions";

// Controllers
import AutorizacionEditController from "./controllers/AutorizacionEditController";
import AutorizacionesListController from "./controllers/AutorizacionesListController";
import AutorizacionViewController from "./controllers/AutorizacionViewController";
import ExcepcionesAutorizacionListController from "./controllers/ExcepcionesAutorizacionListController";
import ExcepcionAutorizacionViewController from "./controllers/ExcepcionAutorizacionViewController";
import OrdenPracticaPrintController from "./controllers/OrdenPracticaPrintController";

// Services
import AutorizadorAuthService from "./services/AutorizadorAuthService";
import AutorizadorDataService from "./services/AutorizadorDataService";
import AutorizadorLogicService from "./services/AutorizadorLogicService";

(function(){
		/* Facturacion.Common Module */
		const module = angular.module('facturacion.autorizador', []);

		states.init(module);
		permissions.init(module);
		//routes.init(module);
		
		AutorizacionEditController.init(module);
		AutorizacionesListController.init(module);
		AutorizacionViewController.init(module);
		ExcepcionesAutorizacionListController.init(module);
		ExcepcionAutorizacionViewController.init(module);
		OrdenPracticaPrintController.init(module);
		
		AutorizadorAuthService.init(module);
		AutorizadorDataService.init(module);
		AutorizadorLogicService.init(module);

		module.run(run);

		run.$inject = ['Logger'];

		function run ($log) {
			$log = $log.getInstance("Facturacion.autorizador");
			//$log.debug('ON.-');
		}
	}
)();

