export default (function () {
	
	const module = { init : (ngModule: any) => {} };

	module.init = function (module) {
		
 		module.controller('MedicoRegisterController', MedicoRegisterController);

 		MedicoRegisterController.$inject = ['$log', '$location', '$stateParams', 'LegacyRegisterService'];

 		function MedicoRegisterController ($log, $location, $stateParams, LegacyRegisterService) {
 			
 			$log.debug('MedicoRegisterController: ON.-');

 			/* ---------------------------------------- API Y VARIABLES ---------------------------------------- */

 			var vm = this;

 			vm.nombrePagina = "Alta de Médico";
			vm.matricula = $stateParams.matricula || null;
			vm.idUsuario = null;
			vm.isFirstTime = LegacyRegisterService.isFirstTime || false;

			// Siempre viene la matricula
			// if (!angular.isUndefined($routeParams.matricula))
			// {
			// 	vm.matricula = $routeParams.matricula;
			// 	$log.debug('Matricula: ' , vm.matricula);
			// }

 			/* ---------------------------------------- IMPLEMENTACIÓN ---------------------------------------- */

 			addMedico();

 			function addMedico () {
				$log.debug('MedicoRegisterController: AddMedico ON.-');

				if (!vm.isFirstTime) {
					$log.debug('NO es la primera vez');

					LegacyRegisterService.isFirstTime = true;

					if (vm.matricula == null) {
						$log.debug('MedicoRegisterController: AddMedico ERROR.- Matricula es null');
					} else {
						$log.debug('MedicoRegisterController: GetUsuario casi.-');
						
						LegacyRegisterService.getUsuario()
						.then(function (pUsuario) {
							
							$log.debug('MedicoRegisterController: GetUsuario OK.-', pUsuario);
							vm.idUsuario = pUsuario.Id;
							$log.debug('MedicoRegisterController: AddMedico casi.-', vm.matricula, vm.idUsuario);
							
							LegacyRegisterService.addMedico(vm.matricula, vm.idUsuario)
							.then(function (pMedico) {
								$log.debug('MedicoRegisterController: AddMedico OK.-', pMedico);
								$location.url('/Medico/Confirm');
							}, addMedicoError);

						}, addMedicoError);
					}
				} else {
					$log.debug('SI es la primera vez');
				}
				// TODO: Si no es el primer ingreso ???
 			}

 			function addMedicoError (pError) {
 				$log.debug('MedicoRegisterController: AddMedico ERROR.-', pError);
				$location.url('/Medico/Error');
 			}
 		}
	}

	return module;
})();