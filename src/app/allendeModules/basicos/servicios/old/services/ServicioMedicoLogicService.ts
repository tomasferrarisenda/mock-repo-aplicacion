/**
 * @author 			emansilla
 * @description 	description
 */
export default (function () {
	
	const module = { init : (ngModule: any) => {} };

	module.init = function (module) {

		module.factory('ServicioMedicoLogicService', ServicioMedicoLogicService);

		// Inyección de dependencia
		ServicioMedicoLogicService.$inject = ['Logger', '$uibModal', 'BASE_MODULES'];

		// Definición del servicio
		function ServicioMedicoLogicService ($log, $uibModal, BASE) {

			/* ------------------------------------------------ LOG ------------------------------------------------ */

			$log = $log.getInstance('ServicioMedicoLogicService');
			$log.debug('ON.-');
			
			/* ------------------------------------------ API Y VARIABLES ------------------------------------------ */
			
			const service = {
				openModal: openModalServicioMedico,
				changeServicioMedicoDefecto : changeServicioMedicoDefecto
			};

			return service;

			/* ------------------------------------------ IMPLEMENTACIÓN ------------------------------------------ */

			function openModalServicioMedico (pServicioMedico) {
				var _telefono;
				(pServicioMedico) ? _telefono = pServicioMedico : _telefono = null;

				var _modalInstance = $uibModal.open({
					templateUrl: BASE + 'support/servicioMedico/templates/telefono-modal.tpl.html',
					controller: 'ServicioMedicoModalController',
					controllerAs: 'vm',
					size: 'lg',
					resolve: {
						ServicioMedico: function () {
							return _telefono;
						}
					}
				});
				
				return _modalInstance.result;
			}

			function changeServicioMedicoDefecto (pServicioMedico, pListServicioMedico) {
				for (var i = 0; i < pListServicioMedico.length; i++) {
					if (pListServicioMedico[i].id_telefono != pServicioMedico.id_telefono)
						pListServicioMedico[i].defecto = false;
				}
			}
		}
	};

	return module;

})();