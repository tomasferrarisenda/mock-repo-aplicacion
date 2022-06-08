/**
 * @author:			Javier Delmastro
 * @description:	directiva para tabla de configuración con manejo de Activo/Inactivo, Visible Portal Web, (Centros/Servicios/Recursos/Prestaciones)
 * @type:			Directive
 **/
import saTemplate = require('../saTableCentroServicios/saTablaConActivoMasVisiblePortalWebComponent.html');
import * as angular from 'angular';

export default (function () {
	'use strict';

	const module = { init: (ngModule: any) => { } };

	module.init = function (module) {

		module.component('saTablaConActivoMasVisiblePortalWeb', {
			template: saTemplate,
			bindings: {
				data: '=',
				tableClass: '<?',
				rowSelected: '&?',
				columns: '<',
				clickRowFunc: '&?',
				colorRow: '<?',
				titulogrid: '@?',
				btnClick: '&?',
				tooltipBtn: '@?',
				deleteClick: '&?',
				changeActivo: '&?',
				changeVisiblePortal: '&?',
				showSeleccionarJefeServicio: '<?',
				establecerJefeServicioClick: '&?',
				idElement: '<?'
			},
			controller: TablaConActivoMasVisiblePortalWebController,
			controllerAs: 'vm'
		});

		TablaConActivoMasVisiblePortalWebController.$inject = ['$q', 'Logger', '$scope', '$filter'];

		function TablaConActivoMasVisiblePortalWebController($q, $log, scope, $filter) {

			/* ------------------------------------------------ LOG ------------------------------------------------ */

			$log = $log.getInstance('TablaConActivoMasVisiblePortalWebController');
			$log.debug('ON.-');

			/* ------------------------------------------ API Y VARIABLES ------------------------------------------ */
			var vm = this;
			vm.today = new Date();

			vm.tableId = makeid();

			/* Component Events */
			vm.$onInit = activate;

			vm.rowClick = rowClick;
			vm.getCol = getCol;

			vm.getItemsFiltered = getItemsFiltered;

			// models filter
			vm.filterBuscarId = "";
			vm.filterBuscarItem = "";

			vm.dataFilter = "";

			vm.mostrarOpcionJefeServicio = (vm.showSeleccionarJefeServicio) ? (vm.showSeleccionarJefeServicio) : false;

			vm.contextOptions = [
				{
					text: 'Cambiar Visible Portal',
					displayed: function (modelValue) {
						return true;
					},
					click: ($itemScope, $event, modelValue, text, $li) => {

						$log.debug('itemsScopeClick', $itemScope.row);
						
					}
				},
				{
					text: 'Cambiar Estado Activo',
					displayed: function (modelValue) {
						return true;
					},
					click: ($itemScope, $event, modelValue, text, $li) => {

						$log.debug('itemsScopeClick', $itemScope.row);
						
					}
				},
				{
					text: 'Eliminar',
					displayed: function (modelValue) {
						return true;
					},
					click: ($itemScope, $event, modelValue, text, $li) => {

						$log.debug('itemsScopeClick', $itemScope.row);
						vm.deleteClick({ pObject: $itemScope.row });
					}
				},
				{
					text: 'Establecer recurso jefe de servicio',
					displayed: function (modelValue) {
						return vm.showSeleccionarJefeServicio && modelValue.row.Activo && modelValue.row.IdTipoRecurso == 1;
					},
					click: ($itemScope, $event, modelValue, text, $li) => {

						$log.debug('itemsScopeClick', $itemScope.row);
						vm.establecerJefeServicioClick({ pObject: $itemScope.row });
					}
				}
			];

			/* ---------------------------------------------- SUPPORT ----------------------------------------------- */

			function makeid(id?): any {
				if (id) return id;

				var text = "";
				var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

				for (var i = 0; i < 5; i++)
					text += possible.charAt(Math.floor(Math.random() * possible.length));

				return text;
			}


			function rowClick(row) {
				cleanSelectedRows();
				row.selected = true;

				vm.clickRowFunc({
					pObject: row
				});
			}

			function cleanSelectedRows() {
				angular.forEach(vm.dataFilter, function (row) {
					row.selected = false;
				});
				angular.forEach(vm.data, function (row) {
					row.selected = false;
				});
			}

			function getCol(servicioStatus) {
				switch (servicioStatus) {
					case true:
						return 'color-verde';
					case false:
						return 'color-rojo';
					default:
						return '';
				}
			};

			function getItemsFiltered() {

				var filterObj = {
					IdElemento: ''
				};
				filterObj[vm.columns.primeraBind] = vm.filterBuscarItem;
				filterObj.IdElemento = vm.filterBuscarId;

				vm.dataFilter = $filter('filter')
					(vm.data,filterObj);

			}


			function scrollTableTurnos(IdRow, IdTable) {

				var e = $(".bodyturnos").find(x => x.Id === IdTable);
				var elm;
				var elmRow;
				if (e) {

					elm = e;
					elmRow = $(".rowturnos");

					var vm = this;
					anim();
				}

				function anim() {

					var scrollTo = IdRow * elmRow.innerHeight();
					elm.animate({ scrollTop: scrollTo }, 650);
				}
			}

			function limpiarRowSelected() {
				angular.forEach(vm.data, function (item) {
					item.selected = false;
				});
			}

			/* ---------------------------------------------- ACTIVATE ---------------------------------------------- */

			function activate() {
				$log.debug('$onInit', vm.data);

			}

			scope.$watch(function () {
				return vm.data;
			}, function (newValue) {
				if (newValue) {
					vm.dataFilter = angular.copy(newValue);
				}
			});


		}
	};

	return module;
})();