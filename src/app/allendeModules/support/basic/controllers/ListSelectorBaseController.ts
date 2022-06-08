/**
 * @author 			ppautasso
 * @description 	description
 */
import * as angular from 'angular';
import { ISupportDataService } from '../../../support/basic/services';

export default (function () {
	'use strict';

	const module = { init: (ngModule: any) => { } };

	module.init = function (module) {

		module.controller('ListSelectorBaseController', ListSelectorBaseController);

		// Inyección de Dependencia
		ListSelectorBaseController.$inject = ['Logger', '$q', '$filter', '$scope', '$uibModalInstance',
			'SupportDataService', 'ModalService', 'AlertaService'];

		// Constructor del Controller
		function ListSelectorBaseController($log, $q, $filter, $scope, $uibModalInstance,
			SupportDataService: ISupportDataService, ModalService, AlertaService : IAlertaService) {

			/* ------------------------------------------------ LOG ------------------------------------------------ */

			//$log = $log.getInstance('ListSelectorBaseController');
			//$log.debug('ON.-');

			/* ------------------------------------------ API Y VARIABLES ------------------------------------------ */

			var vm = this;
			vm.title = {
				page: 'Buscador'
			};

			vm.formData = {
				entidadSeleccionada: null,
				titulo: null,
				mostrarId: null,
				mostrarCodigo: null,
				mostrarNombre: null,
				mostrarDescripcion: null,
				tituloId: null,
				tituloCodigo: null,
				tituloNombre: null,
				tituloDescripcion: null
			};

			vm.data = {
				entidades: []
			};

			vm.filter = {
				entidades: [],
				id: '',
				codigo: '',
				nombre: '',
				descripcion: '',
				clean: cleanFilters,
				validar: validarFilters
			};

			vm.paginacion = {
				currentPage: 0,
				pageSize: 10,
				totalItems: 0,
				pageChanged: getPage,
				getPage: getPage
			};

			vm.formControl = {
				loading: false,
				noResult: true,
				ok: returnEntidad,
				cancel: cancel,
				selectItem: selectItem,
				selectItemAndClose: selectItemAndClose,
				reloadPage: activate,
				validarForm: validarForm
			};

			vm.sort = function (keyname) {
				$scope.sortKey = keyname;   //set the sortKey to the param passed
				$scope.reverse = !$scope.reverse; //if true make it false and vice versa
			};

			/* ------------------------------------------- IMPLEMENTACIÓN ------------------------------------------- */

			function selectItem(id) {

				vm.formData.entidadSeleccionada = null;
				for (var i = 0; i < vm.filter.entidades.length; i++) {
					vm.filter.entidades[i].Seleccionado = false;
				}

				for (var i = 0; i < vm.filter.entidades.length; i++) {
					if (vm.filter.entidades[i].Id == id) {
						vm.filter.entidades[i].Seleccionado = true;
					}

					if (vm.filter.entidades[i].Seleccionado == true) {
						vm.formData.entidadSeleccionada = vm.filter.entidades[i];
					}
				}
			}

			function selectItemAndClose(id) {
				selectItem(id);
				returnEntidad();
			}

			function cleanFilters() {
				vm.filter.id = '';
				vm.filter.codigo = '';
				vm.filter.nombre = '';
				vm.filter.descripcion = '';
				vm.filter.entidades = '';
				vm.paginacion.currentPage = 1;
				vm.paginacion.pageChanged();
			}

			function validarFilters() {
				if (vm.filter.id == null)
					vm.filter.id = '';
				if (vm.filter.codigo == null)
					vm.filter.codigo = '';
				if (vm.filter.nombre == null)
					vm.filter.nombre = '';
				if (vm.filter.descripcion == null)
					vm.filter.descripcion = '';
			}

			function getPage() {

				vm.filter.validar();

				vm.filter.entidades = $filter('filter')
					(vm.data.entidades, {
						Id: vm.filter.id,
						Codigo: vm.filter.codigo,
						Nombre: vm.filter.nombre,
						Descripcion: vm.filter.descripcion
					});

				var cantidadRegistros = vm.filter.entidades.length;
				var cantidadPaginas: any = cantidadRegistros / vm.paginacion.pageSize;

				if ((cantidadPaginas - parseInt(cantidadPaginas)) > 0)
					cantidadPaginas = cantidadPaginas + 1;

				if (cantidadPaginas < vm.paginacion.currentPage) {
					vm.paginacion.currentPage = 1;
				}

				var begin = ((vm.paginacion.currentPage - 1) * vm.paginacion.pageSize);
				var end = begin + vm.paginacion.pageSize;

				vm.paginacion.totalItems = vm.filter.entidades.length;
				vm.filter.entidades = vm.filter.entidades.slice(begin, end);
			}

			/* FORMULARIO */

			function validarForm() {
				var _flag = false;

				if (vm.formData.entidadSeleccionada && !angular.isUndefined(vm.formData.entidadSeleccionada.Id))
					_flag = true;

				return _flag;
			}

			function cancel() {
				$uibModalInstance.dismiss('close');
			}

			function returnEntidad() {
				$uibModalInstance.close(vm.formData.entidadSeleccionada.Entidad);
			}

			function inicializarVariables() {
				vm.data.entidades = [];
			}

			/* -------------------------------------------- ACTIVATE -------------------------------------------- */

			activate();

			function activate() {
				inicializarVariables();
				vm.formControl.loading = true;

				var _entidades = SupportDataService.entidadesBuscador
					.then(activateOk, activateError);
			}

			function activateOk(pResults) {
				vm.data.entidades = pResults;

				if (pResults.length <= 0) 
				{ 
					AlertaService.NewWarning("No hay resultados disponibles para seleccionar.");
					cancel();
				}

				vm.formData.titulo = SupportDataService.tituloBuscador;
				vm.formData.mostrarId = SupportDataService.mostrarIdBuscador;
				vm.formData.mostrarCodigo = SupportDataService.mostrarCodigoBuscador;
				vm.formData.mostrarNombre = SupportDataService.mostrarNombreBuscador;
				vm.formData.mostrarDescripcion = SupportDataService.mostrarDescripcionBuscador;
				vm.formData.tituloId = SupportDataService.tituloIdBuscador;
				vm.formData.tituloCodigo = SupportDataService.tituloCodigoBuscador;
				vm.formData.tituloNombre = SupportDataService.tituloNombreBuscador;
				vm.formData.tituloDescripcion = SupportDataService.tituloDescripcionBuscador;

				vm.formControl.error = false;
				vm.formControl.loading = false;
				vm.paginacion.currentPage = 1;
				vm.paginacion.pageSize = 10;
				vm.paginacion.getPage();

				cleanFilters();
			}

			function activateError(pError) {
				vm.formControl.loading = false;
				ModalService.error(pError.message);
			}
		}
	};

	return module;

})();