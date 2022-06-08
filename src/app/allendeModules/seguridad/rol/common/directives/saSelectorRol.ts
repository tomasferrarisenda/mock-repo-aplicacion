/**
 * @author:			Jorge Basiluk
 * @description:	Selector de Paciente
 * @type:			Directive
 **/ 
'use strict';
import * as angular from 'angular';

import saSelectorRolView = require('../templates/sa-selector-rol.html');

export default (function () {
   'use strict';
   
	const module = { init : (ngModule: any) => {} };

	module.init = function (module) {

		// REUTILIZABLE: [DIRECTIVE] selector de roles disponibles. Se usa con [ng-model].

		module.directive('saSelectorRol', saSelectorRol);

		saSelectorRol.$inject = ['$log', '$q', '$filter', 'RolesGestionDataService'];
		function saSelectorRol ($log, $q, $filter, RolesGestionDataService) {
			return {
				restrict : 'E',
				require: '?ngModel',
				scope : {
					loading : '=?',
					idRol : '=?',
					ngDisabled : '=?',
					clean : '&?'
				},
				template: saSelectorRolView,
				link: link
			};

			function link (scope, attrs, element, controller) {

				if (!controller) return;
				/* ----------------------------------------- API Y VARIABLES ----------------------------------------- */

				scope.data = {
					roles:[],
					rol:''
				};

				scope.updateModel = updateModel;

				scope.required = (attrs.ngRequired || attrs.required) ? true : false;
				scope.disabled = (angular.isUndefined(attrs.ngDisabled)) ? false : scope.ngDisabled;
				scope.loading = (angular.isUndefined(attrs.loading)) ? false : scope.loading;
				


				/* ----------------------------------------- IMPLEMENTACION ----------------------------------------- */

				function updateModel () {
					if(scope.data.rol && scope.data.rol !== '')
					{
						$log.debug('rol',scope.data.rol);
						controller.$setViewValue(scope.data.rol.Id);
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
					var _roles = RolesGestionDataService.getAll();

					$q.all([_roles])
					.then(activateOk, activateError);
				}

				function activateOk (results) {
					scope.data.roles = results[0];
				}

				function activateError (pError) {
				}
			}
		}
	};

	return module;
})();