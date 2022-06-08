/**
 * @author:			Pedro Ferrer
 * @description:	UnidadArancelariaList
 * @type:			Controller
 **/
export default (function(){
	const module = { init : (ngModule: any) => {} };

	module.init = function (module) {

		module.controller('UnidadArancelariaListController', UnidadArancelariaListController);

		UnidadArancelariaListController.$inject = ['Logger', '$state', 'ModalService', 'User', '$scope', 'ConvenioDataService', 'ConvenioLogicService', 'DateUtils'];

		function UnidadArancelariaListController ($log, $state, ModalService, User, $scope, ConvenioDataService, ConvenioLogicService, DateUtils) {

			/* ------------------------------------------------ LOG ------------------------------------------------ */

			$log = $log.getInstance('UnidadArancelariaListController');
			/* ----------------------------------------- API Y VARIABLESES ----------------------------------------- */

			var vm = this;
			vm.today = new Date();

			vm.data = {
				unidades : ''
			};

			vm.formData = {
			};

			vm.formControl = {		
				editarUnidad : editarUnidad,
				borrarUnidad : borrarUnidad,
				loading : false
			};

			/* ------------------------------------------- IMPLEMENTACIÓN ------------------------------------------- */

			/* FORMULARIO */
			function editarUnidad (idUnidad){
				if($scope.$parent.vm.data.convenioEdit.Id > 0){
					$scope.$parent.vm.data.convenioEdit.VigenciaDesde = DateUtils.parseToFe($scope.$parent.vm.filter.vigenciaDesde);
					$scope.$parent.vm.data.convenioEdit.VigenciaHasta = DateUtils.parseToFe($scope.$parent.vm.filter.vigenciaHasta);
					ConvenioLogicService.editarUnidadArancelaria(idUnidad)
					.then(function(unidad){
						agregarUnidad(idUnidad, unidad);
					});
				}
				else{
					ConvenioLogicService.guardarConvenio($scope.$parent.vm.data.convenioEdit, $scope.$parent.vm.filter.mutualElegida, $scope.$parent.vm.filter.vigenciaDesde, $scope.$parent.vm.filter.vigenciaHasta, $scope.$parent.vm.filter.estadoConvenio.Id)
					.then(function(result){
						if(result.IsOk===true){
							ConvenioLogicService.editarUnidadArancelaria(null)
							.then(function(unidad){
								agregarUnidad(idUnidad, unidad);
							});
						}
					});
				}
			}

			function agregarUnidad(idUnidad, unidad){
				if(idUnidad===null){
					vm.data.unidades.Rows.push(unidad);
				}
				else{
					for (var i = vm.data.unidades.Rows.length - 1; i >= 0; i--) {
						if(vm.data.unidades.Rows[i].Id === unidad.Id)
						{
							vm.data.unidades.Rows[i] = unidad;
							break;
						}
					}
				}
			}

			function borrarUnidad (fila){
				ModalService.confirm('¿Desea eliminar la unidad arancelaria '+ fila.NombreUnidad + '?',
				function (pResult) {
					if (pResult) {
						ConvenioDataService.EliminarUnidadArancelariaConvenioPorId(fila.Id)
						.then(function (result) {
							if (result.IsOk === false) {
								ModalService.warning("Verifique por favor. " + result.Message);
							}
							else {
								for (var i = $scope.$parent.vm.data.convenioEdit.UnidadesArancelarias.Rows.length - 1; i >= 0; i--) {
									if($scope.$parent.vm.data.convenioEdit.UnidadesArancelarias.Rows[i].Id == fila.Id){
										$scope.$parent.vm.data.convenioEdit.UnidadesArancelarias.Rows.splice(i, 1);
										ModalService.success("La unidad ha sido eliminada.");
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
				vm.data.unidades = $scope.$parent.vm.data.convenioEdit.UnidadesArancelarias;
				vm.formControl.loading = false;
			}

		}
	};

	return module;
})();