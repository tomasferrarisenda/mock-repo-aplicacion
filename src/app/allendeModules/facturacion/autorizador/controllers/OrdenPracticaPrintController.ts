/**
 * @author 			pferrer
 * @description 	description
 */
export default (function(){
	const module = { init : (ngModule: any) => {} };

	module.init = function (module) {

		module.controller('OrdenPracticaPrintController', OrdenPracticaPrintController);

		// Inyección de Dependencia
		OrdenPracticaPrintController.$inject = ['$log', 'AutorizadorDataService'];

		// Constructor del Controller
		function OrdenPracticaPrintController ($log, AutorizadorDataService) {

			var vm = this;
			
			//vm.user = User;

			vm.formData = {
				aval : '',
				html : ''
			};

			vm.data = {
				aval : {},
				Orden: ''
			};

			vm.formControl = {
				// Manejo del formulario
				error: true,
				loading: false,
				reloadPage: activate,
				imprimir: imprimir
			};



			function imprimir() {
				setTimeout(function (){ window.print(); }, 1000);
			}

			/* ---------------------------------------- ACTIVATE ---------------------------------------- */

			activate();

			function activate () {
				
				$log.debug('Activate');

				vm.formControl.loading = true;
				vm.data.Orden = AutorizadorDataService.ordenPractica;

				vm.formControl.error = false;
				vm.formControl.loading = false;

				imprimir();
			}

		};

	}
	return module;
	
})();