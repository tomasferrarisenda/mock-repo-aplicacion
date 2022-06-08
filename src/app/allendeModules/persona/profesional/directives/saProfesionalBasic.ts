/**
 * @author 			emansilla
 * @description 	description
 */
import * as angular from 'angular';
import saProfesionalBasicView = require('../views/sa-profesional-basic.html');
export default (function () {
	'use strict';
	
	const module = { init : (ngModule: any) => {} };

	module.init = function (module) {

		module.directive('saProfesionalBasic', saProfesionalBasic);

		saProfesionalBasic.$inject = ['$log', 'ProfesionalLogicService'];
		function saProfesionalBasic ($log, ProfesionalLogicService) {
			return {
				restrict : 'E',
				scope : {
					model : '=',
					title : '@?',

					btnSearchDisabled : '=?',
					btnSearchIf : '=?',

					required : '=?'
				},
				template : saProfesionalBasicView,
				link : function (scope, element, attrs) {
					scope.sinDatos = 'Sin datos';
					scope.btnSearchClick = openSelectorProfesional;
					scope.required = (angular.isUndefined(attrs.required)) ? false : scope.required;


					// ButtonService.validarButtons(scope);

					function openSelectorProfesional () {
						ProfesionalLogicService.openModal('', true)
						.then(successCallback, errorCallback);

						function successCallback (pProfesional) {
							scope.model=pProfesional;
						}

						function errorCallback (pError) {
							// body...
						}
					}
				}
			};
		}
	}

	return module;

})();