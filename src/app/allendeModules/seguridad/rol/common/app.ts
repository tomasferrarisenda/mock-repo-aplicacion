/**
 * @author 			ppautasso
 * @description 	description
 */

import * as angular from 'angular';
import saSelectorRol from './directives/saSelectorRol';


(function () {
   'use strict';
   
   	/* Servicios.Common Module */
		const module = angular.module('seguridad.rol.common', []);
		
				// routes.init(module);
				//Directives
				saSelectorRol.init(module);
				
				module.run(run);
				run.$inject = ['Logger'];
				function run ($log) {
					$log = $log.getInstance("Seguridad.Rol.Common");
					$log.debug('ON.-');
				}


})();
