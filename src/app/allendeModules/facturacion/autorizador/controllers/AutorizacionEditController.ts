/**
 * @author 			pferrer
 * @description 	description
 */

import { ISupportDataService } from '../../../support/basic/services';
import { IProfesionalesDataService } from '../../../profesionales';

export default (function () {
	const module = { init: (ngModule: any) => { } };

	module.init = function (module) {

		module.controller('AutorizacionEditController', AutorizacionEditController);

		// Inyección de Dependencia
		AutorizacionEditController.$inject = ['$scope', '$log', '$q', '$filter', '$state', 'ModalService',
			'SupportDataService', 'SupportLogicService', 'ProfesionalesDataService',
			'AutorizadorDataService', 'AutorizadorAuthService', 'User', 'PacienteDataService'];

		// Constructor del Controller
		function AutorizacionEditController($scope, $log, $q, $filter, $state, ModalService,
			SupportDataService: ISupportDataService, SupportLogicService, ProfesionalesDataService: IProfesionalesDataService,
			AutorizadorDataService, AutorizadorAuthService, User, PacienteDataService) {

			//$log.debug('AutorizacionEditController: ON.-');
			/* ------------------------------ API Y VARIABLES ------------------------------ */

			var vm = this;

			vm.title = {
				name: '',
				icon: ''
			};

			vm.data = {
				autorizacion: '',
				items: [],
				tiposMensajes: [],
				tipoMensaje: '',
				sucursales: [],
				sucursal: '',
				servicios: [],
				servicio: '',
				tiposDocumentos: [],
				tipoDocumento: '',
				numeroAfiliado: '',
				mutual: '',
				profesional: '',
				diagnostico: '',
				cantidadItem: '',
				nrotransaccion: '',
				tipoDocumentoPaciente: '',
				numeroDocumentoPaciente: '',
				nombrePaciente: ''
			};

			vm.filter = {
				codigoMutual: '',
				nombreMutual: '',
				idMutual: 0,
				idPaciente: 0,
				matriculaProfesional: 0,
				nombreProfesional: '',
				codigoCIE10: '',
				nombreCIE10: '',
				matriculaSolicitante: '',
				visibleAgregarItem: false,
				modificacion: false,
				puedeEliminarItem: false
			};


			vm.formControl = {
				error: false,
				loading: false,
				validarError: validarError,
				reloadPage: activate,
				cancel: cancel,
				ok: guardarEntidad,
				changeTipoMensaje: changeTipoMensaje,
				eliminarItem: eliminarItem,

				buscarPaciente: buscarPaciente,

				/*MUTUAL*/
				buscarMutuales: buscarMutuales,
				buscarMutual: buscarMutual,
				buscarMutualEnter: buscarMutualEnter,
				
			/*PROFESIONAL*/
				buscarProfesionales: buscarProfesionales,
				buscarProfesional: buscarProfesional,
				buscarProfesionalEnter: buscarProfesionalEnter,
				/*CIE10*/
				buscarCIE10s: buscarCIE10s,
				buscarCIE10: buscarCIE10,
				buscarCIE10Enter: buscarCIE10Enter,

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

				//mutual requerida
				if (vm.filter.codigoMutual == null || vm.filter.codigoMutual == '') {
					_flag = true;
				}
				if (vm.filter.idPaciente == null || vm.filter.idPaciente == 0) {
					_flag = true;
				}


				return _flag;
			}

			function guardarEntidad() {
				//setear objecto autorizacion
				setearAutorizacion();
				//validaciones
				AutorizadorDataService.validarGuardarAutorizacion(vm.data.autorizacion)
					.then(function (result) {

						if (result.IsOk == false) {
							ModalService.error(result.Message);
							return;
						}
						else {
							AutorizadorDataService.guardarAutorizacion(vm.data.autorizacion)
								.then(function (result) {
									$state.go('facturacion.autorizador.autorizaciones.list');
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

			function eliminarItem(pItem) {
				vm.data.autorizacion.Items.splice(vm.data.autorizacion.Items.indexOf(pItem), 1);
			}

			function setearAutorizacion() {
				if (vm.data.autorizacion.Id == 0)
					vm.data.autorizacion.IdTipoOrigenAutorizacion = 60;

				vm.data.autorizacion.IdTipoMensaje = vm.data.tipoMensaje.Id;

				vm.data.autorizacion.IdMutual = vm.filter.idMutual;

				if (vm.filter.idPaciente == null)
					vm.filter.idPaciente = 0;
				vm.data.autorizacion.IdPaciente = vm.filter.idPaciente;

				vm.data.autorizacion.NroAfiliado = vm.data.numeroAfiliado;

				if (vm.data.servicio != null && vm.data.servicio.Id > 0)
					vm.data.autorizacion.IdServicio = vm.data.servicio.Id;
				else
					vm.data.autorizacion.IdServicio = 0;

				if (vm.data.sucursal != null && vm.data.sucursal.Id > 0)
					vm.data.autorizacion.IdSucursal = vm.data.sucursal.Id;
				else
					vm.data.autorizacion.IdSucursal = 0;

				if (vm.data.tipoDocumento != null && vm.data.tipoDocumento.Id > 0)
					vm.data.autorizacion.IdTipoDocumento = vm.data.tipoDocumento.Id;
				else
					vm.data.autorizacion.IdTipoDocumento = 0;

				vm.data.autorizacion.NumeroMatriculaEfector = vm.data.profesional.numero_matricula;

				vm.data.autorizacion.MatriculaSolicitante = vm.filter.matriculaSolicitante;
				vm.data.autorizacion.NroTransaccion = vm.data.nrotransaccion;
				vm.data.autorizacion.Diagnostico = $.trim(vm.data.diagnostico);
				vm.data.autorizacion.Cie10 = $.trim(vm.filter.codigoCIE10);
			}

			function changeTipoMensaje() {
				if (vm.data.tipoMensaje == null) {
					vm.filter.visibleAgregarItem = false;
				}
				else {
					if (vm.data.tipoMensaje.Id == 1) {
						vm.filter.visibleAgregarItem = true;
					}
					else {
						vm.filter.visibleAgregarItem = false;
					}
				}
			}

			/* ------------------------------ IMPLEMENTACIÓN ------------------------------ */

			function inicializarVariables() {
				vm.data.items = [];
				vm.data.tiposMensajes = [];
				vm.data.sucursales = [];
				vm.data.servicios = [];
			}

			function cancel() {
				$state.go('facturacion.autorizador.autorizaciones.list');
			}

			/* BUSCADOR MUTUALES */

			function buscarMutuales() {
				SupportDataService.entidadesBuscador = AutorizadorDataService.getAllMutualConAutorizador();
				SupportDataService.tituloBuscador = 'Seleccionar Mutual';
				SupportDataService.mostrarIdBuscador = false;
				SupportDataService.mostrarCodigoBuscador = true;
				SupportDataService.mostrarNombreBuscador = true;
				SupportDataService.mostrarDescripcionBuscador = false;
				SupportDataService.tituloIdBuscador = '';
				SupportDataService.tituloCodigoBuscador = 'Código';
				SupportDataService.tituloNombreBuscador = 'Mutual';
				SupportDataService.tituloDescripcionBuscador = '';
				SupportLogicService.openSelectorBase()
					.then(function (result) {
						vm.filter.codigoMutual = result.Codigo;
						vm.filter.nombreMutual = result.Nombre;
						vm.filter.idMutual = result.Id;
						vm.data.mutual = result;
					})
					.catch(function (pError) {
						limpiarFiltroMutuales();
						return;
					});
			};

			function buscarMutual() {
				if (vm.filter.codigoMutual != null && vm.filter.codigoMutual != '') {
					AutorizadorDataService.getMutualByCodigo(vm.filter.codigoMutual).then(function (result) {
						if (result == null) {
							limpiarFiltroMutuales();
						}
						else {
							vm.filter.codigoMutual = result.Codigo;
							vm.filter.nombreMutual = result.Nombre;
							vm.filter.idMutual = result.Id;
							vm.data.mutual = result;
						}
					}).catch(function (pError) {
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
				vm.filter.idMutual = 0;
				vm.data.mutual = null;
			}

			/* BUSCADOR PROFESIONALES */

			function buscarProfesionales() {
				SupportDataService.entidadesBuscador = ProfesionalesDataService.getAllProfesional();
				SupportDataService.tituloBuscador = 'Seleccionar Profesional';
				SupportDataService.mostrarIdBuscador = false;
				SupportDataService.mostrarCodigoBuscador = true;
				SupportDataService.mostrarNombreBuscador = true;
				SupportDataService.mostrarDescripcionBuscador = false;
				SupportDataService.tituloIdBuscador = '';
				SupportDataService.tituloCodigoBuscador = 'Matrícula';
				SupportDataService.tituloNombreBuscador = 'Profesional';
				SupportDataService.tituloDescripcionBuscador = '';
				SupportLogicService.openSelectorBase()
					.then(function (result) {
						vm.filter.matriculaProfesional = result.numero_matricula;
						vm.filter.nombreProfesional = result.nombre_completo;
						vm.data.profesional = result;
					})
					.catch(function (pError) {
						limpiarFiltroProfesionales();
					});
			};

			function buscarProfesional() {
				if (vm.filter.matriculaProfesional != null && vm.filter.matriculaProfesional != '') {
					ProfesionalesDataService.getProfesionalByMatricula(vm.filter.matriculaProfesional).then(function (result) {
						if (result == null) {
							limpiarFiltroProfesionales();
						}
						else {
							vm.filter.matriculaProfesional = result.numero_matricula;
							vm.filter.nombreProfesional = result.nombre_completo;
							vm.data.profesional = result;
						}
					})
						.catch(function (pError) {
							ModalService.error(pError.message);
							limpiarFiltroProfesionales();;
						});
				}
				else {
					limpiarFiltroProfesionales();
				}
			}

			function buscarProfesionalEnter(keyEvent) {
				if (keyEvent.which === 13)
					buscarProfesional();
			}

			function limpiarFiltroProfesionales() {
				vm.filter.matriculaProfesional = 0;
				vm.filter.nombreProfesional = '';
				vm.data.profesional = null;
			}

			/* BUSCADOR CIE10 */

			function buscarCIE10s() {
				SupportDataService.entidadesBuscador = AutorizadorDataService.getAllCIE10();
				SupportDataService.tituloBuscador = 'Seleccionar CIE10';
				SupportDataService.mostrarIdBuscador = false;
				SupportDataService.mostrarCodigoBuscador = true;
				SupportDataService.mostrarNombreBuscador = true;
				SupportDataService.mostrarDescripcionBuscador = false;
				SupportDataService.tituloIdBuscador = '';
				SupportDataService.tituloCodigoBuscador = 'Código';
				SupportDataService.tituloNombreBuscador = 'Descripción';
				SupportDataService.tituloDescripcionBuscador = '';
				SupportLogicService.openSelectorBase()
					.then(function (result) {
						vm.filter.codigoCIE10 = result.Codigo;
						vm.filter.nombreCIE10 = result.Nombre;
					})
					.catch(function (pError) {
						limpiarFiltroCIE10s();
					});
			};

			function buscarCIE10() {
				if (vm.filter.codigoCIE10 != null && vm.filter.codigoCIE10 != '') {
					AutorizadorDataService.getCIE10ByCodigo($filter('uppercase')(vm.filter.codigoCIE10)).then(function (result) {
						if (result == null) {
							limpiarFiltroCIE10s();
						}
						else {
							vm.filter.codigoCIE10 = result.Codigo;
							vm.filter.nombreCIE10 = result.Nombre;
						}
					})
						.catch(function (pError) {
							ModalService.error(pError.message);
							limpiarFiltroCIE10s();;
						});
				}
				else {
					limpiarFiltroCIE10s();
				}
			}

			function buscarCIE10Enter(keyEvent) {
				if (keyEvent.which === 13)
					buscarCIE10();
			}

			function limpiarFiltroCIE10s() {
				vm.filter.codigoCIE10 = '';
				vm.filter.nombreCIE10 = '';
				vm.data.CIE10 = null;
			}

			function buscarPaciente(idPaciente) {
				PacienteDataService.obtenerPacientePorId(idPaciente)
						.then(function (result) {
							if (result == null) {
								//limpiarDatos();
							}
							else {
								vm.filter.nombrePaciente = result.NombreCompleto;
								vm.filter.numeroDocumentoPaciente = result.NumeroDocumento;
								vm.filter.tipoDocumentoPaciente = vm.data.tiposDocumentos.find(x => x.Id == result.IdTipoDocumento)

							}
						},function (pError) {
							//limpiarDatos();
						});
			}

			/* ------------------------------ ACTIVATE ------------------------------ */

			activate();

			/* Método inicializador */
			function activate() {
				inicializarVariables();
				
				var _tiposMensajes = AutorizadorDataService.getAllTipoMensajeAutorizador();
				var _tiposDocumentos = AutorizadorDataService.getAllTipoDocumento();

				$q.all([_tiposMensajes, _tiposDocumentos])
					.then(activateOk, activateError);
			}

			function activateOk(results) {
				vm.data.sucursales = User.sucursales;
				vm.data.sucursal = vm.data.sucursales[0];
				vm.data.servicios = User.servicios;
				vm.data.tiposDocumentos = results[1];

				vm.data.autorizacion = AutorizadorDataService.autorizacion;

				vm.title.name = vm.data.autorizacion.Id === 0 ? 'Nueva Autorización' : 'Editar Autorización';
				vm.title.icon = vm.data.autorizacion.Id === 0 ? 'NEW2' : 'EDIT';

				var tMensajes = results[0];
				if (vm.data.autorizacion.Id == 0) {
					for (var i = tMensajes.length - 1; i >= 0; i--) {
						//a pedido de marina, dejo solo habilitado la elegibilidad
						if (tMensajes[i].Id == 4) {
							vm.data.tiposMensajes.push(tMensajes[i]);
							vm.data.tipoMensaje = tMensajes[i];
						}
					}
				}
				else {
					vm.data.tiposMensajes = tMensajes;
					vm.data.tipoMensaje = vm.data.tiposMensajes[0];
				}

				vm.data.tipoDocumento = vm.data.tiposDocumentos[0];
				changeTipoMensaje();

				if (vm.data.autorizacion.Id > 0) {

					for (var i = 0; i < vm.data.tiposMensajes.length; i++) {
						if (vm.data.tiposMensajes[i] == vm.data.autorizacion.IdTipoMensaje) {
							vm.data.tipoMensaje = vm.data.tiposMensajes[i];
						}
					}

					//mutual
					vm.filter.codigoMutual = vm.data.autorizacion.CodigoMutual;
					buscarMutual();

					vm.filter.idPaciente = vm.data.autorizacion.IdPaciente;

					buscarPaciente(vm.filter.idPaciente);

					vm.data.numeroAfiliado = $.trim(vm.data.autorizacion.NroAfiliado);

					for (var i = vm.data.servicios.length - 1; i >= 0; i--) {
						if (vm.data.servicios[i].Id == vm.data.autorizacion.IdServicio) {
							vm.data.servicio = vm.data.servicios[i];
							break;
						}
					}

					for (var i = vm.data.sucursales.length - 1; i >= 0; i--) {
						if (vm.data.sucursales[i].Id == vm.data.autorizacion.IdSucursal) {
							vm.data.sucursal = vm.data.sucursales[i];
							break;
						}
					}

					for (var i = vm.data.tiposDocumentos.length - 1; i >= 0; i--) {
						if (vm.data.tiposDocumentos[i].Id == vm.data.autorizacion.IdTipoDocumento) {
							vm.data.tipoDocumento = vm.data.tiposDocumentos[i];
							break;
						}
					}

					//Profesional
					vm.filter.matriculaProfesional = vm.data.autorizacion.NumeroMatriculaEfector;
					buscarProfesional();

					vm.filter.matriculaSolicitante = $.trim(vm.data.autorizacion.MatriculaSolicitante);

					vm.data.nrotransaccion = $.trim(vm.data.autorizacion.NroTransaccion);
					//vm.data.codigoPreAutorizacion = vm.data.autorizacion.CodigoPreautorizacion;
					vm.data.diagnostico = $.trim(vm.data.autorizacion.Diagnostico);

					vm.filter.codigoCIE10 = $.trim(vm.data.autorizacion.Cie10);
					buscarCIE10();

					vm.filter.modificacion = true;

				}

				vm.formControl.loading = false;
				vm.filter.puedeEliminarItem = AutorizadorAuthService.puedeEliminarItemAutorizacion(User);
			}

			function activateError(pError) {
				vm.formControl.loading = false;
				ModalService.error(pError.message);
			}

		};
	};

	return module;
})();