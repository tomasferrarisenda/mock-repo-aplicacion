/**
 * @author:			Jorge Basiluk
 * @description:	Seguros
 * @type:			Controller
 **/
import { IProfesionalesDataService } from '../../services';

export default (function(){
	const module = { init : (ngModule: any) => {} };

	module.init = function (module) {

		module.controller('SegurosProfesionalEditController', SegurosProfesionalEditController);

		SegurosProfesionalEditController.$inject = ['Logger', '$scope', 'ModalService',
			'ProfesionalesDataService', 'ProfesionalesLogicService'];

		function SegurosProfesionalEditController ($log, $scope, ModalService,
			ProfesionalesDataService: IProfesionalesDataService, ProfesionalesLogicService) {

			/* ----------------------------------------- API Y VARIABLESES ----------------------------------------- */
			var vm = this;

			vm.data = {
				seguros : [],
				idProfesional : null
            };
            
            vm.formControl = {
				buscarPagina : buscarPagina,
				editar : editar,
				borrar : borrar,
				loading : false
            }

            function buscarPagina(pPagination) {
                vm.filter.currentPage = pPagination.currentPage;
                var currentPage = pPagination.currentPage;
                var pageSize = pPagination.pageSize || 10;
            }

			/* FORMULARIO */
			function editar (id){
				if($scope.$parent.vm.data.profesionalEdit.Id > 0){
					ProfesionalesLogicService.editarSeguro(id, $scope.$parent.vm.data.profesionalEdit.Id)
					.then(function(result){
						if(result.IsOk===true){
							agregar(id, result.SeguroDelProfesional);
						}
					});
				}
				else{
					ProfesionalesLogicService.guardarProfesional($scope.$parent.vm.data.profesionalEdit)
					.then(function(result){
						if(result.IsOk===true){
							$scope.$parent.vm.data.profesionalEdit.Id = result.SeguroDelProfesional.Id;
							ProfesionalesLogicService.editar(result.SeguroDelProfesional.Id)
							.then(function(seguro){
								agregar(id, seguro);
							});
						}
					});
				}
			}

			function agregar(id, seguro){
				if(id===null){
					vm.data.seguros.Rows.push(seguro);
				}
				else{
					for (var i = vm.data.seguros.Rows.length - 1; i >= 0; i--) {
						if(vm.data.seguros.Rows[i].Id === seguro.Id)
						{
							vm.data.seguros.Rows[i] = seguro;
							break;
						}
					}
				}
			}

			function borrar (fila){
				ModalService.confirm('¿Desea eliminar el Seguro?',
				function (pResult) {
					if (pResult) {
						ProfesionalesDataService.EliminarSeguroDelProfesionalPorId(fila.Id)
						.then(function (result) {
							if (result.IsOk === false) {
								ModalService.warning("Verifique por favor. " + result.Message);
							}
							else {
								for (var i = $scope.$parent.vm.data.profesionalEdit.Seguros.Rows.length - 1; i >= 0; i--) {
									if($scope.$parent.vm.data.profesionalEdit.Seguros.Rows[i].Id == fila.Id){
										$scope.$parent.vm.data.profesionalEdit.Seguros.Rows.splice(i, 1);
										ModalService.success("El seguro ha sido eliminadp.");
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
				vm.data.seguros = $scope.$parent.vm.data.profesionalEdit.Seguros;
				vm.data.idProfesional = $scope.$parent.vm.data.profesionalEdit.Id;
			}
		}
	};

	return module;
})();