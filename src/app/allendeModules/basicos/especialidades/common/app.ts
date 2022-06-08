/**
 * @author 			ppautasso
 * @description 	description
 */
import * as angular from 'angular';
import saEspecialidadList from './directives/saEspecialidadList';
import saEspecialidadSelector from './directives/saSelectorEspecialidad';

(function(){
	/* Servicios.Common Module */
	const module = angular.module('especialidades.common', []);
	
	saEspecialidadList.init(module);
	saEspecialidadSelector.init(module);

	module.run(run);

	run.$inject = ['Logger'];

	function run ($log) {
		$log = $log.getInstance("Servicios.Common");
		$log.debug('ON.-');
	}
})();