/**
 * @author:			Pedro Ferrer
 * @description:	ListaFacturacionMutual
 * @type:			Controller
 **/
export default (function () {
	const module = { init: (ngModule: any) => { } };

	module.init = function (module) {

		module.controller('ListaFacturacionEditController', ListaFacturacionEditController);

		ListaFacturacionEditController.$inject = ['Logger', '$scope', 'MutualGestionDataService', 'MutualGestionLogicService', 'ModalService', 'AlertaService', '$state'];

		function ListaFacturacionEditController($log, $scope, MutualGestionDataService, MutualGestionLogicService, ModalService, AlertaService, $state) {

			$log = $log.getInstance('ListaFacturacionEditController');

			/* ----------------------------------------- API Y VARIABLESES ----------------------------------------- */
			var vm = this;

			vm.data = {
				listasMutual: ''
			};

			vm.formControl = {
				editarListaFacturacion: editarListaFacturacion,
				eliminar: eliminar
			};

			function editarListaFacturacion(idListaFacturacion: number, index: number) {
				if ($scope.$parent.vm.data.mutual.Id === 0) {
					MutualGestionLogicService.guardarMutual($scope.$parent.vm.data.mutual).then((result) => {
						$scope.$parent.vm.data.mutual.Id = result.IdEntidadValidada;
						$state.go('financiadores.mutual.listaFacturacion', {
							mutualEdit: $scope.$parent.vm.data.mutual,
							idListaEdit: idListaFacturacion
						});
					});
				}
				else {
					$state.go('financiadores.mutual.listaFacturacion', {
						mutualEdit: $scope.$parent.vm.data.mutual,
						idListaEdit: idListaFacturacion
					});
				}
			}

			function eliminar(fila: any, index: number) {
				ModalService.confirm('¿Desea eliminar la lista ' + fila.Nombre + '?', (pResult) => {
					if (pResult) {
						MutualGestionDataService.EliminarListaFacturacion(fila.Id).then((result) => {
							if (result.IsOk === false) {
								AlertaService.NewWarning("Por favor verifique:" + result.Message);
							}
							else {
								if (vm.data.listasMutual.Rows) {
									for (let i = 0; i < vm.data.listasMutual.Rows.length; i++) {
										if (vm.data.listasMutual.Rows[i].Id === fila.Id) {
											vm.data.listasMutual.Rows.splice(i, 1);
											AlertaService.NewSuccess("La lista ha sido eliminada.");
											break;
										}
									}
								}
							}
						})
							.catch((pError) => {
								AlertaService.NewError("Error en el servidor.", pError.message);
								return;
							});
					}
				});
			}

			/* ---------------------------------------------- ACTIVATE ---------------------------------------------- */

			activate();
			function activate() {
				vm.data.listasMutual = $scope.$parent.vm.data.mutual.ListasMutual;
			}
		}
	};

	return module;
})();