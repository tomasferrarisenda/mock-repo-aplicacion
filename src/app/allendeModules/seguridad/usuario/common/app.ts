/**
 * @author 			ppautasso
 * @description 	description
 */

import * as angular from 'angular';
import saSelectorUsuario from './directives/saSelectorUsuario';
import {SelectorUsuarioGenericoComponent,VerUsuariosACargoComponent } from './components/';

(function () {
   'use strict';
   
   	/* Servicios.Common Module */
		const module = angular.module('seguridad.usuario.common', []);
		
				// routes.init(module);
				//Directives
				saSelectorUsuario.init(module);

				//Componentes
				SelectorUsuarioGenericoComponent.init(module);
				VerUsuariosACargoComponent.init(module);
				
				module.run(run);
				run.$inject = ['Logger'];
				function run ($log) {
					$log = $log.getInstance("Seguridad.Usuario.Common");
					$log.debug('ON.-');
				}


})();
