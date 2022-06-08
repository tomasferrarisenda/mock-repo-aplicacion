/**
 * @author 			mastore
 * @description 	registroMedicoStates
 */
export default (function () {
	
	const module = { init : (ngModule: any) => {} };

	module.init = function (module) {

		module.config(states);

		states.$inject = ['$stateProvider'];

		function states ($stateProvider)
		{

			$stateProvider.state({
				name : 'medico',
				url: '/Medico',
				abstract : true,
				template : '<ui-view/>',
				data: {
					userRequired: false
				}
			});

			$stateProvider.state({
				name : 'medico.new',
				url: '/Params/{matricula}',
				template: 'new',
				controller: 'MedicoRegisterController',
				controllerAs: 'vm'
			});

			$stateProvider.state({
				name : 'medico.confirm',
				url: '/Confirm',
				template : 'confirm'
			});

			$stateProvider.state({
				name : 'medico.error',
				url: '/Error',
				template : 'error'
			});


			$stateProvider.state({
				name : 'resgistrousuario',
				url: '/RegistroUsuario',
				abstract : true,
				template : '<ui-view/>',
				data: {
					userRequired: false
				}
			});

			$stateProvider.state({
				name : 'resgistrousuario.new',
				url: '/Params/{nombreLegacy}',
				template: 'new',
				controller: 'UsuarioRegisterController',
				controllerAs: 'vm'
			});

			$stateProvider.state({
				name : 'resgistrousuario.confirm',
				url: '/Confirm',
				template : 'confirm'
			});

			$stateProvider.state({
				name : 'resgistrousuario.error',
				url: '/Error',
				template : 'error'
			});


		}
	};

	return module;
})();