/**
 * @author 			drobledo
 * @description 	LogicService para Configuracion de Cuentas por Defecto para Derechos
 */
import editarCuenta = require ('../templates/cuentasDefectoDerechos-edit.tpl.html');

export default (function(){
	const module = { init : (ngModule: any) => {} };

	module.init = function(module) {

		module.factory('CuentasDefectoDerechosLogicService', CuentasDefectoDerechosLogicService);

		CuentasDefectoDerechosLogicService.$inject = ['Logger', '$uibModal'];

		function CuentasDefectoDerechosLogicService($log, $uibModal) {
			$log = $log.getInstance('CuentasDefectoDerechosLogicService');
			/* ------------------------------------------ API Y VARIABLES ------------------------------------------ */

			const service = {
				editCuenta: editCuenta,
			};

			return service;

			function editCuenta(idCuenta, numeroCuenta) {
				return $uibModal.open({
					template: editarCuenta,
					controller: 'CuentasDefectoDerechosEditController',
					controllerAs: 'vm',
					keyboard : true,
					size: 'lg',
					resolve: {
						IdCuentaEditar: function() {
							return idCuenta ? idCuenta : 0;
						},
						numeroCuenta: function () {
							return numeroCuenta ? numeroCuenta : 0;
						},
					}
				}).result;
			}
		}
	};
	return module;
})();