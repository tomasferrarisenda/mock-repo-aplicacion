/**
 * @author 			emansilla
 * @description 	description
 */
import telefonoTemplate = require('../views/sa-telefonosNuevo.html');
import * as angular from 'angular';

export default (function () {
	'use strict';
	
	const module = { init : (ngModule: any) => {} };

	module.init = function (module) {

		module.directive('saTelefonosNuevo', saTelefonosNuevo);

		saTelefonosNuevo.$inject = ['$log', 'ButtonService','TelefonosLogicService','TelefonosDataService'];
		function saTelefonosNuevo ($log, ButtonService,TelefonosLogicService,TelefonosDataService) {

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
				template: telefonoTemplate,
				link : link
			};

			function link (scope, element, attrs, controller) {

				if (!controller) return;

				/*----------------------------------------- API Y VARIABLES -----------------------------------------*/

				scope.sinDatos = 'Sin datos';
				scope.model = [];
				
				
				scope.btnNewClick = crearTelefono;
				scope.btnEditClick = editarTelefono;
				scope.btnDeleteClick = borrarTelefono;
				scope.eventChange = cambiarTelefonoPorDefecto;
				
				 ButtonService.validarButtons(scope);
				/*----------------------------------------- IMPLEMENTACION -----------------------------------------*/

				function crearTelefono() {					

					TelefonosDataService.ObtenerNuevoTelefono().then(crearTelefonoOk);

					function crearTelefonoOk(pTelefonoNuevo) {

						TelefonosLogicService.openModal(pTelefonoNuevo)
						.then(function (pTelefono) {
							scope.model = (scope.model) ? scope.model : [];
							scope.model.push(pTelefono);
							//if (pTelefono.Defecto)
								cambiarTelefonoPorDefecto(pTelefono);

							//updateModel(scope.model);
						});
					}
				}

				function editarTelefono(pTelefono) {
					TelefonosLogicService.openModal(pTelefono).then(function (pTelefonoEdit) {
						//if (pTelefonoEdit.Defecto)
						pTelefonoEdit.PaisTelefono.CodigoTelefono = angular.copy(pTelefonoEdit.PaisTelefono.codigo_telefono);
							cambiarTelefonoPorDefecto(pTelefonoEdit);

						//updateModel(scope.model);
					});

				}

				function borrarTelefono(pIndex) {
					scope.model.splice(pIndex, 1);
					TelefonosLogicService.validaTelefonoDefecto(scope.model);
					updateModel(scope.model);
				}

				function cambiarTelefonoPorDefecto(pTelefono) {
					if(pTelefono.Defecto){
						TelefonosLogicService.changeTelefonoDefecto(pTelefono, scope.model);
					}else{
						TelefonosLogicService.validaTelefonoDefecto(scope.model);
					}
					updateModel(scope.model);
				}

				function updateModel(pModel) {
					controller.$setViewValue(pModel);
					scope.formSaTelefono.$setDirty();
				}

				function updateDirective(pModel) {
					scope.model = pModel;
				}

				/*---------------------------------------------- WATCH -----------------------------------------------*/
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


				/*--------------------------------------------- MENU CONTEXTUAL ---------------------------------------------*/

				scope.menuOptions = [
					// NEW IMPLEMENTATION
					{
						text: "Agregar",
						displayed: function (modelValue) {
							return(modelValue.btnNewIf);
						},
						click: ($itemScope, $event, modelValue, text, $li) => {
							crearTelefono();
						}
					},
					{
						text: "Editar",
						displayed: function (modelValue) {
							return(modelValue.btnEditIf);
						},
						click: ($itemScope, $event, modelValue, text, $li) => {
							editarTelefono($itemScope.Telefonos);
						}
					},
					{
						text: "Eliminar",
						displayed: function (modelValue) {
							return(modelValue.btnDeleteIf);
						},
						click: ($itemScope, $event, modelValue, text, $li) => {
							borrarTelefono($itemScope.$index);
						}
					}
				];

			}
		}
	};

	return module;

})();