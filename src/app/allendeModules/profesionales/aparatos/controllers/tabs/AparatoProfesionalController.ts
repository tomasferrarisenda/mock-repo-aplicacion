/**
 * @author:			Pedro Ferrer
 * @description:	Participaciones
 * @type:			Controller
 **/
import { IProfesionalesDataService } from '../../../../profesionales';

export default (function(){
	const module = { init : (ngModule: any) => {} };

	module.init = function (module) {

		module.controller('AparatoProfesionalController', AparatoProfesionalController);

		AparatoProfesionalController.$inject = ['Logger', '$state', 'ModalService', '$scope', 'AparatosDataService', 'AparatoLogicService',
			'ProfesionalesDataService'];

		function AparatoProfesionalController ($log, $state, ModalService, $scope, AparatosDataService, AparatoLogicService,
			ProfesionalesDataService: IProfesionalesDataService) {

			/* ------------------------------------------------ LOG ------------------------------------------------ */

			$log = $log.getInstance('AparatoProfesionalController');
			/* ----------------------------------------- API Y VARIABLESES ----------------------------------------- */

            var vm = this;
            
			vm.data = {
				configuraciones : ''
			};

			vm.filter = {
				profesionalDefecto : ''
			}

			vm.formControl = {
				loading : false,
				editarConfiguracion : editarConfiguracion,
				borrarConfiguracion : borrarConfiguracion

			};

			/* ------------------------------------------- IMPLEMENTACIÓN ------------------------------------------- */

			/* FORMULARIO */
			$scope.$watch(function() {
				return vm.filter.profesionalDefecto;
			}, function() {
				$scope.$parent.vm.data.aparato.IdProfesionalPorDefecto = vm.filter.profesionalDefecto ? vm.filter.profesionalDefecto.Id : 0;
				//$scope.$parent.vm.data.aparato.NumeroMatricula = vm.filter.profesionalDefecto ? vm.filter.profesionalDefecto.numero_matricula : 0;
			});
			
			function editarConfiguracion(idConfiguracion, numeroMatricula){
				if($scope.$parent.vm.data.aparato.Id > 0){
					AparatoLogicService.editarConfiguracion(idConfiguracion, numeroMatricula, $scope.$parent.vm.data.aparato.Id, $scope.$parent.vm.data.aparato.IdTipoRecurso)
					.then(function(result){
						if(result.IsOk===true){
							agregarConfiguracion(idConfiguracion, result.Configuracion);
						}
					});
				}
				else{
					AparatoLogicService.guardarAparato($scope.$parent.vm.data.aparato)
					.then(function(result){
						if(result.IsOk===true){
							$scope.$parent.vm.data.aparato.Id = result.AparatoViewDto.Id;
							AparatoLogicService.editarConfiguracion(null, null, result.AparatoViewDto.Id, result.AparatoViewDto.IdTipoRecurso)
							.then(function(result){
								agregarConfiguracion(idConfiguracion, result.Configuracion);
							});
						}
					});
				}
			}

			function agregarConfiguracion(idConfiguracion, configuracion){
				if(idConfiguracion===null){
					vm.data.configuraciones.Rows.push(configuracion);
				}
				else{
					for (var i = vm.data.configuraciones.Rows.length - 1; i >= 0; i--) {
						if(vm.data.configuraciones.Rows[i].Id === configuracion.Id)
						{
							vm.data.configuraciones.Rows[i] = configuracion;
							break;
						}
					}
				}
			}

			function borrarConfiguracion (fila){
				ModalService.confirm('¿Desea eliminar la configuración?',
				function (pResult) {
					if (pResult) {
						AparatosDataService.EliminarConfiguracionPorId(fila.Id)
						.then(function (result) {
							if (result.IsOk === false) {
								ModalService.warning("Verifique por favor. " + result.Message);
							}
							else {
								for (var i = $scope.$parent.vm.data.aparato.Configuraciones.Rows.length - 1; i >= 0; i--) {
									if($scope.$parent.vm.data.aparato.Configuraciones.Rows[i].Id == fila.Id){
										$scope.$parent.vm.data.aparato.Configuraciones.Rows.splice(i, 1);
										ModalService.success("La configuración ha sido eliminada.");
										break;
									}
								}
							}
						})
						.catch(function (pError) {
							ModalService.error("Error en el servidor.", pError.message);
							return;
						});
					}
				});
			}

			/* ---------------------------------------------- ACTIVATE ---------------------------------------------- */

			activate();
			function activate () {
				vm.formControl.loading = true;
				vm.data.configuraciones = $scope.$parent.vm.data.aparato.Configuraciones;

				if($scope.$parent.vm.data.aparato === ""){
					$state.go('profesionales.aparatos.edit.general');
					return;
				}

				if($scope.$parent.vm.data.aparato.IdProfesionalPorDefecto !== 0){
					ProfesionalesDataService.ProfesionalObtenerPorMatricula($scope.$parent.vm.data.aparato.IdProfesionalPorDefecto).then(function(profesional){
						vm.filter.profesionalDefecto = profesional;
					});
				}
				vm.formControl.loading = false;
			}
		}
	};

	return module;
})();