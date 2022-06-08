/**
 * @author 			ppautasso
 * @description 	description
 */
import * as angular from 'angular';
import saRecursosList from './directives/saRecursosList';

import {ConsultaRecursosEnServiciosComponent} from './components';

(function () {
	/* Basicos.Config Module */
	const module = angular.module('recursos.common', []);

	saRecursosList.init(module);

	ConsultaRecursosEnServiciosComponent.init(module);

	module.run(['Logger', function ($log) {
		$log = $log.getInstance("Recursos.Common");
		$log.debug('ON.-');
	}]);
})();


