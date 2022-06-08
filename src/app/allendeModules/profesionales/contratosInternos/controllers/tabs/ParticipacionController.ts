/**
 * @author:			Pedro Ferrer
 * @description:	Participaciones
 * @type:			Controller
 **/
export default (function(){
	const module = { init : (ngModule: any) => {} };

	module.init = function (module) {

		module.controller('ParticipacionController', ParticipacionController);

		ParticipacionController.$inject = ['Logger', '$filter','$state', 'ModalService', '$scope', 'ContratosInternosDataService', 'ContratosInternosLogicService', 'DateUtils'];

		function ParticipacionController ($log, $filter, $state, ModalService, $scope, ContratosInternosDataService, ContratosInternosLogicService, DateUtils) {

			/* ------------------------------------------------ LOG ------------------------------------------------ */

			$log = $log.getInstance('ParticipacionController');
			/* ----------------------------------------- API Y VARIABLESES ----------------------------------------- */

            var vm = this;
            
			vm.data = {
				participaciones : ''
			};

			vm.formControl = {		
				editarParticipacion : editarParticipacion,
				borrarParticipacion : borrarParticipacion,
				loading : false
			};

			/* ------------------------------------------- IMPLEMENTACIÓN ------------------------------------------- */

			/* FORMULARIO */
			function editarParticipacion (idParticipacion, codigoNomenclador, tipoCodigoNomenclador){
				if($scope.$parent.vm.data.contratoEdit.Id > 0){
					$scope.$parent.vm.data.contratoEdit.Desde = DateUtils.parseToFe($scope.$parent.vm.filter.desde);
					$scope.$parent.vm.data.contratoEdit.Hasta = DateUtils.parseToFe($scope.$parent.vm.filter.hasta);
					ContratosInternosLogicService.editarParticipacion(idParticipacion, $scope.$parent.vm.data.contratoEdit.Id)
					.then(function(result){
						if(result.IsOk===true){
							agregarParticipacion(idParticipacion, result.Porcentaje);
						}
					});
				}
				else{
					ContratosInternosLogicService.guardarContrato($scope.$parent.vm.data.contratoEdit, $scope.$parent.vm.filter.contratableElegido, $scope.$parent.vm.filter.desde, $scope.$parent.vm.filter.hasta)
					.then(function(result){
						if(result.IsOk===true){
							$scope.$parent.vm.data.contratoEdit.Id = result.Porcentaje.Id;
							ContratosInternosLogicService.editarParticipacion(null, $scope.$parent.vm.data.contratoEdit.Id)
							.then(function(participacion){
								agregarParticipacion(idParticipacion, participacion);
							});
						}
					});
				}
			}

			function agregarParticipacion(idParticipacion, participacion){
				if(idParticipacion===null){
					$log.debug("EditarParticipacion ",participacion)
					vm.data.participaciones.Rows.push(participacion);
				}
				else{
					for (var i = vm.data.participaciones.Rows.length - 1; i >= 0; i--) {
						if(vm.data.participaciones.Rows[i].Id === participacion.Id)
						{
							vm.data.participaciones.Rows[i] = participacion;
							break;
						}
					}
				}
				vm.data.participaciones.Rows = $filter('orderBy')(vm.data.participaciones.Rows, '+Ponderacion');
			}

			function borrarParticipacion (fila){
				ModalService.confirm('¿Desea eliminar la participacion?',
				function (pResult) {
					if (pResult) {
						ContratosInternosDataService.EliminarParticipacionContratoPorId(fila.Id)
						.then(function (result) {
							if (result.IsOk === false) {
								ModalService.warning("Verifique por favor. " + result.Message);
							}
							else {
								for (var i = $scope.$parent.vm.data.contratoEdit.Retenciones.Rows.length - 1; i >= 0; i--) {
									if($scope.$parent.vm.data.contratoEdit.Retenciones.Rows[i].Id == fila.Id){
										$scope.$parent.vm.data.contratoEdit.Retenciones.Rows.splice(i, 1);
										ModalService.success("La participacion ha sido eliminada.");
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
				vm.data.participaciones = $scope.$parent.vm.data.contratoEdit.Retenciones;
				vm.formControl.loading = false;
			}
		}
	};

	return module;
})();