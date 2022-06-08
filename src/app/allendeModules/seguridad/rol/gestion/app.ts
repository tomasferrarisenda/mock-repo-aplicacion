/**
 * @author 			ppautasso
 * @description 	description
 */

import * as angular from 'angular';
import states from './config/states';
import constants from './config/constants';

import RolesGestionAuthService from './services/RolesGestionAuthService';
import RolesGestionDataService from './services/RolesGestionDataService';
import RolesGestionLogicService from './services/RolesGestionLogicService';

import RolesGestionController from './controllers/RolesGestionController';
import RolesNewController from './controllers/RolesNewController';
import RolesEditController from './controllers/RolesEditController';

(function () {
   'use strict';
   
	/* Seguridad.Rol.Gestion Module */
	const module = angular.module('seguridad.rol.gestion',[]);
	
	states.init(module);
	constants.init(module);
	// Services
	RolesGestionAuthService.init(module);
	RolesGestionDataService.init(module);
	RolesGestionLogicService.init(module);

	// Controllers

	RolesGestionController.init(module);
	RolesNewController.init(module);
	RolesEditController.init(module);

	module.run(['Logger', function ($log) {
		$log = $log.getInstance('Seguridad.Rol.Gestion');
		$log.debug('ON.-');
	}]);

})();
