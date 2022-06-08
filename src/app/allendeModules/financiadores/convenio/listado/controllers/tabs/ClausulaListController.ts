/**
 * @author:			Pedro Ferrer
 * @description:	ClausulaListController
 * @type:			Controller
 **/
export default (function(){
	const module = { init : (ngModule: any) => {} };

	module.init = function (module) {

		module.controller('ClausulaListController', ClausulaListController);

		ClausulaListController.$inject = ['Logger', '$state', 'ModalService', 'User', '$scope', '$stateParams', 'ConvenioDataService', 
			'DateUtils', 'ConvenioLogicService'];

		function ClausulaListController ($log, $state, ModalService, User, $scope, $stateParams, ConvenioDataService, 
			DateUtils, ConvenioLogicService) {

			/* ------------------------------------------------ LOG ------------------------------------------------ */

			$log = $log.getInstance('ClausulaListController');
			/* ----------------------------------------- API Y VARIABLESES ----------------------------------------- */

			var vm = this;
			vm.today = new Date();
			
			vm.data = {
				clausulas : '',
				tiposConsecuencia : null
			};

			vm.formData = {
			};

			vm.filter = {
				tipoConsecuenciaElegido : null
			};

			vm.formControl = {
				editarClausula : editarClausula,
				borrarClausula : borrarClausula,
				filter : filter,
				loading : false
			};

			/* ------------------------------------------- IMPLEMENTACIÓN ------------------------------------------- */

			/* FORMULARIO */
			function editarClausula(row){
				if($scope.$parent.vm.data.convenioEdit.Id > 0){
					$state.go('financiadores.convenios.clausulaEdit',
					{
						convenioEdit : $scope.$parent.vm.data.convenioEdit,
						idClausulaEdit : row ? row.Id : null,
						vigenciaDesde : $scope.$parent.vm.filter.vigenciaDesde,
						vigenciaHasta : $scope.$parent.vm.filter.vigenciaHasta,
						estadoConvenio : $scope.$parent.vm.filter.estadoConvenio.Nombre
					});
				}
				else{
					ConvenioLogicService.guardarConvenio($scope.$parent.vm.data.convenioEdit, $scope.$parent.vm.filter.mutualElegida, $scope.$parent.vm.filter.vigenciaDesde, $scope.$parent.vm.filter.vigenciaHasta, $scope.$parent.vm.filter.estadoConvenio.Id)
					.then(function(result){
						if(result.IsOk===true){
							$scope.$parent.vm.data.convenioEdit = result.Entidad;
							$state.go('financiadores.convenios.clausulaEdit',
							{
								convenioEdit : $scope.$parent.vm.data.convenioEdit,
								idClausulaEdit : row ? row.Id : null,
								vigenciaDesde : $scope.$parent.vm.filter.vigenciaDesde,
								vigenciaHasta : $scope.$parent.vm.filter.vigenciaHasta,
								estadoConvenio : $scope.$parent.vm.filter.estadoConvenio.Nombre
							});
						}
					});
				}
			}

			function borrarClausula (fila){
				ModalService.confirm('¿Desea eliminar la cláusula #'+ fila.Id + '?',
				function (pResult) {
					if (pResult) {
						ConvenioDataService.EliminarClausulaDeConvenio(fila)
						.then(function (result) {
							if (result.IsOk === false) {
								ModalService.warning(result.Message);
							}
							else {
								for (var i = $scope.$parent.vm.data.convenioEdit.Clausulas.Rows.length - 1; i >= 0; i--) {
									if($scope.$parent.vm.data.convenioEdit.Clausulas.Rows[i].Id == fila.Id){
										vm.data.clausulas.Rows.splice(i,1);
										break;
									}
								}
								ModalService.success("La cláusula ha sido eliminada.");
							}
						})
						.catch(function (pError) {
							ModalService.error("Error en el servidor.", pError.message);
							return;
						});
					}
				});
			}

			function filter(row){
				return vm.filter.tipoConsecuenciaElegido 
					? row.data.Consecuencia.indexOf(vm.filter.tipoConsecuenciaElegido.Nombre + " ->") !== -1 
					: true;
			}

			/* ---------------------------------------------- ACTIVATE ---------------------------------------------- */

			activate();

			function activate () {
				vm.formControl.loading = true;
				ConvenioDataService.ObtenerTiposConsecuencia().then(function(tipos){
					vm.data.tiposConsecuencia = tipos;
				});
				vm.data.clausulas = $scope.$parent.vm.data.convenioEdit.Clausulas;
				vm.formControl.loading = false;
			}
		}
	};

	return module;
})();