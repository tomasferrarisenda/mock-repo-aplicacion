export default (function(){
	const module = { init : (ngModule: any) => {} };

	module.init = function (module) { 

		module.controller('PrefacturaInternacionListController', PrefacturaInternacionListController);

		// Inyección de Dependencia
		PrefacturaInternacionListController.$inject = ['$log', '$scope', 'ModalService', 'SupportLogicService', 'FACTURACION_INFO'];

		// Constructor del Controller
		function PrefacturaInternacionListController ($log, $scope, ModalService, SupportLogicService, FACTURACION_INFO) {

				$log.debug('PrefacturaInternacionListController: ON.-');

				/* ---------------------------------------- API Y VARIABLES ---------------------------------------- */

				var vm = this;
				vm.title = {
					module: FACTURACION_INFO.title,
					page: 'Listado Internados'
				};

				vm.formControl = {
					error : true,
					loading : false
				};

				$scope.formControl = {
					// error: true,
					// loading: false,

					searchInternados : searchInternados
				};

				$scope.myData = 
				[
					{
						"NúmeroInternado": 1322,
						"NombreInternado":"Horacio Cano Villa",
						"FechaIngreso":"12/8/2016",
						"FechaAlta":"15/8/2016",
						"ObraSocial":"OSDE",
						"Honorarios":"$9500",
						"Derechos":"$3000",
						"Total":"$12500"
					},
					{
						"NúmeroInternado": 1321,
						"NombreInternado":"Camila Wassan",
						"FechaIngreso":"10/7/2016",
						"FechaAlta":"15/7/2016",
						"ObraSocial":"Swiss Medical",
						"Honorarios":"$3200",
						"Derechos":"$700",
						"Total":"$3900"
					},
					{
						"NúmeroInternado": 1320,
						"NombreInternado":"Carlos Alberto Ahumada",
						"FechaIngreso":"08/7/2016",
						"FechaAlta":"13/7/2016",
						"ObraSocial":"OSDE",
						"Honorarios":"$12000",
						"Derechos":"$3000",
						"Total":"$15000"
					},
					{
						"NúmeroInternado": 1319,
						"NombreInternado":"Silvina Pereyra Suarez",
						"FechaIngreso":"08/7/2016",
						"FechaAlta":"23/7/2016",
						"ObraSocial":"MET",
						"Honorarios":"$15000",
						"Derechos":"$5400",
						"Total":"$20400"
					}
				]

				vm.gridOptions = {
					// Habilitar orden para todas las columnas, se deshabilita por la que no se quiere
					enableSorting: true,
					// Le asigno el $scope si no es "$scope"
					appScopeProvider : vm,
					// onRegisterApi: function(gridApi) {
					// 	vm.gridApi = gridApi;
					// },
					enableGridMenu: true,
					enableRowSelection: true,
					// Habilita seleccionar fila completa
					enableFullRowSelection: true,
					// Habilita multiple selecicón
					multiSelect: false,
					// Habilita columna de seleccion con check
					enableRowHeaderSelection: false,
					// Habilita menu por header
					enableColumnMenus: true,
					// Habilita filtros en header
					enableFiltering: true,
					minRowsToShow: 10
					/*columnDefs: [
						{
							field: 'numero_internado',
							displayName : 'N° internado',
							headerTooltip: 'Número de internado',
							filter : {
								condition: uiGridConstants.filter.STARTS_WITH
							},
							enableHiding : false,
							minWidth : 110
						},
						{
							name : 'nombrePaciente',
							headerTooltip: 'Nombre de internado',
							field: 'Paciente.nombre_completo',
							enableHiding : false,
							minWidth : 200
						},
						{
							name : 'mutual',
							// field: 'Paciente.Mutual.nombre_mutual',
							field: 'MutualTemp.nombre_mutual',
							cellClass: '',
							minWidth : 200
						},
						{
							name : 'numeroAfiliado',
							field: 'Paciente.numero_socio_mutual',
							displayName: 'Nº afiliado',
							cellClass: '',
							minWidth : 100
						},
						{
							name : 'fechaAdmision',
							field: 'fecha_admision',
							displayName: 'Fecha de ingreso',
							cellClass: 'text-center',
							filter : {
								placeholder: 'aaaa-mm-dd'
							},
							type: 'date', cellFilter: 'date:"dd-MM-yyyy"',
							minWidth : 100
						},
						{
							name : 'fechaAdmision',
							field: 'fecha_admision',
							displayName: 'Fecha de alta',
							cellClass: 'text-center',
							filter : {
								placeholder: 'aaaa-mm-dd'
							},
							type: 'date', cellFilter: 'date:"dd-MM-yyyy"',
							minWidth : 100
						}
						// {
						// 	name : 'acciones',
						// 	minWidth : 50,
						// 	cellTemplate : '<div class="btn btn-white btn-xs" uib-tooltip="Imprimir" tooltip-placement="top" ng-click="grid.appScope.formControl.editInternacion(row.entity)"><span ng-class="grid.appScope.icono.PRINT"></span></div>'
						// }
					]*/
				};

				/* ----------------------------------------- IMPLEMENTACIÓN ----------------------------------------- */
				
				function inicializarVariables () {
					vm.data.internaciones = [];
				}

				function searchInternados() {
 					$log.debug('ModalSearchInternados OK.-');
 					SupportLogicService.searchInternados()
 						.then(function (argument) {
 							activate();
 						})
 				}

 				/* -------------------------------------------- ACTIVATE -------------------------------------------- */

 				activate();
				
				function activate () {
					$log.debug('PrefacturaInternacionListController: Inicializar ON.-');
					vm.formControl.loading = true;

					successCallback();

					function successCallback () {
						vm.formControl.error = false;
						vm.formControl.loading = false;
					}

					function errorCallback (pError) {
						vm.formControl.loading = false;
						vm.formControl.error = true;
						ModalService.error(pError.message);
					}
				}
		};
	};
	return module;
})();