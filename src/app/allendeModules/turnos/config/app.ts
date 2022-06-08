
import * as angular from 'angular';
import constants from "./constants";
import states from "./states";


(function () {
   'use strict';
   	/* System.Config Module */
		const module = angular.module('turno.config', []); //turno.config FACTURACION_INFO
		
				constants.init(module);
				states.init(module);
		
				module.run(['Logger',function ($log) {
					$log = $log.getInstance('Turno.Config');
					//$log.info('ON.-');
				}]);
})();
		