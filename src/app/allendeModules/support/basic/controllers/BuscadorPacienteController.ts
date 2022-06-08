/**
 * @author 			ppautasso
 * @description 	description
 */
import * as angular from 'angular';
import { IPacienteDataService } from '../../../persona/paciente/services';
import { ISupportDataService } from '../../../support/basic/services';

export default (function () {
	'use strict';
	
	const module = { init : (ngModule: any) => {} };

	module.init = function(module) {

		module.controller('BuscadorPacienteController', BuscadorPacienteController);

		// Inyección de Dependencia
		BuscadorPacienteController.$inject = ['Logger', '$q', '$filter', '$scope', '$uibModalInstance', '$state', 
			'SupportDataService', 'pacientesCollection', 'PacienteDataService', 'esSelectorNew', 'dataSearch','AlertaService',
			'NuevoPaciente', 'ENV'
		];

		// Constructor del Controller
		function BuscadorPacienteController($log, $q, $filter, $scope, $uibModalInstance, $state,
			SupportDataService: ISupportDataService, pacientesCollection, PacienteDataService: IPacienteDataService, esSelectorNew, dataSearch, AlertaService,
			NuevoPacienteIf, ENV
		) {

			/* ------------------------------------------------ LOG ------------------------------------------------ */

			$log = $log.getInstance('BuscadorPacienteController');
			$log.debug('ON.-');

			/* ------------------------------------------ API Y VARIABLES ------------------------------------------ */

			var vm = this;
			vm.title = {
				page: 'Buscador Pacientes'
			};

			vm.filtroNombreShow = false;

			vm.formData = {
				pacienteSeleccionado: null
			};

			vm.data = {
				tipos: [],
				pacientes: pacientesCollection,
				dataBusqueda: dataSearch
			};

			vm.textN = "Nombre";

			vm.filterNombre = "";
			vm.filterApellido = "";
			vm.filterNroDocumento = "";

			vm.columnasTabla = [
				{
					label: "Nombre",
					field: "Nombre",
					order: 1
				},
				{
					label: "Apellido",
					field: "Apellido",
					order: 2
				}, {
					label: "Tipo Documento",
					field: "TipoDocumento",
					order: 3
				}, {
					label: "Numero Documento",
					field: "NumeroDocumento",
					order: 4
				}, {
					label: "FechaNacimiento",
					field: "FechaNacimiento",
					order: 5
				}];

			vm.filter = {
				pacientes: [],
				tipo: '',
				tipoDocumento: '',
				numero: '',
				nombre: '',
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
				ok: returnPaciente,
				cancel: cancel,
				buscar: buscar,
				selectItem: selectItem,
				selectItemAndClose: selectItemAndClose,
				reloadPage: activate,
				validarForm: validarForm,
				limpiar: cleanFilters,
				esNuevo: false,
				esSelectorNew: esSelectorNew,
				nuevoPacienteIf: NuevoPacienteIf,
				nuevoPaciente: nuevoPaciente,
				mouseOver: mouseOver
			};

			function selectItem(id) {

				vm.formData.pacienteSeleccionado = null;
				for (var i = 0; i < vm.filter.pacientes.length; i++) {
					vm.filter.pacientes[i].Seleccionado = false;
				}

				for (var i = 0; i < vm.filter.pacientes.length; i++) {
					if (vm.filter.pacientes[i].Id == id) {
						vm.filter.pacientes[i].Seleccionado = true;
					}

					if (vm.filter.pacientes[i].Seleccionado == true) {
						vm.formData.pacienteSeleccionado = vm.filter.pacientes[i];
					}
				}
			}

			function selectItemAndClose(id) {

				selectItem(id);
				returnPaciente();

			}

			vm.sort = function(keyname) {
				$scope.sortKey = keyname; //set the sortKey to the param passed
				$scope.reverse = !$scope.reverse; //if true make it false and vice versa
			};

			/* ------------------------------------------- IMPLEMENTACIÓN ------------------------------------------- */
 
			function cleanFilters() {
				vm.filter.numero = '';
				vm.filter.nombre = '';
				vm.filter.apellido = '';
				vm.filterNombre = "";
				vm.filterApellido = "";
				vm.filterNroDocumento = "";
				vm.paginacion.currentPage = 1;
				vm.paginacion.pageChanged();

				//limpiamos la grilla tambien
				vm.filter.pacientes.length = 0;
				vm.data.pacientes.length = 0;

			}

			function buscar() {

				var idTipoDoc = 0;
				if (vm.filter.tipoDocumento != null && vm.filter.tipoDocumento != '' &&
					!angular.isUndefined(vm.filter.tipoDocumento) && !angular.isUndefined(vm.filter.tipoDocumento.Id)) {
					idTipoDoc = vm.filter.tipoDocumento.Id;
				}

				var numeroDoc = (vm.filter.numero) ?
					vm.filter.numero : " ";


				//si es selector nuevo, busco por nombre y apellido separados
				if (vm.formControl.esSelectorNew) {

					var nombrePaciente = (vm.filter.nombre) ?
						vm.filter.nombre : null;

					var apellidoPaciente = (vm.filter.apellido) ?
						vm.filter.apellido : null;


					PacienteDataService.obtenerPacienteConSimilaresSinGrid(idTipoDoc, numeroDoc, nombrePaciente, apellidoPaciente)
						.then(function(result) {
							vm.data.pacientes = result;
							vm.filter.pacientes = angular.copy(vm.data.pacientes);
							if (vm.filter.pacientes.length === 0) {

								AlertaService.NewWarning("Alerta", "No se encontraron pacientes con los criterios utilizados");

							}else {
								getPage();
							}
							vm.formControl.loading = false;
							//cleanFilters();
						}, function(pError) {
							vm.formControl.loading = false;
							//ModalService.error(pError.message);
						});


				} // si es el selector viejo, busco por nombre y apellido todo junto 
				else {

					var nombrePac = (vm.filter.nombreyapellido) ?
						vm.filter.nombreyapellido : null;

					PacienteDataService.getPacientesByFiltro(idTipoDoc, numeroDoc, nombrePac)
						.then(function(result) {
							vm.data.pacientes = result;
							vm.filter.pacientes = vm.data.pacientes;
							getPage();
							vm.formControl.loading = false;
						}, function(pError) {
							vm.formControl.loading = false;
							//ModalService.error(pError.message);
						});
				}


				vm.formControl.loading = true;

				$log.debug('busqueda...', vm.filter.pacientes);

			}

			function validarFilters() {
				if (vm.filterNombre == null)
					vm.filterNombre = '';
				if (vm.filterApellido == null)
					vm.filterApellido = '';
				if (vm.filterNroDocumento == null)
					vm.filterNroDocumento = '';
			}

			function getPage() {

				vm.filter.validar();

				// vm.filter.pacientes = $filter('filter')
				// 	(vm.data.pacientes, {
				// 		NumeroDocumento: '',
				// 		NombreCompleto: ''
				// 	});

				vm.filter.pacientes = $filter('filter')
					(vm.data.pacientes, {
						Nombre: vm.filterNombre,
						Apellido: vm.filterApellido,
						NumeroDocumento: vm.filterNroDocumento
					});

				var cantidadRegistros = vm.filter.pacientes.length;
				var cantidadPaginas : any = cantidadRegistros / vm.paginacion.pageSize;

				if ((cantidadPaginas - parseInt(cantidadPaginas)) > 0)
					cantidadPaginas = cantidadPaginas + 1;

				if (cantidadPaginas < vm.paginacion.currentPage) {
					vm.paginacion.currentPage = 1;
				}

				var begin = ((vm.paginacion.currentPage - 1) * vm.paginacion.pageSize);
				var end = begin + vm.paginacion.pageSize;

				vm.paginacion.totalItems = vm.filter.pacientes.length;
				vm.filter.pacientes = vm.filter.pacientes.slice(begin, end);
			}

			/* FORMULARIO */

			function validarForm() {
				var _flag = false;

				if (vm.formData.pacienteSeleccionado && !angular.isUndefined(vm.formData.pacienteSeleccionado.Id))
					_flag = true;

				return _flag;
			}

			function cancel() {
				$uibModalInstance.dismiss('close');
			}

			function returnPaciente() {
				$uibModalInstance.close(vm.formData.pacienteSeleccionado);
			}


			function inicializarVariables() {
				vm.filter.numero = '';
				vm.filter.nombre = '';
			}

			function nuevoPaciente() {
				
				//voy a nuevo paciente state pero si tengo datos le mando datos paciente.new
				//controlo si tengo datos  y los mando

				// $state.go('paciente.new', { numeroDocumento: 12354, nombre: 'pepe', apellido: 'castro'});
				// $state.go('paciente.new');
				// $state.go('paciente.new', {
				// 	externo: false,
				// 	internoApp: true,
				// 	idTipoDocumento: vm.filter.tipoDocumento.Id || 0,
				// 	numeroDocumento: vm.filter.numero || 0,
				// 	nombre: vm.filter.nombre || "",
				// 	apellido: vm.filter.apellido || ""
				// });
				window.location.href = `${ENV.APP2}/paciente/edit/`
				cancel();
			}

			function mouseOver(state) {
				if (vm.filter.pacientes){
					if (vm.filterNombre == '' || angular.isUndefined(vm.filterNombre))
						vm.filtroNombreShow = state;
					else vm.filtroNombreShow = true;
					
				}
				
			}

			/* --------------------------------------------- ACTIVATE --------------------------------------------- */

			activate();

			function activate() {
				inicializarVariables();
				vm.formControl.loading = true;

				if (vm.data.pacientes) {

					vm.filter.pacientes = angular.copy(vm.data.pacientes);
					if(vm.filter.pacientes.length === 0){
						AlertaService.NewWarning("Alerta", "No se encontraron pacientes con los criterios utilizados");
					}
				}

				if(vm.data.dataBusqueda !== ''){

					//tengo datos de busqueda entonces los cargo en el selector
					$log.debug('tengo data de busqueda', vm.data.dataBusqueda);
					vm.filter.numero = angular.copy(vm.data.dataBusqueda);
				}

				var _tipos = SupportDataService.obtenerTodosTipoDocumento()
					.then(activateOk, activateError);
			}

			function activateOk(pResults) {

				vm.data.tipos = pResults;

				vm.formControl.error = false;
				vm.formControl.loading = false;
				vm.paginacion.currentPage = 1;
				vm.paginacion.pageSize = 10;
				vm.paginacion.getPage();

			}

			function activateError(pError) {
				vm.formControl.loading = false;
			}
		}
	};

	return module;

})();