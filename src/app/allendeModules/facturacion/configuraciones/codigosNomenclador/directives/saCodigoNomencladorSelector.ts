/**
 * @author:			drobledo
 * @description:	Selector de Códigos de Nomenclador
 * @type:			Directive
 **/
import * as angular from 'angular';
import codigoNomencladorTemplate = require('../templates/sa-codigo-nomenclador-selector.tpl.html');
import { ISupportDataService } from '../../../../support/basic/services';

export default (function () {
	'use strict';

	const module = { init: (ngModule: any) => { } };

	module.init = function (module) {

		module.directive('saCodigoNomencladorSelector', saCodigoNomencladorSelector);

		saCodigoNomencladorSelector.$inject = ['$log', 'CodigosNomencladorDataService',
			'SupportDataService', 'SupportLogicService'];
		function saCodigoNomencladorSelector($log, CodigosNomencladorDataService,
			SupportDataService: ISupportDataService, SupportLogicService) {
			return {
				restrict: 'E',
				scope: {
					model: '=',
					codigoNomencladorEdit: '=?',
					ngDisabled: '=?',
					labelCodigo: '@?',
					labelNombre: '@?'
				},
				template: codigoNomencladorTemplate,
				link: link
			};

			function link(scope, attrs) {
				scope.cambioCodigoNomenclador = cambioCodigoNomenclador;
				scope.busquedaRapidaCodigoNomenclador = busquedaRapidaCodigoNomenclador;
				scope.searchCodigosNomenclador = searchCodigosNomenclador;
				scope.codigoNomencladorSeleccionado = null;

				scope.filter = {
					codigo: '',
					nombre: '',
					filtrarCodigoNomenclador: {}
				};

				activate();

				function activate() {
					if (angular.isUndefined(scope.labelCodigo)) scope.labelCodigo = 'Código';
					if (angular.isUndefined(scope.labelNombre)) scope.labelNombre = 'Nombre';
				}

				scope.disabled = (angular.isUndefined(attrs.ngDisabled)) ? false : scope.ngDisabled;
				scope.$watch(function () {
					return scope.ngDisabled;
				}, function (newValue, oldValue, scope) {
					scope.disabled = newValue;
				});

				function searchCodigosNomenclador() {
					SupportDataService.entidadesBuscador = CodigosNomencladorDataService.obtenerCodigosNomenclador();
					SupportDataService.tituloBuscador = 'Seleccionar Código de Nomenclador';
					SupportDataService.mostrarIdBuscador = false;
					SupportDataService.mostrarCodigoBuscador = true;
					SupportDataService.mostrarNombreBuscador = true;
					SupportDataService.mostrarDescripcionBuscador = false;
					SupportDataService.tituloIdBuscador = '';
					SupportDataService.tituloCodigoBuscador = 'Código';
					SupportDataService.tituloNombreBuscador = 'Nombre';
					SupportDataService.tituloDescripcionBuscador = '';
					SupportLogicService.openSelectorBase()
						.then(function (result) {
							scope.filter.codigo = result.codigo_practica_medica;
							scope.filter.nombre = result.nombre_practica_medica;
							scope.model = result;
						});
				}

				function busquedaRapidaCodigoNomenclador() {
					if (!scope.filter.codigo) {
						scope.model = null;
					}
					else {
						CodigosNomencladorDataService.obtenerCodigoNomencladorPorCodigo(scope.filter.codigo)
							.then(function (result) {
								if (result) {
									scope.model = result;
									scope.filter.codigo = result.codigo_practica_medica;
									scope.filter.nombre = result.nombre_practica_medica;
								}
								else
									scope.model = null;
								}
							);
					}
				}

				function cambioCodigoNomenclador() {
					if (!scope.model || scope.filter.codigo != scope.model.codigo_practica_medica) {
						scope.filter.nombre = '';
					}
				}

				scope.$watch(function () {
					return scope.model;
				}, function (newValue) {
					scope.filter.codigo = newValue ? newValue.codigo_practica_medica : '';
					scope.filter.nombre = newValue ? newValue.nombre_practica_medica : '';
				});

				scope.$watch(function () {
					return scope.codigoNomencladorEdit;
				}, function () {
					if(scope.codigoNomencladorEdit){
						CodigosNomencladorDataService.obtenerCodigoNomencladorPorCodigo(scope.codigoNomencladorEdit)
						.then(function (result) {
							if (result) {
								scope.model = result;
								scope.filter.codigo = result.codigo_practica_medica;
								scope.filter.nombre = result.nombre_practica_medica;
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