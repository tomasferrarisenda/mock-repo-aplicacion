/**
 * @author:			Pedro Ferrer
 * @description:	Selector de Items Prefacturables
 * @type:			Directive
 **/
import * as angular from 'angular';
import prefacturableTemplate = require('../templates/sa-Prefacturable-Selector.tpl.html');
import { ISupportDataService } from '../../../support/basic/services';

export default (function () {
	'use strict';

	const module = { init: (ngModule: any) => { } };

	module.init = function (module) {

		module.directive('saPrefacturableSelector', saPrefacturableSelector);

		saPrefacturableSelector.$inject = ['$log', 'SupportLogicService', 'SupportDataService', 'PrefacturableDataService'];
		function saPrefacturableSelector($log, SupportLogicService, SupportDataService: ISupportDataService, PrefacturableDataService) {
			return {
				restrict: 'E',
				scope: {
					model: '=',
					initTipo: '=?',
					disabled: '=?'
				},
				template: prefacturableTemplate,
				link: link
			};

			function link(scope, attrs) {
				scope.cambioCodigoPrefacturable = cambioCodigoPrefacturable;
				scope.busquedaRapidaPrefacturable = busquedaRapidaPrefacturable;
				scope.searchPrefacturables = searchPrefacturables;
				scope.cambioTipoPrefacturable = cambioTipoPrefacturable;

				scope.filter = {
					codigo: null,
					nombre: '',
					tipoPrefacturableElegido: ''
				};

				scope.data = {
					codigo: null,
					nombre: '',
					tipoPrefacturables: '',
					filtrarPrefacturable: {}
				};

				// scope.disabled = (angular.isUndefined(attrs.disabled)) ? false : scope.disabled;
				// scope.$watch(function () {
				// 	return scope.ngDisabled;
				// }, function(newValue, oldValue, scope) {
				// 	scope.disabled = newValue;
				// });

				cargarComboTipos();
				function cargarComboTipos() {
					PrefacturableDataService.obtenerPrefacturablesConNomenclador()
						.then(function (pTiposPrefacturable) {
							scope.data.tipoPrefacturables = pTiposPrefacturable;
							if (scope.initTipo && scope.initTipo.Id) {
								for (var i = scope.data.tipoPrefacturables.length - 1; i >= 0; i--) {
									if (scope.data.tipoPrefacturables[i].Id == scope.initTipo.Id)
										scope.filter.tipoPrefacturableElegido = scope.data.tipoPrefacturables[i].Id;
								}
							}
							else
								setTimeout(() => {
									if (!scope.filter.tipoPrefacturableElegido)
										scope.filter.tipoPrefacturableElegido = scope.data.tipoPrefacturables[0].Id;
								});
						});
				}

				function searchPrefacturables() {
					SupportLogicService.searchPrefacturables(scope.filter.tipoPrefacturableElegido, scope.disabled).then(function (pPrefacturableSeleccionado) {
						scope.model = pPrefacturableSeleccionado;
						scope.data.Prefacturables = scope.model.Codigo;
						for (var i = scope.data.tipoPrefacturables.length - 1; i >= 0; i--) {
							if (scope.data.tipoPrefacturables[i].Id == scope.model.IdTipo) {
								scope.filter.tipoPrefacturableElegido = scope.data.tipoPrefacturables[i].Id;
								break;
							}
						}
						updateView(pPrefacturableSeleccionado);
					});
				}

				function busquedaRapidaPrefacturable() {
					if (!scope.filter.codigo) {
						scope.model = '';
						updateView(scope.model);
					}
					else {
						if (scope.filter.codigo && !scope.filter.nombre) {
							if (scope.filter.tipoPrefacturableElegido) scope.data.filtrarPrefacturable.IdTipoPrefacturable = scope.filter.tipoPrefacturableElegido;
							// if(scope.filter.tipoNomenclador) scope.data.filtrarPrefacturable.IdTipoNomenclador = scope.filter.tipoNomenclador.Id;
							if (scope.filter.codigo) {
								scope.data.filtrarPrefacturable.CodigoDesde = scope.filter.codigo;
								scope.data.filtrarPrefacturable.CodigoHasta = scope.filter.codigo;
							}

							SupportDataService.ObtenerPrefacturablePorFiltro(scope.data.filtrarPrefacturable)
								.then(function (pPrefacturableSeleccionado) {
									if (pPrefacturableSeleccionado[0]) {
										scope.model = pPrefacturableSeleccionado[0];
										scope.data.codigo = pPrefacturableSeleccionado[0].Codigo;
									}
									else
										scope.model = '';
									updateView(pPrefacturableSeleccionado[0]);
								}
								);
							scope.data.filtrarPrefacturable = {};
						}
					}
				}

				function updateView(pPrefacturable) {
					if (pPrefacturable) {
						scope.filter.codigo = pPrefacturable.Codigo;
						scope.filter.nombre = pPrefacturable.Nombre;
					}
				}

				function cambioCodigoPrefacturable() {
					if (scope.data.codigo != '' && scope.filter.codigo != scope.data.codigo) {
						scope.filter.nombre = '';
					}
				}

				function cambioTipoPrefacturable() {
					scope.filter.codigo = null;
					scope.filter.nombre = '';
					scope.data.codigo = null;
					scope.data.nombre = '';
					scope.model = '';
				}

				scope.$watch(function () {
					return scope.model;
				}, function (newValue) {
					if (newValue) {
						scope.filter.codigo = newValue.Codigo;
						scope.filter.nombre = newValue.Nombre;
						scope.filter.tipoPrefacturableElegido = newValue.IdTipo;
					}
					else {
						scope.filter.codigo = '';
						scope.filter.nombre = '';
						scope.model = null;
					}
				});
			}
		}
	};

	return module;

})();