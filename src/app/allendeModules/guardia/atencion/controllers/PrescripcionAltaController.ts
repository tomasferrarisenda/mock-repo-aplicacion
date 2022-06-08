import * as angular from 'angular';

export default (function () {
	'use strict';
	const module = { init : (ngModule: any) => {} };

	module.init = function (module) {

		module.controller('PrescripcionAltaController', PrescripcionAltaController);

		PrescripcionAltaController.$inject = ['$scope', '$log', '$q', '$filter', '$location', '$rootScope', 'AlertaService','CieLogicService',
		'TITLE_ATENCION', 'ACTION_ATENCION', 'GuardiaAtencionDataService', 'GuardiaAtencionLogicService',
		'GuardiaAtencionAuthService', '$uibModalInstance'];

		function PrescripcionAltaController ($scope, $log, $q, $filter,$location, $rootScope, AlertaService,CieLogicService,
			TITLE_ATENCION, ACTION_ATENCION,  GuardiaAtencionDataService, GuardiaAtencionLogicService,
			GuardiaAtencionAuthService , $uibModalInstance) {

			$log.debug('PrescripcionAltaController: ON.-');

			/* ------------------------------ API Y VARIABLES ------------------------------ */
			
			var vm = this;
			vm.template = 'guardia/atencion/templates/detalle_prescripcion.tpl.html';

			$scope.title = {
				module: TITLE_ATENCION.MODULE,
				page: TITLE_ATENCION.NEW_MEDICAMENTO
			};

			$scope.formData = {
				tipoAlta: '',
				tipoInternacion: '',
				tipoHabitacion: '',
				informeMedico: ''
			};

			$scope.data = {
				prescripcion: [],
				tiposAlta: [],
				tiposInternacion: [],
				tiposHabitacion: []
			};

			$scope.formControl = {
				error: true,
				loading: false,
				aceptar: false,
				internacion: false,
				reloadPage: activate,
				// ok : realizarPrescripcion,
				cancel : cancel,
				darAlta : darAlta,
				cambioTipoAlta: cambioTipoAlta,
				controlCarga: controlCarga,
				cargarDiagnostico: cargarDiagnostico
			};

			/* ------------------------------ IMPLEMENTACIÓN ------------------------------ */

			function inicializarVariables () {
				$scope.data.prescripcion = GuardiaAtencionDataService.prescripcion;
				$log.debug("prescripcion",$scope.data.prescripcion);
				$scope.data.tiposHabitacion[0] = {};
				$scope.data.tiposHabitacion[0].descripcion = "Alta Complejidad";
				$scope.data.tiposHabitacion[0].id_tipo_habitacion = 400101;
				$scope.data.tiposHabitacion[1] = {};
				$scope.data.tiposHabitacion[1].descripcion = "Comun";
				$scope.data.tiposHabitacion[1].id_tipo_habitacion = 430101;				
			}

			function cambioTipoAlta() {
				$scope.formControl.aceptar = false;
				if($scope.formData.tipoAlta)
				{
					if($scope.formData.tipoAlta.Nombre == "Internado")
					{
						$scope.formControl.internacion = true;
					}
					else
					{
						$scope.formControl.internacion = false;
						$scope.formControl.aceptar = true;
						$scope.formData.tipoInternacion = '';
						$scope.formData.informeMedico = '';
					}
				}
			}

			function cargarDiagnostico() {
				CieLogicService.openSelector(GuardiaAtencionDataService.usuario)
					.then(function (pDiagnostico) {
						$scope.formData.diagnostico = pDiagnostico;
						$log.debug($scope.formData.diagnostico);
						if($scope.formData.diagnostico.titulo_cie_enfermedad != undefined)
						{
							$scope.formControl.diagnosticoCargado = true;
						}
						else
						{
							$scope.formControl.diagnosticoCargado = false;
						}
						controlCarga();
					});
			}


			function controlCarga() {
				if($scope.formData.tipoInternacion != '' && 
					$scope.formData.informeMedico != '' && 
					$scope.formControl.diagnosticoCargado && 
					$scope.formData.tipoInternacion != '')
				{
					$scope.formControl.aceptar = true;
				}
				else
				{
					$scope.formControl.aceptar = false;
				}
			}

			function darAlta() {
				$scope.data.prescripcion.id_usuario_alta = $scope.data.usuario.Id;
				$scope.data.prescripcion.id_tipo_alta = $scope.formData.tipoAlta.id_tipo_alta_internacion;

				if($scope.formControl.internacion)
				{
					GuardiaAtencionDataService.newAlta($scope.data.prescripcion.Id, $scope.formData.tipoAlta.Id, 
						$scope.formData.tipoInternacion.id_tipo_internacion, $scope.formData.informeMedico, 
						$scope.formData.diagnostico.id_cie_enfermedad, $scope.formData.tipoHabitacion.id_tipo_habitacion)
					.then(function () {
						$uibModalInstance.close();
						AlertaService.NewSuccess("Alta Realizada");
					},
					function (pError) {
						// AlertaService.error(pError.message);
						$scope.formControl.loading = false;
						$log.error('PrescripcionAltaController: AltaInternacion ERROR.-', pError);
					});
				}
				else
				{
					GuardiaAtencionDataService.newAlta($scope.data.prescripcion.Id, $scope.formData.tipoAlta.Id,"0",0,"0",0)
					.then(function () {
						$uibModalInstance.close();
						AlertaService.NewSuccess("Alta Realizada");
						// $location.path(ACTION_ATENCION.LIST);
					},
					function (pError) {
						// AlertaService.error(pError.message);
						$scope.formControl.loading = false;
						$log.error('PrescripcionAltaController: AltaInternacion ERROR.-', pError);
					});
				}
			}

			function cancel () {
				$uibModalInstance.dismiss('cancel');
			}


			/* ------------------------------ ACTIVATE ------------------------------ */

			activate();

			/* Método inicializador */
			function activate () {
				$log.debug('PrescripcionAltaController: Inicializar ON.-');
				inicializarVariables();

				// vm.formControl.loading = true;

				$q.all([
					GuardiaAtencionDataService.getTipoAlta(),
					GuardiaAtencionDataService.getUsuarioByNombre(GuardiaAtencionDataService.usuario.userName),
					GuardiaAtencionDataService.getAllTipoInternacion()
				])
				.then(activateOk, activateError);
			}

			function activateOk (pResult) {
				$scope.data.tiposAlta = pResult[0];
				$scope.data.usuario = pResult[1];
				$scope.data.tiposInternacion = pResult[2];
				$scope.formControl.loading = false;
			}

			function activateError () {
				$scope.formControl.loading = false;
				$scope.formControl.error = true;
			}
		}
	};

	return module;
})();