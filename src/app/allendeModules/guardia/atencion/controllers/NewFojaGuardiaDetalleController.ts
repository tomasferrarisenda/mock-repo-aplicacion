import * as angular from 'angular';

export default (function () {
	'use strict';
	const module = { init : (ngModule: any) => {} };

	module.init = function (module) {

		module.controller('NewFojaGuardiaDetalleController', NewFojaGuardiaDetalleController);

		NewFojaGuardiaDetalleController.$inject = ['$scope', '$log', '$q', '$filter', 'AlertaService', 'CieLogicService','User',
		'TITLE_ATENCION', 'ACTION_ATENCION', 'GuardiaAtencionDataService', '$uibModalInstance'];

		function NewFojaGuardiaDetalleController ($scope, $log, $q, $filter, AlertaService, CieLogicService,User,
			TITLE_ATENCION,ACTION_ATENCION, GuardiaAtencionDataService , $uibModalInstance) {

			$log.debug('NewFojaGuardiaDetalleController: ON.-');

			/* ------------------------------ API Y VARIABLES ------------------------------ */
			

			// $scope.color = COLOR_GUARDIA;

			$scope.title = {
				module: TITLE_ATENCION.MODULE,
				page: TITLE_ATENCION.NEW_FOJA
			};

			$scope.formData = {
				detalle: '',
				medicamento: '',
				descartable: '',
				observacion: ''
			};

			$scope.data = {
				detalle: [],
				vias: [],
				tiposDosis: [],
				usuario: ''
			};

			$scope.formControl = {
				error: true,
				loading: false,


				tipearCirujano: tipearCirujano,
				tipearAyudante1: tipearAyudante1,
				tipearAyudante2: tipearAyudante2,
				tipearAnestesista: tipearAnestesista,
				cargarDiagnosticoPrevio:cargarDiagnosticoPrevio,
				cargarDiagnosticoPosterior: cargarDiagnosticoPosterior,
				controlarCampos: controlarCampos,
				reloadPage: activate,
				ok : guardar,
				cancel : cancel
			};

			/* ------------------------------ IMPLEMENTACIÓN ------------------------------ */


			function inicializarVariables () {
				$scope.data.ubicacion = GuardiaAtencionDataService.ubicacion;
				$scope.data.detalle = GuardiaAtencionDataService.detalle;
				$log.debug("DEtalle: ",$scope.data.detalle);
				$scope.data.prescripcion  = GuardiaAtencionDataService.prescripcion;
				// $scope.data.vias = GuardiaAtencionDataService.vias;
				// $scope.data.tiposDosis = GuardiaAtencionDataService.tiposDosis;
				$scope.data.profesionales = GuardiaAtencionDataService.profesionales;

				$scope.data.detalle.Foja = {};
				// $scope.data.detalle.Foja.id_prescripcion_detalle = $scope.data.detalle.id_prescripcion_detalle;

				// $log.debug("usuarioREaliza",scope.data.detalle.id_usuario_realiza);
			}

			function cargarDiagnosticoPrevio() {
				CieLogicService.openSelector(User)
					.then(function (pDiagnostico) {
						$scope.formData.diagnosticoPrevio = pDiagnostico;
						$scope.data.detalle.Foja.diagnostico_previo = pDiagnostico.id_cie_enfermedad;
					});
					controlarCampos();
			}

			function cargarDiagnosticoPosterior() {
				CieLogicService.openSelector(User)
					.then(function (pDiagnostico) {
						$scope.formData.diagnosticoPosterior = pDiagnostico;
						$scope.data.detalle.Foja.diagnostico_posterior = pDiagnostico.id_cie_enfermedad;
					});
					controlarCampos();
			}

			function tipearCirujano() {
				$scope.data.detalle.Foja.matricula_cirujano = $scope.formData.cirujano.numero_matricula;
				controlarCampos();
			}

			function tipearAyudante1() {
				$scope.data.detalle.Foja.matricula_ayudante_1 = $scope.formData.ayudante1.numero_matricula;
			}

			function tipearAyudante2() {
				$scope.data.detalle.Foja.matricula_ayudante_1 = $scope.formData.ayudante2.numero_matricula;
			}

			function tipearAnestesista() {
				$scope.data.detalle.Foja.matricula_anestesista = $scope.formData.anestesista.numero_matricula;
			}

			function controlarCampos() {
				// $log.debug('fecha',$scope.data.detalle.Foja.fecha_inicio);
				if(
					$scope.data.detalle.Foja.matricula_cirujano &&
					$scope.formData.fecha_inicio &&
					$scope.formData.fecha_fin &&
					$scope.data.detalle.Foja.procedimiento &&
					$scope.data.detalle.Foja.preparacion &&
					$scope.data.detalle.Foja.diagnostico_previo &&
					$scope.data.detalle.Foja.diagnostico_posterior
					)
				{
					$scope.formControl.datosCargados = true;
				}
				else
				{
					$scope.formControl.datosCargados = false;
				}
			}


			function guardar() {
				var _fecha = $filter('date')($scope.formData.fecha_inicio, 'MM/dd/yyyy');
				var _hora = $filter('date')($scope.formData.fecha_inicio, 'HH:mm');
				var _fechaFin = $filter('date')($scope.formData.fecha_fin, 'MM/dd/yyyy');
				var _horaFin = $filter('date')($scope.formData.fecha_fin, 'HH:mm');

				var foja = {
			        IdDetalle: $scope.data.detalle.Id,
			        FechaInicio: _fecha + ' ' + _hora,
			        FechaFin: _fechaFin + ' ' + _horaFin,
			        IdDiagnosticoPrevio: $scope.formData.diagnosticoPrevio.id_cie_enfermedad,
			        IdDiagnosticoPosterior: $scope.formData.diagnosticoPosterior.id_cie_enfermedad,
			        Preparacion: $scope.data.detalle.Foja.preparacion,
			        Procedimiento: $scope.data.detalle.Foja.procedimiento,
			        MatriculaCirujano: $scope.formData.cirujano.numero_matricula,
			        MatriculaAyudante1: ($scope.formData.ayudante1) ? $scope.formData.ayudante1.numero_matricula: null,
			        MatriculaAyudante2: ($scope.formData.ayudante2) ? $scope.formData.ayudante2.numero_matricula: null,
			        MatriculaAnestesista: ($scope.formData.anestesista) ? $scope.formData.anestesista.numero_matricula: null,
			    };

			    GuardiaAtencionDataService.newFoja(foja)
					.then(function () {
						AlertaService.NewSuccess('Carga correcta');
						$uibModalInstance.close();
					});
			}

			function cancel () {
				$uibModalInstance.dismiss('cancel');
			}



			/* ------------------------------ ACTIVATE ------------------------------ */

			activate();

			/* Método inicializador */
			function activate () {
				$log.debug('NewFojaGuardiaDetalleController: Inicializar ON.-');

				$q.all([
					GuardiaAtencionDataService.getFojaDto()
				])
				.then(activateOk, activateError);
				// activateOk();
			}

			function activateOk (pResult) { 
				$scope.data.fojaDto = pResult[0];
				// $log.debug('$scope.data.descartables',$scope.data.descartables);
				$scope.formControl.loading = false;
				inicializarVariables();
			}

			function activateError () {
				$scope.formControl.loading = false;
				$scope.formControl.error = true;
			}
		}
	};

	return module;
})();