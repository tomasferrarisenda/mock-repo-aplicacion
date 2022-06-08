
import * as angular from 'angular';

import states from "./config/states";
import permissions from "./config/permissions";
import ReprogramacionTurnosListController from "./controllers/ReprogramacionTurnosListController";
import ReprogramacionTurnosDataService from "./services/ReprogramacionTurnosDataService";
import ReprogramacionTurnosLogicService from "./services/ReprogramacionTurnosLogicService";
import {ReprogramacionTurnosAuthService} from "./services/ReprogramacionTurnosAuthService";
import {EstadoDeReprogramacionDataService} from './services/EstadoReprogramacionDataService';

(function () {
   'use strict';
   
	const module = angular.module('turno.reprogramacion', []);

	states.init(module);
	permissions.init(module);

	ReprogramacionTurnosListController.init(module);
	ReprogramacionTurnosDataService.init(module);
	ReprogramacionTurnosLogicService.init(module);
	ReprogramacionTurnosAuthService.init(module);
	EstadoDeReprogramacionDataService.init(module);

	module.run(run);

	run.$inject = ['Logger'];

	function run($log) {
		$log = $log.getInstance("Turno.reprogramacion");
		//$log.debug('ON.-');
	}
})();