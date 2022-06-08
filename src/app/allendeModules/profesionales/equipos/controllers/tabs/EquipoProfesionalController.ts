/**
 * @author:			Pedro Ferrer
 * @description:	Participaciones
 * @type:			Controller
 **/
import { IProfesionalesDataService } from '../../../profesionales';

export default (function(){
	const module = { init : (ngModule: any) => {} };

	module.init = function (module) {

		module.controller('EquipoProfesionalController', EquipoProfesionalController);

		EquipoProfesionalController.$inject = ['Logger', '$state', 'ModalService', '$scope', 'EquiposDataService', 'EquipoLogicService',
			'ProfesionalesDataService'];

		function EquipoProfesionalController ($log, $state, ModalService, $scope, EquiposDataService, EquipoLogicService,
			ProfesionalesDataService: IProfesionalesDataService) {

			/* ------------------------------------------------ LOG ------------------------------------------------ */

			$log = $log.getInstance('EquipoProfesionalController');
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
				$scope.$parent.vm.data.equipo.IdProfesionalPorDefecto = vm.filter.profesionalDefecto ? vm.filter.profesionalDefecto.Id : 0;
				//$scope.$parent.vm.data.equipo.NumeroMatricula = vm.filter.profesionalDefecto ? vm.filter.profesionalDefecto.numero_matricula : 0;
			});
			
			function editarConfiguracion(idConfiguracion, numeroMatricula){
				if($scope.$parent.vm.data.equipo.Id > 0){
					EquipoLogicService.editarConfiguracion(idConfiguracion, numeroMatricula, $scope.$parent.vm.data.equipo.Id, $scope.$parent.vm.data.equipo.IdTipoRecurso)
					.then(function(result){
						if(result.IsOk===true){
							agregarConfiguracion(idConfiguracion, result.Configuracion);
						}
					});
				}
				else{
					EquipoLogicService.guardarEquipo($scope.$parent.vm.data.equipo)
					.then(function(result){
						if(result.IsOk===true){
							$scope.$parent.vm.data.equipo.Id = result.EquipoViewDto.Id;
							EquipoLogicService.editarConfiguracion(null, null, result.EquipoViewDto.Id, result.EquipoViewDto.IdTipoRecurso)
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
						EquiposDataService.EliminarConfiguracionPorId(fila.Id)
						.then(function (result) {
							if (result.IsOk === false) {
								ModalService.warning("Verifique por favor. " + result.Message);
							}
							else {
								for (var i = $scope.$parent.vm.data.equipo.Configuraciones.Rows.length - 1; i >= 0; i--) {
									if($scope.$parent.vm.data.equipo.Configuraciones.Rows[i].Id == fila.Id){
										$scope.$parent.vm.data.equipo.Configuraciones.Rows.splice(i, 1);
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
				vm.data.configuraciones = $scope.$parent.vm.data.equipo.Configuraciones;

				if($scope.$parent.vm.data.equipo === ""){
					$state.go('profesionales.equipos.edit.general');
					return;
				}

				if($scope.$parent.vm.data.equipo.IdProfesionalPorDefecto !== 0){
					ProfesionalesDataService.ProfesionalObtenerPorMatricula($scope.$parent.vm.data.equipo.IdProfesionalPorDefecto).then(function(profesional){
						vm.filter.profesionalDefecto = profesional;
					});
				}
				vm.formControl.loading = false;
			}
		}
	};

	return module;
})();