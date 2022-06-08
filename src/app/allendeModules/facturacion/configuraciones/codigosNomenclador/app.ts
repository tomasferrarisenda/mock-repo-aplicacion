import * as angular from 'angular';
import states from "./config/states";
import permissions from "./config/permissions";

import CodigosNomencladorListController from "./controllers/CodigosNomencladorListController";
import CodigoNomencladorEditController from "./controllers/CodigoNomencladorEditController";
import CodigosNomencladorAuthService from "./services/CodigosNomencladorAuthService";
import CodigosNomencladorDataService from "./services/CodigosNomencladorDataService";
import CodigosNomencladorLogicService from "./services/CodigosNomencladorLogicService";
import saCodigoNomencladorSelector from "./directives/saCodigoNomencladorSelector";

(function () {
		/* Facturacion.Common Module */
		const module = angular.module('facturacion.configuraciones.codigosNomenclador', []);

		states.init(module);
		permissions.init(module);

		CodigosNomencladorListController.init(module);
		CodigoNomencladorEditController.init(module);
		CodigosNomencladorAuthService.init(module);
		CodigosNomencladorDataService.init(module);
		CodigosNomencladorLogicService.init(module);
		saCodigoNomencladorSelector.init(module);

		module.run(run);

		run.$inject = ['Logger'];

		function run ($log) {
			//$log = $log.getInstance("Facturacion.configuraciones");
		}
	}
)();