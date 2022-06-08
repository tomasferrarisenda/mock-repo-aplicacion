/**
 * @author:			Jorge Basiluk
 * @description:	Profesional por Defecto
 * @type:			Controller
 **/

export default (function(){
	const module = { init : (ngModule: any) => {} };

	module.init = function (module) {

		module.controller('ProfesionalDefectoEditController', ProfesionalDefectoEditController);

		ProfesionalDefectoEditController.$inject = ['Logger', '$state', 'ModalService', '$scope', 'ProfesionalesDataService', 'ProfesionalesLogicService'];

		function ProfesionalDefectoEditController ($log, $state, ModalService, $scope, ProfesionalesDataService, ProfesionalesLogicService) {

			/* ------------------------------------------------ LOG ------------------------------------------------ */

			$log = $log.getInstance('ProfesionalDefectoEditController');
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
				$scope.$parent.vm.data.profesionalEdit.IdProfesionalPorDefecto = vm.filter.profesionalDefecto ? vm.filter.profesionalDefecto.Id : 0;
			});
			
			function editarConfiguracion(idConfiguracion, numeroMatricula){
				if($scope.$parent.vm.data.profesionalEdit.Id > 0){
					ProfesionalesLogicService.editarConfiguracion(idConfiguracion, numeroMatricula, $scope.$parent.vm.data.profesionalEdit.Id, $scope.$parent.vm.data.profesionalEdit.IdTipoRecurso)
					.then(function(result){
						if(result.IsOk===true){
							agregarConfiguracion(idConfiguracion, result.Configuracion);
						}
					});
				}
				else{
					ProfesionalesLogicService.guardarProfesional($scope.$parent.vm.data.profesionalEdit)
					.then(function(result){
						if(result.IsOk===true){
							$scope.$parent.vm.data.profesionalEdit.Id = result.IdEntidadValidada;
							ProfesionalesLogicService.editarConfiguracion(null, null, result.IdEntidadValidada, $scope.$parent.vm.data.profesionalEdit.IdTipoRecurso)
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
						ProfesionalesDataService.EliminarConfiguracionPorId(fila.Id)
						.then(function (result) {
							if (result.IsOk === false) {
								ModalService.warning("Verifique por favor. " + result.Message);
							}
							else {
								for (var i = $scope.$parent.vm.data.profesionalEdit.Configuraciones.Rows.length - 1; i >= 0; i--) {
									if($scope.$parent.vm.data.profesionalEdit.Configuraciones.Rows[i].Id == fila.Id){
										$scope.$parent.vm.data.profesionalEdit.Configuraciones.Rows.splice(i, 1);
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
				vm.data.configuraciones = $scope.$parent.vm.data.profesionalEdit.Configuraciones;

				if($scope.$parent.vm.data.profesionalEdit === ""){
					$state.go('profesionales.profesionales.edit.general');
					return;
				}

				// if($scope.$parent.vm.data.profesionalEdit.IdProfesionalPorDefecto !== 0){
				// 	ProfesionalesDataService.ProfesionalObtenerPorMatricula($scope.$parent.vm.data.profesionalEdit.IdProfesionalPorDefecto).then(function(profesional){
				// 		vm.filter.profesionalDefecto = profesional;
				// 	});
				// }
				vm.formControl.loading = false;
			}
		}
	};

	return module;
})();