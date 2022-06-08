import * as angular from 'angular';
import states from "./states";

(function() {
	/* System.Config Module */
	const module = angular.module('facturacion.config', []);

	module.constant('FACTURACION_INFO',{
		title: 'FACTURACIÓN'
	});

	states.init(module);

	module.run(['Logger',function ($log) {
		$log = $log.getInstance('Facturacion.Config');
		$log.debug('ON.-');
	}]);
})();