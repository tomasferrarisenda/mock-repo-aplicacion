/**
 * @author:			Pedro Ferrer
 * @description:	Selector de Mutuales
 * @type:			Directive
 **/
import * as angular from 'angular';
import mutualNewTemplate = require('../templates/sa-new-mutual-selector.tpl.html');
import { ISupportDataService } from '../../../../support/basic/services';
export default (function () {
	'use strict';

	const module = { init: (ngModule: any) => { } };

	module.init = function (module) {

		module.directive('saNewMutualSelector', saNewMutualSelector);

		saNewMutualSelector.$inject = ['$log', 'ModalService', 'MutualLogicService',
			'MutualDataService', 'SupportDataService', 'SupportLogicService'];
		function saNewMutualSelector($log, ModalService, MutualLogicService,
			MutualDataService, SupportDataService: ISupportDataService, SupportLogicService) {
			return {
				restrict: 'E',
				scope: {
					model: '=',
					codigoMutualEdit: '=?',
					ngDisabled: '=?',
					labelCodigo: '@?',
					labelNombre: '@?',
					habilitadas: '<?'
				},
				template: mutualNewTemplate,
				link: link
			};

			function link(scope, attrs) {
				scope.cambioMutual = cambioMutual;
				scope.busquedaRapidaMutual = busquedaRapidaMutual;
				scope.searchMutuales = searchMutuales;
				scope.mutualSeleccionada = null;
				

				scope.filter = {
					codigo: '',
					nombre: '',
					filtrarMutual: {}
				};

				activate();

				function activate() {
					if (angular.isUndefined(scope.labelCodigo)) scope.labelCodigo = 'Código Mutual';
					if (angular.isUndefined(scope.labelNombre)) scope.labelNombre = 'Nombre Mutual';
				}

				scope.disabled = (angular.isUndefined(attrs.ngDisabled)) ? false : scope.ngDisabled;
				scope.$watch(function () {
					return scope.ngDisabled;
				}, function (newValue, oldValue, scope) {
					scope.disabled = newValue;
				});

				function searchMutuales() {
					if (scope.habilitadas) { 
						SupportDataService.entidadesBuscador = MutualDataService.getAllMutualParaBusquedaActivas();
					} else
					{
						SupportDataService.entidadesBuscador = MutualDataService.getAllMutualParaBusqueda();
					 }
					SupportDataService.tituloBuscador = 'Seleccionar Mutual';
					SupportDataService.mostrarIdBuscador = false;
					SupportDataService.mostrarCodigoBuscador = true;
					SupportDataService.mostrarNombreBuscador = true;
					SupportDataService.mostrarDescripcionBuscador = false;
					SupportDataService.tituloIdBuscador = '';
					SupportDataService.tituloCodigoBuscador = 'Código';
					SupportDataService.tituloNombreBuscador = 'Mutual';
					SupportDataService.tituloDescripcionBuscador = '';
					SupportLogicService.openSelectorBase()
						.then(function (result) {
							scope.filter.codigo = result.Codigo;
							scope.filter.nombre = result.Nombre;
							scope.model = result;
						});
				}

				function busquedaRapidaMutual() {
					if (!scope.filter.codigo) {
						scope.model = null;
					}
					else {
						MutualDataService.getMutualPorCodigo(scope.filter.codigo)
							.then(function (pMutual) {
								if (pMutual) {
									scope.model = pMutual;
									scope.filter.codigo = pMutual.Codigo;
									scope.filter.nombre = pMutual.Nombre;
								}
								else
									scope.model = null;
								}
							);
					}
				}

				function cambioMutual() {
					if (!scope.model || scope.filter.codigo != scope.model.Codigo) {
						scope.filter.nombre = '';
					}
				}

				scope.$watch(function () {
					return scope.model;
				}, function (newValue) {
					scope.filter.codigo = newValue ? newValue.Codigo : '';
					scope.filter.nombre = newValue ? newValue.Nombre : '';
				});

				scope.$watch(function () {
					return scope.codigoMutualEdit;
				}, function () {
					if(scope.codigoMutualEdit){
						MutualDataService.getMutualPorCodigo(scope.codigoMutualEdit)
						.then(function (pMutual) {
							if (pMutual) {
								scope.model = pMutual;
								scope.filter.codigo = pMutual.Codigo;
								scope.filter.nombre = pMutual.Nombre;
							}
							else
								scope.model = null;
						});
					}
				});
			}
		}
	};
	return module;
})();