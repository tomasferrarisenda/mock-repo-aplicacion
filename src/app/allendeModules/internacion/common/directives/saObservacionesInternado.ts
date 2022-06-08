/**
 * @author 			emansilla
 * @description 	description
 */
import * as angular from 'angular';
import observacionesTemplate = require('../templates/sa-observaciones-internado.tpl.html');
export default (function () {
	
 	const module = { init : (ngModule: any) => {} };

 	module.init = function (module) {

 		module.directive('saObservacionesInternado', saObservacionesInternado);

 		saObservacionesInternado.$inject = [];
 		function saObservacionesInternado () {
 			return {
 				restrict : 'E',
 				scope : {
 					model : '=',
 					title : '@?',

 					btnNewDisabled : '=?',
 					btnNewIf : '=?',

 					user : '=',
 					reload : '='
				},
				template: observacionesTemplate,
 				controller: ObservacionesInternadoController,
				// note: This would be 'ObservacionesInternadoController' (the exported controller name, as string)
				// if referring to a defined controller in its separate file.
				controllerAs: 'vm',
				bindToController: true // because the scope is isolated
			};
		}

		ObservacionesInternadoController.$inject = ['$scope', '$log', 'ModalService',
			'InternacionCommonDataService', 'InternacionCommonLogicService', 'AdmisionDataService'];

		function ObservacionesInternadoController ($scope, $log, ModalService,
			InternacionCommonDataService, InternacionCommonLogicService, AdmisionDataService) {

			/* ------------------------------------------ API Y VARIABLES ------------------------------------------ */

			var vm = this;
			vm.loading = false;
			vm.error = false;
			vm.sinDatos = 'Sin datos';
			vm.btnNewClick = addObservacion;
			vm.observaciones = [];

			/* ------------------------------------------- IMPLEMENTACIÓN ------------------------------------------- */

			function addObservacion () {
				vm.btnLoading = true;

				ModalService.prompt('Observaciones', '', addObservaciones);

				function addObservaciones (pObservaciones) {
					vm.btnLoading = false;
					if (pObservaciones) {
						
						var _observacion = InternacionCommonLogicService
							.crearObservacion(pObservaciones, vm.model.id_internacion, vm.user);
						
						InternacionCommonDataService.addObservacion(_observacion)
						.then (function () {
							ModalService.success('Ok');
							activate();
						});
					}
				}
			}

			$scope.$watch(angular.bind(vm, function () {
				return vm.reload;
			}), function (newVal, oldVal) {
				activate();
			});

			/* ---------------------------------------------- ACTIVATE ---------------------------------------------- */
			// activate();
			
			function activate () {
				$log.debug('saObservacionesInternado: Inicializar ON.-', vm.model);
				vm.observaciones = [];
				vm.loading = true;

				AdmisionDataService.getAllObservacionesByIdInternado(vm.model.id_internacion)
					.then(activateOk, activateError);

				function activateOk (pObservaciones) {
					vm.loading = false;
					vm.error = false;
					vm.observaciones = pObservaciones;
				}

				function activateError () {
					vm.error = true;
					vm.loading = false;					
				}
			}
		}
	};

	return module;

})();