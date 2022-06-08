/**
 * @author:			Martin Astore
 * @description:	Selecciona piso y ubicaciòn
 * @type:			Directive
 **/
import template = require('../templates/sa-ubicacion-piso.tpl.html');

import { IStockCommonLogicService } from '../../common/services';

export default (function () {
	'use strict';
	const module = { init: (ngModule: any) => { } };

	module.init = function (module) {

		module.directive('saUbicacionPiso', saUbicacionPiso);

		saUbicacionPiso.$inject = ['$log', 'StockFarmaciaLogicService', 'StockCommonLogicService'];
		function saUbicacionPiso($log, StockFarmaciaLogicService, StockCommonLogicService: IStockCommonLogicService) {
			return {
				restrict: 'E',
				scope: {
					sucursal: '=',
					changed: '&',
					limpiar: '='
				},
				template: template,
				link: link
			};

			function link(scope) {

				/* ----------------------------------------- API Y VARIABLES ----------------------------------------- */

				scope.data = {
					pisos: [],
					ubicaciones: [],
					ubicacionesPorPiso: []
				};

				scope.piso = {};
				scope.pisoChanged = pisoChanged;

				/* ----------------------------------------- IMPLEMENTACION ----------------------------------------- */

				function pisoChanged() {
					$log.debug('FarmaciaController: getUbicacionPorPiso ON.-');

					scope.data.ubicacionesPorPiso = [];
					if (scope.piso) {
						scope.data.ubicacionesPorPiso = StockCommonLogicService.getUbicacionMedicaByPiso(scope.piso, scope.data.ubicaciones);
					}
				}

				function limpiar() {
					scope.piso = '';
					scope.ubicacionSelect = '';
					scope.data.ubicacionesPorPiso = [];
				}

				// 	scope.$watch(scope.limpiar, function (newVal, oldVal) {
				// 	if (oldVal && !newVal) {
				// 		limpiar();
				// 	}
				// });

				scope.$watch(function () {
					return scope.limpiar;
				}, function (newValue, oldValue) {
					$log.debug('Ubicacion cambio controller', newValue, oldValue);

					if (newValue) {
						activate();
						scope.limpiar = false;
					}
				});

				/* -------------------------------------------- ACTIVATE -------------------------------------------- */

				activate();

				function activate() {
					limpiar();
					scope.data.pisos = StockFarmaciaLogicService.pisos;
					scope.data.ubicaciones = StockFarmaciaLogicService.ubicacionesPiso;
				}
			}
		}
	};

	return module;
})();