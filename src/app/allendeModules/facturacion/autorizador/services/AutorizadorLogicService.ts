import verAutorizacion = require('../templates/autorizacion-view.tpl.html');
import imprimirOrdenPractica = require('../templates/orden-practica-print.tpl.html');
import verExcepcionAutorizador = require('../views/ExcepcionAutorizacionView.html');

export default (function () {
	const module = { init: (ngModule: any) => { } };

	module.init = function (module) {

		module.factory('AutorizadorLogicService', AutorizadorLogicService);

		// Inyección de dependencia
		AutorizadorLogicService.$inject = ['$log', '$uibModal', 'PrintSelectionService'];

		// Definición del servicio
		function AutorizadorLogicService($log, $uibModal, PrintSelectionService) {

			//$log.debug('AutorizadorLogicService: ON.-');

			// API o Interface
			const service = {
				viewAutorizacion: viewAutorizacion,
				printOrdenPractica: printOrdenPractica,
				selectPrint: selectPrint
			};

			return service;

			function viewAutorizacion() {
				var _modalInstance = $uibModal.open({
					template: verAutorizacion,
					controller: 'AutorizacionViewController',
					controllerAs: 'vm',
					keyboard: true,
					size: 'lg'
				});

				return _modalInstance.result;
			}

			function viewExcepcion() {
				var _modalInstance = $uibModal.open({
					template: verExcepcionAutorizador,
					controller: 'ExcepcionAutorizacionViewController',
					controllerAs: 'vm',
					keyboard: true,
					size: 'lg'
				});

				return _modalInstance.result;
			}

			function printOrdenPractica() {
				var _modalInstance = $uibModal.open({
					template: imprimirOrdenPractica,
					controller: 'OrdenPracticaPrintController',
					controllerAs: 'vm',
					keyboard: true,
					size: 'lg'
				});

				return _modalInstance.result;
			}

			function selectPrint(pUser) {
				return PrintSelectionService.open(pUser, 88);
			}

			/**
			 * Select print
			 * @param  {string} pPrintName Nombre de impresion
			 * @return {string}            [description]
			 */
			function selectPrintTemplate(pPrintName) {
				var printSelect = '';
				switch (pPrintName) {
					case 'PrintOrdenIndividual':
						printSelect = '../templates/orden-practica-print.tpl.html';
						break;
					case 'PrintOrdenPaciente':
						printSelect = '../templates/orden-practica-print.tpl.html';
						break;
				}

				return printSelect;
			}

		};
	};

	return module;
})();