/**
 * @author 			hcastro
 * @description 	description
 */
import * as angular from 'angular';
import nacionalidadTemplate = require('../views/sa-nacionalidad.html');
export default (function () {
	'use strict';
	
	const module = { init : (ngModule: any) => {} };

	module.init = function (module) {

		module.directive('saNacionalidad', saNacionalidad);

		saNacionalidad.$inject = ['$log', 'ButtonService','NacionalidadLogicService', 'NacionalidadDataService','ModalService'];
		function saNacionalidad ($log, ButtonService,NacionalidadLogicService,NacionalidadDataService,ModalService) {

			return {
				restrict : 'E',
				require : '?ngModel',
				scope : {					
					title : '@?',
					tipoPropietario : '@',
					idPropietario : '<',
					 
					btnNewDisabled : '=?',
					btnNewIf : '=?',
					 
					btnEditDisabled : '=?',
					btnEditIf : '=?',
					 
					btnDeleteDisabled : '=?',
					btnDeleteIf : '=?'

				},
				template: nacionalidadTemplate,
				link : link
			};

			function link (scope, element, attrs, controller) {

				if (!controller) return;
				/*----------------------------------------- API Y VARIABLES -----------------------------------------*/

				scope.sinDatos = 'Sin datos';
				scope.model = [];
				
				scope.btnNewClick = crearNacionalidad;
				//scope.btnEditClick = editarNacionalidad;
				scope.btnDeleteClick = borrarNacionalidad;
				scope.eventChange = cambiarNacionalidadPorDefecto;
				
				 ButtonService.validarButtons(scope);
				/*----------------------------------------- IMPLEMENTACION -----------------------------------------*/
				function crearNacionalidad () {
						
					NacionalidadDataService.obtenerNuevoNacionalidad().then(crearNacionalidadOk);

					function crearNacionalidadOk(_nuevaNacionalidad){
						NacionalidadLogicService.openModal(_nuevaNacionalidad)
						.then(function (pNacionalidad){
							if (!existeNacionalidad(pNacionalidad,scope.model)) 
								{
									scope.model = (scope.model) ? scope.model : [];
									scope.model.push(pNacionalidad);
									if (pNacionalidad.Defecto)
										cambiarNacionalidadPorDefecto(pNacionalidad);
									updateModel(scope.model);
								}
							else {
									ModalService.info('Ya existe dicha nacionalidad.');
								}
							});
					}
				}
				

				function borrarNacionalidad(pIndex) {
					scope.model.splice(pIndex, 1);
					NacionalidadLogicService.validaNacionalidadDefecto(scope.model);
					updateModel(scope.model);
				}
				function cambiarNacionalidadPorDefecto (pNacionalidad) {
					NacionalidadLogicService.changeNacionalidadDefecto(pNacionalidad, scope.model);
				}

				function existeNacionalidad (pNacionalidad, pNacionalidades) {
					var _flagExiste = false;
					var length = pNacionalidades.length;						
					if (!angular.isUndefined(pNacionalidades) && length) {
						for (var i = 0; i < length; i++) {
							if (pNacionalidades[i].IdPais == pNacionalidad.IdPais &&
								pNacionalidades[i].IdTipoNacionalidad == pNacionalidad.IdTipoNacionalidad &&
								pNacionalidades[i].IdTipoNacionalizado == pNacionalidad.IdTipoNacionalizado){
								_flagExiste = true;
								break;
							}
						}
					}
					return _flagExiste;
				}

				function updateModel(pModel) {
					controller.$setViewValue(pModel);
					scope.formSaNacionalidad.$setDirty();
				}

				function updateDirective(pModel) {
					scope.model = pModel;
				}
				/*--------------------------------------------- MENU CONTEXTUAL ---------------------------------------------*/

				scope.menuOptions = [
					// NEW IMPLEMENTATION
					{
						text: "Agregar",
						displayed: function (modelValue) {
							return(modelValue.btnNewIf);
						},
						click: ($itemScope, $event, modelValue, text, $li) => {
							crearNacionalidad();
						}
					},
					// {
					// 	text: "Editar",
					// 	displayed: function (modelValue) {
					// 		return(modelValue.btnEditIf);
					// 	},
					// 	click: ($itemScope, $event, modelValue, text, $li) => {
					// 		editarNacionalidad($itemScope.Telefonos);
					// 	}
					// },
					{
						text: "Eliminar",
						displayed: function (modelValue) {
							return(modelValue.btnDeleteIf);
						},
						click: ($itemScope, $event, modelValue, text, $li) => {
							borrarNacionalidad($itemScope.$index);
						}
					}
				];
				/*---------------------------------------------- WATCH ----------------------------------------------*/

				scope.$watch(function() {
					return controller.$modelValue || controller.$viewValue;
				}, updateDirective, true);


				/*--------------------------------------------- ACTIVATE ---------------------------------------------*/
				
				function initData() {
					
				}

				function initTipoPropietario() {
					// body...
				}

				activate();
				function activate() {
					initTipoPropietario();
					initData();
				}
			}
		}
	};

	return module;
})();