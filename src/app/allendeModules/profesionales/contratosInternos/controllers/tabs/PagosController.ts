/**
 * @author:			Pedro Ferrer
 * @description:	Pagos
 * @type:			Controller
 **/
export default (function(){
	const module = { init : (ngModule: any) => {} };

	module.init = function (module) {

		module.controller('PagosController', PagosController);

		PagosController.$inject = ['Logger', '$state', 'ModalService', 'User', '$scope', 'ContratosInternosDataService', 'DateUtils'];

		function PagosController ($log, $state, ModalService, User, $scope, ContratosInternosDataService, DateUtils) {

			/* ------------------------------------------------ LOG ------------------------------------------------ */

			$log = $log.getInstance('PagosController');
			/* ----------------------------------------- API Y VARIABLESES ----------------------------------------- */

			var vm = this;

			vm.data = {
            };
            
            vm.filter = {
				IdBancoElegido : '',
                bancos : '',
                sucursal : null,
                IdTipoCuentaBancoElegido : '',
                cuentas : '',
                numeroCuenta : null,
                cbu : null,
                alias : '',
			};

			vm.formControl = {
				loading : false,
				bancoChange : bancoChange,
                sucursalChange : sucursalChange,
                cuentaChange : cuentaChange,
                numeroCuentaChange : numeroCuentaChange,
                cbuChange : cbuChange,
                aliasChange : aliasChange
			};
			

			/* ------------------------------------------- IMPLEMENTACIÓN ------------------------------------------- */

			function bancoChange(){
				$scope.$parent.vm.data.contratoEdit.IdBanco = vm.filter.IdBancoElegido;
			}

			function sucursalChange(){
				$scope.$parent.vm.data.contratoEdit.Sucursal = vm.filter.sucursal;
			}

			function cuentaChange(){
				$scope.$parent.vm.data.contratoEdit.IdTipoCuentaBanco = vm.filter.IdTipoCuentaBancoElegido;
			}

			function numeroCuentaChange(){
				$scope.$parent.vm.data.contratoEdit.NumeroCuentaBanco = vm.filter.numeroCuenta;
			}

			function cbuChange(){
				$scope.$parent.vm.data.contratoEdit.Cbu = vm.filter.cbu;
			}

			function aliasChange(){
				$scope.$parent.vm.data.contratoEdit.AliasCbu = vm.filter.alias;
			}
			/* ---------------------------------------------- ACTIVATE ---------------------------------------------- */

			activate();

			function activate () {
				vm.formControl.loading = true;
                vm.filter.sucursal = $scope.$parent.vm.data.contratoEdit.Sucursal;
                vm.filter.numeroCuenta = $scope.$parent.vm.data.contratoEdit.NumeroCuentaBanco;
                vm.filter.cbu = $scope.$parent.vm.data.contratoEdit.Cbu;
                vm.filter.alias = $scope.$parent.vm.data.contratoEdit.AliasCbu;

				ContratosInternosDataService.BancoObtenerTodos().then(function(bancos){
					vm.filter.bancos = bancos;
					if($scope.$parent.vm.data.contratoEdit.IdBanco !== 0) vm.filter.IdBancoElegido = $scope.$parent.vm.data.contratoEdit.IdBanco;
				});

				ContratosInternosDataService.TipoCuentaBancoObtenerTodos().then(function(cuentas){
					vm.filter.cuentas = cuentas;
					if($scope.$parent.vm.data.contratoEdit.IdTipoCuentaBanco !== 0) vm.filter.IdTipoCuentaBancoElegido = $scope.$parent.vm.data.contratoEdit.IdTipoCuentaBanco;
				});
				vm.formControl.loading = false;
			}
		}
	};

	return module;
})();