
import prescripcionDetalle = require('../templates/prescripcion-detalle.tpl.html');
import PrescripcionDetallePrint = require('../templates/prescripcion-detalle-print.tpl.html');
import PrescripcionFacturacion = require('../templates/prescripcion-facturacion.tpl.html');
import FojaGuardiaPrint = require('../templates/foja-guardia-print.tpl.html');

export default (function () {
	'use strict';

	const module = { init: (ngModule: any) => { } };

	module.init = function (module) {

		module.factory('GuardiaAdministracionLogicService', GuardiaAdministracionLogicService);

		// Inyección de dependencia
		GuardiaAdministracionLogicService.$inject = ['$log', '$uibModal']

		// Definición del servicio
		function GuardiaAdministracionLogicService($log, $uibModal) {

			$log.debug('GuardiaAdministracionLogicService: ON.-');

			// API o Interface
			const service = {
				viewDetalle: viewDetalle,
				printDetalle: printDetalle,
				printFoja: printFoja,
				facturar: facturar
			};

			return service;

			function viewDetalle(pPrescripcion, pMateriales, pPracticas) {
				var _modalInstance;

				_modalInstance = $uibModal.open({
					template: prescripcionDetalle,
					controller: 'PrescripcionDetalleController',
					controllerAs: 'vm',
					size: 'lg',
					resolve: {
						Prescripcion: function () {
							return pPrescripcion;
						},
						Materiales: function () {
							return pMateriales;
						},
						Practicas: function () {
							return pPracticas;
						}
					}
				});

				return _modalInstance.result;
			}


			function facturar(pPrescripcion) {
				var _modalInstance;

				_modalInstance = $uibModal.open({
					template: PrescripcionFacturacion,
					controller: 'PrescripcionFacturacionController',
					controllerAs: 'vm',
					size: 'lg',
					resolve: {
						Prescripcion: function () {
							return pPrescripcion;
						}
					}
				});

				return _modalInstance.result;

				// body...
			}

			function printDetalle(pPrescripcion) {
				var _modalInstance;
				_modalInstance = $uibModal.open({

					template: PrescripcionDetallePrint,
					controller: 'PrescripcionDetallePrintController',
					size: 'lg',
					resolve: {
						Prescripcion: function () {
							return pPrescripcion;
						}
					}
				});
			}

			function printFoja(pDetalle, pPrescripcion) {
				var _modalInstance;
				_modalInstance = $uibModal.open({

					template: FojaGuardiaPrint,
					controller: 'FojaGuardiaPrintController',
					size: 'lg',
					resolve: {
						Detalle: function () {
							return pDetalle;
						},
						Prescripcion: function () {
							return pPrescripcion;
						}
					}
				});
			}

		};
	};

	return module;
})();