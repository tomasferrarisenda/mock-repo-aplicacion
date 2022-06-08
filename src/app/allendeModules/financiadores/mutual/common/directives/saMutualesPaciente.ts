import * as angular from 'angular';
import mutualPacienteTemplate = require('../views/sa-mutualesPaciente.html');
import { ISupportDataService } from '../../../../support/basic/services';
import { IAuthorizationService } from 'core/security';
export default (function () {
	'use strict';
	
	const module = { init : (ngModule: any) => {} };

	module.init = function (module) {


		// REUTILIZABLE: [DIRECTIVE] Input para el buscardo de mutuales. Se usa con [ng-model]
		module.directive('saMutualesPaciente', saMutualesPaciente);

		saMutualesPaciente.$inject = ['$log','ButtonService','MutualLogicService', 'AuthorizationService',
										 'ModalService','MutualDataService','SupportDataService'];
		function saMutualesPaciente ($log,ButtonService,MutualLogicService, AuthorizationService:IAuthorizationService,
			ModalService,MutualDataService,SupportDataService: ISupportDataService) {
			return {
				restrict : 'E',
				require : '?ngModel',
				scope : {
					title : '@?',
					idPaciente : '<',
					
					btnNewDisabled : '=?',
					btnNewIf : '=?',
					 
					btnEditDisabled : '=?',
					btnEditIf : '=?',
					 
					btnDeleteDisabled : '=?',
					btnDeleteIf : '=?',

				},
				template: mutualPacienteTemplate,
				link : link
			};

			function link(scope, element, attrs, controller) {

				if (!controller) return;
				/*----------------------------------------- API Y VARIABLES -----------------------------------------*/

				scope.sinDatos = 'Sin datos';
				scope.model = [];
				scope.data = {
					tiposdeAfiliado: []
				};
				scope.btnNewClick = crearPlanMutual;
				//scope.btnEditClick = editarNacionalidad;
				scope.btnDeleteClick = borrarPlan;
				scope.eventChange = cambiarPlanPorDefecto;
								
				 ButtonService.validarButtons(scope);
				/*----------------------------------------- IMPLEMENTACION -----------------------------------------*/

				function crearPlanMutual () {

					MutualLogicService.openPlanMutualSelector()
					.then(function (pPlan) {
						if (!existePlanEnAfiliaciones(pPlan, scope.model)) {
							
							MutualDataService.getNuevaCobertura()
							.then(function (pResult) {
									 pResult.CodigoMutual = pPlan.Codigo;
									 pResult.EstaVigente = true;
									 pResult.MutualNombre = pPlan.NombreMutual;
									 pResult.PlanMutualNombre = pPlan.Nombre;
									 pResult.IdPlanMutual = pPlan.Id;
									 pResult.IdPaciente = scope.idPaciente;
									 pResult.PorDefecto = true;
									 pResult.NumeroAfiliado = pPlan.NumeroAfiliado;
									 pResult.TipoAfiliadoCobertura = pPlan.TipodeAfiliado;
									 pResult.FechaHasta = pPlan.FechaHasta;
									 pResult.FechaDesde = pPlan.FechaDesde;
									 pResult.EsEliminable = pPlan.EsEliminable;
									 scope.model.push(pResult);
									//$scope.formPaciente.$pristine = false;
									// se agrega visible en turnos para mostrarlo en la lista
									pResult.VisibleEnTurnos = angular.copy(pPlan.VisibleEnTurnos);

									var indexUltimo = scope.model.length;
									if (indexUltimo > 0) indexUltimo -=1;

									cambiarPlanPorDefecto(scope.model[indexUltimo]);
									updateModel(scope.model);
								}
							);
						} else {
							ModalService.info('Ya existe dicho plan.');
						}
					});
				}

				function existePlanEnAfiliaciones (pPlan, pAfiliaciones) {
					var _flagExiste = false;
					var length = pAfiliaciones.length;
					if (!angular.isUndefined(pAfiliaciones) && pAfiliaciones.length) {
						for (var i = 0; i < length; i++) {
							if (pAfiliaciones[i].IdPlanMutual == pPlan.Id && pAfiliaciones[i].fecha_baja == null){
								_flagExiste = true;
								break;
							}
						}
					}

					return _flagExiste;
				}

				function borrarPlan (pIndex) {
					//var _index = findElements(scope.model,pIndex);
					var _index = pIndex
					if(scope.model[_index].EsEliminable === true){
						scope.model.splice(_index, 1);
						
						MutualLogicService.validaPlanDefecto(scope.model);
						updateModel(scope.model);
						//$scope.formPaciente.$pristine = false;
					}
				}

				function cambiarPlanPorDefecto (pPlan) {
					MutualLogicService.changePlanDefecto(pPlan, scope.model);
					//$scope.formPaciente.$pristine = false;
				}

				function findElements(array, itemSearch)
				{
				    return MutualLogicService.findElements(array, itemSearch);
				}
				
				function updateModel(pModel) {
					controller.$setViewValue(pModel);
					scope.formSaCoberturas.$setDirty();
				}

				function updateDirective(pModel) {
					scope.model = pModel;
				}
			/*---------------------------------------------- WATCH ----------------------------------------------*/

				scope.$watch(function() {
					return controller.$modelValue || controller.$viewValue;
				}, updateDirective, true);

			/*--------------------------------------------- MENU CONTEXTUAL --------------------------------------*/
			scope.menuOptions = [
				// NEW IMPLEMENTATION
				{
					text: "Agregar",
					displayed: function (modelValue) {
						return(modelValue.btnNewIf);
					},
					click: ($itemScope, $event, modelValue, text, $li) => {							
						crearPlanMutual();
						
					}
				},
				{
					text: "Eliminar",
					displayed: function (modelValue) {
						return(modelValue.btnDeleteIf);
					},
					click: ($itemScope, $event, modelValue, text, $li) => {
						// console.log($itemScope);
						borrarPlan($itemScope.c.Id);
					}
				}

			];

			/*--------------------------------------------- ACTIVATE ---------------------------------------------*/
				
				function initData() {
					SupportDataService.getAllTipoAfiliadoSinAmbos().then(function(pResult){
						scope.data.tiposdeAfiliado = pResult;
					}, function(pError) {
						$log.error('Error Tipos Afiliados', pError);
					});
				}

				activate();
				function activate() {
					initData();
					if(AuthorizationService.tienePermisoById(null,188)) scope.showAsignableTurnos = true;
				}
			}
		}
	};

	return module;

})();