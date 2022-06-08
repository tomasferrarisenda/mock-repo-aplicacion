/**
 * @author:			Rodrigo Bassi
 * @description:	Configuracion Factura Directo
 * @type:			Controller
 **/
export default (function () {
	const module = { init: (ngModule: any) => { } };

	module.init = function (module) {

		module.controller('FacturaDirectoController', FacturaDirectoController);

		FacturaDirectoController.$inject = ['Logger', '$filter','$state', 'ModalService', '$scope', 'ContratosInternosDataService', 'ContratosInternosLogicService', 'DateUtils'];

		function FacturaDirectoController($log, $filter, $state, ModalService, $scope, ContratosInternosDataService, ContratosInternosLogicService, DateUtils) {

			/* ------------------------------------------------ LOG ------------------------------------------------ */

			$log = $log.getInstance('FacturaDirectoController');
			/* ----------------------------------------- API Y VARIABLESES ----------------------------------------- */

			var vm = this;

			vm.data = {
				facturacionDirecta: null
			};

			vm.formControl = {
				editarFacturaDirecta: editarFacturaDirecta,
				borrarFacturacionDirecta: borrarFacturacionDirecta,
				loading: false
			};

			/* ------------------------------------------- IMPLEMENTACIÓN ------------------------------------------- */

			/* FORMULARIO */
			function editarFacturaDirecta(idFacturaDirecto, IdContratoInterno) {
				ContratosInternosLogicService.editarFacturaDirecta(idFacturaDirecto, $scope.$parent.vm.data.contratoEdit.Id)
					.then(function (resultado) {
						if (!idFacturaDirecto) {
							vm.data.facturacionDirecta.Rows.push(resultado.ListDto);
						}
						else {
							for (var i = vm.data.facturacionDirecta.Rows.length - 1; i >= 0; i--) {
								if (vm.data.facturacionDirecta.Rows[i].Id === idFacturaDirecto) {
									vm.data.facturacionDirecta.Rows[i] = resultado.ListDto;
									break;
								}
							}
						}
						vm.data.facturacionDirecta.Rows = $filter('orderBy')(vm.data.facturacionDirecta.Rows, '+Ponderacion');
					});
			}


			function borrarFacturacionDirecta(fila) {
				ModalService.confirm('¿Desea eliminar esta configuracion?',
					function (pResult) {
						if (pResult) {
							ContratosInternosDataService.FacturaDirectoEliminarPorId(fila.Id)
								.then(function (result) {
									if (result.IsOk === false) {
										ModalService.warning("Verifique por favor. " + result.Message);
									}
									else {
										for (var i = $scope.$parent.vm.data.contratoEdit.ConfiguracionesFacturaDirecto.Rows.length - 1; i >= 0; i--) {
											if ($scope.$parent.vm.data.contratoEdit.ConfiguracionesFacturaDirecto.Rows[i].Id == fila.Id) {
												$scope.$parent.vm.data.contratoEdit.ConfiguracionesFacturaDirecto.Rows.splice(i, 1);
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

			function activate() {
				//vm.formControl.loading = true;
				//vm.data.facturacionDirecta = $scope.$parent.vm.data.contratoEdit.facturacionDirecta;
				vm.formControl.loading = true;
				vm.data.facturacionDirecta = $scope.$parent.vm.data.contratoEdit.ConfiguracionesFacturaDirecto;
				vm.formControl.loading = false;
				$log.debug("ResultadoFacturacionDirecta", vm.data.facturacionDirecta);

			}
		}
	};

	return module;
})();