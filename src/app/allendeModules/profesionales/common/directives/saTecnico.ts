/**
 * @author:			Pedro Ferrer
 * @description:	Selector de Tecnico
 * @type:			Directive
 **/
import tecnicoTemplate = require('../templates/sa-Tecnico.tpl.html');
export default (function () {
	'use strict';
	
	const module = { init : (ngModule: any) => {} };

	module.init = function (module) {

		module.directive('saTecnico', saTecnico);

		saTecnico.$inject = ['$log', 'ModalService', 'ContratableLogicService', 'ContratableDataService','AlertaService'];
		function saTecnico ($log, ModalService, ContratableLogicService, ContratableDataService, AlertaService) {
			return {
				restrict : 'E',
				scope : {
					model : '=',
					title : '@',
					mostrarlabelcodigo : '@',
					mostrarlabelnombre : '@',
					tooltip : '@',
					idservicio : '@'
				},
				template: tecnicoTemplate,
				link: link
			};

			function link(scope){
				scope.cambioCodigoTecnico = cambioCodigoTecnico;
				scope.busquedaRapidaTecnico = busquedaRapidaTecnico;
				scope.searchTecnico = searchTecnico;

				scope.filter = {
					codigo : '',
					nombre : ''
				};

				scope.data = {
					codigo : null,
					nombre : ''
				};

				function searchTecnico() {
 					ContratableLogicService.searchTecnico(scope.idservicio).then(function (pTecnicoSeleccionado) {
						scope.model = pTecnicoSeleccionado;
						scope.data.codigo = scope.model.Codigo;
						updateView(pTecnicoSeleccionado);
					});
 				}

 				function busquedaRapidaTecnico() {
 					if(scope.filter.codigo == null){
 						scope.model = '';
						scope.data.codigo = null;
						scope.data.nombre = null;
						scope.filter.codigo = null;
						scope.filter.nombre = null;
 					}
 					else{
	 					if (scope.filter.codigo && !scope.filter.nombre){
	 						ContratableDataService.TecnicoObtenerPorCodigo(scope.idservicio, scope.filter.codigo)
								.then(function(pTecnicoSeleccionado){
									if(pTecnicoSeleccionado){
			 							scope.model = pTecnicoSeleccionado;
										scope.data.codigo = pTecnicoSeleccionado.Codigo;
									}
									else {
										AlertaService.NewWarning("El técnico "+scope.filter.codigo+" No existe");
										scope.filter.codigo = 0;
										scope.model = '';
									}
									updateView(pTecnicoSeleccionado);
								}
	 						);
	 					}
 					}
 				}

 				function updateView(pTecnico){
 					if(pTecnico){
	 					scope.filter.codigo = pTecnico.Codigo;
						scope.filter.nombre = pTecnico.Nombre;
					}
 				}

 				function cambioCodigoTecnico() {
					if(scope.data.codigo != '' && scope.filter.codigo != scope.data.codigo){
						scope.filter.nombre = '';
 					}
 				}

 				scope.$watch(function () {
					return scope.model;
				}, function(newValue) {
					if(newValue){
						scope.filter.codigo = newValue.Codigo;
						scope.filter.nombre = newValue.Nombre;
					}
				});
			}
		}
	};
	return module;

})();