import * as angular from 'angular';
import { ICredentialsDataService } from 'core/security';

export default (function () {
	'use strict';
	const module = { init : (ngModule: any) => {} };

	module.init = function (module) {

		module.controller('PrescripcionViewController', PrescripcionViewController);

		PrescripcionViewController.$inject = ['$scope', '$log', '$q', '$filter', '$state', 'AlertaService',
		'TITLE_ATENCION', 'ACTION_ATENCION', 'GuardiaAtencionDataService', 'GuardiaAtencionLogicService',
		'CredentialsDataService', '$uibModalInstance','SecurityLogicService'];

		function PrescripcionViewController ($scope, $log, $q, $filter,$state, AlertaService,
			TITLE_ATENCION, ACTION_ATENCION,  GuardiaAtencionDataService, GuardiaAtencionLogicService,
			CredentialsDataService: ICredentialsDataService , $uibModalInstance,SecurityLogicService) {

			$log.debug('PrescripcionViewController: ON.-');

			/* ------------------------------ API Y VARIABLES ------------------------------ */
			
			var vm = this;
			vm.template = 'guardia/atencion/templates/detalle_prescripcion.tpl.html';

			$scope.title = {
				module: TITLE_ATENCION.MODULE,
				page: TITLE_ATENCION.NEW_MEDICAMENTO
			};

			$scope.formData = {
				detalle: ''
			};

			$scope.data = {
				prescripcion: []
			};

			$scope.formControl = {
				error: true,
				loading: false,
				alta: false,


				colorearPrioridad: colorearPrioridad,
				verMedicamentos: verMedicamentos,
				reloadPage: activate,
				ok : realizarPrescripcion,
				cancel : cancel,
				darAlta : darAlta,
				verFojas : verFojas
			};

			/* ------------------------------ IMPLEMENTACIÓN ------------------------------ */

			function inicializarVariables () {
				$scope.data.prescripcion = GuardiaAtencionDataService.prescripcion;
				GuardiaAtencionDataService.clavePaciente = $scope.data.prescripcion.IdPaciente;
				$scope.formControl.alta = true;
				$log.debug("prescripcion",$scope.data.prescripcion);
				for (var i = 0; i < $scope.data.prescripcion.Detalles.length; i++) {
					if($scope.data.prescripcion.Detalles[i].IdEstado == 1)
					{
						$scope.formControl.alta = false;
					}
					else
					{
						// $scope.data.prescripcion.Detalles[i].Prioridad.nombre_prioridad_prescripcion = 'REALIZADA';
					}
					if($scope.data.prescripcion.Detalles[i].observacion_enfermeria != '' && 
						$scope.data.prescripcion.Detalles[i].observacion_enfermeria != null)
					{
						$scope.data.prescripcion.Detalles[i].observacionEnfermeria = true;
					}
					if($scope.data.prescripcion.Detalles[i].observacion_medica != '' && 
						$scope.data.prescripcion.Detalles[i].observacion_medica != null)
					{
						$scope.data.prescripcion.Detalles[i].observacionMedica = true;
					}
				}
				
			}

			function login(pDestino) {
				GuardiaAtencionDataService.getUbicacionBySucursal(GuardiaAtencionDataService.sucursal) 
					.then(function (pUbicacion) {
						GuardiaAtencionDataService.ubicacion = pUbicacion;
					});
				SecurityLogicService.OpenLogin()
					.then(function () {
						GuardiaAtencionDataService.login = true;
						$scope.data.user = CredentialsDataService.GetForce();
						$log.debug('Login correcto',$scope.data.user);
						GuardiaAtencionDataService.usuario = $scope.data.user;
						GuardiaAtencionDataService.prescripcion = $scope.data.prescripcion;
						redirect(pDestino);
					});
			}

			function redirect(pDestino) {
				$log.debug("redirect",pDestino);
				var sinPermisos = true;

				switch(pDestino){
					case "Carga":
						for (var i = $scope.data.user.permisos.length - 1; i >= 0; i--) {
							switch($scope.data.user.permisos[i].Id) {

								case 26:
									$uibModalInstance.close();
									sinPermisos = false;
									$state.go('guardia.atencion.new');
									break;
								case 28:
									$uibModalInstance.close();
									sinPermisos = false;
									$state.go('guardia.atencion.edit');
									break;
							}
						}
						if(sinPermisos)
						{
							AlertaService.NewWarning("No posee permisos para realizar cargas");
						}
					break;

					case "Alta":
						$log.debug('user',$scope.data.user);
						for (var i = $scope.data.user.permisos.length - 1; i >= 0; i--) {
							switch($scope.data.user.permisos[i].Id) {

								case 205:
									$log.debug("entro case");	
									sinPermisos = false;
									$uibModalInstance.close('Alta');
									break;
							}
						}
						if(sinPermisos)
						{
							AlertaService.NewWarning("No posee permisos para dar Alta");
						}
					break;

					case "Foja":
						for (var i = $scope.data.user.permisos.length - 1; i >= 0; i--) {
							switch($scope.data.user.permisos[i].Id) {

								case 202:
									$uibModalInstance.close();
									sinPermisos = false;
									$state.go('guardia.atencion.foja');
								break;
							}
						}
						if(sinPermisos)
						{
							AlertaService.NewWarning("No posee permisos para cargar foja");
						}
					break;

				}
				
				
			}
			

			function realizarPrescripcion () {
				login("Carga");
			}

			function darAlta() {
				login("Alta");
			}

			function verFojas() {
				login("Foja");
			}

			function cancel () {
				$uibModalInstance.dismiss('cancel');
			}

			function verMedicamentos(pIndex) {
				if($scope.data.prescripcion.Detalles[pIndex].Materiales.length == 0)
				{
					$log.debug("no materiales");
					$scope.data.prescripcion.Detalles[pIndex].noMateriales = true;
				}
				// for (var i = 0; i < $scope.data.prescripcion.Detalles[pIndex].Materiales.length; i++) {
				// 	getMaterial($scope.data.prescripcion.Detalles[pIndex].Materiales[i],pIndex,i);
				// }
				if(!$scope.data.prescripcion.Detalles[pIndex].verMateriales)
				{
					$scope.data.prescripcion.Detalles[pIndex].verMateriales = true;
				}
				else
				{
					$scope.data.prescripcion.Detalles[pIndex].verMateriales = false;
				}
				if($scope.data.prescripcion.Detalles[pIndex].Materiales.length == 0)
				{
					$scope.data.prescripcion.Detalles[pIndex].noMateriales = true;
				}
				$log.debug('detalle',$scope.data.prescripcion.Detalles[pIndex]);
			}
			

			function colorearPrioridad(pPrioridad) {
				return GuardiaAtencionLogicService.colorearPrioridad(pPrioridad);
			}


			/* ------------------------------ ACTIVATE ------------------------------ */

			activate();

			/* Método inicializador */
			function activate () {
				$log.debug('PrescripcionViewController: Inicializar ON.-');
				inicializarVariables();

			// 	vm.formControl.loading = true;

			// 	$q.all([
			// 		GuardiaAtencionDataService.getAllMedicamentos()
			// 	])
			// 	.then(activateOk, activateError)
			}

		}
	};

	return module;
})();