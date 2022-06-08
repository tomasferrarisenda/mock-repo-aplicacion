/**
 * @author:			Jorge Basiluk
 * @description:	Selector de Paciente
 * @type:			Directive
 **/ 
'use strict';
import * as angular from 'angular';

import saSelectorUsuarioView = require('../templates/sa-selector-usuario.html');

export default (function () {
   'use strict';
   
	const module = { init : (ngModule: any) => {} };

	module.init = function (module) {

		// REUTILIZABLE: [DIRECTIVE] selector de @usuarios disponibles. Se usa con [ng-model].

		module.directive('saSelectorUsuario', saSelectorUsuario);

		saSelectorUsuario.$inject = ['$log', '$q', '$filter', 'UsuarioGestionDataService'];
		function saSelectorUsuario ($log, $q, $filter, UsuarioGestionDataService) {
			return {
				restrict : 'E',
				require: '?ngModel',
				scope : {
					loading : '=?',
					idUsuario : '=?',
					ngDisabled : '=?',
					clean : '&?'
				},
				template : saSelectorUsuarioView,
				link: link
			};

			function link (scope, attrs, element, controller) {

				if (!controller) return;
				/* ----------------------------------------- API Y VARIABLES ----------------------------------------- */

				scope.data = {
					usuarios:[],
					usuario:''
				};

				scope.updateModel = updateModel;

				scope.required = (attrs.ngRequired || attrs.required) ? true : false;
				scope.disabled = (angular.isUndefined(attrs.ngDisabled)) ? false : scope.ngDisabled;
				scope.loading = (angular.isUndefined(attrs.loading)) ? false : scope.loading;
				


				/* ----------------------------------------- IMPLEMENTACION ----------------------------------------- */

				function updateModel () {
					if(scope.data.usuario && scope.data.usuario !== '')
					{
						$log.debug('usuario',scope.data.usuario);
						controller.$setViewValue(scope.data.usuario.Id);
					}
					else
					{
						controller.$setViewValue('');
					}
				}


 				function limpiar() {

 				}


				/* -------------------------------------------- ACTIVATE -------------------------------------------- */
				
				activate();

				function activate () {
					var _usuarios = UsuarioGestionDataService.obtenerTodos();

					$q.all([_usuarios])
					.then(activateOk, activateError);
				}

				function activateOk (results) {
					scope.data.usuarios = results[0];
				}

				function activateError (pError) {
				}
			}
		}
	};

	return module;
})();
