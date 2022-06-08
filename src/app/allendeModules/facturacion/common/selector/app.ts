import * as angular from 'angular';

import saCie10 from "./directives/saCie10";
import saCargarParticipante from "./directives/saCargarParticipante";
import Cie10DataService from "./services/Cie10DataService";
import ParticipanteDataService from "./services/ParticipanteDataService";
import Cie10LogicService from "./services/Cie10LogicService";
import SearchCie10Controller from "./controllers/SearchCie10Controller";

(function () {	
	/* Financiadores.Common Module */
    const module = angular.module('facturacion.common.selector', []);
    
	saCie10.init(module);
	saCargarParticipante.init(module);
	Cie10DataService.init(module);
	ParticipanteDataService.init(module);
	Cie10LogicService.init(module);
	SearchCie10Controller.init(module);

	module.run(run);

	run.$inject = ['Logger'];

	function run ($log) {
		$log = $log.getInstance("facturacion.common.selector");
	}
})();