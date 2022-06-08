/**
 * @author 			ppautasso
 * @description 	description
 */

import * as angular from 'angular';
import states from './config/states';
import constants from './config/constants';

import UsuarioGestionAuthService from './services/UsuarioGestionAuthService';
import UsuarioGestionDataService from "./services/UsuarioGestionDataService";
import UsuarioGestionLogicService from 	"./services/UsuarioGestionLogicService";

import UsuarioGestionController from "./controllers/UsuarioGestionController";
import UsuarioEditController from "./controllers/UsuarioEditController";
import UsuarioNewController from "./controllers/UsuarioNewController";
import UsuarioViewController from "./controllers/UsuarioViewController";
import UsuarioAsignarRolController from "./controllers/UsuarioAsignarRolController";
import UsuarioAsignarExcepcionController from "./controllers/UsuarioAsignarExcepcionController";
import ExcepcionNewController from "./controllers/ExcepcionNewController";

import EmpresasUsuarioEdit from "./components/saEmpresasUsuarioEdit";

(function () {
   'use strict';
   
	/* Usuario Module */
	const module = angular.module('seguridad.usuario.gestion',[]);
	
			states.init(module);
			constants.init(module);
			// Services
			UsuarioGestionAuthService.init(module);
			UsuarioGestionDataService.init(module);
			UsuarioGestionLogicService.init(module);
	
			// Controllers
	
			UsuarioGestionController.init(module);
			UsuarioEditController.init(module);
			UsuarioNewController.init(module);
			UsuarioViewController.init(module);
			UsuarioAsignarRolController.init(module);
			UsuarioAsignarExcepcionController.init(module);
			ExcepcionNewController.init(module);

			// Components
			EmpresasUsuarioEdit.init(module)
	
			module.run(['Logger', function ($log) {
				$log = $log.getInstance('Seguridad.Usuario.Gestion');
				$log.debug('ON.-');
			}]);


})();
