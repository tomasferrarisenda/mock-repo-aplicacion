export default (function () {
	
	const module = { init : (ngModule: any) => {} };

	module.init = function (module) {

		module.factory('LegacyRegisterService', LegacyRegisterService);

		LegacyRegisterService.$inject = ['DotService', '$rootScope', '$log', 'HTTP_METHOD'];

		function LegacyRegisterService (DotService, $rootScope, $log, HTTP_METHOD)
		{
			$log.debug('LegacyRegisterService: ON.-');

			/* ---------------------------------------- API Y VARIABLES ---------------------------------------- */

			var isFirstTime = false;
			var password = '';
			const service = {
				addMedico: addMedico,
				addUsuario: addUsuario,
				getUsuario: getUsuario
			};
			
			return service;

			/* ---------------------------------------- IMPLEMENTACIÓN ---------------------------------------- */

			function getUsuario() {
				var _url ='Usuario/GetByUserName/' + $rootScope.globals.currentUser.userName;
				return DotService.Get(_url);
			}

			function addMedico(pMatricula, pIdUsuario) {
				var _url, _medico;

				_url ='Legacy/UsuarioMedico/';

				_medico = {
					id_usuario : pIdUsuario,
					matricula_medico : pMatricula,
					password_medico : this.password
				};
				
				return DotService.Post(_url , _medico);
			}

			function addUsuario(pNombreLegacy, pIdUsuario) {
				var _url, _medico;

				_url ='UsuarioLegacy/Nuevo/';

				_medico = {
					IdUsuario : pIdUsuario,
					NombreLegacy : pNombreLegacy,
					Password : this.password
				};
				
				return DotService.Post(_url , _medico);
			}
		}
	};

	return module;
})();