/**
 * @author:			Pedro Ferrer
 * @description:	Cuentas Por Defecto
 * @type:			Controller
 **/
export default (function(){
	const module = { init : (ngModule: any) => {} };

	module.init = function (module) {

		module.controller('CuentasController', CuentasController);

		CuentasController.$inject = ['Logger', '$filter', '$state', 'ModalService', '$scope', 'ContratosInternosDataService', 'ContratosInternosLogicService', 'DateUtils'];

		function CuentasController ($log, $filter, $state, ModalService, $scope, ContratosInternosDataService, ContratosInternosLogicService, DateUtils) {

			/* ------------------------------------------------ LOG ------------------------------------------------ */

			$log = $log.getInstance('CuentasController');
			/* ----------------------------------------- API Y VARIABLESES ----------------------------------------- */

            var vm = this;
            
			vm.data = {
				cuentas : ''
			};

			vm.formControl = {		
				editarCuenta : editarCuenta,
				borrarCuenta : borrarCuenta,
				loading : false
			};

			/* ------------------------------------------- IMPLEMENTACIÓN ------------------------------------------- */

			/* FORMULARIO */
			function editarCuenta (idCuenta, numeroCuenta){
				if($scope.$parent.vm.data.contratoEdit.Id > 0){
					$scope.$parent.vm.data.contratoEdit.Desde = DateUtils.parseToFe($scope.$parent.vm.filter.desde);
					$scope.$parent.vm.data.contratoEdit.Hasta = DateUtils.parseToFe($scope.$parent.vm.filter.hasta);
					ContratosInternosLogicService.editarCuenta(idCuenta, numeroCuenta, $scope.$parent.vm.data.contratoEdit.Id, $scope.$parent.vm.filter.contratableElegido)
					.then(function(result){
						if(result.IsOk===true){
							agregarCuenta(idCuenta, result.ListDto);
						}
					});
				}
				else{
					ContratosInternosLogicService.guardarContrato($scope.$parent.vm.data.contratoEdit, $scope.$parent.vm.filter.contratableElegido, $scope.$parent.vm.filter.desde, $scope.$parent.vm.filter.hasta)
					.then(function(result){
						if(result.IsOk===true){
							$scope.$parent.vm.data.contratoEdit.Id = result.IdEntidadValidada;
							ContratosInternosLogicService.editarCuenta(null, null, result.IdEntidadValidada, $scope.$parent.vm.filter.contratableElegido)
							.then(function(cuenta){
								agregarCuenta(idCuenta, cuenta);
							});
						}
					});
				}
			}

			function agregarCuenta(idCuenta, cuenta){
				if(idCuenta===null){
					vm.data.cuentas.Rows.push(cuenta);
				}
				else{
					for (var i = vm.data.cuentas.Rows.length - 1; i >= 0; i--) {
						if(vm.data.cuentas.Rows[i].Id === cuenta.Id)
						{
							vm.data.cuentas.Rows[i] = cuenta;
							break;
						}
					}
				}
				vm.data.cuentas.Rows = $filter('orderBy')(vm.data.cuentas.Rows, '+Ponderacion');
			}

			function borrarCuenta (fila){
				ModalService.confirm('¿Desea eliminar la cuenta?',
				function (pResult) {
					if (pResult) {
						ContratosInternosDataService.EliminarCuentaContratoPorId(fila.Id)
						.then(function (result) {
							if (result.IsOk === false) {
								ModalService.warning("Verifique por favor. " + result.Message);
							}
							else {
								for (var i = $scope.$parent.vm.data.contratoEdit.ConfiguracionesDeCuenta.Rows.length - 1; i >= 0; i--) {
									if($scope.$parent.vm.data.contratoEdit.ConfiguracionesDeCuenta.Rows[i].Id == fila.Id){
										$scope.$parent.vm.data.contratoEdit.ConfiguracionesDeCuenta.Rows.splice(i, 1);
										ModalService.success("La cuenta ha sido eliminada.");
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
				vm.data.cuentas = $scope.$parent.vm.data.contratoEdit.ConfiguracionesDeCuenta;
				vm.formControl.loading = false;
			}

		}
	};

	return module;
})();