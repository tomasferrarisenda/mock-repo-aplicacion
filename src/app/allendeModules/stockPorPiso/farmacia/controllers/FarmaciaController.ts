import { IUbicacionPisoDataService, IMaterialDataService, IStockCommonDataService } from '../../common/services';

export default (function () {
	'use strict';

	const module = { init: (ngModule: any) => { } };

	module.init = function (module) {

		module.controller('FarmaciaController', FarmaciaController);

		// Inyección de Dependencia
		FarmaciaController.$inject = ['$scope', '$log', '$q', 'User',
			'UbicacionPisoDataService', 'MaterialDataService',
			'StockCommonDataService',
			'StockFarmaciaLogicService'
		];
		// Constructor del Controller
		function FarmaciaController($scope, $log, $q, User,
			UbicacionPisoDataService: IUbicacionPisoDataService, MaterialDataService: IMaterialDataService,
			StockCommonDataService: IStockCommonDataService,
			StockFarmaciaLogicService) {

			$log.debug('FarmaciaController: ON.-');

			var vm = this;
			vm.tabs = [];
			
			$scope.cargaOkPrint = cargaOkPrint;

			$scope.formControl = {
				selectTab: selectTab,
				cambioSucursal : cambioSucursal,
				loading: false
			};

			$scope.data = {
				sucursales : [],
				limpiar: false
			};

			$scope.filter = {
				sucursal: ''
			};


			function cargaOkPrint() {
				$scope.printMovimiento = false;
				$log.debug("cargaOkPrint");
				for (var t = 0; t < vm.tabs.length; t++) {
					if (vm.tabs[t].NAME == "LISTADO") {
						vm.tabs[t].ACTIVE = true;
					}
					if (vm.tabs[t].NAME == "REPOSICION") {
						vm.tabs[t].ACTIVE = false;
						$scope.printMovimiento = true;
					}
				}
			}

			function llenarForm() {
				vm.tabs = StockFarmaciaLogicService.getTabs(User);
				// angular.copy
				// (
				// 	StockFarmaciaLogicService.getTabs(User),
				// 	vm.tabs
				// );
			}

			function selectTab(tab) {
				// for (let i = 0; i < vm.tabs.length; i++) {
				// 	vm.tabs[i].ACTIVE = false;
				// }
				// tab.ACTIVE = true;
				$scope.data.tab = tab;
			}

			function cambioSucursal(){
				$scope.sucursal = $scope.filter.sucursal;				
				
				// var tabActive;
				// for (let i = 0; i < vm.tabs.length; i++) {
				// 	if(vm.tabs[i].ACTIVE){
				// 		tabActive =  vm.tabs[i];
				// 	}
				// }

				activate();
				// selectTab(tabActive);
			}


			/* -------------------------------------------- ACTIVATE -------------------------------------------- */

			function activate() {
				$log.debug('FarmaciaController: Inicializar ON.-', User);
				$scope.formControl.loading = true;

				$scope.data.sucursales = User.sucursales;

				if (!$scope.filter.sucursal || !$scope.filter.sucursal.Id) {
					$scope.sucursal = User.sucursales[0];
				}
				$scope.filter.sucursal = $scope.sucursal;
				StockFarmaciaLogicService.sucursal = $scope.sucursal;

				var _pisos = StockCommonDataService.getAllPisosPorEdificio(StockFarmaciaLogicService.sucursal.Id);
				var _usuario = StockCommonDataService.getUsuarioByNombre(User.userName);
				var _farmacia = StockCommonDataService.getFarmaciaByEdificio(StockFarmaciaLogicService.sucursal.Id);
				var _ubicacionesPiso = UbicacionPisoDataService.getAllUbicacionesPiso();
				var _materiales = MaterialDataService.getAllMateriales();
				var _tipoUbicacion = StockCommonDataService.getAllTipoUbicacionDetalle();

				$q.all([_pisos, _usuario, _farmacia, _ubicacionesPiso, _materiales, _tipoUbicacion])
					.then(activateOk, activateError);
			}

			function activateOk(results) {
				
				StockFarmaciaLogicService.pisos = results[0];
				StockFarmaciaLogicService.usuario = User;
				StockFarmaciaLogicService.farmacia = results[2];
				StockFarmaciaLogicService.ubicacionesPiso = results[3];
				StockFarmaciaLogicService.materiales = results[4];
				StockFarmaciaLogicService.tiposUbicacion = results[5];

				llenarForm();
				selectTab(vm.tabs[0]);
				// vm.tabs[0].ACTIVE = true;
				$scope.formControl.error = false;
				$scope.formControl.loading = false;
				$log.debug('FarmaciaController: activateOK', vm.tabs);
			}

			function activateError() {
				$scope.formControl.loading = false;
			}

			activate();

		}
	};

	return module;
})();