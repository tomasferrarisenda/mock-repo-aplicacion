/**
 * @author 			pferrer
 * @description 	description
 */
import { ISupportDataService } from '../../../support/basic/services';

export default (function () {
	const module = { init: (ngModule: any) => { } };

	module.init = function (module) {

		module.controller('ExcepcionAutorizacionViewController', ExcepcionAutorizacionViewController);

		// Inyección de Dependencia
		ExcepcionAutorizacionViewController.$inject = ['$scope', '$log', '$q', '$state', 'ModalService',
			'SupportDataService', 'SupportLogicService',
			'AutorizadorDataService'];

		// Constructor del Controller
		function ExcepcionAutorizacionViewController($scope, $log, $q, $state, ModalService,
			SupportDataService: ISupportDataService, SupportLogicService,
			AutorizadorDataService) {

			//$log.debug('ExcepcionAutorizacionViewController: ON.-');

			/* ------------------------------ API Y VARIABLES ------------------------------ */

			var vm = this;

			vm.title = {
				icon: '',
				name: ''
			};

			vm.data = {
				excepcion: '',
				tiposExcepciones: [],
				practica: '',
				observacion: ''
			};

			vm.filter = {
				tipoExcepcion: '',
				codigoPractica: '',
				nombrePractica: '',
				codigoMutual: '',
				nombreMutual: ''
			};


			vm.formControl = {
				error: true,
				loading: false,
				validarError: validarError,
				reloadPage: activate,
				cancel: cancel,
				ok: guardarEntidad,

				/*PRACTICA*/
				buscarPracticas: buscarPracticas,
				buscarPractica: buscarPractica,
				buscarPracticaEnter: buscarPracticaEnter,
				/*MUTUAL*/
				buscarMutuales: buscarMutuales,
				buscarMutual: buscarMutual,
				buscarMutualEnter: buscarMutualEnter,

				validarForm: validarForm
			};

			$scope.validar = {
				error: validarError
			};

			/* IMPLEMENTACIÓN DE MÉTODOS*/

			/* FORMULARIO */

			function validarError(pBool) {
				return pBool ? null : 'error';
			}

			function validarForm() {
				var _flag = false;
				//if (angular.isUndefined(vm.data.mutual)) {

				//mutual requerida
				if (vm.filter.codigoMutual == null || vm.filter.codigoMutual == '') {
					_flag = true;
				}
				//practica requerida
				if (vm.filter.codigoPractica == null || vm.filter.codigoPractica == '') {
					_flag = true;
				}

				return _flag;
			}

			function guardarEntidad() {
				//setear objecto excepcion
				setearExcepcion();
				//validaciones
				AutorizadorDataService.validarGuardar(vm.data.excepcion)
					.then(function (result) {
						if (result.IsOk == false) {
							ModalService.error(result.Message);
							return;
						}
						else {
							//guardar	
							AutorizadorDataService.guardarExcepcion(vm.data.excepcion)
								.then(function (result) {
									AutorizadorDataService.excepcion.Mutual = vm.data.mutual;
									//$location.url('/Autorizador/List/Excepciones');
									$state.go('facturacion.autorizador.excepciones.list');

								})
								.catch(function (pError) {
									ModalService.error(pError.message);
									return;
								});
						}
					})
					.catch(function (pError) {
						ModalService.error(pError.message);
						return;
					});
			}


			function setearExcepcion() {
				vm.data.excepcion.TipoExcepcionAutorizacion = null;// vm.filter.tipoExcepcion;
				vm.data.excepcion.IdTipoExcepcionAutorizacion = vm.filter.tipoExcepcion.Id;

				if (vm.data.mutual != null)
					vm.data.excepcion.IdMutual = vm.data.mutual.Id;
				else
					vm.data.excepcion.IdMutual = 0;

				if (vm.data.practica != null)
					vm.data.excepcion.IdPracticaMedica = vm.data.practica.id_practica_medica;
				else
					vm.data.excepcion.IdPracticaMedica = 0;

				vm.data.excepcion.Observacion = $.trim(vm.data.observacion);

				if (vm.data.excepcion.Observacion == null)
					vm.data.excepcion.Observacion = '';

				AutorizadorDataService.excepcion = vm.data.excepcion;
			}

			/* ------------------------------ IMPLEMENTACIÓN ------------------------------ */

			function inicializarVariables() {
				vm.data.excepcion = null;
				vm.data.practica = null;
				vm.data.mutual = null;
				vm.data.observacion = '';
				vm.data.tiposExcepciones = [];
			}

			function cancel() {
				$state.go('facturacion.autorizador.excepciones.list');
			}

			/* BUSCADOR PRACTICAS */

			function buscarPracticas() {
				SupportDataService.entidadesBuscador = AutorizadorDataService.getAllPracticaMedica();
				SupportDataService.tituloBuscador = 'Seleccionar Práctica';
				SupportDataService.mostrarIdBuscador = false;
				SupportDataService.mostrarCodigoBuscador = true;
				SupportDataService.mostrarNombreBuscador = true;
				SupportDataService.mostrarDescripcionBuscador = false;
				SupportDataService.tituloIdBuscador = '';
				SupportDataService.tituloCodigoBuscador = 'Código';
				SupportDataService.tituloNombreBuscador = 'Práctica';
				SupportDataService.tituloDescripcionBuscador = '';
				SupportLogicService.openSelectorBase()
					.then(function (result) {
						vm.filter.codigoPractica = result.codigo_practica_medica;
						vm.filter.nombrePractica = result.nombre_practica_medica;
						vm.data.practica = result;
					})
					.catch(function (pError) {
						limpiarFiltroPracticas();
						return;
					});
			};

			function buscarPractica() {
				if (vm.filter.codigoPractica != null && vm.filter.codigoPractica != '') {
					AutorizadorDataService.getPracticaByCodigo(vm.filter.codigoPractica).then(function (result) {
						if (result == null) {
							limpiarFiltroPracticas();
						}
						else {
							vm.filter.codigoPractica = result.codigo_practica_medica;
							vm.filter.nombrePractica = result.nombre_practica_medica;
							vm.data.practica = result;
						}
					})
						.catch(function (pError) {
							ModalService.error(pError.message);
							limpiarFiltroPracticas();
						});
				}
				else {
					limpiarFiltroPracticas();
				}
			}

			function buscarPracticaEnter(keyEvent) {
				if (keyEvent.which === 13)
					buscarPractica();
			}

			function limpiarFiltroPracticas() {
				vm.filter.codigoPractica = '';
				vm.filter.nombrePractica = '';
				vm.data.practica = null;
			}

			/* BUSCADOR MUTUALES */

			function buscarMutuales() {
				SupportDataService.entidadesBuscador = AutorizadorDataService.getAllMutualConAutorizadorNoHijas();
				SupportDataService.tituloBuscador = 'Seleccionar Mutual';
				SupportDataService.mostrarIdBuscador = false;
				SupportDataService.mostrarCodigoBuscador = true;
				SupportDataService.mostrarNombreBuscador = true;
				SupportDataService.mostrarDescripcionBuscador = false;
				SupportDataService.tituloIdBuscador = '';
				SupportDataService.tituloCodigoBuscador = 'Codigo';
				SupportDataService.tituloNombreBuscador = 'Mutual';
				SupportDataService.tituloDescripcionBuscador = '';
				SupportLogicService.openSelectorBase()
					.then(function (result) {
						vm.filter.codigoMutual = result.Codigo;
						vm.filter.nombreMutual = result.Nombre;
						vm.data.mutual = result;
					})
					.catch(function (pError) {
						limpiarFiltroMutuales();
						return;
					});
			};

			function buscarMutual() {
				if (vm.filter.codigoMutual != null && vm.filter.codigoMutual != '') {
					AutorizadorDataService.getMutualByCodigo(vm.filter.codigoMutual)
						.then(function (result) {
							if (result == null) {
								limpiarFiltroMutuales();
							}
							else {
								vm.filter.codigoMutual = result.Codigo;
								vm.filter.nombreMutual = result.Nombre;
								vm.data.mutual = result;
							}
						})
						.catch(function (pError) {
							ModalService.error(pError.message);
							limpiarFiltroMutuales();
						});
				}
				else {
					limpiarFiltroMutuales();
				}
			}

			function buscarMutualEnter(keyEvent) {
				if (keyEvent.which === 13)
					buscarMutual();
			}

			function limpiarFiltroMutuales() {
				vm.filter.codigoMutual = '';
				vm.filter.nombreMutual = '';
				vm.data.mutual = null;
			}

			/* ------------------------------ ACTIVATE ------------------------------ */

			activate();

			/* Método inicializador */
			function activate() {
				inicializarVariables();
				AutorizadorDataService.getAllTipoExcepcionesEntidad().then(function (results) {
					vm.data.tiposExcepciones = results;
					vm.filter.tipoExcepcion = vm.data.tiposExcepciones;
					vm.data.excepcion = AutorizadorDataService.excepcion;

					vm.title.name = vm.data.excepcion.Id !== 0 ? 'Editar Excepción' : 'Nueva Excepción';
					vm.title.icon = vm.data.excepcion.Id !== 0 ? 'EDIT' : 'NEW2';

					if (vm.data.excepcion != null) {
						//mutual
						vm.filter.codigoMutual = vm.data.excepcion.CodigoMutual;
						buscarMutual();
						//practica
						vm.filter.codigoPractica = vm.data.excepcion.CodigoPracticaMedica;
						buscarPractica();

						for (var i = vm.data.tiposExcepciones.length - 1; i >= 0; i--) {
							if (vm.data.tiposExcepciones[i].Id == vm.data.excepcion.IdTipoExcepcionAutorizacion) {
								vm.filter.tipoExcepcion = vm.data.tiposExcepciones[i];
							}

						}
						vm.data.observacion = vm.data.excepcion.Observacion;
					}
					vm.formControl.loading = false;
				})
					.catch(function (pError) {
						vm.formControl.loading = false;
						vm.formControl.error = true;
					})
			}

		};
	};

	return module;
})();