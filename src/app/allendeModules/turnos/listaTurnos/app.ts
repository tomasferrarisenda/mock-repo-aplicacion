
import * as angular from 'angular';
import states from "./config/states";
import TurnosListController from "./controllers/TurnosListController";

(function () {
   'use strict';
   

	const module = angular.module('turno.listaTurnos', []);

	states.init(module);
	//permissions.init(module);

	TurnosListController.init(module);

	module.run(run);

	run.$inject = ['Logger'];

	function run($log) {
		$log = $log.getInstance("Turno.listaTurnos");
		//$log.debug('ON.-');
	}
})();
