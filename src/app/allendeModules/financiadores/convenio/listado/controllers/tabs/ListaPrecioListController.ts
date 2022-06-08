/**
 * @author:			Pedro Ferrer
 * @description:	ListaPrecioList
 * @type:			Controller
 **/
export default (function(){
	const module = { init : (ngModule: any) => {} };

	module.init = function (module) {

		module.controller('ListaPrecioListController', ListaPrecioListController);

		ListaPrecioListController.$inject = ['Logger', '$state', 'ModalService', 'User', '$scope', 'ConvenioLogicService', 'ConvenioDataService'];

		function ListaPrecioListController ($log, $state, ModalService, User, $scope, ConvenioLogicService, ConvenioDataService) {

			/* ------------------------------------------------ LOG ------------------------------------------------ */

			$log = $log.getInstance('ListaPrecioListController');
			/* ----------------------------------------- API Y VARIABLESES ----------------------------------------- */

			var vm = this;
			vm.today = new Date();

			vm.data = {
				listas : ''
			};

			vm.formData = {
			};

			vm.formControl = {
				editarListaPrecio : editarListaPrecio,
				borrarListaPrecio : borrarListaPrecio,
				loading : false
			};

			/* ------------------------------------------- IMPLEMENTACIÓN ------------------------------------------- */

			/* FORMULARIO */
			function editarListaPrecio (row){
				if($scope.$parent.vm.data.convenioEdit.Id > 0){
					$state.go('financiadores.convenios.listaPrecioEdit',
					{
						convenioEdit : $scope.$parent.vm.data.convenioEdit,
						idListaEdit : row ? row.Id : null,
						vigenciaDesde : $scope.$parent.vm.filter.vigenciaDesde,
						vigenciaHasta : $scope.$parent.vm.filter.vigenciaHasta,
						estadoConvenio : $scope.$parent.vm.filter.estadoConvenio.Nombre
					});
				}
				else{
					//, normativas, aplicaADAC, listaADAC
					ConvenioLogicService.guardarConvenio($scope.$parent.vm.data.convenioEdit, $scope.$parent.vm.filter.mutualElegida, $scope.$parent.vm.filter.vigenciaDesde, $scope.$parent.vm.filter.vigenciaHasta, $scope.$parent.vm.filter.estadoConvenio.Id)
					.then(function(result){
						if(result.IsOk===true){
							$scope.$parent.vm.data.convenioEdit = result.Entidad;
							$state.go('financiadores.convenios.listaPrecioEdit',
							{
								convenioEdit : $scope.$parent.vm.data.convenioEdit,
								idListaEdit : row ? row.Id : null,
								vigenciaDesde : $scope.$parent.vm.filter.VigenciaDesde,
								vigenciaHasta : $scope.$parent.vm.filter.VigenciaHasta,
								estadoConvenio : $scope.$parent.vm.filter.estadoConvenio.Nombre
							});
						}
					});
				}
			}

			function borrarListaPrecio (fila){
				ModalService.confirm('¿Desea eliminar la lista '+ fila.NombreLista + '?',
				function (pResult) {
					if (pResult) {
						ConvenioDataService.EliminarListaPreciosConvenioPorId(fila.Id)
						.then(function (result) {
							if (result.IsOk === false) {
								ModalService.warning("Por favor verifique:" + result.Message);
							}
							else {
								for (var i = $scope.$parent.vm.data.convenioEdit.ListasPrecios.Rows.length - 1; i >= 0; i--) {
									if($scope.$parent.vm.data.convenioEdit.ListasPrecios.Rows[i].Id == fila.Id){
										vm.data.listas.Rows.splice(i,1);
										break;
									}
								}
				 				ModalService.success("La lista ha sido eliminada.");
							}
						})
				 	}
				});
			}

			/* ---------------------------------------------- ACTIVATE ---------------------------------------------- */

			activate();

			function activate () {
				vm.formControl.loading = true;
				vm.data.listas = $scope.$parent.vm.data.convenioEdit.ListasPrecios;
				vm.formControl.loading = false;
			}

		}
	};

	return module;
})();