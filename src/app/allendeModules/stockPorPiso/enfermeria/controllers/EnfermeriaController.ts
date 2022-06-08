import { IUbicacionPisoDataService, IMaterialDataService, IStockCommonDataService } from "../../common/services";

export default (function () {
	'use strict';

	const module = { init: (ngModule: any) => { } };

	module.init = function (module) {

		module.controller('EnfermeriaController', EnfermeriaController);

		// Inyección de Dependencia
		EnfermeriaController.$inject = ['$scope', '$log', '$q',
			'UbicacionPisoDataService', 'MaterialDataService',
			'StockCommonDataService',
			'User', 'StockEnfermeriaLogicService',
		];

		// Constructor del Controller
		function EnfermeriaController($scope, $log, $q,
			UbicacionPisoDataService: IUbicacionPisoDataService, MaterialDataService: IMaterialDataService,
			StockCommonDataService: IStockCommonDataService,
			User, StockEnfermeriaLogicService) {

			$log.debug('EnfermeriaController: ON.-');

			var vm = this;
			vm.tabs = [];

			$scope.formData = {
				internacion: '',
				ubicacion: '',
				piso: ''
			};

			$scope.data = {
				user: User,
				pisos: [],
				piso: '',
				ubicacionesPiso: [],
				ubicaciones: [],
				ubicacion: '',
				ubicacionesDetalle: [],
				materiales: [],
				internacion: '',
				internaciones: [],
				usuario: '',
				materialesFiltro: [],

				movimiento: '',

				fecha_desde: '',
				fecha_hasta: '',
				movimientos: [],
				usuarios: []

			};

			$scope.formControl = {
				// limpiar: limpiar,
				loading: false
			};

			$scope.validar = {

			};

			function llenarForm() {
				vm.tabs = StockEnfermeriaLogicService.getTabs(User);
			}


			function activate() {
				$log.debug('EnfermeriaController: Inicializar ON.-', User);
				$scope.formControl.loading = true;
				// permisos();
				var _pisos = StockCommonDataService.getAllPisosPorEdificio(User.sucursales[0].Id);
				var _usuario = StockCommonDataService.getUsuarioByNombre(User.userName);
				var _ubicacionesPiso = UbicacionPisoDataService.getAllUbicacionesPiso();
				var _materiales = MaterialDataService.getAllMateriales();
				var _tipoUbicacion = StockCommonDataService.getAllTipoUbicacionDetalle();

				$q.all([_pisos, _usuario, _ubicacionesPiso, _materiales, _tipoUbicacion])
					.then(activateOk, activateError);
			}

			function activateOk(results) {
				$scope.data.pisos = results[0];
				$scope.data.usuario = results[1];
				$scope.data.ubicacionesPiso = results[2];
				$scope.data.materiales = results[3];
				$scope.data.tiposUbicacion = results[4];
				$scope.formData.tipoUbicacion = $scope.data.tiposUbicacion[0];

				StockEnfermeriaLogicService.pisos = results[0];
				StockEnfermeriaLogicService.usuario = User;
				StockEnfermeriaLogicService.ubicacionesPiso = results[2];
				StockEnfermeriaLogicService.materiales = results[3];
				StockEnfermeriaLogicService.tiposUbicacion = results[4];

				llenarForm();

				$scope.formControl.error = false;
				$scope.formControl.loading = false;

				$log.debug('EnfermeriaController: activateOK');
			}

			function activateError() {
				$scope.formControl.loading = false;
			}

			activate();

		}
	};

	return module;
})();