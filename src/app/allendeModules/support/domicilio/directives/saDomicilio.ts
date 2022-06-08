
/**
 * @author 			hcastro
 * @description 	description
 */
import domicilioTemplate = require('../views/sa-domicilio.html');
export default (function () {
	'use strict';
	
	const module = { init : (ngModule: any) => {} };

	module.init = function (module) {

		module.directive('saDomicilio', saDomicilio);

		saDomicilio.$inject = ['$log', 'ButtonService','DomicilioLogicService','DomicilioDataService'];
		function saDomicilio ($log, ButtonService,DomicilioLogicService,DomicilioDataService) {

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
				template: domicilioTemplate,
				link : link
			};

			function link (scope, element, attrs, controller) {

				if (!controller) return;

				/*----------------------------------------- API Y VARIABLES -----------------------------------------*/

				scope.sinDatos = 'Sin datos';
				scope.model = [];
				
				scope.btnNewClick = crearDomicilio;
				scope.btnEditClick = editarDomicilio;
				scope.btnDeleteClick = borrarDomicilio;
				scope.eventChange = cambiarDomicilioPorDefecto;
				
				 ButtonService.validarButtons(scope);
				/*----------------------------------------- IMPLEMENTACION -----------------------------------------*/
				function crearDomicilio () {				

					DomicilioDataService.ObtenerNuevoDomicilio().then(crearDomcilioOk);
					
					function crearDomcilioOk(pDomicilioNuevo){
						DomicilioLogicService.openModal(pDomicilioNuevo)
						.then(function (pDomicilio) {
							scope.model.push(pDomicilio);
							cambiarDomicilioPorDefecto(pDomicilio);
						});
					}
				}					

				function editarDomicilio (pDomicilioEdit) {
					DomicilioLogicService.openModal(pDomicilioEdit).then(function (pDomicilio) {						
						cambiarDomicilioPorDefecto(pDomicilio);
					});
				}

				function borrarDomicilio (pIndex) {
						scope.model.splice(pIndex, 1);
						DomicilioLogicService.validaDomicilioDefecto(scope.model);
						updateModel(scope.model);
				}

				function cambiarDomicilioPorDefecto (pDomicilio) {
					if(pDomicilio.Defecto){
						DomicilioLogicService.changeDomicilioDefecto(pDomicilio, scope.model);
					}else{
						DomicilioLogicService.validaDomicilioDefecto(scope.model);
					}
					updateModel(scope.model);
				}				

				function updateModel(pModel) {
					scope.formSaDomicilio.$setDirty();
					controller.$setViewValue(pModel);
				}

				function updateDirective(pModel) {
					scope.model = pModel;
				}

				/*---------------------------------------------- WATCH ----------------------------------------------*/

				scope.$watch(function() {
					return controller.$modelValue || controller.$viewValue;
				}, updateDirective, true);



				/*--------------------------------------------- MENU CONTEXTUAL ---------------------------------------------*/

				scope.menuOptions = [
					// NEW IMPLEMENTATION
					{
						text: "Agregar",
						displayed: function (modelValue) {
							return(modelValue.btnNewIf);
						},
						click: ($itemScope, $event, modelValue, text, $li) => {
							crearDomicilio();
						}
					},
					{
						text: "Editar",
						displayed: function (modelValue) {
							return(modelValue.btnEditIf);
						},
						click: ($itemScope, $event, modelValue, text, $li) => {
							editarDomicilio($itemScope.domicilio);
						}
					},
					{
						text: "Eliminar",
						displayed: function (modelValue) {
							return(modelValue.btnDeleteIf);
						},
						click: ($itemScope, $event, modelValue, text, $li) => {
							borrarDomicilio($itemScope.$index);
						}
					}
				];

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