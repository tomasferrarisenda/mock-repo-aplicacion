/**
 * @author 			ppautasso
 * @description 	description
 */
import * as angular from 'angular';

import saPermisosXModuloView = require('../templates/sa-permisosxmodulo-list.tpl.html');

export default (function () {
	'use strict';

	const module = { init: (ngModule: any) => { } };

	module.init = function (module) {

		// REUTILIZABLE: [DIRECTIVE] List de permisos x modulo. Se usa con [ng-model].
		module.directive('saPermisosXModuloList', saPermisosXModuloList);

		saPermisosXModuloList.$inject = ['$log', '$rootScope', 'RolesGestionDataService', '$interval',
			'uiGridConstants'
		];

		function saPermisosXModuloList($log, $rootScope, RolesGestionDataService, $interval,
			uiGridConstants
		) {

			return {
				restrict: 'E',
				require: '^ngModel',
				scope: {
					// model: '=',
					title: '@?',
					// loading : '=?',
					// 

					viewEstadoIf: '=?',

					/* Botones */

					btnFilterClick: '&?',
					btnFilterDisabled: '=?',
					btnFilterIf: '=?',


					btnGuardarClick: '&?',
					btnGuardarDisabled: '=?',
					btnGuardarIf: '=?',

					btnShowClick: '&?',
					btnShowDisabled: '=?',
					btnShowIf: '=?',



				},
				template: saPermisosXModuloView,
				link: link
			};

			function link(scope, element, attrs, controller) {

				scope.sinDatos = 'Sin datos';
				scope.loading = false;
				scope.tieneValor = '';
				scope.data = {
					permisosXModulo: [],
					permisosXModuloFiltrado: []
				};

				scope.grid = {
					toggleFiltering: toggleFiltering,
					togglePermisosActivos: togglePermisosActivos,
					toggleRowPermisos: toggleRowPermisos,

				};

				scope.enablePermisosActivos = true;

				scope.gridData = [];

				scope.rol = {
					getStatus: getStatus,

				};

				scope.permiso = {
					cambiarPermisosHijos: cambiarPermisosHijos
				};


				scope.$watch(function () {
					return controller.$modelValue;
				}, function (newValue, oldValue, scope) {
					if(newValue.length > 0){

						updateDirective(newValue);
						scope.data.permisosXModulo = scope.model;
						
						parserData();
					}
				});

				function updateDirective(pValue) {
					scope.model = controller.$modelValue || controller.$viewValue || '';

				}

				function inicializarVariables() {
					scope.gridOptions.data = [];
				}


				/* ---------------------------------- GRID SECTION ------------------------------------------------------ */

				function toggleFiltering() {
					scope.gridOptions.enableFiltering = !scope.gridOptions.enableFiltering;
					scope.gridApi.core.notifyDataChange(uiGridConstants.dataChange.COLUMN);
				}


				//
				//toggle para mostrar permisos activos o mostrar toda la data
				//
				function togglePermisosActivos() {
					scope.enablePermisosActivos = !scope.enablePermisosActivos;
					if (scope.enablePermisosActivos) {

						scope.gridOptions.data = scope.data.permisosXModulo;
						scope.gridOptions.showTreeExpandNoChildren = false;
						scope.gridApi.treeBase.collapseAllRows();

					} else if (!scope.enablePermisosActivos) {

						scope.gridOptions.data = scope.data.permisosXModuloFiltrado;
						scope.gridOptions.showTreeExpandNoChildren = false;
						scope.gridApi.treeBase.expandAllRows();

					}
					scope.gridApi.core.notifyDataChange(uiGridConstants.dataChange.COLUMN);
				}

				function toggleRowPermisos(evnt, permisos) {



					$interval(function () {

						parserData();
						scope.gridApi.core.handleWindowResize();
					}, 300, 2);

				}

				//$rootScope.$on('mostrarPermisosPorRow', toggleRowPermisos);



				var cellSeleccionado = function () {
					return '<div  ' +
						//	'ng-if="grid.appScope.hasTheRevokePrivilige(row, grid.appScope)" ' +
						'name="invDocB" class="ui-grid-cell-contents small-grid-font text-center" >' +
						'<button type="button" ng-if="row.entity.PuedeSeleccionar" class="btn"' +
						'ng-class="{ \'btn-success\' : row.entity.Seleccionado, \'btn-warning\' : !row.entity.Seleccionado }"' +
						'ng-model="row.entity.Seleccionado" ng-click="grid.appScope.permiso.cambiarPermisosHijos(row.entity)" uib-btn-checkbox btn-checkbox-true="true" btn-checkbox-false="false"' +
						'style="padding-top: 1px;padding-bottom: 1px;" >' +
						'{{grid.appScope.rol.getStatus(row.entity,"texto")}}' +
						'</button>' +
						'</div>';
				};



				var cellSeleccionadoConSlider = function () {
					return '<div style="text-align-last: center; padding-top: 6px;">' +
						//	'ng-if="grid.appScope.hasTheRevokePrivilige(row, grid.appScope)" ' +
						'<sa-check-box ng-model="row.entity.Seleccionado" ng-if="row.entity.PuedeSeleccionar" ng-click="grid.appScope.permiso.cambiarPermisosHijos(row.entity)" color="green"' +
						'id-element="permisosxmodulo-{{$index}}"> </sa-check-box>' +
						'</div>';
				};




				//
				//funcion de parseo data para obtener solamente los modulos y permisos activos, ademas 
				//setea los modulos/permiso al gridOptions de la tabla
				//
				function parserData() {

					for (var i = scope.data.permisosXModulo.length - 1; i >= 0; i--) {


						scope.data.permisosXModulo[i].$$treeLevel = scope.data.permisosXModulo[i].Nivel;


						if (scope.data.permisosXModulo[i].Tipo == 'Modulo' ||
							(scope.data.permisosXModulo[i].Tipo == 'Permiso' && scope.data.permisosXModulo[i].Seleccionado === true)
						) {
							if (scope.data.permisosXModulo[i].Tipo == 'Permiso')
								scope.data.permisosXModuloFiltrado[i] = scope.data.permisosXModulo[i];
						}

						if (scope.data.permisosXModulo[i].PuedeSeleccionar === false) {
							scope.data.permisosXModulo[i].Seleccionado = '';
						}

					}

					scope.gridOptions.data = scope.data.permisosXModulo;

				}

				function getStatus(entity) {


					if (entity.Seleccionado === true)
						return 'Activado';
					else return 'Desactivado';

				}

				//
				//funcion que activa/desactiva todos los permisos hijos cuando se seleccona un permiso padre
				//
				function cambiarPermisosHijos(entity) {

					//$log.debug(' cambiarPermisosHijos Ok .-', entity);
					if (entity.IdsPermisosHijos.length != 0) {


						angular.forEach(entity.IdsPermisosHijos, function (idPermisoHijo, key) {

							for (var i = scope.data.permisosXModulo.length - 1; i >= 0; i--) {

								if (scope.data.permisosXModulo[i].Id === idPermisoHijo)
									scope.data.permisosXModulo[i].Seleccionado = entity.Seleccionado;

							}

						});
						scope.gridOptions.data = scope.data.permisosXModulo;
					}

				}


				scope.gridOptions = {
					//data: vm.data.permisosXModulo,
					data: scope.gridData,
					enableSorting: true, // Habilitar orden para todas las columnas, se deshabilita por la que no se quiere
					appScopeProvider: scope, // Le asigno el $scope si no es "$scope"
					onRegisterApi: function (gridApi) {
						scope.gridApi = gridApi;

						$interval(function () {

							parserData();
							scope.gridApi.core.handleWindowResize();
						}, 300, 5);


					},
					enableGridMenu: true,
					enableColumnResizing: true,
					showTreeExpandNoChildren: false,
					showTreeRowHeader: true,
					enableRowSelection: true,
					enableFiltering: true,
					columnDefs: [{
						field: 'Nombre',
						displayName: 'Nombre',
						width: '*'
						//minWidth: 60
					}, {
						field: 'Descripcion',
						displayName: 'Descripcion',
						// minWidth: 80
						width: '*'

					}, {
						field: 'Tipo',
						displayName: 'Tipo',
						width: '*',
						cellClass: function (grid, row, col, rowRenderIndex, colRenderIndex) {


						},

					}, {
						field: 'NombreSistema',
						displayName: 'Sistema',
						width: '*',


					}, {
						field: 'Seleccionado',
						displayName: 'Seleccionado',
						width: '*',
						// minWidth: 50,
						headerCellClass: 'small-grid-font gridHeader-truncate',
						cellTemplate: cellSeleccionadoConSlider()
					}]


				};

				activate();
				// 



				function activate() {

					$log.debug('Inicializar Directive Ok .-');

					scope.gridOptions.enableFiltering = false;
					inicializarVariables();



				}
			}
		}
	};

	return module;
})();
