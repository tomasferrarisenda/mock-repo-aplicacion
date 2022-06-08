/**
 * @author 			emansilla
 * @description 	description
 */
import * as angular from 'angular';
export default (function () {
	'use strict';
	const module = { init : (ngModule: any) => {} };

	module.init = function (ngModule) {

		ngModule.factory('ButtonService', ButtonService);

		ButtonService.$inject = ['Logger'];
		
		function ButtonService ($log) {

			/* ------------------------------------------------ LOG ------------------------------------------------ */

			$log = $log.getInstance('ButtonService');
			$log.debug('ON.-');

			/* ------------------------------------------ API Y VARIABLES ------------------------------------------ */
			
			const service = {
				validarButtons : validarButtons
			};
			return service;

			/* ------------------------------------------- IMPLEMENTACIÓN ------------------------------------------- */

			function validarButtons (scope) {
				/* Button New */
				if (angular.isUndefined(scope.btnNewDisabled)) 
					scope.btnNewDisabled = false;

				if (angular.isUndefined(scope.btnNewIf)) 
					scope.btnNewIf = !(angular.isUndefined(scope.btnNewClick));

				/* Button Edit */
				if (angular.isUndefined(scope.btnEditDisabled)) 
					scope.btnEditDisabled = false;

				if (angular.isUndefined(scope.btnEditIf)) 
					scope.btnEditIf = !(angular.isUndefined(scope.btnEditClick));

				/* Button Delete */
				if (angular.isUndefined(scope.btnDeleteDisabled)) 
					scope.btnDeleteDisabled = false;

				if (angular.isUndefined(scope.btnDeleteIf)) 
					scope.btnDeleteIf = !(angular.isUndefined(scope.btnDeleteClick));

				/* Button View */
				if (angular.isUndefined(scope.btnViewDisabled)) 
					scope.btnViewDisabled = false;

				if (angular.isUndefined(scope.btnViewIf)) 
					scope.btnViewIf = !(angular.isUndefined(scope.btnViewClick));

				/* Button Print */
				if (angular.isUndefined(scope.btnPrintDisabled)) 
					scope.btnPrintDisabled = false;

				if (angular.isUndefined(scope.btnPrintIf)) 
					scope.btnPrintIf = !(angular.isUndefined(scope.btnPrintClick));

				/* Button Search */
				if (angular.isUndefined(scope.btnSearchDisabled)) 
					scope.btnSearchDisabled = false;

				if (angular.isUndefined(scope.btnSearchIf)) 
					scope.btnSearchIf = !(angular.isUndefined(scope.btnSearchClick)) ;

				/* Button Reload */
				if (angular.isUndefined(scope.btnReloadDisabled)) 
					scope.btnReloadDisabled = false;

				if (angular.isUndefined(scope.btnReloadIf)) 
					scope.btnReloadIf = !(angular.isUndefined(scope.btnReloadClick));

 				/* Button Personalizado */
                if (angular.isUndefined(scope.btnPersonalizadoDisabled))
                    scope.btnPersonalizadoDisabled = false;

                if (angular.isUndefined(scope.btnPersonalizadoIf))
					scope.btnPersonalizadoIf = !(angular.isUndefined(scope.btnPersonalizadoClick));
					
			                
                /* Button Alerta */
                if (angular.isUndefined(scope.alertasIf))
                    scope.alertasIf = !(angular.isUndefined(scope.alertas) || (scope.alertas) == []);

				// $log.debug('ButtonService scope',scope);
				/* Event Reload */
			}

			function validarButtonsNew (scope) {
				/* Button New */
				resolveButton(scope.btnNewClick, scope.btnNewDisabled, scope.btnNewIf, 'New');

				/* Button Edit */
				resolveButton(scope.btnEditClick, scope.btnEditDisabled, scope.btnEditIf, 'Edit');

				/* Button Delete */
				resolveButton(scope.btnDeleteClick, scope.btnDeleteDisabled, scope.btnDeleteIf, 'Delete');

				/* Button Print */
				resolveButton(scope.btnPrintClick, scope.btnPrintDisabled, scope.btnPrintIf, 'Print');

				/* Button Search */
				resolveButton(scope.btnSearchClick, scope.btnSearchDisabled, scope.btnSearchIf, 'Search');

				/* Button Reload */
				resolveButton(scope.btnReloadClick, scope.btnReloadDisabled, scope.btnReloadIf, 'Reload');
			}

			function resolveButton (pClick, pDisabled, pIf, pName) {
				// $log.debug('Antes ' + pName + ' Click:' + pClick);
				// $log.debug('Antes ' + pName + ' Disabled:' + pDisabled);
				// $log.debug('Antes ' + pName + ' If:' + pIf);
				if (angular.isUndefined(pDisabled)) {
					pDisabled = false;
				} else if (pDisabled) {
					pDisabled = true;
				} else {
					pDisabled = false;
				}

				if (angular.isUndefined(pIf)) {
					pIf = !(angular.isUndefined(pClick));
				}

				// $log.debug('Despues ' + pName + ' Click:' + pClick);
				// $log.debug('Despues ' + pName + ' Disabled:' + pDisabled);
				// $log.debug('Despues ' + pName + ' If:' + pIf);
			}
		}
	};

	return module;
})();