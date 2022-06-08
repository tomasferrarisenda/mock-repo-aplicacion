/**
 * @author 			emansilla
 * @description 	description
 */
import diasInternacionTemplate = require('../templates/sa-dias-internacion.tpl.html');
export default (function () {
	
	const module = { init : (ngModule: any) => {} };

	module.init = function (module) {

		module.directive('saCantidadDiasInternacion', saCantidadDiasInternacion);

		saCantidadDiasInternacion.$inject = ['$log', 'PreadmisionLogicService'];
		function saCantidadDiasInternacion ($log, PreadmisionLogicService) {
			return {
				restrict : 'E',
				scope : {
					model : '=',
					cantidad : '=',
					title : '@?',

					required : '=?',

					btnNewDisabled : '=?',
					btnNewIf : '=?'
				},
				template: diasInternacionTemplate,
				link : link
			};

			function link (scope) {
				// $log.debug(scope.model);
				scope.loading = false;
				scope.sinDatos = 'Sin datos';
				scope.btnNewClick = cargarCantidadDias;
				
				function cargarCantidadDias () {
					scope.loading = true;
					PreadmisionLogicService.openCargaCantidadDias({userName:'emansilla'}, scope.model)
					.then(successCallback, errorCallback);

					function successCallback (pCantidadDias) {
						scope.loading = false;
						var _cantidadTotal = 0;
						scope.model = pCantidadDias;
						for (var i = 0; i < pCantidadDias.length; i++) {
							_cantidadTotal += pCantidadDias[i].cantidad_dias;
						}
						scope.cantidad = _cantidadTotal;
					}

					function errorCallback () {
						scope.loading = false;
					}
				}

				activate();
				function activate () {
					// $log.debug('saCantidadDiasInternacion: activate');
					if (!scope.model) {
						scope.model = [];
					}
					// $log.debug('saCantidadDiasInternacion: activate OK', scope.model);
				}
			}
		}
	};

	return module;

})();