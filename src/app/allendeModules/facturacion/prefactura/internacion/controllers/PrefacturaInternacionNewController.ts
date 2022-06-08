import * as angular from 'angular';
import { ISupportDataService } from '../../../../support/basic/services';

export default (function(){
	const module = { init : (ngModule: any) => {} };

	module.init = function (module) { 
		
		module.controller('PrefacturaInternacionNewController', PrefacturaInternacionNewController);

		// Inyección de Dependencia
		PrefacturaInternacionNewController.$inject = ['Logger', '$q', '$scope', '$filter', 'ModalService', 'User', 'SupportLogicService',
			'SupportDataService', 'PrefacturaInternacionDataService',
			'FACTURACION_INFO', 'ORIGEN_PREFACTURA', 'ESTADO_PREFACTURA', 'ESTADO', 'ESTADO_ITEM_PREFACTURADO',
			'TIPO_PREFACTURABLE', 'TIPO_AFILIADO', 'TIPO_PARTICIPANTE', 'TIPO_PROFESIONAL_SOLICITANTE'];

		// Constructor del Controller
		function PrefacturaInternacionNewController ($log, $q, $scope, $filter, ModalService, User, SupportLogicService,
			SupportDataService: ISupportDataService, PrefacturaInternacionDataService,
			FACTURACION_INFO, ORIGEN_PREFACTURA, ESTADO_PREFACTURA, ESTADO, ESTADO_ITEM_PREFACTURADO,
			TIPO_PREFACTURABLE, TIPO_AFILIADO, TIPO_PARTICIPANTE, TIPO_PROFESIONAL_SOLICITANTE) {

				$log = $log.getInstance('PrefacturaInternacionNewController');
				/* ---------------------------------------- API Y VARIABLES ---------------------------------------- */

				var vm = this;
				vm.user = User;
				vm.title = {
					module: FACTURACION_INFO.title,
					page: 'Prefactura Internado'
				};

				vm.formControl = {
					searchPracticas : searchPracticas,
					searchInternados : searchInternados,
					busquedaRapidaInternado : busquedaRapidaInternado,
					busquedaRapidaPractica : busquedaRapidaPractica,
					cambioNumeroInternado : cambioNumeroInternado,
					cambioCodigoPractica : cambioCodigoPractica,
					cargarCoberturaFechaRealizacion : cargarCoberturaFechaRealizacion,
					mostrarCargaPractica : false,
					habilitarCargaPractica : false,
					limpiarCargaPractica : limpiarCargaPractica,
					limpiarImportes : limpiarImportes,
					calcularMontos : calcularMontos,
					guardarPractica : guardarPractica,
					getCuentasDerecho : getCuentasDerecho,
					porcentajeImporte : porcentajeImporte,
					cargarPrefactura : cargarPrefactura,
					showDetallePractica : false,
					verItemsDetalle : verItemsDetalle,
					visar : visar,
					editarPractica : editarPractica,
					eliminarPractica : eliminarPractica
				};

				vm.data = {
					profesionalSolicitante : {
						matricula : '',
						nombre : ''
					},
					profesionalEfector : {
						matricula : '',
						nombre : ''
					},
					datosPrefactura : {
						idPaciente : 0,
						tipoOrigenPrefactura : 0,
						numeroOrigen : 0
					},

					pCalculoMontoPractica : {},
					importeEspecialistaSugerido : 0,
					importeAyudanteSugerido : 0,
					importeAnestesistaSugerido : 0,
					importeDerechoSugerido : 0,

					pInternadoSeleccionado : {},
					pPracticaSeleccionada : {},

					profesionalEspecialista : {},
					profesionalEspecialista2 : {},
					profesionalAyudante : {},
					profesionalAnestesista : {},
					profesionalAnestesista2 : {},

					ParticipanteEspecialista : {},
					ParticipanteAyudante : {},
					ParticipanteAnestesista : {},
					ParticipanteDerecho : {},

					CuentasProfesional : {},

					ListaParticipantes : [],
					pPracticaAGrabar: {},

					hoy : '',

					IdPractica : 0,
					IdEspecialista : 0,
					IdAyudante : 0,
					IdAnestesista : 0,
					IdDerechos : 0
				};

				vm.filter = {
					codigoInternado : null,
					nombreInternado : '',
					tipoNumeroDocumento : '',
					obraPlanPredefinidos : '',
					fechaIngreso : '',
					fechaAlta : '',

					codigoPractica : null,
					nombrePractica : '',

					cantidad : 1,
					porcentajeAfiliado : 0,

					fechaRealizacion : '',

					importeEspecialista : null,
					importeEspecialista2 : null,
					importeAyudante : null,
					importeAnestesista : null,
					importeAnestesista2 : null,
					importeDerecho : null,

					porcPracticaEspecialista : 0,
					porcPracticaEspecialista2 : 0,
					porcPracticaAyudante : 0,
					porcPracticaAnestesista : 0,
					porcPracticaAnestesista2 : 0,
					porcDerecho : 0,

					servicios : [],
					servicioElegido : {},
					coberturasPractica : [],
					coberturaPracticaElegida : {},
					coberturasCabecera : [],
					coberturaCabeceraElegida : {},
					cuentasDerecho : {
						Cuentas : {}
					},

					bloquearCoberturaCabecera : false,
					itemVisado : null
				};
				/* ----------------------------------------- IMPLEMENTACIÓN ----------------------------------------- */

				/* INTERNADO */
 				function searchInternados() {
 					SupportLogicService.searchInternados(User)
 						.then(function (pInternadoSeleccionado) {
 							vm.data.pInternadoSeleccionado = pInternadoSeleccionado;
 							vm.filter.codigoInternado = vm.data.pInternadoSeleccionado.NumeroInternado;
 							limpiarCargaPractica();
							actualizarFiltroInternado();
							if(pInternadoSeleccionado)
								cargarPrefactura(vm.data.pInternadoSeleccionado.IdPaciente, ORIGEN_PREFACTURA.INTERNACION,
								vm.data.pInternadoSeleccionado.NumeroInternado);
						});
 				}

 				function busquedaRapidaInternado() {
 					if (vm.filter.codigoInternado && vm.filter.nombreInternado == ''){
 						PrefacturaInternacionDataService.getInternadoPorNumero(vm.filter.codigoInternado)
							.then(function(pInternadoSeleccionado){
								vm.data.pInternadoSeleccionado = pInternadoSeleccionado;
								vm.filter.codigoInternado = vm.data.pInternadoSeleccionado.NumeroInternado;
								limpiarCargaPractica();
								actualizarFiltroInternado();
								if(pInternadoSeleccionado)
									cargarPrefactura(vm.data.pInternadoSeleccionado.IdPaciente, ORIGEN_PREFACTURA.INTERNACION,
									vm.data.pInternadoSeleccionado.NumeroInternado);
 							});
 					}
 				}

 				function limpiarDataInternado (){
					vm.filter.nombreInternado = '';
					vm.filter.tipoNumeroDocumento = '';
					vm.filter.fechaIngreso = '';
					vm.filter.fechaAlta = '';
					vm.filter.fechaRealizacion = '';
					vm.filter.coberturaCabeceraElegida = {};
					vm.data.pPrefacturaPaciente = {};
					if (vm.data.pInternadoSeleccionado != null){
						vm.formControl.habilitarCargaPractica = false;
						vm.formControl.mostrarCargaPractica = false;
					}
 				}

				function actualizarFiltroInternado() {
					if(vm.data.pInternadoSeleccionado){
						vm.filter.nombreInternado = vm.data.pInternadoSeleccionado.NombreInternado;
						vm.filter.tipoNumeroDocumento = vm.data.pInternadoSeleccionado.TipoDocumento + ': '  
													  + vm.data.pInternadoSeleccionado.NumeroDocumento;
						vm.filter.fechaIngreso = $filter('date')(vm.data.pInternadoSeleccionado.FechaAdmision, 'dd/MM/yyyy');
						vm.filter.fechaRealizacion = $filter('date')(vm.data.pInternadoSeleccionado.FechaAdmision, 'dd/MM/yyyy');
						
						vm.filter.fechaAlta = $filter('date')(vm.data.pInternadoSeleccionado.FechaAltaMedica, 'dd/MM/yyyy');

						if (vm.data.pInternadoSeleccionado != null){
							vm.formControl.habilitarCargaPractica = true;
						}
					}
 				}

 				function cambioNumeroInternado() {
 					if(vm.data.pInternadoSeleccionado.NumeroInternado != '' && vm.filter.codigoInternado != vm.data.pInternadoSeleccionado.NumeroInternado){
 						limpiarDataInternado();
 					}
 				}

 				function cargarCoberturaFechaRealizacion (){
 					vm.filter.fechaRealizacion = vm.data.pInternadoSeleccionado.FechaAdmision;
					SupportDataService.getAllCoberturasPaciente(vm.data.pInternadoSeleccionado.IdPaciente)
						.then(function (pCoberturaInternado) {
							vm.filter.coberturasPractica = pCoberturaInternado;
							vm.filter.coberturasCabecera = pCoberturaInternado;
							if (vm.data.pPrefacturaPaciente){
								for (var i = vm.filter.coberturasCabecera.length - 1; i >= 0; i--) {
									if (vm.filter.coberturasCabecera[i].IdPlanMutual == vm.data.pPrefacturaPaciente.IdPlanMutual &&
										vm.filter.coberturasCabecera[i].NumeroAfiliado == vm.data.pPrefacturaPaciente.NroAfiliado) {
										vm.filter.coberturaCabeceraElegida = vm.filter.coberturasCabecera[i];
										vm.filter.coberturaPracticaElegida = vm.filter.coberturasCabecera[i];
										vm.filter.bloquearCoberturaCabecera = true;
										break;
									}
									else{
										vm.filter.bloquearCoberturaCabecera = false;
									}
								}
							}
							else{
								vm.filter.bloquearCoberturaCabecera = false;
							}
						}, function (){
							vm.filter.coberturasPractica = null;
							vm.filter.coberturasCabecera = null;
							vm.filter.bloquearCoberturaCabecera = false;
						});
 				}

 				function cargarPrefactura(idPaciente, tipoOrigenPrefactura, numeroOrigen){
 					vm.data.datosPrefactura.idPaciente = idPaciente;
					vm.data.datosPrefactura.tipoOrigenPrefactura = tipoOrigenPrefactura;
					vm.data.datosPrefactura.numeroOrigen = numeroOrigen;

					$log.debug('Message',vm.data.datosPrefactura);

 					PrefacturaInternacionDataService.getPrefacturaPaciente(vm.data.datosPrefactura)
						.then(function(pPrefacturaPaciente){
							vm.data.pPrefacturaPaciente = pPrefacturaPaciente;
							cargarCoberturaFechaRealizacion();
						}, function (){
							vm.data.pPrefacturaPaciente = null;
							vm.filter.coberturasPractica = null;
							vm.filter.coberturasCabecera = null;
							vm.filter.bloquearCoberturaCabecera = false;
						});
 				}
				/* FIN INTERNADO */


				/* PRACTICAS */
 				function searchPracticas() {
 					SupportLogicService.searchPracticas(User)
 						.then(function (pPracticaSeleccionada) {
 							vm.data.pPracticaSeleccionada = pPracticaSeleccionada;
 							vm.filter.codigoPractica = vm.data.pPracticaSeleccionada.Codigo;
							actualizarFiltroPractica();
 						}, function () {
						});
 				}

 				function busquedaRapidaPractica() {
 					if(vm.filter.codigoPractica && vm.filter.nombrePractica == ''){
						PrefacturaInternacionDataService.getPracticaPorCodigo(vm.filter.codigoPractica)
						.then(function(pPracticaSeleccionada){
							vm.data.pPracticaSeleccionada = pPracticaSeleccionada;
							vm.filter.codigoPractica = vm.data.pPracticaSeleccionada.Codigo;
							actualizarFiltroPractica();
							}, function () {
								vm.data.pPracticaSeleccionada = [];
								limpiarDataPractica();
						});
						limpiarImportes();
					}
 				}

 				function cambioCodigoPractica() {
 					if(vm.data.pPracticaSeleccionada.Codigo != '' && vm.filter.codigoPractica != vm.data.pPracticaSeleccionada.Codigo){
 						limpiarDataPractica();
 					}
 				}

				function limpiarDataPractica (){
					vm.filter.nombrePractica = '';
 				}

				function actualizarFiltroPractica() {
					vm.filter.nombrePractica = vm.data.pPracticaSeleccionada.Nombre;
					limpiarImportes();
 				}
 				/* FIN PRACTICAS */

 				/* PROFESIONAL CUENTA */
 				function getCuentasDerecho(){
 					// HardCode Modo ON: Para traer todas las cuentas que posee el Sanatorio.
 					var Matricula = 63432;
 					PrefacturaInternacionDataService.getCuentasProfesional(Matricula)
						.then(function (cuentas) {
							vm.data.cuentasDerecho = {
								Cuentas : {}
							};
							vm.data.cuentasDerecho.Cuentas = cuentas;
						}, function (pError) {
							$log.error('Error en carga de cuentas de Derecho', pError);
						});
 				}
 				/* FIN PROFESIONAL CUENTA */


 				/* MANEJO FORMULARIO */

 				function limpiarCargaPractica(){

					vm.filter.codigoPractica = null;
					vm.filter.nombrePractica = '';

					vm.filter.cantidad = 1;
					vm.filter.porcentajeAfiliado = 0;

					vm.filter.porcPracticaEspecialista = 0;
					vm.filter.porcPracticaEspecialista2 = 0;
					vm.filter.porcPracticaAyudante = 0;
					vm.filter.porcPracticaAnestesista = 0;
					vm.filter.porcPracticaAnestesista2 = 0;
					vm.filter.porcDerecho = 0;

					vm.filter.fechaRealizacion = '';
					limpiarImportes();

					vm.filter.servicioElegido = {};
					var planMutualCuerpo = vm.filter.coberturaPracticaElegida.PlanMutual;
					vm.filter.coberturaPracticaElegida = {};
					vm.filter.coberturaPracticaElegida.PlanMutual = planMutualCuerpo;

					vm.data.profesionalSolicitante = {};
					vm.data.profesionalEfector = {};
					vm.data.pPracticaSeleccionada = {};

					vm.data.profesionalEspecialista = {};
					vm.data.profesionalEspecialista2 = {};
					vm.data.profesionalAyudante = {};
					vm.data.profesionalAnestesista = {};
					vm.data.profesionalAnestesista2 = {};

					vm.filter.observacionPractica = "";

					vm.data.IdPractica = 0;
					vm.data.IdEspecialista = 0;
					vm.data.IdAyudante = 0;
					vm.data.IdAnestesista = 0;
					vm.data.IdDerechos = 0;
				}

				function limpiarImportes(){
					vm.filter.importeEspecialista = null;
					vm.filter.importeEspecialista2 = null;
					vm.filter.importeAyudante = null;
					vm.filter.importeAnestesista = null;
					vm.filter.importeAnestesista2 = null;
					vm.filter.importeDerecho = null;
				}

				function setearItemsPrefactura(){
					if(vm.data.pPrefacturaPaciente.Items != null)
					{
						for (var i = vm.data.pPrefacturaPaciente.Items.length - 1; i >= 0; i--) {
							vm.data.pPrefacturaPaciente.Items[i].ServicioSolicitante = null;
							vm.data.pPrefacturaPaciente.Items[i].ServicioEfector = null;
							vm.data.pPrefacturaPaciente.Items[i].Prefacturable = null;
							vm.data.pPrefacturaPaciente.Items[i].TipoProfesional = null;
						}
					}
				}

				function validarCargaPractica(){
					var informeError = '';
					if (!vm.filter.codigoPractica)
						informeError += 'Debe seleccionar una práctica.\n';

					if (Object.getOwnPropertyNames(vm.filter.coberturaPracticaElegida).length === 0)
						informeError += 'Debe seleccionar una cobertura del internado.\n';

					if (Object.getOwnPropertyNames(vm.data.profesionalEfector).length === 0)
						informeError += 'Debe seleccionar un profesional efector.\n';

					if (Object.getOwnPropertyNames(vm.filter.servicioElegido).length === 0)
						informeError += 'Debe seleccionar un servicio.\n';

					if (Object.getOwnPropertyNames(vm.data.profesionalEspecialista).length !== 0 && vm.data.profesionalEspecialista == null)
						informeError += 'Debe seleccionar un profesional especialista.\n';
					else
						if (vm.filter.codigoEspecialista === undefined || vm.filter.codigoEspecialista === null)
							informeError += 'Debe seleccionar una cuenta para el profesional especialista.\n';

					if (Object.getOwnPropertyNames(vm.data.profesionalAyudante).length !== 0 && vm.filter.profesionalAyudante == null)
						informeError += 'El profesional ayudante debe tener una cuenta elegida.\n';
					
					if (Object.getOwnPropertyNames(vm.data.profesionalAnestesista).length !== 0 && vm.filter.profesionalAnestesista == null)
						informeError += 'El profesional anestesista debe tener una cuenta elegida.\n';

					if (Object.getOwnPropertyNames(vm.filter.cuentasDerecho).length === 0)
					{
						informeError += 'Debe seleccionar una cuenta del derecho.\n';
					}
					return informeError;
				}

				function porcentajeImporte(){
					//TODO: Hablar con personas para entender bien el calculo de los porcentajes
				}

				function guardarPractica1(){
					calcularMontos();
					if (vm.data.pPrefacturaPaciente.IdPaciente == 0) //Se genera una nueva prefactura para el internado
					{
						PrefacturaInternacionDataService.crearPrefactura()
						.then(function (pResult) {
							vm.data.pPrefacturaPaciente = pResult;
							cargarDatosPrefactura();
						});
					}
					else{
						cargarDatosPractica();
					}
				}

				function calcularMontos(){
					var informeError = validarCargaPractica();

					if(informeError != '')
					{
						ModalService.error(informeError);
						return false;
					}

					vm.data.pCalculoMontoPractica.nombrePlan = vm.filter.coberturaPracticaElegida.NombrePlan;
					vm.data.pCalculoMontoPractica.fechaPractica = $filter('date')(vm.filter.fechaRealizacion, 'dd/MM/yyyy');
					vm.data.pCalculoMontoPractica.numeroMutual = vm.filter.coberturaPracticaElegida.CodigoMutual;
					vm.data.pCalculoMontoPractica.numeroPractica = vm.filter.codigoPractica;
					vm.data.pCalculoMontoPractica.subCodigo = 1;
					vm.data.pCalculoMontoPractica.cantidad = vm.filter.cantidad;
					vm.data.pCalculoMontoPractica.cuenta = vm.filter.codigoEspecialista.Numero;
					vm.data.pCalculoMontoPractica.servicio = vm.filter.servicioElegido.Id;
					vm.data.pCalculoMontoPractica.matriculaProfesional = vm.data.profesionalEspecialista.Matricula;

					PrefacturaInternacionDataService.getCalculoMontosHonorarios(vm.data.pCalculoMontoPractica)
						.then(function (pResult) {
							vm.data.importeEspecialistaSugerido = pResult.importeEspecialista;
							vm.data.importeAyudanteSugerido = pResult.importeAyudante;
							vm.data.importeAnestesistaSugerido = pResult.importeAnestesista;

							if (vm.filter.importeEspecialista == null){
								vm.filter.importeEspecialista = pResult.importeEspecialista;
							}
							//vm.filter.importeEspecialista2 = pResult.importeEspecialista;
							if (vm.filter.importeAyudante == null){
								vm.filter.importeAyudante = pResult.importeAyudante;
							}
							if (vm.filter.importeAnestesista == null){
								vm.filter.importeAnestesista = pResult.importeAnestesista;
							}
							//vm.filter.importeAnestesista2 = pResult.importeAnestesista;
							vm.data.pCalculoMontoPractica.subCodigo = 4;
							vm.data.pCalculoMontoPractica.cuenta = vm.filter.cuentasDerecho.Numero;
							vm.data.pCalculoMontoPractica.matriculaProfesional = vm.filter.cuentasDerecho.Numero;
							PrefacturaInternacionDataService.getCalculoMontosHonorarios(vm.data.pCalculoMontoPractica)
								.then(function (pResult) {
									vm.data.importeDerechoSugerido = pResult.importeDerecho;
									if (vm.filter.importeDerecho == null || vm.filter.importeDerecho == '')
										vm.filter.importeDerecho = pResult.importeDerecho;
									return true;
								});
						});
					return;
				}

				function guardarPractica(){
					calcularMontos();
					if (vm.data.pPrefacturaPaciente.IdPaciente == 0) //Se genera una nueva prefactura para el internado
					{
						PrefacturaInternacionDataService.crearPrefactura()
						.then(function (pResult) {
							vm.data.pPrefacturaPaciente = pResult;
							cargarDatosPrefactura();
						});
					}
					else{
						cargarDatosPractica();
					}
				}

				function cargarDatosPrefactura(){
					vm.data.pPrefacturaPaciente.IdPaciente = vm.data.pInternadoSeleccionado.IdPaciente;
					vm.data.pPrefacturaPaciente.IdMutual = vm.filter.coberturaCabeceraElegida.PlanMutual.IdMutual;
					vm.data.pPrefacturaPaciente.IdPlanMutual = vm.filter.coberturaCabeceraElegida.PlanMutual.Id;
					vm.data.pPrefacturaPaciente.NroAfiliado = vm.filter.coberturaCabeceraElegida.NumeroAfiliado;
					if (vm.data.pPrefacturaPaciente.IdTipoAfiliado == TIPO_AFILIADO.NOEXISTE)
						vm.data.pPrefacturaPaciente.IdTipoAfiliado = vm.filter.coberturaCabeceraElegida.IdTipoAfiliado;
					vm.data.pPrefacturaPaciente.IdTipoOrigenPrefactura = ORIGEN_PREFACTURA.INTERNACION;
					vm.data.pPrefacturaPaciente.IdOrigenPrefactura = vm.data.pInternadoSeleccionado.NumeroInternado;
					vm.data.pPrefacturaPaciente.IdEstado = ESTADO_PREFACTURA.PENDIENTE;
					//TODO:Resolver mas adelante
					vm.data.pPrefacturaPaciente.IdSucursal = 1; // HardCodeo de NuevaCordoba
					cargarDatosPractica();
				}

				function cargarDatosPractica(){
					setearItemsPrefactura();

					if(vm.data.pPrefacturaPaciente.Id != 0){
						vm.data.pPrefacturaPaciente.Id = vm.data.pPrefacturaPaciente.Id;
					}

					PrefacturaInternacionDataService.crearItemPrefactura()
					.then (function (pResult){
						vm.data.pPracticaAGrabar = pResult;
						if(vm.data.IdPractica != 0){
							vm.data.pPracticaAGrabar.Id = vm.data.IdPractica;
						}
						vm.data.pPracticaAGrabar.Codigo = vm.data.pPracticaSeleccionada.Codigo;
						vm.data.pPracticaAGrabar.IdPrefacturable = vm.data.pPracticaSeleccionada.Id;
						vm.data.pPracticaAGrabar.FechaRealizacion = $filter('date')(vm.filter.fechaRealizacion, 'dd/MM/yyyy');
						vm.data.pPracticaAGrabar.Observacion = vm.filter.observacionPractica;
						vm.data.pPracticaAGrabar.IdProfesionalSolicitante = vm.data.profesionalSolicitante.Matricula;
						vm.data.pPracticaAGrabar.TipoProfesionalSolicitante = TIPO_PROFESIONAL_SOLICITANTE.INTERNO;
						vm.data.pPracticaAGrabar.IdProfesionalEfector = vm.data.profesionalEfector.Matricula;
						vm.data.pPracticaAGrabar.DerechoSugerido = vm.data.importeDerechoSugerido;
						vm.data.pPracticaAGrabar.HonorarioEspecialistaSugerido = vm.data.importeEspecialistaSugerido;
						vm.data.pPracticaAGrabar.HonorarioAyudanteSugerido = vm.data.importeAyudanteSugerido;
						vm.data.pPracticaAGrabar.HonorarioAnestesistaSugerido = vm.data.importeAnestesistaSugerido;
						vm.data.pPracticaAGrabar.Derecho = vm.filter.importeDerecho;
						vm.data.pPracticaAGrabar.HonorarioEspecialista = vm.filter.importeEspecialista;
						vm.data.pPracticaAGrabar.HonorarioAyudante = vm.filter.importeAyudante;
						vm.data.pPracticaAGrabar.HonorarioAnestesista = vm.filter.importeAnestesista;
						vm.data.pPracticaAGrabar.PorcentajeAfiliado = vm.filter.porcentajeAfiliado;
						vm.data.pPracticaAGrabar.Cantidad = vm.filter.cantidad;
						vm.data.pPracticaAGrabar.Visado = 0;
						vm.data.pPracticaAGrabar.IdUsuarioVisado = 0;
						vm.data.pPracticaAGrabar.FechaVisado = "0001-01-01T00:00:00";
						vm.data.pPracticaAGrabar.IdTipoAfiliado = vm.filter.coberturaPracticaElegida.IdTipoAfiliado;
						vm.data.pPracticaAGrabar.IdPrefactura = vm.data.pPrefacturaPaciente.Id;
						vm.data.pPracticaAGrabar.IdTipoPrefacturable = TIPO_PREFACTURABLE.CODIGO_NOMENCLADOR;
						vm.data.pPracticaAGrabar.IdServicioEfector = vm.filter.servicioElegido.Id;
						vm.data.pPracticaAGrabar.NroAfiliado = vm.filter.coberturaPracticaElegida.NumeroAfiliado;
						vm.data.pPracticaAGrabar.IdPlanMutual = vm.filter.coberturaPracticaElegida.PlanMutual.Id;
						vm.data.pPracticaAGrabar.IdMutual = vm.filter.coberturaPracticaElegida.PlanMutual.IdMutual;
						vm.data.pPracticaAGrabar.Nombre = vm.data.pPracticaSeleccionada.Nombre;
						vm.data.pPracticaAGrabar.IdEstadoItemPrefacturado = ESTADO_ITEM_PREFACTURADO.PENDIENTE;
						cargarDatosParticipantes();
					}, function(){
						ModalService.error('No se pudo obtener la práctica');
					});
				}

				function cargarDatosParticipantes(){
					PrefacturaInternacionDataService.crearParticipanteItemPrefacturado()
					.then (function (pResult){
						if(Object.getOwnPropertyNames(vm.data.profesionalEspecialista).length !== 0)
						{
							angular.copy(pResult, vm.data.ParticipanteEspecialista);
							if(vm.data.IdEspecialista != 0){
								vm.data.ParticipanteEspecialista.Id = vm.data.IdEspecialista;
							}	
							vm.data.ParticipanteEspecialista.IdTipoComponente = TIPO_PARTICIPANTE.ESPECIALISTA;
							vm.data.ParticipanteEspecialista.Matricula = vm.data.profesionalEspecialista.Matricula;
							vm.data.ParticipanteEspecialista.IdProfesional = vm.data.profesionalEspecialista.IdProfesional;
							vm.data.ParticipanteEspecialista.Importe = vm.filter.importeEspecialista;
							vm.data.ParticipanteEspecialista.IdCuenta = vm.filter.codigoEspecialista.Numero;
							vm.data.pPracticaAGrabar.Participantes.push(vm.data.ParticipanteEspecialista);
						}

						if(Object.getOwnPropertyNames(vm.data.profesionalAyudante).length !== 0)
						{
							angular.copy(pResult, vm.data.ParticipanteAyudante);
							if(vm.data.IdAyudante != 0){
								vm.data.ParticipanteAyudante.Id = vm.data.IdAyudante;
							}
							vm.data.ParticipanteAyudante.IdTipoComponente = TIPO_PARTICIPANTE.AYUDANTE;
							vm.data.ParticipanteAyudante.Matricula = vm.data.profesionalAyudante.Matricula;
							vm.data.ParticipanteAyudante.IdProfesional = vm.data.profesionalAyudante.IdProfesional;
							vm.data.ParticipanteAyudante.Importe = vm.filter.importeAyudante;
							vm.data.ParticipanteAyudante.IdCuenta = vm.filter.profesionalAyudante.Numero;
							vm.data.pPracticaAGrabar.Participantes.push(vm.data.ParticipanteAyudante);
						}

						if(Object.getOwnPropertyNames(vm.data.profesionalAnestesista).length !== 0)
						{
							angular.copy(pResult, vm.data.ParticipanteAnestesista);
							if(vm.data.IdAnestesista != 0){
								vm.data.ParticipanteAnestesista.Id = vm.data.IdAnestesista;
							}
							vm.data.ParticipanteAnestesista.IdTipoComponente = TIPO_PARTICIPANTE.ANESTESISTA;
							vm.data.ParticipanteAnestesista.Matricula = vm.data.profesionalAnestesista.Matricula;
							vm.data.ParticipanteAnestesista.IdProfesional = vm.data.profesionalAnestesista.IdProfesional;
							vm.data.ParticipanteAnestesista.Importe = vm.filter.importeAnestesista;
							vm.data.ParticipanteAnestesista.IdCuenta = vm.filter.profesionalAnestesista.Numero;
							vm.data.pPracticaAGrabar.Participantes.push(vm.data.ParticipanteAnestesista);
						}

						angular.copy(pResult, vm.data.ParticipanteDerecho);
						if(vm.data.IdDerechos != 0){
							vm.data.ParticipanteDerecho.Id = vm.data.IdDerechos;	
						}
						vm.data.ParticipanteDerecho.IdTipoComponente = TIPO_PARTICIPANTE.DERECHOS;
						vm.data.ParticipanteDerecho.Matricula = 63432; // HardCode
						vm.data.ParticipanteDerecho.Importe = vm.filter.importeDerecho;
						vm.data.ParticipanteDerecho.IdProfesional = vm.filter.cuentasDerecho.Numero;
						vm.data.ParticipanteDerecho.IdCuenta = vm.filter.cuentasDerecho.Numero;
						vm.data.pPracticaAGrabar.Participantes.push(vm.data.ParticipanteDerecho);

						if (!vm.data.IdPractica || vm.data.IdPractica == 0){
							vm.data.pPrefacturaPaciente.Items.push(vm.data.pPracticaAGrabar);
						}
						else{
							for (var i = vm.data.pPrefacturaPaciente.Items.length - 1; i >= 0; i--){
								if(vm.data.pPrefacturaPaciente.Items[i].Id == vm.data.IdPractica && vm.data.IdPractica)
									vm.data.pPrefacturaPaciente.Items[i] = vm.data.pPracticaAGrabar;
							}
						}
						$log.debug("a guardar",vm.data.pPrefacturaPaciente);
						PrefacturaInternacionDataService.editarPrefactura(vm.data.pPrefacturaPaciente)
						.then (function (){
							ModalService.success('Práctica guardada.');
							//Limpiar pantalla
							vm.formControl.mostrarCargaPractica = false;
							vm.formControl.habilitarCargaPractica = true;
							limpiarCargaPractica();
							cargarPrefactura(vm.data.pInternadoSeleccionado.IdPaciente, ORIGEN_PREFACTURA.INTERNACION,
								vm.data.pInternadoSeleccionado.NumeroInternado);
						}, function(pError){
							vm.data.pPrefacturaPaciente.Items.pop();
							ModalService.error('No se ha podido grabar la práctica de la prefactura.', pError.detail);
						});
					});
				}

				function verItemsDetalle(pIdItem) {
					for (var i = vm.data.pPrefacturaPaciente.Items.length - 1; i >= 0; i--) {
						if (vm.data.pPrefacturaPaciente.Items[i].Id == pIdItem) {
							vm.data.pPrefacturaPaciente.Items[i].VerDetalle = !vm.data.pPrefacturaPaciente.Items[i].VerDetalle;
						}
					}
				}

				function visar(pIdItem){
					PrefacturaInternacionDataService.visarItemPrefactura(pIdItem)
					.then (function (){
					}, function(pError){
						ModalService.error('No se pudo visar este item.', pError.detail);
					});
				}

				function editarPractica(pIdItem){
					PrefacturaInternacionDataService.ObtenerItemPrefactura(pIdItem).
					then(function (pItemPrefactura){
						vm.data.IdPractica = pItemPrefactura.Id;
						vm.filter.codigoPractica = pItemPrefactura.Codigo;
						vm.filter.nombrePractica = pItemPrefactura.Nombre;
						vm.data.pPracticaSeleccionada.Codigo = pItemPrefactura.Codigo;
						vm.data.pPracticaSeleccionada.Id = pItemPrefactura.IdPrefacturable;
						vm.data.pPracticaSeleccionada.Nombre = pItemPrefactura.Nombre;
						vm.filter.fechaRealizacion = $filter('date')(pItemPrefactura.FechaRealizacion, 'dd/MM/yyyy');
						vm.data.profesionalSolicitante = pItemPrefactura.ProfesionalSolicitante;
						vm.data.profesionalEfector = pItemPrefactura.ProfesionalEfector;
						// Esto se hace para que cargue en la directiva el numero de la matricula y la muestre en pantalla, no es lo correcto, 
						// pero por ahora salva.
						vm.data.profesionalSolicitante.Matricula = pItemPrefactura.ProfesionalSolicitante.NumeroMatricula;
						vm.data.profesionalEfector.Matricula = pItemPrefactura.ProfesionalEfector.NumeroMatricula;
						vm.filter.servicioElegido.Id = pItemPrefactura.IdServicioEfector;
						vm.filter.porcentajeAfiliado = pItemPrefactura.PorcentajeAfiliado;
						vm.filter.cantidad = pItemPrefactura.Cantidad;
						vm.filter.coberturaPracticaElegida = vm.filter.coberturaCabeceraElegida;
						vm.filter.coberturaPracticaElegida.IdTipoAfiliado = pItemPrefactura.IdTipoAfiliado;
						vm.filter.coberturaPracticaElegida.NumeroAfiliado = pItemPrefactura.NroAfiliado;
						vm.filter.coberturaPracticaElegida.PlanMutual.Id = pItemPrefactura.IdPlanMutual;
						vm.filter.coberturaPracticaElegida.PlanMutual.IdMutual = pItemPrefactura.IdMutual;
						vm.data.pPracticaSeleccionada.Nombre = pItemPrefactura.Nombre;

						for (var i = pItemPrefactura.Participantes.length - 1; i >= 0; i--) {
							switch(pItemPrefactura.Participantes[i].IdTipoComponente){
								case TIPO_PARTICIPANTE.ESPECIALISTA:
									vm.data.IdEspecialista = pItemPrefactura.Participantes[i].Id;
									vm.data.profesionalEspecialista = pItemPrefactura.Participantes[i];
									PrefacturaInternacionDataService.getCuentasProfesional(pItemPrefactura.Participantes[i].Matricula)
									.then(function (cuentas) {
										vm.data.profesionalEspecialista.Cuentas = cuentas;
										for (var j= 0, n=vm.data.profesionalEspecialista.Cuentas.length; j < n ; j++) {
												if (vm.data.profesionalEspecialista.Cuentas[j].Numero == vm.data.profesionalEspecialista.IdCuenta) {
													vm.filter.codigoEspecialista = vm.data.profesionalEspecialista.Cuentas[j];
													break;
												}
											}
									});
								break;
								case TIPO_PARTICIPANTE.AYUDANTE:
									vm.data.IdAyudante = pItemPrefactura.Participantes[i].Id;
									vm.data.profesionalAyudante = pItemPrefactura.Participantes[i];
									PrefacturaInternacionDataService.getCuentasProfesional(pItemPrefactura.Participantes[i].Matricula)
									.then(function (cuentas) {
										vm.data.profesionalAyudante.Cuentas = cuentas;
										for (var j= 0, n=vm.data.profesionalAyudante.Cuentas.length; j < n ; j++) {
												if (vm.data.profesionalAyudante.Cuentas[j].Numero == vm.data.profesionalAyudante.IdCuenta) {
													vm.filter.profesionalAyudante = vm.data.profesionalAyudante.Cuentas[j];
													break;
												}
											}
									});
								break;
								case TIPO_PARTICIPANTE.ANESTESISTA:
									
									vm.data.IdAnestesista = pItemPrefactura.Participantes[i].Id;
									vm.data.profesionalAnestesista = pItemPrefactura.Participantes[i];
									PrefacturaInternacionDataService.getCuentasProfesional(pItemPrefactura.Participantes[i].Matricula)
									.then(function (cuentas) {
										vm.data.profesionalAnestesista.Cuentas = cuentas;
										for (var j= 0, n=vm.data.profesionalAnestesista.Cuentas.length; j < n ; j++) {
												if (vm.data.profesionalAnestesista.Cuentas[j].Numero == vm.data.profesionalAnestesista.IdCuenta) {
													vm.filter.profesionalAnestesista = vm.data.profesionalAnestesista.Cuentas[j];
													break;
												}
											}
									});
								break;
								case TIPO_PARTICIPANTE.DERECHOS:
									
									vm.data.IdDerechos = pItemPrefactura.Participantes[i].Id;
									vm.data.cuentasDerecho = pItemPrefactura.Participantes[i];
				 					PrefacturaInternacionDataService.getCuentasProfesional(63432) // HARDCODEO
										.then(function (cuentas) {
											vm.data.cuentasDerecho.Cuentas = cuentas;
											for (var j= 0, n=vm.data.cuentasDerecho.Cuentas.length; j < n ; j++) {
												if (vm.data.cuentasDerecho.Cuentas[j].Numero == vm.data.cuentasDerecho.IdCuenta) {
													vm.filter.cuentasDerecho = vm.data.cuentasDerecho.Cuentas[j];
													break;
												}
											}
										});
								break;
							}
						}
						vm.filter.Visado = pItemPrefactura.Visado;
						vm.filter.IdUsuarioVisado = pItemPrefactura.IdUsuarioVisado;
						vm.filter.fechaVisado = $filter('date')(pItemPrefactura.FechaVisado, 'dd/MM/yyyy');

						//TIPO_PROFESIONAL_SOLICITANTE.INTERNO = 
						//TIPO_PREFACTURABLE.CODIGO_NOMENCLADOR
						//ESTADO_ITEM_PREFACTURADO.PENDIENTE
						vm.filter.observacionPractica = pItemPrefactura.Observacion;

						vm.filter.importeDerecho = pItemPrefactura.Derecho;
						vm.filter.importeEspecialista = pItemPrefactura.HonorarioEspecialista;
						vm.filter.importeAyudante = pItemPrefactura.HonorarioAyudante;
						vm.filter.importeAnestesista = pItemPrefactura.HonorarioAnestesista;
						vm.data.importeDerechoSugerido = pItemPrefactura.DerechoSugerido;
						vm.data.importeEspecialistaSugerido = pItemPrefactura.HonorarioEspecialistaSugerido;
						vm.data.importeAyudanteSugerido = pItemPrefactura.HonorarioAyudanteSugerido;
						vm.data.importeAnestesistaSugerido = pItemPrefactura.HonorarioAnestesistaSugerido;

						vm.formControl.habilitarCargaPractica = false;
						vm.formControl.mostrarCargaPractica = true;
					},
					function(pError){
						ModalService.error('Error al intentar obtener la práctica a editar.', pError);
					});
				}

				function eliminarPractica(pIdItem){
					ModalService.confirm('¿Desea eliminar la práctica?',
						function(pResult){
							if(pResult){
								PrefacturaInternacionDataService.eliminarPractica(pIdItem)
									.then (function (){
										for (var i =0; i < vm.data.pPrefacturaPaciente.Items.length; i++)
											if (vm.data.pPrefacturaPaciente.Items[i].Id == pIdItem) {
												vm.data.pPrefacturaPaciente.Items.splice(i,1);
												ModalService.success('Práctica eliminada.');
												break;
											}
								});
							}
						}
					);
				}
 				/* -------------------------------------------- ACTIVATE -------------------------------------------- */

 				activate();
								
				function activate () {
					vm.data.hoy = new Date();

					SupportDataService.getAllServicioMedico()
						.then(function (pServicios) {
							vm.filter.servicios = pServicios;
						}, function (pError) {
							$log.error('Error en carga de combo servicios', pError);
						});
				}
			}
	};
	return module;
})();