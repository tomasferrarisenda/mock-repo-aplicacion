/**
 * @author:			Pedro Ferrer
 * @description:	Selector de CIE10
 * @type:			Directive
 **/
import cie10Template = require('../templates/sa-Cie10.tpl.html');
export default (function () {
	'use strict';
	
	const module = { init : (ngModule: any) => {} };

	module.init = function (module) {

		module.directive('saCie10', saCie10);

		saCie10.$inject = ['$log', 'ModalService', 'Cie10LogicService', 'Cie10DataService'];
		function saCie10 ($log, ModalService, Cie10LogicService, Cie10DataService) {
			return {
				restrict : 'E',
				scope : {
					model : '=',
					title : '@',
					mostrarlabelcodigo : '@',
					mostrarlabelnombre : '@',
					tooltip : '@'
				},
				template: cie10Template,
				link: link
			};

			function link(scope){
				scope.cambioCodigoCie10 = cambioCodigoCie10;
				scope.busquedaRapidaCie10 = busquedaRapidaCie10;
				scope.searchCie10 = searchCie10;

				scope.filter = {
					codigo : '',
					nombre : ''
				};

				scope.data = {
					codigo : null,
					nombre : ''
				};

				function searchCie10() {
 					Cie10LogicService.searchCie10()
 						.then(function (pCie10Seleccionado) {
 							scope.model = pCie10Seleccionado;
 							scope.data.codigo = scope.model.Codigo;
							updateView(pCie10Seleccionado);
 						});
 				}

 				function busquedaRapidaCie10() {
 					if(scope.filter.codigo == null){
 						scope.model = '';
						scope.data.codigo = null;
						scope.data.nombre = null;
						scope.filter.codigo = null;
						scope.filter.nombre = null;
 					}
 					else{
	 					if (scope.filter.codigo && !scope.filter.nombre){
	 						Cie10DataService.ObtenerPorCodigo(scope.filter.codigo)
								.then(function(pCie10Seleccionado){
									if(pCie10Seleccionado){
			 							scope.model = pCie10Seleccionado;
										scope.data.codigo = pCie10Seleccionado.Codigo;
									}
									else{
										scope.model = '';
										scope.data.codigo = null;
										scope.filter.codigo = null;
									}
									updateView(pCie10Seleccionado);
								}
	 						);
	 					}
 					}
 				}

 				function updateView(pCie10){
 					if(pCie10){
	 					scope.filter.codigo = pCie10.Codigo;
						scope.filter.nombre = pCie10.Nombre;
					}
 				}

 				function cambioCodigoCie10() {
					if(scope.data.codigo != '' && scope.filter.codigo != scope.data.codigo){
						scope.filter.nombre = '';
 					}
 				}

 				scope.$watch(function () {
					return scope.model;
				}, function(newValue) {
					if(newValue){
						scope.filter.codigo = newValue.Codigo.trim();
						scope.filter.nombre = newValue.Nombre;
					}
				});
			}
		}
	};
	return module;

})();