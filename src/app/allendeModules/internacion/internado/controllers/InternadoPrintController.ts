/**
 * @author 			emansilla
 * @description 	description
 */
export default (function () {
	
	const module = { init : (ngModule: any) => {} };

	module.init = function (module) {

		module.controller('InternadoPrintController', InternadoPrintController);

		// Inyección de Dependencia
		InternadoPrintController.$inject = ['$scope', 'Logger', '$q', '$uibModalInstance',
			'AdmisionDataService', 'User', 'IdInternacion'];

		// Constructor del Controller
		function InternadoPrintController ($scope, $log, $q, $uibModalInstance,
			AdmisionDataService, User, IdInternacion) {

			/* ------------------------------------------------ LOG ------------------------------------------------ */

			$log = $log.getInstance('InternadoPrintController');
			$log.debug('ON.-');

			/* ------------------------------------------ API Y VARIABLES ------------------------------------------ */

			var vm = this;

			vm.today = new Date();

			$scope.constante = {
				idInternacion: IdInternacion
			};

			$scope.formData = {
				aval : '',
				html : '',
				fechaProbableSalida : ''
			};

			$scope.data = {
				internacion : {},
				aval : {},
				avalHabitacion : {},
				user: User
			};

			$scope.formControl = {
				// Manejo del formulario
				error: true,
				loading: false,
				reloadPage: activate,
				volver: volver,
				validarForm: validarForm,
				esValidoParaFirma: esValidoParaFirma
			};

			/* ------------------------------------------ IMPLEMENTACIÓN ------------------------------------------ */

			/* FORMULARIO */

			function volver () {
				
				// $location.url('/Admision/List');
			}

			function esValidoParaFirma (pIndex) {
				if (pIndex == 2 || pIndex == 8) {
					return true;
				}
				return false;
			}

			function validarForm () {
				// body...
			}

			function getNameMonth (pNumber) {
				var _meses = [
					'enero',
					'febrero',
					'marzo',
					'abril',
					'mayo',
					'junio',
					'julio',
					'agosto',
					'septiembre',
					'octubre',
					'noviembre',
					'diciembre'
				];

				return _meses[pNumber];
			}

			/* --------------------------------------------- ACTIVATE --------------------------------------------- */

			activate();

			function activate () {
				$scope.formControl.loading = true;
				$log.debug('Inicializar ON.-');
				
				var _internacion = AdmisionDataService.getOneInternacion(IdInternacion);
				var _aval = AdmisionDataService.getAval();
				var _avalHabitacion = AdmisionDataService.getAvalDiferenciaHabitacion();

				$q.all([_internacion, _aval, _avalHabitacion])
				.then(activateOk, activateError);
			}

			function activateOk (pResults) {
				$scope.formControl.loading = false;
				$scope.data.internacion = pResults[0];
				$scope.data.aval = pResults[1];
				$scope.data.avalHabitacion = pResults[2];
				// TODO: agregar cantidad de dias.
				
				$scope.formData.fechaProbableSalida = new Date($scope.data.internacion.fecha_admision);
				$scope.formData.fechaProbableSalida.setDate($scope.formData.fechaProbableSalida.getDate() + $scope.data.internacion.cantidad_dias_internacion);
				
				// Aval Internacion
				var _nombPaciente =  $scope.data.internacion.Paciente.nombre_completo;
				var _textoCompleto = $scope.data.aval.memo.replace(/&PACIENTE&/g,_nombPaciente);
				$scope.formData.aval = _textoCompleto.split('<br>');

				// Aval Diferencia Habitacion
				var _nombreAcompaniante = $scope.data.internacion.nombre_acompaniante;
				var _today = new Date();
				var _mes = getNameMonth(_today.getMonth());
				var _textoDiferenciaHabitacion = $scope.data.avalHabitacion.memo.replace(/&ACOMPANANTE&/g,_nombreAcompaniante);
				_textoDiferenciaHabitacion = _textoDiferenciaHabitacion.replace(/&DIA&/g, _today.getDate());
				_textoDiferenciaHabitacion = _textoDiferenciaHabitacion.replace(/&MES&/g, _mes);
				_textoDiferenciaHabitacion = _textoDiferenciaHabitacion.replace(/&ANIO&/g, _today.getFullYear());
				$scope.formData.avalHabitacion = _textoDiferenciaHabitacion.split('<br>');


				setTimeout(function (){ window.print(); }, 1000);
			}

			function activateError (pError) {
				$uibModalInstance.dismiss(pError);
			}
		};
	};

	return module;

})();