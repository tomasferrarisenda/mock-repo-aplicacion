/**
 * @author:			Pedro Ferrer
 * @description:	Selector de Profesional por Cuenta
 * @type:			Directive
 **/
import profesionalTemplate = require('../templates/sa-Cuenta-Profesional.tpl.html');
export default (function () {
	'use strict';
	
	const module = { init : (ngModule: any) => {} };

	module.init = function (module) {

		module.directive('saCuentaProfesional', saCuentaProfesional);

		saCuentaProfesional.$inject = ['$log', 'ModalService', 'ContratableLogicService', 'ContratableDataService'];
		function saCuentaProfesional ($log, ModalService, ContratableLogicService, ContratableDataService) {
			return {
				restrict : 'E',
				scope : {
					model : '=',
					title : '@',
					mostrarlabelcuenta : '@',
					mostrarlabelnombre : '@',
					tooltip : '@'
				},
				template: profesionalTemplate,
				link: link
			};

			function link(scope){
				scope.cambioCuentaProfesional = cambioCuentaProfesional;
				scope.busquedaRapidaProfesional = busquedaRapidaProfesional;
				scope.searchProfesional = searchProfesional;

				scope.filter = {
					numero : '',
					nombre : ''
				};

				scope.data = {
					numero : null,
					nombre : ''
				};

				function searchProfesional() {
 					ContratableLogicService.searchProfesional()
 						.then(function (pProfesionalSeleccionado) {
 							scope.model = pProfesionalSeleccionado;
 							scope.data.numero = scope.model.Numero;
							updateView(pProfesionalSeleccionado);
 						});
 				}

 				function busquedaRapidaProfesional() {
 					if(scope.filter.numero == null){
 						scope.model = '';
						scope.data.numero = null;
						scope.data.nombre = null;
						scope.filter.numero = null;
						scope.filter.nombre = null;
 					}
 					else{
	 					if (scope.filter.numero && !scope.filter.nombre){
	 						ContratableDataService.ObtenerCuentaPorCodigo(scope.filter.numero)
								.then(function(pProfesionalSeleccionado){
									if(pProfesionalSeleccionado){
			 							scope.model = pProfesionalSeleccionado;
										scope.data.numero = pProfesionalSeleccionado.Numero + ' - SUCURSAL: ' + pProfesionalSeleccionado.Sucursal;
									}
									else
										scope.model = '';
									updateView(pProfesionalSeleccionado);
								}
	 						);
	 					}
 					}
 				}

 				function updateView(pProfesional){
 					if(pProfesional){
	 					scope.filter.numero = pProfesional.Numero;
						scope.filter.nombre = pProfesional.Nombre + ' - SUCURSAL: ' + pProfesional.Sucursal;
					}
 				}

 				function cambioCuentaProfesional() {
					if(scope.data.numero != ''  && scope.filter.numero != scope.data.numero){
						scope.filter.nombre = '';
 					}
 				}

 				scope.$watch(function () {
					return scope.model;
				}, function(newValue) {
					if(newValue){
						scope.filter.numero = newValue.Numero;
						scope.filter.nombre = newValue.Nombre+ ' - SUCURSAL: ' + newValue.Sucursal;
					}
				});
			}
		}
	};
	return module;

})();