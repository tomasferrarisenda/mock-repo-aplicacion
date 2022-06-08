/**
 * @author:			Ezequiel Mansilla
 * @description:	Directiva para mostrar grilla de historico de internacion
 * @type:			Directive
 **/
import * as angular from 'angular';

import gridTemplate = require('../templates/sa-grid-reporte-internacion-historico.tpl.html');
export default (function () {
	'use strict';
		const module = { init : (ngModule: any) => {} };

	module.init = function (module) {

		module.directive('saGridReporteInternacionHistorico', saGridReporteInternacionHistorico);

		saGridReporteInternacionHistorico.$inject = ['$state', 'uiGridConstants', 'AdmisionDataService'];
		function saGridReporteInternacionHistorico ($state, uiGridConstants, AdmisionDataService) {
			return {
				restrict : 'E',
				scope : {
					data : '=',

					btnEditIf : '<?',
					btnEditDisabled : '<?',
					btnViewIf : '<?',
					btnViewDisabled : '<?'
				},
				template: gridTemplate,
				link: function (scope) {

					scope.btnEditIf = (angular.isUndefined(scope.btnEditIf)) ? false : scope.btnEditIf;
					scope.btnEditDisabled = (angular.isUndefined(scope.btnEditDisabled)) ? false : scope.btnEditDisabled;
					scope.btnViewIf = (angular.isUndefined(scope.btnViewIf)) ? false : scope.btnViewIf;
					scope.btnViewDisabled = (angular.isUndefined(scope.btnViewDisabled)) ? false : scope.btnViewDisabled;

					scope.toggleFiltering = toggleFiltering;
					scope.isSelected = isInternacionSelected;
					scope.edit = editInternacion;
					scope.view = viewInternacion;

					scope.gridOptions = {
						enableSorting: true, 	// Habilitar orden para todas las columnas, 
												//se deshabilita por la que no se quiere
						onRegisterApi: function(gridApi) {
							scope.gridApi = gridApi;
						},
						enableGridMenu: true,
						enableRowSelection: true,
						enableFullRowSelection: true,		// Habilita seleccionar fila completa
						multiSelect: false,					// Habilita multiple selecicón
						enableRowHeaderSelection: false, 	// Habilita columna de seleccion con check
						enableColumnMenus: true,			// Habilita menu por header
						enableFiltering: false,				// Habilita filtros en header
						exporterMenuPdf: false,				// Habilita la opcion de exportar pdf
						minRowsToShow: 10,
						columnDefs: [
							{
								field: 'numero_internado',
								displayName : 'N° Internado',
								headerTooltip: 'Número de internado',
								filter : {
									condition: uiGridConstants.filter.STARTS_WITH
								},
								enableHiding : false,
								minWidth : 110
							},
							{
								name : 'prioridadSolicitud',
								headerTooltip: 'Prioridad de solicitud',
								field: 'nombre_prioridad_solicitud_preadmision',
								cellClass: 'text-center',
								minWidth : 100,
								visible : false,
							},
							{
								name : 'estadoPreadmision',
								headerTooltip: 'Estado de preadmisión',
								field: 'nombre_estado_preadmision',
								cellClass: 'text-center',
								minWidth : 100,
								visible : false
							},
							{
								name : 'estadoInternacion',
								headerTooltip: 'Estado de internación',
								field: 'nombre_estado_internacion',
								cellClass: 'text-center',
								minWidth : 100
							},
							{
								name : 'tipoAlta',
								headerTooltip: 'Tipo de alta administrativa',
								field: 'nombre_tipo_alta_internacion',
								cellClass: 'text-center',
								minWidth : 100,
								visible : false
							},
							{
								name : 'tipoDocumento',
								headerTooltip: 'Tipo de documento',
								field: 'nombre_tipo_documento',
								cellClass: 'text-center',
								minWidth : 100,
								visible : false
							},
							{
								name : 'numeroDocumento',
								displayName: 'Nº Documento',
								headerTooltip: 'N° de documento',
								field: 'numero_documento',
								cellClass: 'text-center',
								minWidth : 100
							},
							{

								name : 'nombrePaciente',
								headerTooltip: 'Nombre de paciente',
								field: 'nombre_paciente',
								enableHiding : false,
								minWidth : 200
							},
							{
								name : 'sexo',
								field: 'sexo_paciente',
								cellClass: 'text-center',
								minWidth : 100
							},
							{
								name : 'habitacion',
								field: 'numero_habitacion',
								cellClass: 'text-center',
								minWidth : 100
							},
							{
								name : 'cama',
								field: 'numero_cama',
								cellClass: 'text-center',
								minWidth : 70
							},
							{
								name : 'edad',
								field: 'Edad',
								cellClass: 'text-center',
								minWidth : 70
							},
							{
								name : 'medicoCabecera',
								headerTooltip: 'Médico de Cabecera',
								field: 'nombre_medico_cabecera',
								cellClass: '',
								minWidth : 200
							},
							{
								name : 'mutual',
								// field: 'Paciente.Mutual.nombre_mutual',
								field: 'nombre_mutual',
								cellClass: '',
								minWidth : 200
							},
							{
								name : 'numeroAfiliado',
								field: 'numero_afiliado',
								displayName: 'Nº afiliado',
								cellClass: '',
								minWidth : 100
							},
							{
								name : 'fechaAdmision',
								field: 'fecha_admision',
								displayName: 'Ingreso',
								cellClass: 'text-center',
								filter : {
									placeholder: 'aaaa-mm-dd'
								},
								type: 'date', cellFilter: 'date:"dd-MM-yyyy"',
								minWidth : 100
							},
							{
								name : 'diasSolicitados',
								field: 'CantidadTotalDiasSolicitados',
								minWidth : 100,
								visible : false
							},
							{
								name : 'diasAutorizados',
								field: 'CantidadTotalDiasAutorizados',
								minWidth : 100,
								visible : false
							},
							{
								name : 'diasReales',
								field: 'CantidadTotalDiasReales',
								minWidth : 100,
								visible : false
							},
							{
								name : 'diagnostico',
								field: 'diagnostico',
								cellTooltip :function (row) { // (row, col)
									return row.entity.diagnostico;
								},
								cellClass: '',
								minWidth : 200
							}
						]
					};

					function isInternacionSelected () {
						if (scope.gridApi) {
							var _cantidad = scope.gridApi.selection.getSelectedCount();
							if (_cantidad > 0) {
								return true;
							}
						}
						return false;
					}

					function toggleFiltering () {
						scope.gridOptions.enableFiltering = !scope.gridOptions.enableFiltering;
						scope.gridApi.core.notifyDataChange( uiGridConstants.dataChange.COLUMN );
					}

					function getCurrentInternado() {
						return scope.gridApi.selection.getSelectedRows();
					}

					function viewInternacion (pInternado) {
						// var internado = getCurrentInternado();
						AdmisionDataService.pathReturn = 'internacion.reportes.historico';
						$state.go('internado.view', { idInternacion : pInternado.id_internacion });
					}

					function editInternacion(pInternado) {
						// var internado = getCurrentInternado();
						AdmisionDataService.pathReturn = 'internacion.reportes.historico';
						$state.go('internado.editSelector', { idInternacion : pInternado.id_internacion });
					}

					function changePageSize () {
						if (scope.data.length) {
							if (scope.data.length < 5) {
								scope.gridOptions.minRowsToShow = 5;
							} else {
								scope.gridOptions.minRowsToShow = 10;
							}
						} else {
							// scope.formData.searchOk = false;
						}
					}

					scope.$watch(function () {
						return scope.data;
					}, updateGrid);

					function updateGrid(pData) {
						scope.gridOptions.data = pData || [];
						changePageSize();
					}
				}
			};
		}
	};

	return module;

})();