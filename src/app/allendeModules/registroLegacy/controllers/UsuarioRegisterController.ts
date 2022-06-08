export default (function () {
	
	const module = { init : (ngModule: any) => {} };

	module.init = function (module) {
		
 		module.controller('UsuarioRegisterController', UsuarioRegisterController);

 		UsuarioRegisterController.$inject = ['$log', '$location', '$stateParams', 'LegacyRegisterService'];

 		function UsuarioRegisterController ($log, $location, $stateParams, LegacyRegisterService) {
 			
 			$log.debug('UsuarioRegisterController: ON.-');

 			/* ---------------------------------------- API Y VARIABLES ---------------------------------------- */

 			var vm = this;

 			vm.nombrePagina = "Alta de Usuario";
			vm.nombreLegacy = $stateParams.nombreLegacy || null;
			vm.idUsuario = null;
			vm.isFirstTime = LegacyRegisterService.isFirstTime || false;

			// Siempre viene la nombreLegacy
			// if (!angular.isUndefined($routeParams.nombreLegacy))
			// {
			// 	vm.nombreLegacy = $routeParams.nombreLegacy;
			// 	$log.debug('nombreLegacy: ' , vm.nombreLegacy);
			// }

 			/* ---------------------------------------- IMPLEMENTACIÓN ---------------------------------------- */

 			addMedico();

 			function addMedico () {
				$log.debug('UsuarioRegisterController: AddUsuario ON.-');

				if (!vm.isFirstTime) {
					$log.debug('NO es la primera vez');

					LegacyRegisterService.isFirstTime = true;

					if (vm.nombreLegacy == null) {
						$log.debug('UsuarioRegisterController: AddUsuario ERROR.- nombreLegacy es null');
					} else {
						$log.debug('UsuarioRegisterController: GetUsuario casi.-');
						
						LegacyRegisterService.getUsuario()
						.then(function (pUsuario) {
							
							$log.debug('UsuarioRegisterController: GetUsuario OK.-', pUsuario);
							vm.idUsuario = pUsuario.Id;
							$log.debug('UsuarioRegisterController: AddUsuario casi.-', vm.nombreLegacy, vm.idUsuario);
							
							LegacyRegisterService.addUsuario(vm.nombreLegacy, vm.idUsuario)
							.then(function (pMedico) {
								$log.debug('UsuarioRegisterController: AddUsuario OK.-', pMedico);
								$location.url('/Usuario/Confirm');
							}, addUsuarioError);

						}, addUsuarioError);
					}
				} else {
					$log.debug('SI es la primera vez');
				}
				// TODO: Si no es el primer ingreso ???
 			}

 			function addUsuarioError (pError) {
 				$log.debug('UsuarioRegisterController: AddUsuario ERROR.-', pError);
				$location.url('/Usuario/Error');
 			}
 		}
	};

	return module;

})();