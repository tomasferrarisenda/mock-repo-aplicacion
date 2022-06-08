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
		const module = angular.module('seguridad.usuario.config',[]);

		permissions.init(module);
		states.init(module);

		module.run(['Logger', function ($log) {
			$log = $log.getInstance('Seguridad.Usuario.Config');
			$log.debug('ON.-');
		}]);
	})();