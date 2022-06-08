/**
 * @author 			ppautasso
 * @description 	description
 */

import * as angular from 'angular';
import states from './states';
import permissions from './permissions';

(function () {
   'use strict';
   
   /* Prueba Module */
		const module = angular.module('seguridad.rol.config',[]);
		
				permissions.init(module);
				states.init(module);
		
				module.run(['Logger', function ($log) {
					$log = $log.getInstance('Seguridad.Rol.Config');
					$log.debug('ON.-');
				}]);

})();
