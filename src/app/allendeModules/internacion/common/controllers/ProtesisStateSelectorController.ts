/**
 * @author:			Ezequiel Mansilla
 * @description:	Verificar protesis
 * @type:			Controller
 **/
export default (function () {
	
	const module = { init : (ngModule: any) => {} };

	module.init = function (module) {

		module.controller('ProtesisStateSelectorController', ProtesisStateSelectorController);

		ProtesisStateSelectorController.$inject = ['Logger', '$uibModalInstance', 'ProtesisDataService', 'ModalService',
			'Protesis', 'Estado', 'Title', 'Module', 'User'];

		function ProtesisStateSelectorController ($log, $uibModalInstance, ProtesisDataService, ModalService,
			Protesis, Estado, Title, Module, User) {

			/* ------------------------------------------------ LOG ------------------------------------------------ */

			$log = $log.getInstance('ProtesisStateSelectorController');
			$log.debug('ON.-');
			
			/* ----------------------------------------- API Y VARIABLESES ----------------------------------------- */

			var vm = this;
			vm.today = new Date();
			
			vm.title = {
				module : Module,
				page : Title
			};

			vm.data = {
				estados : []
			};

			vm.formData = {
				estado: '',
				observaciones : ''
			};

			vm.formControl = {
				loading : false,
				error : true,
				ok : registrarVerificacion
			};

			/* ------------------------------------------ IMPLEMENTACIÓN ------------------------------------------ */

			function registrarVerificacion (pEstado) {
				vm.formData.estado = pEstado;
				
				$uibModalInstance.close(vm.formData);
			}

			/* --------------------------------------------- ACTIVATE --------------------------------------------- */

			activate();

			function activate () {
				$log.debug('Inicializar ON.-');
				vm.formControl.loading = true;

				var estados;

				switch (Estado) {
					case 'Verificacion':
						estados = ProtesisDataService.getAllEstadoProtesisVerificacion();
						break;
					case 'Esterilizacion':
						estados = ProtesisDataService.getAllEstadoProtesisEsterilizacion();
						break;
					case 'Autorizacion':
						estados = ProtesisDataService.getAllEstadoProtesisAutorizacion();
						break;
				}

				estados.then(successCallback, errorCallback);
				
	 			function successCallback (pResults) {
	 				vm.data.estados = pResults;	 				
	 				vm.formControl.loading = false;
	 				vm.formControl.error = false;
	 				$log.debug('Inicializar OK.-', pResults);
	 			}

	 			function errorCallback (pError) {
	 				vm.formControl.loading = false;
	 				vm.formControl.error = true;
	 			}
			}

		}
	};

	return module;

})();