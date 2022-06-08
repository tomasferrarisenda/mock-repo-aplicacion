/**
 * @author:			Ezequiel Mansilla
 * @description:	Controller para reporte de protesis
 * @type:			Controller
 **/
export default (function () {
	'use strict';
	
	const module = { init : (ngModule: any) => {} };

	module.init = function (module) {

		module.controller('ProtesisReporteTotalController', ProtesisReporteTotalController);

		ProtesisReporteTotalController.$inject = ['$location', 'Logger', '$state', '$stateParams', '$filter',
			'CantidadPacientes', 'Reporte', 'User'
		];

		function ProtesisReporteTotalController ($location,  $log, $state, $stateParams, $filter,
			CantidadPacientes, Reporte, User) {

			/* ------------------------------------------------ LOG ------------------------------------------------ */

			$log = $log.getInstance('ProtesisReporteTotalController');
			$log.debug('ON.-');
			
			/* ----------------------------------------- API Y VARIABLESES ----------------------------------------- */

			var vm = this;
			vm.today = new Date();
			
			vm.title = {
				name : $state.current.data.title,
				icon : $state.current.data.icon
			};

			vm.data = {};

			vm.filter = {};

			vm.formControl = {			
				reloadPage : reloadPage,
				volver : volver
			};

			/* ------------------------------------------- IMPLEMENTACIÓN ------------------------------------------- */

			function reloadPage () {
				var fecha = $filter('date')(vm.filter.fechaRecepcionProbable, 'MM-dd-yyyy');
				$log.debug('reload page: fecha ', fecha);
				$state.go($state.current.name, {
					fechaRecepcionProbable : fecha
				});
			}

			function volver () {
				$location.url('');
			}

			/* ---------------------------------------------- ACTIVATE ---------------------------------------------- */

			activate();

			function activate () {
				$log.debug('Inicializar ON.-', Reporte);
				if ($stateParams.fechaRecepcionProbable)
					vm.filter.fechaRecepcionProbable = new Date($stateParams.fechaRecepcionProbable);
				else {
					vm.filter.fechaRecepcionProbable = new Date();
				}
				vm.data.reporte = Reporte;
				vm.data.cantidadPacientes = CantidadPacientes;
			}

		}
	};

	return module;

})();