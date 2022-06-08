/**
 * @author:			Ezequiel Mansilla
 * @description:	Visualuzación de observaciones de prótesis
 * @type:			Controller
 **/
export default (function () {
	
	const module = { init : (ngModule: any) => {} };

	module.init = function (module) {

		module.controller('ProtesisObservacionesModalController', ProtesisObservacionesModalController);

		ProtesisObservacionesModalController.$inject = [
			'Logger', '$uibModalInstance', 'ProtesisDataService', 'ModalService',
			'Protesis', 'Title', 'Module', 'User'
		];

		function ProtesisObservacionesModalController (
			$log, $uibModalInstance, ProtesisDataService, ModalService,
			Protesis, Title, Module, User
		) {

			/* ------------------------------------------------ LOG ------------------------------------------------ */

			$log = $log.getInstance('ProtesisObservacionesModalController');
			$log.debug('ON.-');
			
			/* ----------------------------------------- API Y VARIABLESES ----------------------------------------- */

			var vm = this;
			vm.today = new Date();
			
			vm.title = {
				module : Module,
				page : Title
			};

			vm.data = {
				observaciones : [],
				observacionesAutorizacion : [],
				observacionesEsterilizacion : [],
				observacionesVerificacion : []
			};

			vm.formData = {
			};

			vm.formControl = {
				loading : false,
				error : true
			};

			/* ------------------------------------------ IMPLEMENTACIÓN ------------------------------------------ */

			function crearArrayObservaciones (pResults) {
				vm.data.observaciones = [
					{
						title: 'Observaciones Esterilizacion',
						data : pResults.Esterilizacion
					},
					{
						title: 'Observaciones Verificacion',
						data : pResults.Verificacion
					},
					{
						title: 'Observaciones Autorizacion',
						data : pResults.Autorizacion
					}
				];
			}

			/* ---------------------------------------------- ACTIVATE ---------------------------------------------- */

			activate();

			function activate () {
				$log.debug('Inicializar ON.-');
				vm.formControl.loading = true;
				ProtesisDataService.getObservacionesAll(Protesis.id_protesis_preadmision)
				.then(successCallback, errorCallback);
				
	 			function successCallback (pResults) {
	 				crearArrayObservaciones(pResults);
	 				
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