import * as angular from 'angular';
import states from "./config/states";
import { TurnoGrupoPrestacionMedicaModule } from './grupoPrestacionMedica/app';

(function () {
	const module = angular.module('turno.configuraciones', [
		TurnoGrupoPrestacionMedicaModule.name
	]);

	states.init(module);
	module.run(run);

	run.$inject = ['Logger'];
	function run($log) {
		$log = $log.getInstance("Turno.configuraciones");
	}
})();