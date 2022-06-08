/**
 * @author:			Pedro Ferrer
 * @description:	Prefactura Ambulatorio Controller
 * @type:			Controller
 **/
import * as angular from 'angular';
import { ISupportDataService } from '../../../../support/basic/services';
import { IProfesionalesDataService } from '../../../../profesionales';

export default (function () {
	const module = { init: (ngModule: any) => { } };

	module.init = function (module) {

		module.controller('PrefacturaAmbulatorioNewController', PrefacturaAmbulatorioNewController);

		PrefacturaAmbulatorioNewController.$inject = [
			'Logger', '$q', 'PrefacturaAmbulatorioDataService', 'Cie10DataService', 'ContratableDataService', 'User', 'AuthorizationService', 
			'ModalService', 'SupportDataService', 'ProfesionalesDataService',
			'DateUtils', '$state', 'FinanciadorLogicService', 'PrefacturaAmbulatorioLogicService',
			'PrefacturaAmbulatorioStorageHelperService', 'AlertaService', '$scope', 'ParticipanteDataService', 'AutorizadorDataService', 'AutorizadorLogicService',
			'$stateParams', 'TIPO_PARTICIPANTE', '$filter', 'moment',
			'SEXO', 'StateHelperService', 'ORIGEN_PREFACTURA', 'TIPO_PREFACTURABLE', 'TIPO_REQUISITO', 'MUTUAL_SANCOR', 'ENV'
		];

		function PrefacturaAmbulatorioNewController(
			$log, $q, PrefacturaAmbulatorioDataService, Cie10DataService, ContratableDataService, User, AuthorizationService,
			ModalService, SupportDataService: ISupportDataService, ProfesionalesDataService: IProfesionalesDataService,
			DateUtils, $state, FinanciadorLogicService, PrefacturaAmbulatorioLogicService,
			PrefacturaAmbulatorioStorageHelperService, AlertaService, $scope, ParticipanteDataService, AutorizadorDataService, AutorizadorLogicService,
			$stateParams, TIPO_PARTICIPANTE, $filter, moment,
			SEXO, StateHelperService, ORIGEN_PREFACTURA, TIPO_PREFACTURABLE, TIPO_REQUISITO, MUTUAL_SANCOR, ENV
		) {
			/* ------------------------------------------------ LOG ------------------------------------------------ */

			$log = $log.getInstance('PrefacturaAmbulatorioNewController');
			$log.debug('ON.-');

			/* ----------------------------------------- API Y VARIABLESES ----------------------------------------- */

			var vm = this;
			vm.today = new Date();
			vm.ORIGEN_PREFACTURA = ORIGEN_PREFACTURA;
			vm.TIPO_PREFACTURABLE = TIPO_PREFACTURABLE;
			vm.TIPO_REQUISITO = TIPO_REQUISITO;

			vm.UsuarioFacturista = false;
			vm.UsuarioPreFacturista = false;

			vm.title = {
				name: '',
				icon: ''
			}

			vm.data = {
				prefactura: '',
				componentes: '',
				estadoAutorizacionAnterior: {
					AutorizacionManual: false,
					EstadoAutorizacion: '',
					ColorAutorizacion: '',
					MensajeAutorizacion: '',
					NroAutorizacion: ''
				},
				primeraLetraSancor: '',
				patologias: ''
			};

			vm.menuOptions = [];

			vm.filter = {
				cie10: '',
				tecnico: '',
				idAmbito: '',
				coberturas: '',
				tiposAfiliacion: '',
				tiposEstudios: '',
				coberturaElegida: '',
				fechaRealizacion: '',
				fechaPrescripcion: '',
				participanteNuevo: '',
				profesionalEfector: '',
				profesionalEfectorPrevio : '',
				prefacturableNuevo: '',
				profesionalSolicitante: '',
				TipoAfiliacionElegida: '',
				totalPaciente: 0,
				totalRecepcion: 0,
				totalFinanciador: 0,
				soloConsulta: false,
				editarAutorizacion: false,
				limiteParticipantes: false,
				mostrarNuevoParticipante: false,
				mostrarNuevoPrefacturable: false
			}

			vm.formControl = {
				loading: false,
				verDetalle: false,
				volver: volver,
				validarGuardar: validarGuardar,
				guardar: guardar,
				clickRequisito: clickRequisito,
				editarPaciente: editarPaciente,
				verDetalleItem: verDetalleItem,
				focoAgregarItem: focoAgregarItem,
				infoFinanciador: infoFinanciador,
				cambioCobertura: cambioCobertura,
				restablecerImporte: restablecerImporte,
				eliminarParticipante: eliminarParticipante,
				cambiarCuentaParticipante: cambiarCuentaParticipante,
				eliminarPrefacturable: eliminarPrefacturable,
				cambioMontosPrefactura: cambioMontosPrefactura,
				cambioPorcentejePracticaParticipante: cambioPorcentejePracticaParticipante,
				editarProfesionalParticipante: editarProfesionalParticipante,
				calcularTotalPrefactura: calcularTotalPrefactura,
				cargarPrefacturableNuevo: cargarPrefacturableNuevo,
				cambioImporteParticipante: cambioImporteParticipante,
				cambioPorcentajeCoseguro: cambioPorcentajeCoseguro,
				cambioImporteCoseguro: cambioImporteCoseguro,
				editarAutorizacion: editarAutorizacion,
				validarAutorizar: validarAutorizar,
				autorizar: autorizar,
				imprimirOrden: imprimirOrden,
				habilitarAutorizacionOnline: habilitarAutorizacionOnline,
				cambioNroAutorizacion: cambioNroAutorizacion,
				calcularImporteItemUnitario : calcularImporteItemUnitario,
				calcularImporteItemTotal : calcularImporteItemTotal,
				calcularImporteItemTotalFinanciador : calcularImporteItemTotalFinanciador,
				calcularImporteItemTotalPaciente : calcularImporteItemTotalPaciente,
				disabledSave: disabledSave,
				itemConPorcentajePracticaParticipanteEditado: itemConPorcentajePracticaParticipanteEditado,
				inicializarMenuOptions: inicializarMenuOptions,
				saveDisabled: false,
				editarItemPrefactura: editarItemPrefactura,
				verPatologia: false
			};

			vm.storage = {
				keyPrefacturaStorage: "prefactura-ambulatorio-data",
			};

			function itemConPorcentajePracticaParticipanteEditado(item) {
				return item.Participantes.some(p => p.PorcentajePractica !== 100);
			}

			/* SOLO PARA SANCOR */
			vm.autorizacionManualSancor = [
				{ NombreOpcion: 'Autorización Web', Id: 1, LetraInicio: 'W' },
				{ NombreOpcion: 'Formulario', Id: 2, LetraInicio: 'F' },
				{ NombreOpcion: 'Manual', Id: 3, LetraInicio: '' }
			]

			/* ------------------------------------------- IMPLEMENTACIÓN ------------------------------------------- */

			/* FORMULARIO */

			function editarItemPrefactura(index, item){
				PrefacturaAmbulatorioLogicService.editaritemPrefactura(item).then((itemPrefacturable) => {
	
					PrefacturaAmbulatorioDataService.cambiarCodigoItemPrefacturado(item.Id,itemPrefacturable.IdTipo,itemPrefacturable.Id).then((result)=>{
						if (result.IsOk===true){
							vm.data.prefactura.Items[index] = result.Entidad;
						}
						else {
							ModalService.loadingClose();
							ModalService.warning('Verifique por favor. ' + result.Message);
						}
						
					})
					
				})
			}

			function volver() {
				
				StateHelperService.goToPrevState({enviarEfector: false});
			}

			function imprimirOrden() {
				AutorizadorDataService.getOrdenPracticaPorPrefactura(vm.data.prefactura.Id).then(function (result) {
					AutorizadorDataService.ordenPractica = result;
					AutorizadorLogicService.printOrdenPractica();
				});

				// AutorizadorDataService.exportarOrdenPracticaPorPrefactura(vm.data.prefactura.Id).then(function (result) {
					
				// });
			}

			function disabledSave(){
				vm.formControl.saveDisabled = true;
				setTimeout(() => {
					vm.formControl.saveDisabled = false;
					}, 1000);
			}

			function itemConAutorizacionRechazada(item){
				return item && item.EstadoAutorizacion === "NO AUTORIZADO"
			}




			function validarAutorizar(formPrefactura){

				function validarNumeroAfiliado(): boolean {
					return (formPrefactura && formPrefactura.pref_amb_edit_nroafiliado_input) ? formPrefactura.pref_amb_edit_nroafiliado_input.$valid : true
				}
				
				// VALIDAR FORMATO AFILIADO
				if (!validarNumeroAfiliado()) {
					ModalService.confirm('El formato de número de afiliado no es válido para la mutual seleccionada, por favor verifique. Desea continuar', (result) => {
						if (result){
							if(vm.data.prefactura.AutorizadorValidaCSC){
								comprobarCSC();
							}else
							autorizar();
						}else  return;
					});
				}else {
					if(vm.data.prefactura.AutorizadorValidaCSC){
						comprobarCSC();
					}else
					autorizar();
				}
			}

			function comprobarCSC(){
				PrefacturaAmbulatorioLogicService.validarCscEnPrefactura().then((responseCSC) => {

					vm.data.prefactura.CSCAfiliado = responseCSC;
					autorizar();
					
				}, (error) => {
					//no hago nada
				});
			}



			function autorizar() {
				var mensaje = '';

				function validarMedicoSolicitanteCuandoNoEsSoloConsulta(): boolean {
					if (vm.filter.soloConsulta === false) {
						return vm.filter.profesionalSolicitante && vm.filter.profesionalSolicitante.Id ? true : false;
					}
					return true;
				}

				function validarFechaPrescripcionCuandoNoEsSoloConsulta(): boolean {
					if (vm.filter.soloConsulta === false) {

						return vm.filter.fechaPrescripcion ? true : false;
					}
					return true;
				}

				function validarDiagnosticoCuandoNoEsSoloConsulta(): boolean {
					if (vm.filter.soloConsulta === false) {
						return vm.data.prefactura.Diagnostico && vm.data.prefactura.Diagnostico.length ? true : false
					}
					return true;
				}

				if (!validarMedicoSolicitanteCuandoNoEsSoloConsulta()) {
					mensaje = mensaje + 'Se requiere médico solicitante. ';
				}
				if (!validarDiagnosticoCuandoNoEsSoloConsulta()) {
					mensaje = mensaje + 'Se requiere diagnóstico. ';
				}
				if (!validarFechaPrescripcionCuandoNoEsSoloConsulta()) {
					mensaje = mensaje + 'Se requiere fecha de prescripción. ';
				}

				if (mensaje) {
					ModalService.warning(mensaje);
					return;
				}

				for (let i = 0; i < vm.data.prefactura.Items.length; i++) {
					if (vm.data.prefactura.Items[i].Participantes.length === 0) {
						if (!mensaje) mensaje = "Los siguientes ítems no poseen participantes:";
						mensaje += " *" + vm.data.prefactura.Items[i].Nombre;
					}
				}
				if (mensaje) {
					ModalService.warning(mensaje);
					return;
				}

				var tieneParticipanteSinCuenta = false;
				for (let i = 0; i < vm.data.prefactura.Items.length; i++) {
					for (let j = 0; j < vm.data.prefactura.Items[i].Participantes.length; j++) {
						if (!vm.data.prefactura.Items[i].Participantes[j].IdCuenta) {
							tieneParticipanteSinCuenta = true;
							if (!mensaje) mensaje = "Los siguientes ítems poseen participante sin cuenta:";
							mensaje += " *" + vm.data.prefactura.Items[i].Nombre;
							break;
						}
					}
				}
				if(tieneParticipanteSinCuenta==true){
					mensaje += ". Comuníquese con Facturación.";
				}

				if (mensaje) {
					ModalService.warning(mensaje);
					return;
				}

				asignarValoresPrefactura();

				ModalService.loadingOpen();
				PrefacturaAmbulatorioDataService.guardarPrefactura(vm.data.prefactura).then(function (result) {
					if (result.IsOk === true) {
						PrefacturaAmbulatorioDataService.autorizarPrefactura(vm.data.prefactura.Id).then(function (resultDto) {
							ModalService.loadingClose();
							if (resultDto.IsOk === true) {
								// Guardo estado anterior de la autorización
								vm.data.estadoAutorizacionAnterior.EstadoAutorizacion = resultDto.Prefactura.EstadoAutorizacion;
								vm.data.estadoAutorizacionAnterior.ColorAutorizacion = resultDto.Prefactura.ColorAutorizacion;
								vm.data.estadoAutorizacionAnterior.MensajeAutorizacion = resultDto.Prefactura.MensajeAutorizacion;
								vm.data.estadoAutorizacionAnterior.NroAutorizacion = resultDto.Prefactura.NroAutorizacion;

								// Cargo los datos relacionados a la autorización en la prefactura, y piso los ítems.
								vm.data.prefactura.ColorAutorizacion = resultDto.Prefactura.ColorAutorizacion;
								vm.data.prefactura.MensajeAutorizacion = resultDto.Prefactura.MensajeAutorizacion;
								vm.data.prefactura.EstadoAutorizacion = resultDto.Prefactura.EstadoAutorizacion;
								vm.data.prefactura.NroAutorizacion = resultDto.Prefactura.NroAutorizacion;
								vm.data.prefactura.NroAfiliado = resultDto.Prefactura.NroAfiliado;
								vm.data.prefactura.AutorizacionAutomatica = resultDto.Prefactura.AutorizacionAutomatica;
								vm.data.prefactura.IdPlan = resultDto.Prefactura.IdPlan;
								
								if (vm.data.prefactura.IdTipoAfiliado !== resultDto.Prefactura.IdTipoAfiliado) {
									vm.data.prefactura.IdTipoAfiliado = resultDto.Prefactura.IdTipoAfiliado;									
									if (vm.data.prefactura.IdTipoAfiliado === 1 || vm.data.prefactura.IdTipoAfiliado === 2) {
										vm.filter.TipoAfiliacionElegida = vm.filter.tiposAfiliacion.find(x => x.Id === vm.data.prefactura.IdTipoAfiliado);
									}	
								}

								vm.data.prefactura.TieneAutorizador = resultDto.Prefactura.TieneAutorizador;
								vm.data.prefactura.NombreTipoAfiliado = resultDto.Prefactura.NombreTipoAfiliado;
								vm.data.prefactura.AutorizacionManual = resultDto.Prefactura.AutorizacionManual;
								vm.data.prefactura.CSCAfiliado = resultDto.Prefactura.CSCAfiliado;
								vm.data.prefactura.TieneItemsPorAutorizar = resultDto.Prefactura.TieneItemsPorAutorizar;
								vm.data.prefactura.TieneItemsAutorizados = resultDto.Prefactura.TieneItemsAutorizados;
								vm.data.prefactura.TodosItemsRechazados = resultDto.Prefactura.Items.every(itemConAutorizacionRechazada);

								for (let i = 0; i < vm.data.prefactura.Items.length; i++) {
									for (let j = 0; j < resultDto.Prefactura.Items.length; j++) {
										if (vm.data.prefactura.Items[i].Id === resultDto.Prefactura.Items[j].Id) {
											vm.data.prefactura.Items[i].Cantidad = resultDto.Prefactura.Items[j].Cantidad;
											vm.data.prefactura.Items[i].CantidadOriginal = resultDto.Prefactura.Items[j].CantidadOriginal;
											vm.data.prefactura.Items[i].ImporteCoseguro = resultDto.Prefactura.Items[j].ImporteCoseguro;
											vm.data.prefactura.Items[i].PorcentajeCoseguro = resultDto.Prefactura.Items[j].PorcentajeCoseguro;
											vm.data.prefactura.Items[i].EstadoAutorizacion = resultDto.Prefactura.Items[j].EstadoAutorizacion;
											vm.data.prefactura.Items[i].IdEstadoAutorizacion = resultDto.Prefactura.Items[j].IdEstadoAutorizacion;
											vm.data.prefactura.Items[i].ColorAutorizacion = resultDto.Prefactura.Items[j].ColorAutorizacion;
											vm.data.prefactura.Items[i].MensajeAutorizacion = resultDto.Prefactura.Items[j].MensajeAutorizacion;
											vm.data.prefactura.Items[i].Autorizado = resultDto.Prefactura.Items[j].Autorizado;
											vm.data.prefactura.Items[i].NroAutorizacion = resultDto.Prefactura.Items[j].NroAutorizacion;
											vm.data.prefactura.Items[i].CSCAfiliado = resultDto.Prefactura.Items[j].CSCAfiliado;
											vm.data.prefactura.Items[i].AutorizacionManual = resultDto.Prefactura.Items[j].AutorizacionManual;
											vm.data.prefactura.Items[i].EstaAutorizadoOnline = resultDto.Prefactura.Items[j].EstaAutorizadoOnline;
	

											vm.data.prefactura.Items[i].IdMutual = resultDto.Prefactura.Items[j].IdMutual;
											vm.data.prefactura.Items[i].CodigoMutual = resultDto.Prefactura.Items[j].CodigoMutual;
											vm.data.prefactura.Items[i].IdPlan = resultDto.Prefactura.Items[j].IdPlan;
											vm.data.prefactura.Items[i].NroAfiliado = resultDto.Prefactura.Items[j].NroAfiliado;
											vm.data.prefactura.Items[i].IdTipoAfiliado = resultDto.Prefactura.Items[j].IdTipoAfiliado;
										}
									}
								}

								// Lee de nuevo las coberturas del paciente por si el autorizador cambió el plan
								leerCoberturasPaciente();
							}
							else {
								ModalService.warning('No se puede autorizar, verifique por favor. ' + resultDto.Message);
							}
						})
					}
					else {
						ModalService.loadingClose();
						ModalService.warning('Verifique por favor. ' + result.Message);
					}
				});
			}

			function editarAutorizacion() {
				vm.data.prefactura.AutorizacionManual = !vm.data.prefactura.AutorizacionManual;

				if (vm.data.prefactura.AutorizacionManual) {
					/* SOLO PARA SANCOR */
					var codigoMutualNumber = parseInt(vm.data.prefactura.CodigoMutual);

					if (codigoMutualNumber === MUTUAL_SANCOR.SANCORMADRE ||
						codigoMutualNumber === MUTUAL_SANCOR.SANCOR432K ||
						codigoMutualNumber === MUTUAL_SANCOR.SANCOR1K ||
						codigoMutualNumber === MUTUAL_SANCOR.SANCOR432KSMP ||
						codigoMutualNumber === MUTUAL_SANCOR.SANCOR1KSMP) {
						let options: Array<any> = [];
						for (let i = 0; i < vm.autorizacionManualSancor.length; i++) {
							options.push({
								id: vm.autorizacionManualSancor[i].Id,
								label: vm.autorizacionManualSancor[i].NombreOpcion,
								letraInicio : vm.autorizacionManualSancor[i].LetraInicio
							});
						};
						ModalService.selectOptionModal(options).then(function (opcionElegida) {
							vm.data.primeraLetraSancor = opcionElegida.letraInicio;
							vm.data.prefactura.EstadoAutorizacion = 'MANUAL';
							vm.data.prefactura.ColorAutorizacion = 'color-gris-autorizacion';
							vm.data.prefactura.MensajeAutorizacion = '';
							if (vm.data.prefactura.NroAutorizacion) {
								if (vm.data.prefactura.NroAutorizacion.charAt(0).toLowerCase() === 'w' || vm.data.prefactura.NroAutorizacion.charAt(0).toLowerCase() === 'f') {
									vm.data.prefactura.NroAutorizacion = opcionElegida.letraInicio + vm.data.prefactura.NroAutorizacion.slice(1);
								}
								else {
									vm.data.prefactura.NroAutorizacion = opcionElegida.letraInicio + vm.data.prefactura.NroAutorizacion;
								}
							}
							$("#txtNumeroAutorizacion").focus(); // Redirige foco a al input de NroAutorizacion, solo si es Sancor y toda la gilada
						}).catch(function(){
							// Recursividad piola, para que cuando cierren la modal con el botón cancelar, se vuelva a estado inicial
							// todo el tema de la autorización y su número
							editarAutorizacion();
						});
					}
					else {
						vm.data.prefactura.EstadoAutorizacion = 'MANUAL';
						vm.data.prefactura.ColorAutorizacion = 'color-gris-autorizacion';
						vm.data.prefactura.MensajeAutorizacion = '';
						vm.data.prefactura.NroAutorizacion = '';
					}
					/* FIN BLOQUE SANCOR */

				} else {
					vm.data.prefactura.EstadoAutorizacion = '';
					vm.data.prefactura.ColorAutorizacion = 'color-gris-autorizacion';
					vm.data.prefactura.MensajeAutorizacion = '';
					vm.data.prefactura.NroAutorizacion = '';
				}
			}

			function validarGuardar(formPrefactura){
				function validarNumeroAfiliado(): boolean {
					return (formPrefactura && formPrefactura.pref_amb_edit_nroafiliado_input) ? formPrefactura.pref_amb_edit_nroafiliado_input.$valid : true
				}
				
				// VALIDAR FORMATO AFILIADO
				if (!validarNumeroAfiliado()) {
					ModalService.confirm('El formato de número de afiliado no es válido para la mutual seleccionada, por favor verifique. Desea continuar', (result) => {
						if (result){
							guardar();
						}else  return;
					});
				}else guardar();
			}

			function guardar() {
			
				var mensaje = '';

				// Validaciones de cabecera prefactura
				function requisitoLogicoSinChequear(requisito) {
					return requisito.IdTipoRequisito === TIPO_REQUISITO.LOGICO && requisito.Respuesta === false;
				}

				function itemConPrecioInformado(item) {
					return item.Participantes.some(p => p.Importe !== p.ImporteSugerido);
				}

				function itemConImporteCero(item) {
					return item.Participantes.some(p => p.Importe == 0);
				}

				function itemNoIncluido(item) {
					return !item.EstaIncluido;
				}

				function tieneAutorizadorOnlinePeroFaltaNro() {
					if(vm.data.prefactura.AutorizacionAutomatica) return false;
					if(vm.data.prefactura.TieneAutorizador && !vm.data.prefactura.RequiereAutorizacion) return false;
					return vm.data.prefactura.TieneAutorizador && !vm.data.prefactura.NroAutorizacion;
				}

				function requiereAutorizacionPeroFaltaNro() {
					if(vm.data.prefactura.AutorizacionAutomatica) return false;
					return vm.data.prefactura.RequiereAutorizacion && !vm.data.prefactura.NroAutorizacion;
				}

				function tienePresupuestoPrevioAprobado() {
					return vm.data.prefactura.RequierePresupuestoPrevioAprobado && !vm.data.prefactura.TienePresupuestoPrevioAprobado;
				}

				function validarMedicoSolicitanteCuandoNoEsSoloConsulta(): boolean {
					if (vm.filter.soloConsulta === false) {
						return vm.filter.profesionalSolicitante && vm.filter.profesionalSolicitante.Id ? true : false;
					}
					return true;
				}

				function validarFechaPrescripcionCuandoNoEsSoloConsulta(): boolean {
					if (vm.filter.soloConsulta === false) {

						return vm.filter.fechaPrescripcion ? true : false;
					}
					return true;
				}

				function validarDiagnosticoCuandoNoEsSoloConsulta(): boolean {
					if (vm.filter.soloConsulta === false) {
						return vm.data.prefactura.Diagnostico && vm.data.prefactura.Diagnostico.length ? true : false
					}
					return true;
				}
				
				 


				if (!vm.data.prefactura.Observacion) {

					var validacionReqAdm = vm.data.prefactura.Requisitos.some(requisitoLogicoSinChequear);
					var validacionPrecioInformado = vm.data.prefactura.Items.some(itemConPrecioInformado);
					var validacionImporteCero = vm.data.prefactura.Items.some(itemConImporteCero);
					var validacionItemNoIncluido = vm.data.prefactura.Items.some(itemNoIncluido);
					var validacionAutorizacion = tieneAutorizadorOnlinePeroFaltaNro() || requiereAutorizacionPeroFaltaNro();
					var validacionTienePresupuesto = tienePresupuestoPrevioAprobado();

					if (validacionReqAdm) {
						mensaje = 'Existen requisitos sin chequear';
					}

					if (validacionPrecioInformado) {
						if (mensaje == '') {
							mensaje = 'Existen precios informados';
						} else {
							mensaje = mensaje + ', precios informados';
						}
					}

					if (validacionImporteCero) {
						if (mensaje == '') {
							mensaje = 'Verifique, existen participantes con importes en cero. Por favor comunicarse con Facturación para verificar o registre una observacion para continuar.';
						} else {
							mensaje = mensaje + ', verifique, existen participantes con importes en cero. Por favor comunicarse con Facturación para verificar o registre una observacion para continuar.';
						}
					}

					if (validacionItemNoIncluido) {
						if (mensaje == '') {
							mensaje = 'Existen códigos no incluidos';
						} else {
							mensaje = mensaje + ', códigos no incluidos';
						}
					}

					if (validacionAutorizacion) {
						if (mensaje == '') {
							mensaje = 'Falta número de autorización';
						} else {
							mensaje = mensaje + ', falta número de autorización';
						}
					}

					if (validacionTienePresupuesto) {
						if (mensaje == '') {
							mensaje = 'Se requiere presupuesto previo aprobado';
						} else {
							mensaje = mensaje + ', se requiere presupuesto previo aprobado';
						}
					}

					if (validacionReqAdm || validacionPrecioInformado || validacionItemNoIncluido || validacionAutorizacion || validacionTienePresupuesto) {
						mensaje = mensaje + ". Debe completar la carga o especificar el motivo en observaciones. ";
					}
				}

				if (!validarMedicoSolicitanteCuandoNoEsSoloConsulta()) {
					mensaje = mensaje + 'Se requiere médico solicitante. ';
				}
				if (!validarDiagnosticoCuandoNoEsSoloConsulta()) {
					mensaje = mensaje + 'Se requiere diagnóstico. ';
				}
				if (!validarFechaPrescripcionCuandoNoEsSoloConsulta()) {
					mensaje = mensaje + 'Se requiere fecha de prescripción. ';
				}

				if (mensaje) {
					ModalService.warning(mensaje);
					return;
				}

				// Validaciones de recorrido de ítems
				for (let i = 0; i < vm.data.prefactura.Items.length; i++) {
					if (vm.data.prefactura.Items[i].Coseguro > vm.data.prefactura.Items[i].HonorarioEspecialista + vm.data.prefactura.Items[i].HonorarioAyudante + vm.data.prefactura.Items[i].HonorarioAnestesista + vm.data.prefactura.Items[i].Derecho + vm.data.prefactura.Items[i].ImporteGlobal) {
						if (!mensaje) mensaje = "Los siguientes ítems poseen un coseguro mayor al monto unitario:";
						mensaje += " *" + vm.data.prefactura.Items[i].Nombre;
					}
				}
				if (mensaje) {
					ModalService.warning(mensaje);
					return;
				}

				var tieneItemSinParticipante = false;
				for (let i = 0; i < vm.data.prefactura.Items.length; i++) {
					if (vm.data.prefactura.Items[i].Participantes.length === 0) {
						tieneItemSinParticipante = true;
						if (!mensaje) mensaje = "Los siguientes ítems no poseen participantes:";
						mensaje += " *" + vm.data.prefactura.Items[i].Nombre;
					}
				}
				if(tieneItemSinParticipante==true){
					mensaje += ". Por favor, comuníquese con Facturación.";
				}
				if (mensaje) {
					ModalService.warning(mensaje);
					return;
				}

				var tieneParticipanteSinCuenta = false;
				for (let i = 0; i < vm.data.prefactura.Items.length; i++) {
					for (let j = 0; j < vm.data.prefactura.Items[i].Participantes.length; j++) {
						if (!vm.data.prefactura.Items[i].Participantes[j].IdCuenta) {
							tieneParticipanteSinCuenta = true;
							if (!mensaje) mensaje = "Los siguientes ítems poseen participante sin cuenta:";
							mensaje += " *" + vm.data.prefactura.Items[i].Nombre;
							break;
						}
					}
				}
				if(tieneParticipanteSinCuenta==true){
					mensaje += ". Por favor, comuníquese con Facturación.";
				}
				if (mensaje) {
					ModalService.warning(mensaje);
					return;
				}

				asignarValoresPrefactura();

				let options: Array<any> = [];
						for (let i = 0; i < vm.filter.tiposEstudios.length; i++) {
							options.push({
								id: vm.filter.tiposEstudios[i].Id,
								label: vm.filter.tiposEstudios[i].Nombre
							});
						};								
	
				if(vm.data.prefactura.IdTipoEstudio === 0 && vm.data.prefactura.Items.some(p=> p.Codigo === '170101')){
					ModalService.selectOptionModal(options, 'Seleccionar tipo de Estudio')
					.then((pResultEleccion) => {
						vm.data.prefactura.IdTipoEstudio = pResultEleccion.id; 
						GuardarPrefact();
					});
				} 
				else {
					GuardarPrefact();
				}

			}

			function GuardarPrefact() {
				// Guarda la prefa y redirige al estado anterior.
				// Switch para futura expansión desde donde se llama a esta ventana. Hoy es turno, para después será de rayos, internados, etc...
				switch (vm.filter.idAmbito) {
					case ORIGEN_PREFACTURA.LISTADO_PREFACTURACION:
					case ORIGEN_PREFACTURA.TURNO_EDICION:
						PrefacturaAmbulatorioDataService.guardarPrefactura(vm.data.prefactura).then(function (result) {
							if (result.IsOk === true) {
								StateHelperService.goToPrevState();
							}
							else {
								ModalService.warning('Verifique por favor. ' + result.Message);
							}
						});
						break;
					case ORIGEN_PREFACTURA.TURNO:
						PrefacturaAmbulatorioDataService.receptarTurnoAPartirDePrefacturaAmbulatoria(vm.data.prefactura).then(function (result) {
							if (result.IsOk === true) {
								StateHelperService.goToPrevState({enviarEfector: result.EnviarAEfector});
							}
							else {
								ModalService.warning('Verifique por favor. ' + result.Message);
							}
						});
						break;
					default:
						ModalService.warning('Camino no implementado.');
						break;
				}
			}

			// Seteo de los valores a la prefactura, para guardarla o pasar a otro estado, por ejemplo editar un paciente
			function asignarValoresPrefactura() {
				vm.data.prefactura.IdMutual = vm.filter.coberturaElegida ? vm.filter.coberturaElegida.IdMutual : 0;
				vm.data.prefactura.IdPlan = vm.filter.coberturaElegida ? vm.filter.coberturaElegida.IdPlanMutual : 0;
				vm.data.prefactura.IdCie10 = vm.filter.cie10 ? vm.filter.cie10.Id : 0;
				vm.data.prefactura.IdProfesionalSolicitante = vm.filter.profesionalSolicitante ? vm.filter.profesionalSolicitante.Id : 0;
				vm.data.prefactura.MatriculaProfesionalSolicitante = vm.filter.profesionalSolicitante ? vm.filter.profesionalSolicitante.Matricula : 0;
				vm.data.prefactura.IdTipoProfesionalSolicitante = vm.filter.profesionalSolicitante ? vm.filter.profesionalSolicitante.IdTipoSolicitante : 0;
				vm.data.prefactura.FechaPrescripcion = DateUtils.parseToBe(vm.filter.fechaPrescripcion);
				vm.data.prefactura.IdTipoAfiliado = vm.filter.TipoAfiliacionElegida ? vm.filter.TipoAfiliacionElegida.Id : 0;
				vm.data.prefactura.IdTecnico = vm.filter.tecnico ? vm.filter.tecnico.Id : 0;

				for (let i = 0; i < vm.data.prefactura.Items.length; i++) {
					for (let j = 0; j < vm.data.prefactura.Items[i].Participantes.length; j++) {
						if (vm.data.prefactura.Items[i].Participantes[j].Cuenta) {
							vm.data.prefactura.Items[i].Participantes[j].IdCuenta = vm.data.prefactura.Items[i].Participantes[j].Cuenta.Id;
							vm.data.prefactura.Items[i].Participantes[j].NumeroCuenta = vm.data.prefactura.Items[i].Participantes[j].Cuenta.Numero;
						}
					}
				}
			}

			// Habilita/deshabilita el botón de Autorizar
			function habilitarAutorizacionOnline() {
				if (vm.formControl.loading) return false;

				if (!vm.data.prefactura.TieneAutorizador || vm.data.prefactura.AutorizacionManual) return false;

				if (vm.data.prefactura.TieneAutorizador && !vm.data.prefactura.AutorizacionManual && vm.data.prefactura.TieneItemsPorAutorizar) return true;

				for (let index = 0; index < vm.data.prefactura.Items.length; index++) {
					if (vm.data.prefactura.Items[index].NroAutorizacion == null && !vm.data.prefactura.Items[index].AutorizacionManual) {
						return true;
					}
				}
				return false;
			}

			function editarPaciente() {
				grabarDirectivas();
				setStoredData();
				//DEPRECADO => se redirige a appv2
				// $state.go('paciente.edit', {
				// 	idPaciente: vm.data.prefactura.IdPaciente
				// });
				console.log(`${ENV.APP2}/paciente/edit/` + vm.data.prefactura.IdPaciente);
				window.location.href = `${ENV.APP2}/paciente/edit/` + vm.data.prefactura.IdPaciente;
			}

			function verDetalleItem(index, detalle) {
				for (var i = vm.data.prefactura.Items.length - 1; i >= 0; i--) {
					vm.data.prefactura.Items[i].VerDetalle = false;
				}
				vm.data.prefactura.Items[index].VerDetalle = !detalle;
				vm.filter.mostrarNuevoParticipante = false;
				vm.filter.participanteNuevo = null;
				// Hasta 4 participantes, especialista, ayudante, anestesista y derechos. Esto habilita/deshabilita el agregar mas participantes al item
				vm.filter.limiteParticipantes = vm.data.prefactura.Items[index].Participantes.length >= 4;

				$log.debug("Detalle del Item ",vm.data.prefactura.Items)
			}

			function guardarRequisitos(listaRequisitosPrefactura) {
				var requisitos = new Array();
				var requisito = {
					IdRequisito: '',
					IdTipoRequisito: '',
					Respuesta: ''
				}

				for (let i = 0; i < listaRequisitosPrefactura.length; i++) {
					var requisitoCopy = angular.copy(requisito);
					requisitoCopy.IdRequisito = listaRequisitosPrefactura[i].IdRequisito;
					requisitoCopy.IdTipoRequisito = listaRequisitosPrefactura[i].IdTipoRequisito;
					requisitoCopy.Respuesta = listaRequisitosPrefactura[i].Respuesta;

					requisitos.push(requisitoCopy);
				}
				return requisitos;
			}

			function eliminarPrefacturable(index, item) {
				ModalService.confirm('¿Confirma la eliminación del ítem?', function (pResult) {
					if (pResult) {
						// Elimina no solo el ítem de la prefactura, sino también aquellos requisitos que se agregaron gracias a éste.
						PrefacturaAmbulatorioDataService.eliminarItemPrefactura(item.Id).then(function (result) {
							if (result.IsOk === true) {
								var nombreItemEliminado = vm.data.prefactura.Items[index].Nombre;
								vm.data.prefactura.Items.splice(index, 1);

								// var requisitos = guardarRequisitos(vm.data.prefactura.Requisitos);
								// vm.data.prefactura.Requisitos = result.Entidad.Requisitos;
								// for (let j = 0; j < requisitos.length; j++) {
								// 	for (let k = 0; k < vm.data.prefactura.Requisitos.length; k++) {
								// 		if (requisitos[j].IdRequisito === vm.data.prefactura.Requisitos[k].IdRequisito &&
								// 			requisitos[j].IdTipoRequisito === vm.data.prefactura.Requisitos[k].IdTipoRequisito) {
								// 			vm.data.prefactura.Requisitos[k].Respuesta = requisitos[j].Respuesta;
								// 			break;
								// 		}
								// 	}
								// }
								for (let j = 0; j < result.Entidad.Requisitos.length; j++) {
									for (let k = 0; k < vm.data.prefactura.Requisitos.length; k++) {
										if (result.Entidad.Requisitos[j].IdRequisito === vm.data.prefactura.Requisitos[k].IdRequisito &&
											result.Entidad.Requisitos[j].IdTipoRequisito === vm.data.prefactura.Requisitos[k].IdTipoRequisito) {
												result.Entidad.Requisitos[j].Respuesta = vm.data.prefactura.Requisitos[k].Respuesta ? 'true' : 'false';
											break;
										}
									}
								}
								//vm.data.prefactura = result.Entidad;
								vm.data.prefactura.Requisitos = result.Entidad.Requisitos;

								soloConsulta();

								// PrefacturaAmbulatorioDataService.obtenerPrefacturaAmbulatorioPorId(vm.data.prefactura.Id).then(function (prefac) {
								// 	vm.data.prefactura.RequiereAutorizacion = prefac.RequiereAutorizacion;
								// 	vm.data.prefactura.TieneAutorizador = prefac.TieneAutorizador;
								// 	vm.data.prefactura.NroAutorizacion = prefac.NroAutorizacion;
								// 	vm.data.prefactura.AutorizacionManual = prefac.AutorizacionManual;
								// 	vm.data.prefactura.EstadoAutorizacion = prefac.EstadoAutorizacion;
								// 	vm.data.prefactura.ColorAutorizacion = prefac.ColorAutorizacion;
								// 	vm.data.prefactura.MensajeAutorizacion = prefac.MensajeAutorizacion;
								// 	vm.data.prefactura.AutorizacionAutomatica = prefac.AutorizacionAutomatica;
								// 	vm.data.prefactura.TieneItemsPorAutorizar = prefac.TieneItemsPorAutorizar;
								// 	vm.data.prefactura.TieneItemsAutorizados = prefac.TieneItemsAutorizados;
								// 	vm.data.prefactura.RequierePresupuestoPrevioAprobado = prefac.RequierePresupuestoPrevioAprobado;
								// 	vm.data.prefactura.TienePresupuestoPrevioAprobado = prefac.TienePresupuestoPrevioAprobado;
								// });

								vm.data.prefactura.RequiereAutorizacion = result.Entidad.RequiereAutorizacion;
								vm.data.prefactura.TieneAutorizador = result.Entidad.TieneAutorizador;
								vm.data.prefactura.NroAutorizacion = result.Entidad.NroAutorizacion;
								vm.data.prefactura.CSCAfiliado = result.Entidad.CSCAfiliado;								
								vm.data.prefactura.AutorizacionManual = result.Entidad.AutorizacionManual;
								vm.data.prefactura.EstadoAutorizacion = result.Entidad.EstadoAutorizacion;
								vm.data.prefactura.ColorAutorizacion = result.Entidad.ColorAutorizacion;
								vm.data.prefactura.MensajeAutorizacion = result.Entidad.MensajeAutorizacion;
								vm.data.prefactura.AutorizacionAutomatica = result.Entidad.AutorizacionAutomatica;
								vm.data.prefactura.TieneItemsPorAutorizar = result.Entidad.TieneItemsPorAutorizar;
								vm.data.prefactura.TieneItemsAutorizados = result.Entidad.TieneItemsAutorizados;
								vm.data.prefactura.RequierePresupuestoPrevioAprobado = result.Entidad.RequierePresupuestoPrevioAprobado;

								vm.data.prefactura.TodosItemsRechazados = result.Entidad.Items.every(itemConAutorizacionRechazada);

								//vm.data.prefactura.RequierePresupuestoPrevioAprobado = result.Entidad.RequierePresupuestoPrevioAprobado;
								//vm.data.prefactura.NroAutorizacion = obtenerNrosAutorizacion();
								AlertaService.NewSuccess("Item " + nombreItemEliminado + " eliminado.", "");
								calcularTotalPrefactura();
							}
							else {
								ModalService.warning('Verifique por favor. ' + result.Message);
							}
						})
					}
				});
			}

			function obtenerNrosAutorizacion(){
				var nro = "";
				vm.data.prefactura.Items.forEach(element => {
					nro = nro + element.NroAutorizacion;
					nro = nro + ",";
				});
				return nro.slice(0, -1);
			}

			function focoAgregarItem() {
				$("#btnAgregarItem").focus();
			}

			function cargarPrefacturableNuevo() {
				//Agregar un prefacturable implica si se agregar un requisito nuevo, si es consulta o distinto a ella, recalculo de montos.
				PrefacturaAmbulatorioDataService.agregarPrefacturableAPrefactura(vm.data.prefactura.Id, vm.filter.prefacturableNuevo.IdTipo, vm.filter.prefacturableNuevo.Id).then(function (result) {
					if (result.IsOk === true) {
						vm.data.prefactura.TieneItemsPorAutorizar = result.Entidad.TieneItemsPorAutorizar;
						for (let i = 0; i < result.Entidad.Items.length; i++) {
							if (result.Entidad.Items[i].IdPrefacturable === vm.filter.prefacturableNuevo.Id && result.Entidad.Items[i].IdTipoPrefacturable === vm.filter.prefacturableNuevo.IdTipo) {
								var yaExiste = false;
								for (let l = 0; l < vm.data.prefactura.Items.length; l++) {
									if (vm.data.prefactura.Items[l].Id == result.Entidad.Items[i].Id) {
										yaExiste = true;
									}
								}

								if (!yaExiste) {
									for (let l = 0; l < vm.data.prefactura.Items.length; l++) {
										vm.data.prefactura.Items[l].VerDetalle = false;
									}
									result.Entidad.Items[i].VerDetalle = true;
	
									vm.data.prefactura.Items.push(result.Entidad.Items[i]);
	
									//var requisitos = guardarRequisitos(vm.data.prefactura.Requisitos);	
									//vm.data.prefactura.Requisitos = result.Entidad.Requisitos;	
									// for (let j = 0; j < requisitos.length; j++) {
									// 	for (let k = 0; k < vm.data.prefactura.Requisitos.length; k++) {
									// 		if (requisitos[j].IdRequisito === vm.data.prefactura.Requisitos[k].IdRequisito &&
									// 			requisitos[j].IdTipoRequisito === vm.data.prefactura.Requisitos[k].IdTipoRequisito) {
									// 			vm.data.prefactura.Requisitos[k].Respuesta = requisitos[j].Respuesta;
									// 			break;
									// 		}
									// 	}
									// }
									// vm.data.prefactura.Requisitos = result.Entidad.Requisitos;
									for (let j = 0; j < result.Entidad.Requisitos.length; j++) {
										for (let k = 0; k < vm.data.prefactura.Requisitos.length; k++) {
											if (result.Entidad.Requisitos[j].IdRequisito === vm.data.prefactura.Requisitos[k].IdRequisito &&
												result.Entidad.Requisitos[j].IdTipoRequisito === vm.data.prefactura.Requisitos[k].IdTipoRequisito) {
													result.Entidad.Requisitos[j].Respuesta = vm.data.prefactura.Requisitos[k].Respuesta ? 'true' : 'false';
												break;
											}
										}
									}
									//vm.data.prefactura = result.Entidad;
									vm.data.prefactura.Requisitos = result.Entidad.Requisitos;
	
									vm.data.prefactura.RequierePresupuestoPrevioAprobado = result.Entidad.RequierePresupuestoPrevioAprobado;
	
									vm.filter.prefacturableNuevo = '';
									vm.filter.mostrarNuevoPrefacturable = false;
									soloConsulta();
									calcularTotalPrefactura();
									focoAgregarItem();
									break;
								}
							}
						}
					}
					else {
						ModalService.warning('Verifique por favor. ' + result.Message);
					}
				})
			}

			function editarParticipanteItem(participante, idItemPrefactura) {
				PrefacturaAmbulatorioDataService.editarParticipanteItemPrefacturado(participante.Id, participante.IdProfesional).then(function (result) {
					if (result.IsOk === true) {
						vm.data.prefactura.TieneItemsPorAutorizar = result.Entidad.TieneItemsPorAutorizar;
						
						for (let i = 0; i < result.Entidad.Items.length; i++) {
							
							if(result.Entidad.Items[i].Id !== idItemPrefactura) continue;
							
							result.Entidad.Items[i].VerDetalle = true;

							var itemPrefacturadoActual;
							
							for (let j = 0; j < vm.data.prefactura.Items.length; j++) {
								if(vm.data.prefactura.Items[j].Id !== idItemPrefactura) continue;	

								itemPrefacturadoActual = vm.data.prefactura.Items[j];
								break;
							}

							for (let m = 0; m < itemPrefacturadoActual.Participantes.length; m++) {
								for (let n = 0; n < result.Entidad.Items[i].Participantes.length; n++) {
									// Actualizo los valores del participante que fue actualizado
									if(itemPrefacturadoActual.Participantes[m].Id === result.Entidad.Items[i].Participantes[n].Id)
									{
										itemPrefacturadoActual.Participantes[m].Matricula = result.Entidad.Items[i].Participantes[n].Matricula;
										itemPrefacturadoActual.Participantes[m].Importe = result.Entidad.Items[i].Participantes[n].Importe;
										itemPrefacturadoActual.Participantes[m].ImporteSugerido = result.Entidad.Items[i].Participantes[n].ImporteSugerido;
										itemPrefacturadoActual.Participantes[m].IdCuenta = result.Entidad.Items[i].Participantes[n].IdCuenta;
										itemPrefacturadoActual.Participantes[m].NumeroCuenta = result.Entidad.Items[i].Participantes[n].NumeroCuenta;
										itemPrefacturadoActual.Participantes[m].Cuenta = result.Entidad.Items[i].Participantes[n].Cuenta;
										itemPrefacturadoActual.Participantes[m].Cuentas = result.Entidad.Items[i].Participantes[n].Cuentas;
										itemPrefacturadoActual.Participantes[m].IdProfesional = result.Entidad.Items[i].Participantes[n].IdProfesional;
										itemPrefacturadoActual.Participantes[m].Nombre = result.Entidad.Items[i].Participantes[n].Nombre;
										itemPrefacturadoActual.Participantes[m].CalculoImporte = result.Entidad.Items[i].Participantes[n].CalculoImporte;
									}
								}
							}

							// Si existe algún participante que no se encuentra actualmente en el ítem, lo agrego
							for (let m = 0; m < result.Entidad.Items[i].Participantes.length; m++) {
								var existeParticipante = false;
								for (let n = 0; n < itemPrefacturadoActual.Participantes.length; n++) {	
									if(itemPrefacturadoActual.Participantes[n].Id === result.Entidad.Items[i].Participantes[m].Id)
									{
										existeParticipante = true;
										break;
									}
								}
								
								if(existeParticipante === false){
									itemPrefacturadoActual.Participantes.push(result.Entidad.Items[i].Participantes[m]);
								}
							}

							var requisitos = guardarRequisitos(vm.data.prefactura.Requisitos);
							vm.data.prefactura.Requisitos = result.Entidad.Requisitos;

							for (let j = 0; j < requisitos.length; j++) {
								for (let k = 0; k < vm.data.prefactura.Requisitos.length; k++) {
									if (requisitos[j].IdRequisito === vm.data.prefactura.Requisitos[k].IdRequisito &&
										requisitos[j].IdTipoRequisito === vm.data.prefactura.Requisitos[k].IdTipoRequisito) {
										vm.data.prefactura.Requisitos[k].Respuesta = requisitos[j].Respuesta;
										break;
									}
								}
							}
							vm.data.prefactura.Requisitos = result.Entidad.Requisitos;

							vm.data.prefactura.RequierePresupuestoPrevioAprobado = result.Entidad.RequierePresupuestoPrevioAprobado;
							soloConsulta();
							calcularTotalPrefactura();
							focoAgregarItem();
							break;
						}
					}
					else {
						ModalService.warning('Verifique por favor. ' + result.Message);
					}
				})
			}

			// Modal de los datos del financiador.
			function infoFinanciador() {
				FinanciadorLogicService.infoFinanciador(vm.data.prefactura.IdMutual);
			}

			// Si los ítems que posee la prefactura son sólo consultas, sino hay que mostrar campos adicionales en la misma.
			function soloConsulta() {
				if (vm.data.prefactura.Items.length === 0) vm.filter.soloConsulta = true;
				for (let j = 0; j < vm.data.prefactura.Items.length; j++) {
					if (!vm.data.prefactura.Items[j].EsConsulta) {
						vm.filter.soloConsulta = false;
						break;
					}
					if ((j === vm.data.prefactura.Items.length - 1) && vm.data.prefactura.Items[j].EsConsulta) {
						vm.filter.soloConsulta = true;
					}
				}
			}

			// Si cambia el profesional efector, implica un recálculo de toda la prefactura.
			$scope.$watch(function () {				
				return vm.filter.profesionalEfector;
			}, function () {
				
				if (!vm.filter.profesionalEfector) {
					vm.filter.mostrarNuevoPrefacturable = false;
				}

				if (vm.filter.profesionalEfector && vm.data.prefactura.IdProfesionalEfector !== vm.filter.profesionalEfector.Id) {

					// Uso: si tengo estado vm.data.prefactura.IdEstadoPrefactura != 5 aviso para cambiar profesional efector
					// Si no tengo estado != 5 no pregunto y cambio
					if (vm.data.prefactura.IdEstadoPrefactura != 5){
						
						let optionsObj = {
							ok: 'Si',
							cancel: 'No'
						};

						ModalService.confirm("Atención: Al cambiar el profesional efector, se reevaluará la prefactura, ¿Desea continuar?",
							(_pOk) => {
								if (_pOk) {
									// tengo el ok del usuario => cambio el profesional efector
									cambiarProfesionalEfectorDePrefactura(vm.data.prefactura, vm.filter.profesionalEfector);
								}else {
									// tengo que volver a colocar el profesional que estaba antes
									ProfesionalesDataService.getProfesionalPorMatricula(vm.data.prefactura.MatriculaProfesionalEfector)
									.then( (pResult) => {
										$log.debug('restauro el efector anteriorOk',pResult);
										vm.filter.profesionalEfector = angular.copy(pResult);
									}, (pError) => {
										$log.error('pError',pError);
									});
								}
							}, "", optionsObj);

					} else {
						cambiarProfesionalEfectorDePrefactura(vm.data.prefactura, vm.filter.profesionalEfector);
					}

				}
				
			});

			function cambiarProfesionalEfectorDePrefactura(prefacturaData, profesionalEfector) {
				PrefacturaAmbulatorioDataService.cambiarProfesionalEfectorDePrefactura(prefacturaData.Id, profesionalEfector.Id).then(function (result) {
					if (result.IsOk === true) {
						
						// debemos respetar el estado del check de enivar al llamador

						let enviarAlLlamador = vm.data.prefactura.EnviarAlLlamador;

						for (let j = 0; j < result.Entidad.Requisitos.length; j++) {
							for (let k = 0; k < vm.data.prefactura.Requisitos.length; k++) {
								if (result.Entidad.Requisitos[j].IdRequisito === vm.data.prefactura.Requisitos[k].IdRequisito &&
									result.Entidad.Requisitos[j].IdTipoRequisito === vm.data.prefactura.Requisitos[k].IdTipoRequisito) {
										result.Entidad.Requisitos[j].Respuesta = vm.data.prefactura.Requisitos[k].Respuesta ? 'true' : 'false';
									break;
								}
							}
						}

						//var requisitos = guardarRequisitos(vm.data.prefactura.Requisitos);

						vm.data.prefactura = result.Entidad;
						vm.data.prefactura.Requisitos = result.Entidad.Requisitos;

						// for (let j = 0; j < requisitos.length; j++) {
						// 	for (let k = 0; k < vm.data.prefactura.Requisitos.length; k++) {
						// 		if (requisitos[j].IdRequisito === vm.data.prefactura.Requisitos[k].IdRequisito &&
						// 			requisitos[j].IdTipoRequisito === vm.data.prefactura.Requisitos[k].IdTipoRequisito) {
						// 				vm.data.prefactura.Requisitos[k].Respuesta = requisitos[j].Respuesta;
						// 			break;
						// 		}
						// 	}
						// }

						//vm.data.prefactura.Requisitos = result.Entidad.Requisitos;
						vm.data.prefactura.EnviarAlLlamador = enviarAlLlamador;

						calcularTotalPrefactura();
						vm.filter.profesionalEfectorPrevio = vm.filter.profesionalEfector;
					}
					else {
						ModalService.warning('Verifique por favor. ' + result.Message);
						vm.filter.profesionalEfector = vm.filter.profesionalEfectorPrevio;
					}
				})
			}

			// Cambio de cobertura implica un recálculo de toda la prefactura
			function cambioCobertura() {
				var diagnostico = vm.data.prefactura.Diagnostico;

				PrefacturaAmbulatorioDataService.cambiarCoberturaDePrefactura(vm.data.prefactura.Id, vm.filter.coberturaElegida.IdPlanMutual).then(function (result) {
					if (result.IsOk === true) {
						vm.data.prefactura.EstadoAutorizacion = '';
						vm.data.prefactura.ColorAutorizacion = 'color-gris-autorizacion';
						vm.data.prefactura.MensajeAutorizacion = '';
						vm.data.prefactura.NroAutorizacion = '';
						// al cambiar la prefactura debemos respetar el envío al llamador que tenemos
						let _enviarAlLlamador = angular.copy(vm.data.prefactura.EnviarAlLlamador);
						vm.data.prefactura = result.Entidad;
						vm.data.prefactura.EnviarAlLlamador = angular.copy(_enviarAlLlamador);
						vm.data.prefactura.Diagnostico = diagnostico;
						if(vm.data.prefactura.IdTipoAfiliado === 1 || vm.data.prefactura.IdTipoAfiliado === 2) {
							vm.filter.TipoAfiliacionElegida = vm.filter.tiposAfiliacion.find(x => x.Id === vm.data.prefactura.IdTipoAfiliado);
						}	
						calcularTotalPrefactura();
					}
					else {
						ModalService.warning('Verifique por favor. ' + result.Message);
					}
				})
			};

			function clickRequisito(requisito) {
				requisito.Respuesta = requisito.Respuesta ? 'true' : 'false';
			}

			//Graba todos los datos que no estan bindeados al objeto de prefactura.
			function grabarDirectivas() {
				vm.data.prefactura.IdMutual = vm.filter.coberturaElegida ? vm.filter.coberturaElegida.IdMutual : 0;
				vm.data.prefactura.IdPlan = vm.filter.coberturaElegida ? vm.filter.coberturaElegida.IdPlanMutual : 0;

				vm.data.prefactura.IdTipoAfiliado = vm.filter.TipoAfiliacionElegida ? vm.filter.TipoAfiliacionElegida.Id : 0;
				vm.data.prefactura.NombreTipoAfiliado = vm.filter.TipoAfiliacionElegida ? vm.filter.TipoAfiliacionElegida.Nombre : '';

				vm.data.prefactura.IdProfesionalEfector = vm.filter.profesionalEfector ? vm.filter.profesionalEfector.Id : 0;
				vm.data.prefactura.MatriculaProfesionalEfector = vm.filter.profesionalEfector ? vm.filter.profesionalEfector.Matricula : 0;

				vm.data.prefactura.IdProfesionalSolicitante = vm.filter.profesionalSolicitante ? vm.filter.profesionalSolicitante.Id : 0;
				vm.data.prefactura.MatriculaProfesionalSolicitante = vm.filter.profesionalSolicitante ? vm.filter.profesionalSolicitante.Matricula : 0;

				vm.data.prefactura.IdTecnico = vm.filter.tecnico ? vm.filter.tecnico.Id : 0;
				vm.data.prefactura.CodigoTecnico = vm.filter.tecnico ? vm.filter.tecnico.Codigo : 0;

				vm.data.prefactura.IdCie10 = vm.filter.cie10 ? vm.filter.cie10.Id : 0;
				vm.data.prefactura.CodigoCie10 = vm.filter.cie10 ? vm.filter.cie10.Codigo : 0;


				console.log("grabarDirectivas() IdProfesionalSolicitante ",vm.data.prefactura)
			}

			// Búsqueda del profesional en los participantes de un ítem.
			function editarProfesionalParticipante(itemIndex, idParticipante, matricula, tipoParticipante, importeManual, importeSugerido) {
				if (matricula) {
					if(idParticipante > 0){
						PrefacturaAmbulatorioDataService.actualizarParticipanteItemPrefactura(idParticipante, matricula, tipoParticipante).then(function (participante) {
							if (participante) {
								for (let i = 0; i < vm.data.prefactura.Items[itemIndex].Participantes.length; i++) {
									if (vm.data.prefactura.Items[itemIndex].Participantes[i].IdTipoComponente === participante.IdTipoComponente) {
										participante.Id = vm.data.prefactura.Items[itemIndex].Participantes[i].Id;
										vm.data.prefactura.Items[itemIndex].Participantes[i] = participante;
										break;
									}
								}

								if((tipoParticipante === 1 || tipoParticipante === 9) && participante.Id > 0)
								{
									// Participante
									editarParticipanteItem(participante, vm.data.prefactura.Items[itemIndex].Id);
								}
							}
							else {
								for (let i = 0; i < vm.data.prefactura.Items[itemIndex].Participantes.length; i++) {
									if (vm.data.prefactura.Items[itemIndex].Participantes[i].IdTipoComponente === tipoParticipante) {
										vm.data.prefactura.Items[itemIndex].Participantes[i].Cuenta = null;
										vm.data.prefactura.Items[itemIndex].Participantes[i].Cuentas = [];
										vm.data.prefactura.Items[itemIndex].Participantes[i].IdCuenta = 0;
										vm.data.prefactura.Items[itemIndex].Participantes[i].IdProfesional = 0;
										vm.data.prefactura.Items[itemIndex].Participantes[i].Nombre = null;
										vm.data.prefactura.Items[itemIndex].Participantes[i].NumeroCuenta = 0;
										break;
									}
								}
							}
						});
					} else {
						PrefacturaAmbulatorioDataService.obtenerNuevoParticipanteItemPrefacturaConMatricula(vm.data.prefactura.Items[itemIndex].Id, matricula, tipoParticipante).then(function (participante) {
							if (participante) {
								//participante.Importe = importeManual;
								//participante.ImporteSugerido = importeSugerido;
								for (let i = 0; i < vm.data.prefactura.Items[itemIndex].Participantes.length; i++) {
									if (vm.data.prefactura.Items[itemIndex].Participantes[i].IdTipoComponente === participante.IdTipoComponente) {
										participante.Id = vm.data.prefactura.Items[itemIndex].Participantes[i].Id;
										vm.data.prefactura.Items[itemIndex].Participantes[i] = participante;
										break;
									}
								}
	
								if((tipoParticipante === 1 || tipoParticipante === 9) && participante.Id > 0)
								{
									//participante
									editarParticipanteItem(participante, vm.data.prefactura.Items[itemIndex].Id);
								}
							}
							else {
								for (let i = 0; i < vm.data.prefactura.Items[itemIndex].Participantes.length; i++) {
									if (vm.data.prefactura.Items[itemIndex].Participantes[i].IdTipoComponente === tipoParticipante) {
										vm.data.prefactura.Items[itemIndex].Participantes[i].Cuenta = null;
										vm.data.prefactura.Items[itemIndex].Participantes[i].Cuentas = [];
										vm.data.prefactura.Items[itemIndex].Participantes[i].IdCuenta = 0;
										vm.data.prefactura.Items[itemIndex].Participantes[i].IdProfesional = 0;
										vm.data.prefactura.Items[itemIndex].Participantes[i].Nombre = null;
										vm.data.prefactura.Items[itemIndex].Participantes[i].NumeroCuenta = 0;
										break;
									}
								}
							}
						});
					}	
				}
				else {
					for (let i = 0; i < vm.data.prefactura.Items[itemIndex].Participantes.length; i++) {
						if (vm.data.prefactura.Items[itemIndex].Participantes[i].IdTipoComponente === tipoParticipante) {
							vm.data.prefactura.Items[itemIndex].Participantes[i].Cuenta = null;
							vm.data.prefactura.Items[itemIndex].Participantes[i].Cuentas = [];
							vm.data.prefactura.Items[itemIndex].Participantes[i].IdCuenta = 0;
							vm.data.prefactura.Items[itemIndex].Participantes[i].IdProfesional = 0;
							vm.data.prefactura.Items[itemIndex].Participantes[i].Nombre = null;
							vm.data.prefactura.Items[itemIndex].Participantes[i].NumeroCuenta = 0;
							break;
						}
					}
				}
			}

			function eliminarParticipante(itemIndex, participanteIndex) {
				switch (vm.data.prefactura.Items[itemIndex].Participantes[participanteIndex].IdTipoComponente) {
					case TIPO_PARTICIPANTE.ESPECIALISTA:
						vm.data.prefactura.Items[itemIndex].HonorarioEspecialista = 0;
						break;
					case TIPO_PARTICIPANTE.AYUDANTE:
						vm.data.prefactura.Items[itemIndex].HonorarioAyudante = 0;
						break;
					case TIPO_PARTICIPANTE.ANESTESISTA:
						vm.data.prefactura.Items[itemIndex].HonorarioAnestesista = 0;
						break;
					case TIPO_PARTICIPANTE.DERECHOS:
						vm.data.prefactura.Items[itemIndex].Derecho = 0;
						break;
					case TIPO_PARTICIPANTE.GLOBAL:
						vm.data.prefactura.Items[itemIndex].ImporteGlobal = 0;
						break;
				}
				vm.data.prefactura.Items[itemIndex].Participantes.splice(participanteIndex, 1);
				vm.filter.mostrarNuevoParticipante = false;
				vm.filter.limiteParticipantes = vm.data.prefactura.Items[itemIndex].Participantes.length >= 4;
				cambioMontosPrefactura(vm.data.prefactura.Items[itemIndex]);
			}

			function cambiarCuentaParticipante(participante){
				if(participante.IdTipoComponente == 4) {
					participante.Nombre = participante.Cuenta.Nombre;
				}
			}

			$scope.$watch(function () {
				return vm.filter.participanteNuevo;
			}, function () {
				// Agregar un nuevo participante
				if (vm.filter.participanteNuevo) {
					for (let i = 0; i < vm.data.prefactura.Items.length; i++) {
						if (vm.filter.participanteNuevo.IdItemPrefactura === vm.data.prefactura.Items[i].Id) {
							for (let j = 0; j < vm.data.prefactura.Items[i].Participantes.length; j++) {
								if (vm.filter.participanteNuevo.IdProfesional === vm.data.prefactura.Items[i].Participantes[j].IdProfesional) {
									AlertaService.NewWarning("El profesional ya se encuentra cargado.", "");
									return;
								}
							}
							vm.data.prefactura.Items[i].Participantes.push(vm.filter.participanteNuevo);
							vm.data.prefactura.Items[i].Participantes.sort(function (a, b) { return (a.IdTipoComponente > b.IdTipoComponente) ? 1 : ((b.IdTipoComponente > a.IdTipoComponente) ? -1 : 0); });
							vm.filter.limiteParticipantes = vm.data.prefactura.Items[i].Participantes.length >= 4;
							cambioImporteDelParticipante(i, vm.filter.participanteNuevo);
							cambioMontosPrefactura(vm.data.prefactura.Items[i]);
							break;
						}
					}
				}
			});

			// Vuelve el monto que pudo editar el usuario al valor del importe sugerido
			function restablecerImporte(participante, itemIndex, participanteIndex) {
				participante.Importe = participante.ImporteSugerido;
				cambioImporteParticipante(itemIndex, participanteIndex);
			}

			// Recálculo del monto de la prefactura
			function cambioImporteParticipante(itemIndex, participanteIndex) {
				var participante = vm.data.prefactura.Items[itemIndex].Participantes[participanteIndex];
				cambioImporteDelParticipante(itemIndex, participante);
				// var porcentajeItem = vm.data.prefactura.Items[itemIndex].PorcentajePractica;

				// var importeNuevo = 0;

				// if(porcentajeItem > 0 && participante.PorcentajePractica > 0){
				// 	var importeParticipanteConPorcentaje = participante.Importe * participante.PorcentajePractica / 100;
				// 	importeNuevo = importeParticipanteConPorcentaje * porcentajeItem / 100;
				// }

				// switch (participante.IdTipoComponente) {
				// 	case TIPO_PARTICIPANTE.ESPECIALISTA:
				// 		vm.data.prefactura.Items[itemIndex].HonorarioEspecialista = importeNuevo;
				// 		break;
				// 	case TIPO_PARTICIPANTE.AYUDANTE:
				// 		vm.data.prefactura.Items[itemIndex].HonorarioAyudante = importeNuevo;
				// 		break;
				// 	case TIPO_PARTICIPANTE.ANESTESISTA:
				// 		vm.data.prefactura.Items[itemIndex].HonorarioAnestesista = importeNuevo;
				// 		break;
				// 	case TIPO_PARTICIPANTE.DERECHOS:
				// 		vm.data.prefactura.Items[itemIndex].Derecho = importeNuevo;
				// 		break;
				// 	case TIPO_PARTICIPANTE.GLOBAL:
				// 		vm.data.prefactura.Items[itemIndex].ImporteGlobal = importeNuevo;
				// 		break;
				// }
				// if (vm.data.prefactura.Items[itemIndex].ImporteCoseguro > 0) cambioImporteCoseguro(vm.data.prefactura.Items[itemIndex]);
				// if (vm.data.prefactura.Items[itemIndex].PorcentajeCoseguro > 0) cambioPorcentajeCoseguro(vm.data.prefactura.Items[itemIndex]);
				// cambioMontosPrefactura(vm.data.prefactura.Items[itemIndex]);
			}

			// Recálculo del monto de la prefactura
			function cambioImporteDelParticipante(itemIndex, participante) {
				var porcentajeItem = vm.data.prefactura.Items[itemIndex].PorcentajePractica;

				var importeNuevo = 0;

				if(porcentajeItem > 0 && participante.PorcentajePractica > 0){
					var importeParticipanteConPorcentaje = participante.Importe * participante.PorcentajePractica / 100;
					importeNuevo = importeParticipanteConPorcentaje * porcentajeItem / 100;
				}

				switch (participante.IdTipoComponente) {
					case TIPO_PARTICIPANTE.ESPECIALISTA:
						vm.data.prefactura.Items[itemIndex].HonorarioEspecialista = importeNuevo;
						break;
					case TIPO_PARTICIPANTE.AYUDANTE:
						vm.data.prefactura.Items[itemIndex].HonorarioAyudante = importeNuevo;
						break;
					case TIPO_PARTICIPANTE.ANESTESISTA:
						vm.data.prefactura.Items[itemIndex].HonorarioAnestesista = importeNuevo;
						break;
					case TIPO_PARTICIPANTE.DERECHOS:
						vm.data.prefactura.Items[itemIndex].Derecho = importeNuevo;
						break;
					case TIPO_PARTICIPANTE.GLOBAL:
						vm.data.prefactura.Items[itemIndex].ImporteGlobal = importeNuevo;
						break;
				}
				if (vm.data.prefactura.Items[itemIndex].ImporteCoseguro > 0) cambioImporteCoseguro(vm.data.prefactura.Items[itemIndex]);
				if (vm.data.prefactura.Items[itemIndex].PorcentajeCoseguro > 0) cambioPorcentajeCoseguro(vm.data.prefactura.Items[itemIndex]);
				cambioMontosPrefactura(vm.data.prefactura.Items[itemIndex]);
			}

			// Redondeo a X dígitos
			function roundTo(n, digits) {
				if (digits === undefined) {
					digits = 0;
				}
				const multiplicator = Math.pow(10, digits);
				n = parseFloat((n * multiplicator).toFixed(11));
				const test = (Math.round(n) / multiplicator);
				return +(test.toFixed(digits));
			}

			function cambioPorcentajeCoseguro(item) {
				// if (item.PorcentajeCoseguro === 100) item.Coseguro = item.TotalItem;
				// else {
				// 	item.Coseguro = item.TotalItem * (item.PorcentajeCoseguro / 100);
				// 	item.Coseguro = roundTo(item.Coseguro, 2);
				// }
				if (item.PorcentajeCoseguro > 0) item.ImporteCoseguro = 0;
				cambioMontosPrefactura(item);
			}

			function cambioImporteCoseguro(item) {
				// item.PorcentajeCoseguro = (item.Coseguro / item.TotalItem) * 100;
				// item.PorcentajeCoseguro = roundTo(item.PorcentajeCoseguro, 0);
				if (item.ImporteCoseguro > 0) item.PorcentajeCoseguro = 0;
				cambioMontosPrefactura(item);
			}

			function cambioMontosPrefactura(item) {
				item.TotalItem = calcularImporteItemTotal(item);
				calcularTotalPrefactura();
			}

			function calcularImporteItemTotal(item) {
				var importe = 0;
				for (let index = 0; index < item.Participantes.length; index++) {
					importe += item.Participantes[index].Importe * item.Participantes[index].PorcentajePractica / 100;
				}	
				var total = ((importe * item.Cantidad) * item.PorcentajePractica / 100);
				item.TotalItem = total;
				return total;
			}

			function calcularImporteItemTotalFinanciador(item) {
				if(item.MutualParticular) return 0;
				let importeUnitario = calcularImporteItemUnitario(item);
				let coseguroUnitario = item.ImporteCoseguro > 0 ? item.ImporteCoseguro : ((importeUnitario * item.Cantidad) * (item.PorcentajeCoseguro / 100));
				return (item.TotalItem - (coseguroUnitario));				
			}

			function calcularImporteItemTotalPaciente(item) {
				let importeUnitario = calcularImporteItemUnitario(item);
				let coseguroUnitario = item.ImporteCoseguro > 0 ? item.ImporteCoseguro : ((importeUnitario * item.Cantidad) * (item.PorcentajeCoseguro / 100));
				if(!item.MutualParticular) return (coseguroUnitario);
				return calcularImporteItemTotal(item) + (coseguroUnitario);
			}

			function calcularImporteItemUnitario(item) {
				var importe = 0;
				for (let index = 0; index < item.Participantes.length; index++) {
					importe += item.Participantes[index].Importe * item.Participantes[index].PorcentajePractica / 100;
				}
				return importe;
			}

			function cambioPorcentejePracticaParticipante(itemIndex, participanteIndex) {
				cambioImporteParticipante(itemIndex, participanteIndex);
			}

			function cambioNroAutorizacion() {
				/* SOLO PARA SANCOR */
				var codigoMutualNumber = parseInt(vm.data.prefactura.CodigoMutual);
				if (codigoMutualNumber === MUTUAL_SANCOR.SANCORMADRE || codigoMutualNumber === MUTUAL_SANCOR.SANCOR432K ||
					codigoMutualNumber === MUTUAL_SANCOR.SANCOR1K || codigoMutualNumber === MUTUAL_SANCOR.SANCOR432KSMP ||
					codigoMutualNumber === MUTUAL_SANCOR.SANCOR1KSMP) {
					if (vm.data.prefactura.NroAutorizacion.charAt(0).toLowerCase() === 'w' || vm.data.prefactura.NroAutorizacion.charAt(0).toLowerCase() === 'f') {
						vm.data.prefactura.NroAutorizacion = vm.data.primeraLetraSancor + vm.data.prefactura.NroAutorizacion.slice(1);
					}
					else {
						vm.data.prefactura.NroAutorizacion = vm.data.primeraLetraSancor + vm.data.prefactura.NroAutorizacion;
					}
				}
			}

			function calcularTotalPrefactura() {
				if (vm.data.prefactura.Items) {
					vm.filter.totalPaciente = 0;
					vm.filter.totalFinanciador = 0;
					vm.filter.totalRecepcion = 0;
					for (var i = vm.data.prefactura.Items.length - 1; i >= 0; i--) {
						vm.filter.totalPaciente += calcularImporteItemTotalPaciente(vm.data.prefactura.Items[i]); 
						vm.filter.totalFinanciador += calcularImporteItemTotalFinanciador(vm.data.prefactura.Items[i]); 
					}
					vm.filter.totalRecepcion = vm.filter.totalPaciente + vm.filter.totalFinanciador;
				}
			}

			/* ---------------------------------------------- STORAGE ---------------------------------------------- */

			function getStoredData() {
				var def = $q.defer();
				if (PrefacturaAmbulatorioStorageHelperService.existStoredObjects(vm.storage.keyPrefacturaStorage)) {
					var almacenPrefactura = PrefacturaAmbulatorioStorageHelperService.getStorageObj(vm.storage.keyPrefacturaStorage) ? angular.copy(PrefacturaAmbulatorioStorageHelperService.getStorageObj(vm.storage.keyPrefacturaStorage)) : {};
					def.resolve(almacenPrefactura);
					cleanStorage();
				}
				else {
					switch ($stateParams.idAmbito) {
						case ORIGEN_PREFACTURA.LISTADO_PREFACTURACION:
						case ORIGEN_PREFACTURA.TURNO_EDICION:
							PrefacturaAmbulatorioDataService.obtenerPrefacturaAmbulatorio($stateParams.id).then(function (prefactura) {
								def.resolve(prefactura);
								cleanStorage();
							}, function () {
								def.reject();
								cleanStorage();
							});
							break;
						case ORIGEN_PREFACTURA.TURNO:
							PrefacturaAmbulatorioDataService.obtenerPrefacturaAmbulatorio($stateParams.id).then(function (prefactura) {
								def.resolve(prefactura);
								cleanStorage();
							}, function () {
								def.reject();
								cleanStorage();
							});
							break;
						default:
							$state.go('homesistemas');
							break;
					}
				}
				return def.promise;
			}

			function cleanStorage() {
				PrefacturaAmbulatorioStorageHelperService.cleanStorage(vm.storage.keyPrefacturaStorage);
			}

			// Store para dirigirse a otro estado (Edición de paciente). Se guarda la prefactura con todos sus campos actualizados,
			// el ámbito desde donde se levantó la pantalla, estado anterior de la autorización.
			function setStoredData() {
				var prefacturaStorage = {
					prefactura: vm.data.prefactura,
					idAmbito: $stateParams.idAmbito,
					estadoAutorizacionAnterior: vm.data.estadoAutorizacionAnterior
				};
				PrefacturaAmbulatorioStorageHelperService.setStorageObj(vm.storage.keyPrefacturaStorage, prefacturaStorage);
			}

			// Obtiene todas las coberturas del paciente y carga la cobertura de la prefactura.
			function leerCoberturasPaciente() {				
				SupportDataService.getAllCoberturasPaciente(vm.data.prefactura.IdPaciente).then(function (coberturas) {
					vm.filter.coberturas = coberturas;
					vm.filter.coberturaElegida = null;
					if (vm.data.prefactura.IdPlan !== 0) {
						for (let i = 0; i < vm.filter.coberturas.length; i++) {
							if (vm.filter.coberturas[i].IdPlanMutual === vm.data.prefactura.IdPlan) {
								vm.filter.coberturaElegida = vm.filter.coberturas[i];

								// if (!vm.data.prefactura.AutorizacionManual) {
								// 	if(vm.data.prefactura.IdMutual === vm.filter.coberturas[i].IdMutual) {
								// 		if(vm.filter.coberturas[i].IdTipoAfiliado === 1 || vm.filter.coberturas[i].IdTipoAfiliado === 2) {
								// 			vm.filter.TipoAfiliacionElegida = vm.filter.tiposAfiliacion.find(x => x.Id === vm.filter.coberturas[i].IdTipoAfiliado);
								// 		}	
								// 	}	
								// }

								if (vm.data.prefactura.IdTipoAfiliado === 1 || vm.data.prefactura.IdTipoAfiliado === 2) {
									vm.filter.TipoAfiliacionElegida = vm.filter.tiposAfiliacion.find(x => x.Id === vm.data.prefactura.IdTipoAfiliado);
								} else {
									if (!vm.data.prefactura.AutorizacionManual) {
										if(vm.filter.coberturas[i].IdTipoAfiliado === 1 || vm.filter.coberturaElegida.IdTipoAfiliado === 2) {
											vm.filter.TipoAfiliacionElegida = vm.filter.tiposAfiliacion.find(x => x.Id === vm.filter.coberturaElegida.IdTipoAfiliado);
										}	
									}
								}
								
								break;
							}
						}
					}
					
					// Si no pudo ubicar la cobertura, puede que se haya cambiado desde empadronamiento, hay que ubicarla por mutual y reevaluar
					if (!vm.filter.coberturaElegida) {
						// for (let i = 0; i < vm.filter.coberturas.length; i++) {
						// 	if (vm.filter.coberturas[i].IdMutual === vm.data.prefactura.IdMutual) {
						// 		vm.filter.coberturaElegida = vm.filter.coberturas[i];

						// 		if(vm.data.prefactura.IdTipoAfiliado === 1 || vm.data.prefactura.IdTipoAfiliado === 2) {
						// 			vm.filter.TipoAfiliacionElegida = vm.filter.tiposAfiliacion.find(x => x.Id === vm.data.prefactura.IdTipoAfiliado);
						// 		}
						// 		// vm.data.prefactura.NroAfiliado = vm.filter.coberturas[i].NumeroAfiliado;
						// 		// vm.filter.TipoAfiliacionElegida = vm.filter.coberturas[i].TipoAfiliadoCobertura;
						// 		// // Si no tiene autorización manual, cambia la cobertura
						// 		// if (!vm.data.prefactura.AutorizacionManual) cambioCobertura();
						// 		break;
						// 	}
						// }
						
						if (!vm.filter.coberturaElegida) {
							SupportDataService.ObtenerNuevoPorPaciente(vm.data.prefactura.IdPlan, vm.data.prefactura.IdTipoAfiliado, vm.data.prefactura.NroAfiliado).then(function (coberturaNueva) {
								if(coberturaNueva !== null){
									vm.filter.coberturas.push(coberturaNueva)
									vm.filter.coberturaElegida = coberturaNueva;
								}

								if (!vm.filter.coberturaElegida) {
									// Si se borró la cobertura que tenía esa mutual, intenta poner la cobertura por defecto
									vm.filter.coberturaElegida = vm.filter.coberturas.find(function(cob) {return cob.PorDefecto; })
									vm.data.prefactura.NroAfiliado = vm.filter.coberturaElegida.NumeroAfiliado;
									vm.filter.TipoAfiliacionElegida = vm.filter.coberturaElegida.TipoAfiliadoCobertura;
									// Si no tiene autorización manual, cambia la cobertura
									if (!vm.data.prefactura.AutorizacionManual) cambioCobertura();
								}
							});							
						}
					}
				});
			}

			function inicializarMenuOptions() {
				vm.menuOptions = [
					{
						text: 'Desglosar',
						displayed: function ($itemScope) {
							// Si la cantidad del item es mayor a 1 y el usuario es facturista o prefacturista del servicio
							return ($itemScope.item.CantidadOriginal > 1 && vm.UsuarioPreFacturista);
						},
						click: ($itemScope, $event, modelValue, text, $li) => {
							Desglosar($itemScope.item)
						}
					},
					{
						text: 'Sin Acciones Disponibles',
						displayed: function ($itemScope) {
							
							return ($itemScope.item.CantidadOriginal <= 1);
	
						},
						enabled: false
		
					} 
				];
			}

			function Desglosar(pRowItemPrefactura) {				
				ModalService.confirm('¿Está seguro que desea desglosar el ítem?', function (pResult) {
					if (pResult) {
						// tengo que validar la recepcion delturn
						vm.formControl.loading = true;
						PrefacturaAmbulatorioDataService.Desglosar(pRowItemPrefactura.Id)
							.then((pResponse) => {
								if (pResponse.IsOk) {
									vm.data.prefactura.Items = pResponse.Entidad.Items;
									vm.formControl.loading = false;
								} else {
									vm.formControl.loading = false;
									if (pResponse.Message !== null)
										AlertaService.NewError(pResponse.Message);
									else
										AlertaService.NewError("Error De Servidor");
								}
				
							}, (pError) => {
								$log.error('Desglosar item prefacturado .-', pError);
								vm.formControl.loading = false;
							})
					}
				});	
			}

			/* ---------------------------------------------- ACTIVATE ---------------------------------------------- */
			activate();

			function activate() {
				

				vm.formControl.loading = true;
				vm.UsuarioFacturista = AuthorizationService.tienePermisoById(User, 247);
				vm.UsuarioPreFacturista = vm.UsuarioFacturista;
				if(!vm.UsuarioPreFacturista)
				{
					vm.UsuarioPreFacturista = AuthorizationService.tienePermisoById(User, 306);
				}

				SupportDataService.getAllTipoAfiliadoSinAmbos().then(function (tiposAfiliacion) {
					vm.filter.tiposAfiliacion = tiposAfiliacion;											
				});

				getStoredData().then(function (almacenPrefactura) {
					vm.data.prefactura = almacenPrefactura.prefactura ? almacenPrefactura.prefactura : almacenPrefactura;
					vm.data.estadoAutorizacionAnterior = almacenPrefactura.estadoAutorizacionAnterior 
						? almacenPrefactura.estadoAutorizacionAnterior 
						: vm.data.estadoAutorizacionAnterior;
					
					
					// Seteo en true el envio al llamador automático al receptar
					vm.data.prefactura.EnviarAlLlamador = true;
					
					if (almacenPrefactura.idAmbito) {
						vm.filter.idAmbito = almacenPrefactura.idAmbito;
						$stateParams.idAmbito = vm.filter.idAmbito;
					}
					else {
						vm.filter.idAmbito = $stateParams.idAmbito;
					}

					vm.title.icon = 'NEW2';
					let prefijoTitulo = vm.data.prefactura.IdSexoProfesionalEfector == SEXO.FEMENINO
						? 'Recepción de Turno de la Doctora '
						: 'Recepción de Turno del Doctor ';
					vm.title.name = prefijoTitulo + vm.data.prefactura.NombreProfesionalEfector + ' del ' + 
						$filter('fwPicker')(vm.data.prefactura.FechaHoraTurno, 'datetime');

					vm.filter.fechaRealizacion = DateUtils.parseToFe(vm.data.prefactura.FechaRealizacion);
					vm.filter.fechaPrescripcion = DateUtils.parseToFe(vm.data.prefactura.FechaPrescripcion);
					vm.data.prefactura.EstadoAutorizacion = vm.data.prefactura.AutorizacionManual ? 'MANUAL' : vm.data.prefactura.EstadoAutorizacion;

					leerCoberturasPaciente();

					// SupportDataService.getAllTipoAfiliadoSinAmbos().then(function (tiposAfiliacion) {
					// 	vm.filter.tiposAfiliacion = tiposAfiliacion;						
					// 	if (vm.data.prefactura.IdTipoAfiliado === 1 || vm.data.prefactura.IdTipoAfiliado === 2) {
					// 		vm.filter.TipoAfiliacionElegida = vm.filter.tiposAfiliacion.find(x => x.Id === vm.data.prefactura.IdTipoAfiliado);
					// 	}	
					// });

					SupportDataService.getAllTiposEstudios().then(function(tiposDeEstudios){
						vm.filter.tiposEstudios = tiposDeEstudios;						
					});

					if (vm.data.prefactura.MatriculaProfesionalEfector !== 0) {
						ProfesionalesDataService.getProfesionalPorMatricula(vm.data.prefactura.MatriculaProfesionalEfector).then(function (efector) {
							vm.filter.profesionalEfectorPrevio = efector;
							vm.filter.profesionalEfector = efector;
						});
					}

					if (vm.data.prefactura.MatriculaProfesionalSolicitante !== 0) {
						ProfesionalesDataService.getProfesionalSolicitantePorMatricula(vm.data.prefactura.MatriculaProfesionalSolicitante).then(function (solicitantes) {
							const even = (element) => element.IdTipoSolicitante === vm.data.prefactura.IdTipoProfesionalSolicitante;
							if(solicitantes.some(even)){
								for (let i = 0; i < solicitantes.length; i++) {
									if (solicitantes[i].IdTipoSolicitante === vm.data.prefactura.IdTipoProfesionalSolicitante) {
										vm.filter.profesionalSolicitante = solicitantes[i];										
										break;
									}
								}								
							} else{
								vm.filter.profesionalSolicitante = null;
							}
							
						});
					}

					if (vm.data.prefactura.CodigoCie10 !== 0) {
						Cie10DataService.ObtenerPorCodigo(vm.data.prefactura.CodigoCie10).then(function (cie10) {
							vm.filter.cie10 = cie10;
						});
					}

					if (vm.data.prefactura.CodigoTecnico !== 0) {
						ContratableDataService.TecnicoObtenerPorCodigo(vm.data.prefactura.IdServicioEvento, vm.data.prefactura.CodigoTecnico).then(function (tecnico) {
							vm.filter.tecnico = tecnico;
						});
					}

					// Método para obtener si el afiliado está ok según Padrones
					PrefacturaAmbulatorioDataService.obtenerAfiliadoOKSegunPadrones(vm.data.prefactura.IdMutual, vm.data.prefactura.NumeroDocumentoPaciente)
					.then(function (afiliadoSegunPadronOk) {
						$log.debug('afiliadoSegunPadronOk',afiliadoSegunPadronOk);
						if(afiliadoSegunPadronOk.Ok == false){
							if(afiliadoSegunPadronOk.TieneFechaVigencia){
								ModalService.warn("Afiliado inhabilitado desde " + moment(afiliadoSegunPadronOk.FechaVigencia).format("DD/MM/YYYY"));
							} else {
								ModalService.warn("Afiliado no se encuentra en padron");
							}							
						}
					}, function (afiliadoSegunPadronError) {
						$log.error('afiliadoSegunPadronError',afiliadoSegunPadronError);
					});

					/* SOLO SANCOR */
					var codigoMutualNumber = parseInt(vm.data.prefactura.CodigoMutual);
					if (codigoMutualNumber === MUTUAL_SANCOR.SANCORMADRE || codigoMutualNumber === MUTUAL_SANCOR.SANCOR432K ||
						codigoMutualNumber === MUTUAL_SANCOR.SANCOR1K || codigoMutualNumber === MUTUAL_SANCOR.SANCOR432KSMP ||
						codigoMutualNumber === MUTUAL_SANCOR.SANCOR1KSMP) {
						if (vm.data.prefactura.NroAutorizacion.charAt(0).toLowerCase() === 'w')
							vm.data.primeraLetraSancor = 'W';
						if (vm.data.prefactura.NroAutorizacion.charAt(0).toLowerCase() === 'f')
							vm.data.primeraLetraSancor = 'F';
					}
					/* FIN SANCOR */

					ParticipanteDataService.obtenerTodosComponentesCompleto().then(function (componentes) {
						vm.data.componentes = componentes;
					});

					/* 
					* sospecha patologia
					 */

					if (vm.data.prefactura && vm.data.prefactura.IdPaciente) { 
						SupportDataService.obtenerActivosDelPacienteParaAletaAdministrativa(vm.data.prefactura.IdPaciente)
						.then(function (patologias) {
							//$log.debug('pato: ', patologias);
							vm.data.patologias = angular.copy(patologias);
						});
					}
					

					calcularTotalPrefactura();
					soloConsulta();
					if (vm.data.prefactura && vm.data.prefactura.Items) {
						vm.data.prefactura.TodosItemsRechazados = vm.data.prefactura.Items.every(itemConAutorizacionRechazada);
					}

					vm.formControl.loading = false;

					habilitarAutorizacionOnline();
				});

				inicializarMenuOptions();

			}
		}
	};
	return module;
})();