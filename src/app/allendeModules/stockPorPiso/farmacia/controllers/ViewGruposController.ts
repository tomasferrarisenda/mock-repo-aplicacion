import * as angular from 'angular';
import { IMaterialDataService, IGrupoFarmaciaDataService } from '../../common/services';
export default (function () {
	'use strict';

	const module = { init: (ngModule: any) => { } };

	module.init = function (module) {

		module.controller('ViewGruposController', ViewGruposController);

		ViewGruposController.$inject = ['$scope', '$log', '$q', '$uibModalInstance',
			'ModalService', 'AlertaService',
			'MaterialDataService', 'GrupoFarmaciaDataService',
			'StockFarmaciaLogicService'];

		function ViewGruposController($scope, $log, $q, $uibModalInstance,
			ModalService: IModalService, AlertaService: IAlertaService, 
			MaterialDataService: IMaterialDataService, GrupoFarmaciaDataService: IGrupoFarmaciaDataService,
			StockFarmaciaLogicService) {

			$log.debug('ViewGruposController: ON.-');

			/* ------------------------------ API Y VARIABLES ------------------------------ */

			$scope.title = {
			};

			$scope.formData = {
			};

			$scope.data = {
				grupos: [],
				materiales: [],
				materialesGrupo: [],
				grupoSeleccionado: ''
			};

			$scope.formControl = {
				error: true,
				loading: false,
				nuevaCordoba: false,
				cerro: false,

				reloadPage: activate,
				ok: guardar,
				cancel: cancel,


				selectGrupo: selectGrupo,
				selectMaterial: selectMaterial,

				agregarProducto: agregarProducto,
				nuevoProducto: nuevoProducto,
				eliminarProducto: eliminarProducto,

				agregarGrupo: agregarGrupo,
				nuevoGrupo: nuevoGrupo,
				editarGrupo: editarGrupo,
				guardarGrupo: guardarGrupo,
				eliminarGrupo: eliminarGrupo,

				registrarRetira: registrarRetira,
				suma: suma,
				resta: resta
			};

			$scope.paginacion = {
				currentPage: 1,
				pageSize: 7
			};

			$scope.filter = {
				codigo_material: '',
				producto: '',

				// mètodo para botòn Limpiar filtros
				clean: function () {
					$scope.filter.codigo_material = '';
					$scope.filter.producto = '';
					$scope.formControl.limpiar = true;
					// $scope.formData.search = ''

				},
				// mètodo para que no valle el filtro de solicitudes
				validar: function () {

					if ($scope.filter.codigo_material == null) {
						$scope.filter.codigo_material = '';
					}
					if ($scope.filter.producto == null) {
						$scope.filter.producto = '';
					}
				}
			};

			/* ------------------------------ IMPLEMENTACIÓN ------------------------------ */
			function selectGrupo(grupo) {
				$scope.data.grupoSeleccionado = '';
				$scope.formControl.grupoSeleccionado = false;
				$scope.data.materialesGrupo = [];

				for (var i = 0; i < $scope.data.grupos.length; i++) {
					$scope.data.grupos[i].Color = "";
					if ($scope.data.grupos[i].Id == grupo.Id && $scope.data.grupos[i].Nombre == grupo.Nombre) {
						$scope.data.grupoSeleccionado = $scope.data.grupos[i];
						$scope.data.grupos[i].Color = "color-verde-sucursales";
						if (grupo.Id > 0)
							GrupoFarmaciaDataService.getGrupoPorId(grupo.Id)
								.then(function (grupo) {
									$scope.data.materialesGrupo = grupo.Materiales;
								})
						$scope.formControl.grupoSeleccionado = true;
					}
				}

			}

			function selectMaterial(material) {
				$scope.formControl.materialSeleccionado = false;
				$scope.data.materialSeleccionado = '';
				for (var i = 0; i < $scope.data.materialesGrupo.length; i++) {
					$scope.data.materialesGrupo[i].Color = "";
					if ($scope.data.materialesGrupo[i].Id == material.Id && $scope.data.materialesGrupo[i].Material.Id == material.Material.Id) {
						$scope.data.materialesGrupo[i].Color = "color-celeste-sucursales";
						$scope.formControl.materialSeleccionado = true;
						$scope.data.materialSeleccionado = $scope.data.materialesGrupo[i];

					}
				}
			}

			function agregarGrupo() {
				$scope.formData.grupoNuevo = '';
				$scope.formControl.cargarGrupo = !$scope.formControl.cargarGrupo;
				$scope.formControl.editandoGrupo = false;
			}

			function nuevoGrupo() {

			}

			function editarGrupo() {
				$scope.formControl.cargarGrupo = !$scope.formControl.cargarGrupo;
				$scope.formControl.editandoGrupo = true;
				$scope.formData.grupoNuevo = $scope.data.grupoSeleccionado.Nombre;
			}

			function eliminarGrupo() {
				ModalService.confirm("¿Seguro que desea eliminar el grupo?", function (result) {
					if (result) {
						if ($scope.data.grupoSeleccionado.Id > 0)
							GrupoFarmaciaDataService.eliminarGrupo($scope.data.grupoSeleccionado.Id)
								.then(function () {
									AlertaService.NewSuccess("Grupo eliminado");
									GrupoFarmaciaDataService.getGruposFarmacia()
										.then(function (grupos) {
											$scope.data.grupos = grupos;
											Inicializar();
										})
								})
					}
				});
			}

			function guardarGrupo() {
				if ($scope.formControl.editandoGrupo) {
					for (var i = 0; i < $scope.data.grupos.length; i++) {
						if ($scope.data.grupos[i].Id == $scope.data.grupoSeleccionado.Id) {
							$scope.data.grupos[i].Nombre = $scope.formData.grupoNuevo;
							break;
						}
					}
					agregarGrupo();
				}
				else {
					for (var i = 0; i < $scope.data.grupos.length; i++) {
						$scope.data.grupos[i].Color = "";
					}
					var grupo = {
						Id: 0,
						Nombre: $scope.formData.grupoNuevo,
						Materiales: <Array<any>>[],
						Color: "color-verde-sucursales"
					}
					$scope.data.grupos.unshift(grupo);
					$scope.data.grupoSeleccionado = grupo;
					$scope.data.materialesGrupo = [];
					agregarGrupo();
				}
			}


			function guardar() {
				var grupo: any = {};
				for (var i = 0; i < $scope.data.grupos.length; i++) {
					if ($scope.data.grupos[i].Color !== "") {
						grupo = {
							Id: $scope.data.grupos[i].Id,
							Nombre: $scope.data.grupos[i].Nombre,
							Materiales: []
						};
						break;
					}
				}
				for (var j = 0; j < $scope.data.materialesGrupo.length; j++) {
					var material = {
						Id: $scope.data.materialesGrupo[j].Id,
						Cantidad: $scope.data.materialesGrupo[j].Cantidad,
						Material: {
							Id: $scope.data.materialesGrupo[j].Material.Id,
							IdTipoMaterial: $scope.data.materialesGrupo[j].Material.IdTipoMaterial
						}
					};
					grupo.Materiales.push(material);
				}
				$log.debug("Grupo a guardar: ", grupo);
				if (grupo)
					GrupoFarmaciaDataService.guardarGrupo(grupo)
						.then(function (result) {
							AlertaService.NewSuccess("Guardado");
							GrupoFarmaciaDataService.getGruposFarmacia()
								.then(function (grupos) {
									$scope.data.grupos = grupos;
									Inicializar();
								})
						})
			}



			function cancel() {
				$uibModalInstance.dismiss('cancel');
			}

			function agregarProducto() {
				$scope.formControl.cargarProducto = !$scope.formControl.cargarProducto;
			}

			function nuevoProducto() {
				$log.debug('Producto', $scope.formData.productoNuevo);
				var detalle: any = {};
				detalle.Material = $scope.formData.productoNuevo;
				detalle.Cantidad = 0;
				detalle.minimo = true;
				detalle.nuevo = true;
				detalle.Id = 0;
				var _existe = false;
				for (var i = 0; i < $scope.data.materialesGrupo.length; i++) {
					if ($scope.data.materialesGrupo[i].Material.Id == detalle.Material.Id) {
						_existe = true;
					}
				}
				if (!_existe) {
					$scope.data.materialesGrupo.unshift(detalle);
				}
				// getPage();
				$scope.formData.productoNuevo = '';
				$scope.formControl.cargarProducto = false;
			}

			function eliminarProducto() {
				ModalService.confirm("¿Seguro que desea eliminar el producto?", function (result) {
					if (result)
						for (var i = 0; i < $scope.data.materialesGrupo.length; i++) {
							if ($scope.data.materialesGrupo[i].Id == $scope.data.materialSeleccionado.Id &&
								$scope.data.materialesGrupo[i].Material.Id == $scope.data.materialSeleccionado.Material.Id) {
								$scope.data.materialesGrupo.splice(i, 1);
							}
						}
				})
			}


			function suma(material) {

				for (var i = 0; i < $scope.data.materialesGrupo.length; i++) {
					if ($scope.data.materialesGrupo[i].Id == material.Id && $scope.data.materialesGrupo[i].Material.Id == material.Material.Id) {
						$scope.data.materialesGrupo[i].Cantidad += 1;
						$scope.data.materialesGrupo[i].minimo = false;
					}
				}

			}

			function resta(material) {
				for (var i = 0; i < $scope.data.materialesGrupo.length; i++) {
					if ($scope.data.materialesGrupo[i].Id == material.Id && $scope.data.materialesGrupo[i].Material.Id == material.Material.Id) {
						$scope.data.materialesGrupo[i].Cantidad -= 1;
						if ($scope.data.materialesGrupo[i].Cantidad == 0) {
							$scope.data.materialesGrupo[i].minimo = true;
						}
					}
				}
			}

			function registrarRetira() {

			}


			/* ------------------------------ ACTIVATE ------------------------------ */

			activate();

			/* Método inicializador */
			function activate() {
				$scope.formControl.loading = true;

				$scope.formControl.supervisor = StockFarmaciaLogicService.supervisor;
				var materiales = MaterialDataService.getMaterialesDto();
				var grupos = GrupoFarmaciaDataService.getGruposFarmacia();
				$q.all([materiales, grupos])
					.then(activateOk, activateError);
			}

			function activateOk(result) {
				if (StockFarmaciaLogicService.sucursal.Id == 1) {
					$scope.formControl.nuevaCordoba = true;
				}
				else if (StockFarmaciaLogicService.sucursal.Id == 2) {
					$scope.formControl.cerro = true;
				}
				for (var i = 0; i < $scope.data.materiales.length; i++) {
					$scope.data.materiales[i].Stock = ($scope.formControl.nuevaCordoba) ? $scope.data.materiales[i].StockNuevaCordoba : $scope.data.materiales[i].StockCerro;

				}
				$scope.formControl.loading = false;
				$scope.data.materiales = result[0];
				$scope.data.grupos = result[1];
				$log.debug('ViewGruposController: Inicializar OK.-');
			}

			function Inicializar() {
				$scope.data.materialesGrupo = [];
				$scope.formControl.grupoSeleccionado = false;
				$scope.data.grupoSeleccionado = '';
			}

			function activateError(error) {
				$scope.formControl.loading = false;
				$log.error('Error al inicializar', error);
			}
		}
	};

	return module;
})();