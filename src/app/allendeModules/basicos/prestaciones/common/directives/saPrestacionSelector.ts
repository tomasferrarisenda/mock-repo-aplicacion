/**
 * @author:			Pedro Ferrer
 * @description:	Selector de Prestaciones
 * @type:			Directive
 **/
import * as angular from 'angular';
import prestacionTemplate = require('../templates/sa-prestacion-selector.tpl.html');
import { ISupportDataService } from '../../../../support/basic/services';

export default (function () {
	'use strict';

	const module = { init: (ngModule: any) => { } };

	module.init = function (module) {

		module.directive('saPrestacionSelector', saPrestacionSelector);

		saPrestacionSelector.$inject = ['$log', 'PrestacionGestionDataService', 'SupportDataService', 'SupportLogicService'];
		function saPrestacionSelector($log, PrestacionGestionDataService, SupportDataService: ISupportDataService, SupportLogicService) {
			return {
				restrict: 'E',
				scope: {
					model: '=',
					codigoPrestacionEdit: '=?',
					idServicio: '<?',
					idSucursal: '<?',
					ngDisabled: '=?'
				},
				template: prestacionTemplate,
				link: link
			};

			function link(scope, attrs) {
				scope.cambioPrestacion = cambioPrestacion;
				scope.busquedaRapidaPrestacion = busquedaRapidaPrestacion;
				scope.searchPrestaciones = searchPrestaciones;
				scope.prestacionSeleccionada = null;


				scope.filter = {
					id: '',
					nombre: '',
					filtrarPrestacion: {}
				};

				scope.disabled = (angular.isUndefined(attrs.ngDisabled)) ? false : scope.ngDisabled;
				scope.$watch(function () {
					return scope.ngDisabled;
				}, function (newValue, oldValue, scope) {
					scope.disabled = newValue;
				});

				function searchPrestaciones() {
					SupportDataService.entidadesBuscador = PrestacionGestionDataService.ObtenerPrestacionesDelServicioSucursalActivos(
						scope.idServicio ? scope.idServicio : 0,
						scope.idSucursal ? scope.idSucursal : 0);
					SupportDataService.tituloBuscador = 'Seleccionar Prestación';
					SupportDataService.mostrarIdBuscador = true;
					SupportDataService.mostrarCodigoBuscador = false;
					SupportDataService.mostrarNombreBuscador = true;
					SupportDataService.mostrarDescripcionBuscador = false;
					SupportDataService.tituloIdBuscador = 'Código';
					SupportDataService.tituloCodigoBuscador = '';
					SupportDataService.tituloNombreBuscador = 'Nombre';
					SupportDataService.tituloDescripcionBuscador = '';

					SupportLogicService.openSelectorBase()
						.then(function (result) {
							scope.filter.id = result.Id;
							scope.filter.nombre = result.Nombre;
							scope.model = result;
						});

				}

				function busquedaRapidaPrestacion() {
					if (!scope.filter.id) {
						scope.model = null;
					}
					else {
						PrestacionGestionDataService.ObtenerPorIdDeUnServicioYSucursalActivos(scope.filter.id, scope.idServicio ? scope.idServicio : 0, scope.idSucursal ? scope.idSucursal : 0)
							.then(function (pPrestacion) {
								if (pPrestacion) {
									scope.model = pPrestacion;
									scope.filter.id = pPrestacion.Id;
									scope.filter.nombre = pPrestacion.Nombre;
								}
								else
									scope.model = null;
							}
							);
					}
				}

				function cambioPrestacion() {
					if (!scope.model || scope.filter.id != scope.model.Id) {
						scope.filter.nombre = '';
					}
				}

				scope.$watch(function () {
					return scope.model;
				}, function (newValue) {
					scope.filter.id = newValue ? newValue.Id : '';
					scope.filter.nombre = newValue ? newValue.Nombre : '';
				});

				scope.$watch(function () {
					return scope.codigoPrestacionEdit;
				}, function () {
					if (!angular.isUndefined(scope.codigoPrestacionEdit)) {
						PrestacionGestionDataService.getPrestacionById(scope.codigoPrestacionEdit)
							.then(function (pPrestacion) {
								if (pPrestacion) {
									scope.model = pPrestacion;

									scope.filter.id = pPrestacion.Id;
									scope.filter.nombre = pPrestacion.Nombre;
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