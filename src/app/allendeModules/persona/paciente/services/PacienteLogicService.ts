/**
 * @author 			emansilla
 * @description 	description
 */
import * as angular from 'angular';
import pacienteBabyNewView = require('../templates/paciente-baby-new.tpl.html');
import pacienteListSelectorView = require('../templates/paciente-list-selector.tpl.html');
import pacienteListSelectorRelacionView = require('../templates/paciente-list-selector-relacion.tpl.html');
import saTurnosPorPacienteComponent from '../../../turnos/common/components/saTurnosPorPaciente/saTurnosPorPacienteComponent';
export default (function () {
	'use strict';
	
	const module = { init : (ngModule: any) => {} };

	module.init = function (module) {

		module.factory('PacienteLogicService', PacienteLogicService);

		PacienteLogicService.$inject = ['Logger', '$q', '$uibModal','$state', '$stateParams',
			 'DateUtils','ModalService','PacienteDataService','StateHelperService','SelectorService', 'AlertaService', 'ENV'];
		
		function PacienteLogicService ($log, $q, $uibModal,$state, $stateParams, DateUtils:IDateUtils ,
			ModalService, PacienteDataService, StateHelperService: IStateHelperService, SelectorService, AlertaService:IAlertaService, ENV) {

			/* ------------------------------------------------ LOG ------------------------------------------------ */

			$log = $log.getInstance('PacienteLogicService');
			$log.debug('ON.-');

			/* ------------------------------ API Y VARIABLES ------------------------------ */
			
			var isSelectorOpen;

			const service = {
				newNacimiento: newNacimiento,
				openPacienteSelector : openPacienteSelector,
				openPacienteSelectorRelacion: openPacienteSelectorRelacion,
				crearPaciente : crearPaciente,
				changeResponsableDefecto : changeResponsableDefecto,
				existePacienteEnResponsables : existePacienteEnResponsables,
				crearResponsable : crearResponsable,
				esMayorDeEdad : esMayorDeEdad,
				existePlanEnAfiliaciones : existePlanEnAfiliaciones,
				crearPlanAfiliacion : crearPlanAfiliacion,
				existeNacionalidadPaciente : existeNacionalidadPaciente,
				iniciarTipoDocumentoPaciente : iniciarTipoDocumentoPaciente,
				// getTabs : getTabs,
				validaResponsableDefecto :validaResponsableDefecto,
				nuevoResponsable: nuevoResponsable,
				nuevoAcargo : nuevoAcargo,
				borrarResponsable : borrarResponsable,
				borrarPacienteAcargo : borrarPacienteAcargo,
				confirmarCreacionPaciente : confirmarCreacionPaciente,
				findElements : findElements,
				esNumeroDocumentoRequerido : esNumeroDocumentoRequerido,
				esNumeroDocumentoDeshabilitado : esNumeroDocumentoDeshabilitado,
				esTipoDocumentoDeshabilitado : esTipoDocumentoDeshabilitado,
				cancelar : cancel,
				validarExistenciaPacientePorDocumento :validarExistenciaPacientePorDocumento,
				validarExistenciaPacientePorNombre : validarExistenciaPacientePorNombre,
				validarTipoDeDocumentoElegible : validarTipoDeDocumentoElegible,
				editPaciente : editPaciente,
				agregarApellidoDesdeNombre : agregarApellidoDesdeNombre,
				agregarNombreDesdeApellido : agregarNombreDesdeApellido,
				validarVisualizaEstadosPaciente:validarVisualizaEstadosPaciente,
				validarVisualizaTiposPaciente:validarVisualizaTiposPaciente,
				filtarTipoSexoElegible : filtarTipoSexoElegible,
				esPacienteVip: esPacienteVip,
				validarGuardarPaciente:validarGuardarPaciente,
				verDatosContactoPaciente: verDatosContactoPaciente
			};

			return service;

			/* ------------------------------ IMPLEMENTACIÓN ------------------------------ */
			function iniciarTipoDocumentoPaciente ( pListTipoDocumento) {
				var tipoDocumentos : Array<any>= [];
				for (var i = 0; i < pListTipoDocumento.length; i++) {
					tipoDocumentos.push({
						IdTipoDocumento: pListTipoDocumento[i].Id, 
						NombreTipoDocumento: pListTipoDocumento[i].Nombre
					});
				}
				//$log.debug('tipo documentos :',tipoDocumentos);
				return tipoDocumentos;
			}

			function validarTipoDeDocumentoElegible(pPaciente) {
				//Por el momento solo validamos en front hasta que se pueda hacer en back esta validacion.
				var tiposDocumentosNoElegibles = [{Id :8,TipoDocumento:'HC'}];
				for (let i = 0; i < tiposDocumentosNoElegibles.length; i++) {
					if (pPaciente.TipoDocumentoPaciente.Id === tiposDocumentosNoElegibles[i].Id)
						return false;
				}
				//si tenia RN solo dejo cambiar a DNI (Id = 1) el tipo DNI tiene propiedad PorDefecto = true
				//si tenia RN solo dejo cambiar a DOC NO SABE (Id = 7) el tipo DOC NO SABE tiene propiedad GeneraNumeroDocumentoAutomatico = true
				// y tiene permiso para fusionar
				if(pPaciente.TipoDocumentoPacienteBase.RecienNacido && 
					((!pPaciente.TipoDocumentoPaciente.PorDefecto && !pPaciente.TipoDocumentoPaciente.GeneraNumeroDocumentoAutomatico)
					||(!pPaciente.PuedeFusinarPaciente && pPaciente.TipoDocumentoPaciente.GeneraNumeroDocumentoAutomatico) ))
					return false;
				
				//esto no funciona en chromium
				// if (tiposDocumentosNoElegibles.find(x => x.Id === pTipoDocumento.Id)) {
				// 	return false;
				// }
				return true;
			}

			function filtarTipoSexoElegible(pListTipoSexo) {
				// el id 46 SIN DATOS LO ELIMINO PARA QUE NO LO ELIJA
				for (let i = 0; i < pListTipoSexo.length; i++) {
					if(pListTipoSexo[i].Id === 46){
						pListTipoSexo.splice(i,1);
						break;
					}
				}
				return pListTipoSexo;
			}
			function newNacimiento (pTitle) {

				var title = (pTitle) ? ' - Madre: ' + pTitle : '';

				return $uibModal.open({
					template : pacienteBabyNewView,
					controller : 'PacienteBabyNewController',
					controllerAs : 'vm',
					size : 'lg',
					resolve : {
						Title : function () {
							return title;
						}
					}
				}).result;
			}

			function openPacienteSelector (pUser) {
				
				return $uibModal.open({
					template :pacienteListSelectorView,
					controller : 'PacienteListSelectorController',
					controllerAs : 'vm',
					resolve : {
						User : function () {
							return pUser;
						}
					},
					size: 'lg'
				}).result;
			}

			function openPacienteSelectorRelacion (pUser,pIdPaciente,pTipoRelacion?:string) {
					//pRelacion 1) Responsable
					//			2) ACargo
					if(!pTipoRelacion){pTipoRelacion = 'Responsable'}

				return $uibModal.open({
					template : pacienteListSelectorRelacionView,
					controller : 'PacienteListSelectorRelacionController',
					controllerAs : 'vm',
					resolve : {
						User : function () {
							return pUser;
						},
						IdPaciente : function(){
							return pIdPaciente;
						},
						TipoRelacion : function () {
							return pTipoRelacion;
						}
					},
					size: 'lg'
				}).result;
			}

			function crearPaciente (pPaciente) {
				var _paciente = angular.copy(pPaciente);
				//_paciente.FechaNacimiento = $filter('date')(pPaciente.fecha_nacimiento, 'MM/dd/yyyy');
				_paciente.FechaNacimiento = DateUtils.parseToBe(_paciente.FechaNacimiento);
				_paciente.NombreCompleto = $.trim(_paciente.Apellido) +' '+ $.trim(_paciente.Nombre);
				_paciente.Afiliaciones = _paciente.Afiliaciones.map(a => {
					a.FechaDesde = DateUtils.parseToBe(a.FechaDesde);
					a.FechaHasta = DateUtils.parseToBe(a.FechaHasta);
					return a;
				})

				$log.debug('Crear Paciente', _paciente);
				return _paciente;
			}

			/* ------------------------------ RESPONSABLE ------------------------------ */
			function nuevoResponsable(pUser, pPaciente, scope) {
				openPacienteSelectorRelacion(pUser, pPaciente.Id)
					.then(function (pPacienteRes) {

						if (pPacienteRes.IdPaciente != pPaciente.Id) {

							if (!existePacienteEnResponsables(pPacienteRes, pPaciente.PacientesResponsables)) {

								//if (PacienteLogicService.esMayorDeEdad(pPaciente)) {
								//_responsable = PacienteLogicService.crearResponsable(pPaciente);
								//vm.data.paciente.Responsables.push(_responsable);
								//pPaciente.Responsables.push(pPacienteRes);
								pPaciente.PacientesResponsables.push(pPacienteRes);
								//validaResponsableDefecto(pPaciente.Responsables);
								//$scope.formPaciente.$pristine = false;
								scope.formPaciente.$setDirty();
								//$log.debug('vm.data.paciente.Responsables:', vm.data.paciente.Responsables);
								// } else {
								// 	ModalService.info('El responsable debe ser mayor de edad.');
								// }
							} else {
								ModalService.info('Ya está cargado.');
							}
						} else {
							ModalService.info('No se puede agregar como responsable al mismo paciente.');
						}
					});
			}

			function nuevoAcargo(pUser, pPaciente, scope) {
				openPacienteSelectorRelacion(pUser, pPaciente.Id,'ACargo')
					.then(function (pPacienteAcargo) {

						if (pPacienteAcargo.IdPacienteRelacionado != pPaciente.Id) {

							if (!existePacienteACargo(pPacienteAcargo, pPaciente.PacientesAMiCargo)) {
								
								pPaciente.PacientesAMiCargo.push(pPacienteAcargo);
								scope.formPaciente.$setDirty();
								
							} else {
								ModalService.info('Ya está cargado.');
							}
						} else {
							ModalService.info('No se puede agregar como paciente a cargo al mismo paciente.');
						}
					});
			}

			function borrarResponsable(pListResponsables, pIndex,scope) {
				pListResponsables.splice(pIndex, 1);
				scope.formPaciente.$setDirty();
				//validaResponsableDefecto(pListResponsables);
			}

			function borrarPacienteAcargo(pListPacientesAMiCargo, pIndex,scope) {
				pListPacientesAMiCargo.splice(pIndex, 1);
				scope.formPaciente.$setDirty();
				//validaResponsableDefecto(pListPacientesAMiCargo);
			}

			function changeResponsableDefecto (pResponsable, pListResponsables,scope) {
				for (var i = 0; i < pListResponsables.length; i++) {
					if (pListResponsables[i].$$hashKey  != pResponsable.$$hashKey )
						pListResponsables[i].Defecto = false;
				}
				validaResponsableDefecto(pListResponsables);
				scope.formPaciente.$setDirty();
			}

			function validaResponsableDefecto ( pListResponsables) {
				var bDefectoOk = false;
				for (var i = 0; i < pListResponsables.length; i++) {
					if(pListResponsables[i].Defecto) {
						bDefectoOk = true;
						break;
					}
				}
				if (!bDefectoOk && pListResponsables.length){
					pListResponsables[0].Defecto = true;
				}
			}

			function existePacienteEnResponsables (pResponsable, pListResponsables) {
				var _flagExiste = false;

				if (!angular.isUndefined(pListResponsables) && pListResponsables.length) {

					for (var i = 0; i < pListResponsables.length; i++) {
						//if (pListResponsables[i].IdPacienteResponsable == pResponsable.IdPacienteResponsable) {
						if (pListResponsables[i].IdPaciente == pResponsable.IdPaciente) {
							_flagExiste = true;
							break;
						}
					}
				}
				return _flagExiste;
			}

			function existePacienteACargo (pPacienteAcargo, pListPacientesAMiCargo) {
				var _flagExiste = false;

				if (!angular.isUndefined(pListPacientesAMiCargo) && pListPacientesAMiCargo.length) {

					for (var i = 0; i < pListPacientesAMiCargo.length; i++) {
						if (pListPacientesAMiCargo[i].IdPacienteRelacionado == pPacienteAcargo.IdPacienteRelacionado) {
							_flagExiste = true;
							break;
						}
					}
				}
				return _flagExiste;
			}

			function crearResponsable (pResponsable) {
				return {
					Responsable : pResponsable,
					TipoRelacion : {},
					defecto : false
				};
			}

			function esMayorDeEdad (pPaciente) {
				var _flag = false;
				if (pPaciente) {
					if (pPaciente.edad > 18)
						_flag = true;
				}

				return _flag;
			}
			/* ------------------------------ NACIONALIDADES ------------------------------ */		

			function existeNacionalidadPaciente (pNacionalidad, pNacionalidades) {
				var _flagExiste = false;
				var length = pNacionalidades.length;
				if (!angular.isUndefined(pNacionalidades) && length) {
					for (var i = 0; i < length; i++) {
						if (pNacionalidades[i].IdPais == pNacionalidad.IdPais &&
							pNacionalidades[i].IdTipoNacionalidad == pNacionalidad.IdTipoNacionalidad &&
							pNacionalidades[i].IdTipoNacionalizado == pNacionalidad.IdTipoNacionalizado){
							_flagExiste = true;
							break;
						}
					}
				}
				return _flagExiste;
			}

			/* ------------------------------ AFILIACIONES ------------------------------ */

			function existePlanEnAfiliaciones (pPlan, pAfiliaciones) {
				var _flagExiste = false;
				var length = pAfiliaciones.length;
				if (!angular.isUndefined(pAfiliaciones) && pAfiliaciones.length) {
					for (var i = 0; i < length; i++) {
						if (pAfiliaciones[i].IdPlanMutual == pPlan.Id && pAfiliaciones[i].fecha_baja == null){
							_flagExiste = true;
							break;
						}
					}
				}

				return _flagExiste;
			}

			function crearPlanAfiliacion (pPlan) {
				return {
					Plan : pPlan,
					numero_afiliado : '',
					defecto : false
				};
			}

			function findElements(array, itemSearch) {
				var matchingIndices = -1;

				for(var j = 0; j < array.length; j++)
				{
					if(itemSearch == array[j].Id)
					{	
						matchingIndices = j;
						break;
					}	
				}
				return matchingIndices;
			}

			function validarGuardarPaciente(pPaciente){
				let def = $q.defer();
				var _result = false;
				var _paciente = crearPaciente(pPaciente);
							PacienteDataService.validarGuardarPaciente(_paciente)
							.then(validaPacienteOk, validaPacienteError);

					function validaPacienteOk(result){
						if (result.IsOk === true ) {
							if(result.HasWarnings === true){
								ModalService.validarWarning(result).then(
								function (pResult) {
									if(pResult){
										def.resolve(true)
									} else {
										def.reject(_result);
									}
								}
								, function (pError) {
									def.reject(pError);
									$log.error('error', pError.Message);
								})
							}else{
								def.resolve(true);
							}
						}else{
							AlertaService.NewWarning("ERROR",result.Message);
							def.reject(_result);
						}
					}

					function validaPacienteError (pError) {
						$log.error(pError);
						def.reject(pError);
					}

				return def.promise;
			}

			function confirmarCreacionPaciente(pConfirmMessage, pPaciente) {

				var _message = pConfirmMessage || '¿Desea guardar el paciente nuevo?';
				var _messageSuccess = (pConfirmMessage) ? 'Paciente actualizado' : 'Paciente creado exitosamente';
				//Validamos antes de guardar para obtener los mensajes nuevos sobre el telefono
				validarGuardarPaciente(pPaciente).then(result => {

					ModalService.confirm(_message,
						function (pResult) {
							if (pResult) {
								var _paciente = crearPaciente(pPaciente);
								PacienteDataService.guardarPaciente(_paciente)
								.then(addPacienteOk, addPacienteError);
							}
						});
				}
				)
				
				//--------------------

				function addPacienteOk (result) {
					$log.debug('result guardar crear paciente', result);
					if (result.IsOk === false) {
						ModalService.error(result.Message);	
						return;
					}
					else {
						if($stateParams.externo === false){
							// ModalService.success(_messageSuccess);
							var obj= {
								obj: {
									idPaciente: result.IdPaciente
								}
							}
							StateHelperService.goToPrevState(obj);
						}else{
							$state.go('paciente.confirm');
						}
					}
				}

				function addPacienteError (pError) {
					$log.error(pError);
				}
			}

			function cancel (pPristine) {
				if (!pPristine){
					ModalService.confirm('¿Desea descartar los cambios?',
						function (pResult) {
							if (pResult) {
								retornarPagina();
							}
						},'',{classButton: 'btn-warning', classHeader: 'color-warning',ok:"Si",cancel:"No"});
				}
				else {retornarPagina();}
			}

			function retornarPagina() {
				if($stateParams.externo === false){
					StateHelperService.goToPrevState();
				}else{// Para cerrar Chromium
					$state.go('paciente.confirm');
				}
			}
			/* VALIDACIONES */

			function esNumeroDocumentoRequerido(pPaciente) {
				if (!pPaciente) return;
				if (!pPaciente.TipoDocumentoPaciente) return;

				return !pPaciente.TipoDocumentoPaciente.GeneraNumeroDocumentoAutomatico;
			}

			function esNumeroDocumentoDeshabilitado(pPaciente) {
				if (!pPaciente) return true;
				if(esNumeroDocumentoRequerido(pPaciente))
				{
					if(pPaciente.Id > 0){
						if(pPaciente.PuedeEditarDatosBasicos){
							if(!pPaciente.PacienteValidado || pPaciente.PuedeFusinarPaciente){
								if( pPaciente.PuedeFusinarPaciente || ((pPaciente.TipoDocumentoPaciente.RecienNacido || pPaciente.TipoDocumentoPacienteBase.RecienNacido)
									 && pPaciente.PuedeModificarTipoDocumentosRecienNacido)){
									return false;
								}
							}
						}
					}else{
						return false;
					}
				}
				return true;
			}
			
			function esTipoDocumentoDeshabilitado(pPaciente) {
				if (!pPaciente) return true;
				if(pPaciente.Id == 0) return false;
				
				if(pPaciente.PuedeEditarDatosBasicos){
					if(!pPaciente.PacienteValidado || pPaciente.PuedeFusinarPaciente){
						if( pPaciente.PuedeFusinarPaciente || ((pPaciente.TipoDocumentoPaciente.RecienNacido || pPaciente.TipoDocumentoPacienteBase.RecienNacido)
								&& pPaciente.PuedeModificarTipoDocumentosRecienNacido)){
							return false;
						}
					}
				}
				return true;
			}

			function Selector(pFiltro) {
				var _def = $q.defer();
				SelectorService.newSelector({
					nombreSelector: 'Existe/n paciente/s con datos similares al ingresado. Si desea elija uno para editarlo',
					dataService: 'PacienteDataService',
					method: 'obtenerPacienteConSimilares',
					isTableBackEnd: true,
					columns: ['Nombre'],
					objCriterio: pFiltro,
					labelWait: "Aguarde unos instantes, validando datos del paciente"
				}).then(function (pResult) {
						$log.debug('Result', pResult);
						if (pResult) {
							$log.debug('pResponse :', pResult);
							editPaciente(pResult.Id);
						} else {
							// Invalidar formulario
						}
						_def.resolve(true);

					}, function (pError) {
						_def.reject(true);
						$log.error('Error', pError);
					});
				return _def.promise;
			}

			function validarExistenciaPacientePorDocumento(pPaciente,pFiltro,pCurrentPage,pPageSize) {
				var vm = this;
				var _def = $q.defer();
				//if (pPaciente.TipoDocumentoPaciente && pPaciente.NumeroDocumento) {
				if (pPaciente.NumeroDocumento) {
					/// nuevo filtro dto
					pFiltro.IdTipodocumento = 0;//pPaciente.TipoDocumentoPaciente.Id;
					pFiltro.NumeroDocumento = pPaciente.NumeroDocumento;
					pFiltro.Nombre = pPaciente.Nombre;
					pFiltro.Apellido = pPaciente.Apellido;
					//vm.filter.filtroNuevo.Edad
					pFiltro.IdPacienteExcluir = pPaciente.Id;
					pFiltro.CurrentPage = pCurrentPage;
					pFiltro.PageSize = pPageSize;

					PacienteDataService.obtenerPacienteConSimilares(pFiltro)
						.then(function(pResult){
							if (pResult && pResult.Rows.length !==0){
								
								if (!vm.isSelectorOpen) {
									vm.isSelectorOpen = true;
									// llamo el selector
									pFiltro.PaginacionPorBack = true;
									Selector(pFiltro).then(() => {
										vm.isSelectorOpen = false;
										_def.resolve(true)
									}, () => {
										vm.isSelectorOpen = false;
										_def.reject(true)
									})
									//_def.resolve(true);() => _def.reject(true)
								}
							}
							else{
								_def.resolve(true);
							}
						}, () => _def.reject(true))
				}
				else {
					_def.resolve(true);
				}
				return _def.promise;
			}

			function editPaciente (pIdPaciente) {
				PacienteDataService.idPaciente = pIdPaciente;
				//DEPRECADO
				// $state.go('paciente.edit', {
				// 				idPaciente: pIdPaciente
				// 		});
				window.location.href = `${ENV.APP2}/paciente/edit/` + pIdPaciente;
			}

			function validarExistenciaPacientePorNombre (pPaciente,pFiltro,pCurrentPage,pPageSize) {
				var vm = this;
				var _fechaNacimiento, _def;
				var edad = 0;
				_def= $q.defer();
				//$log.debug('validarExistenciaPacientePorNombre', vm.data.paciente.FechaNacimiento);

				if (pPaciente.Nombre && pPaciente.Apellido) {
					if (pPaciente.FechaNacimiento ){
						_fechaNacimiento = new Date(pPaciente.FechaNacimiento);
						//Calculo la Edad para enviar como parametro de filtro
				   		 edad = DateUtils.getYearsOld(_fechaNacimiento);
					  	//Fin calculo Edad
					}

					/// nuevo filtro dto
					pFiltro.IdTipodocumento = pPaciente.TipoDocumentoPaciente.Id;
					pFiltro.NumeroDocumento = pPaciente.NumeroDocumento;
					pFiltro.Nombre = pPaciente.Nombre;
					pFiltro.Apellido = pPaciente.Apellido;
					pFiltro.Edad = edad;
					pFiltro.IdPacienteExcluir = pPaciente.Id;
					pFiltro.CurrentPage = pCurrentPage;
					pFiltro.PageSize = pPageSize;
					
					PacienteDataService.obtenerPacienteConSimilares(pFiltro)
						.then(function (pResult) {
							if (pResult && pResult.Rows.length !==0) {

								if (!vm.isSelectorOpen) {

									vm.isSelectorOpen = true;
									// llamo el selector
									pFiltro.PaginacionPorBack = true;
									Selector(pFiltro).then(() => {
										vm.isSelectorOpen = false;
										_def.resolve(true)
									}, () => {
										vm.isSelectorOpen = false;
										_def.reject(true)
									})
									//_def.resolve(true);() => _def.reject(true)
								}
							}
							else {
								_def.resolve(true);
							}
						}, () => _def.reject(true))
				}
				else{
					_def.resolve(true);
				}

				return _def.promise;
			}	

			function agregarApellidoDesdeNombre(pPaciente,pSeparador) {
				var separador = angular.isUndefined(pSeparador) ? " " : pSeparador;
				
				if((pPaciente.Nombre) && (pPaciente.Nombre.length > 0))
				{
					var arrayNombre = pPaciente.Nombre.split(separador);
					if(arrayNombre.length > 1)
					{
						pPaciente.Apellido = pPaciente.Apellido +" "+ arrayNombre[0];
						arrayNombre.splice(0,1);
						pPaciente.Nombre = arrayNombre.join(separador);
					}
				}
				return pPaciente;
			}
			function agregarNombreDesdeApellido(pPaciente,pSeparador) {

				var separador = angular.isUndefined(pSeparador) ? " " : pSeparador;
				
				if((pPaciente.Apellido) && (pPaciente.Apellido.length > 0))
				{
					var arrayApellido = pPaciente.Apellido.split(separador);
					var largoArray = arrayApellido.length;
					if(largoArray > 1)
					{
						pPaciente.Nombre = arrayApellido[largoArray-1] +" "+pPaciente.Nombre ;
						arrayApellido.splice((largoArray-1),1);
						pPaciente.Apellido = arrayApellido.join(separador);
					}
				}
				return pPaciente;
			}

			function validarVisualizaEstadosPaciente(pPaciente) {
				if ((pPaciente.PuedeEditarEstadoEmpadronamiento && !pPaciente.PacienteFusionado)|| pPaciente.PuedeFusinarPaciente){
					 return true;
				}
				else{
					return false;
				}
			}

			function validarVisualizaTiposPaciente(pPaciente) {
				if ((pPaciente.PuedeEditarTipoDePaciente && !pPaciente.PacienteFusionado)|| pPaciente.PuedeFusinarPaciente){
					 return true;
				}
				else{
					return false;
				}
			}

			function esPacienteVip(pPaciente) {
				if (pPaciente.PacienteVip) AlertaService.NewWarning("ATENCIÓN", "EL PACIENTE SELECCIONADO ES FAMILIAR DEL SANATORIO");
			}

			function verDatosContactoPaciente(pIdPaciente) {
				return $uibModal.open({
					component: 'saVerDatosContactoPacienteModal',
					resolve : {
						IdPaciente : function () {
							return pIdPaciente;
						}
					},
					size: 'md'
				}).result;
			}
			/* ------------------------------ OTROS ------------------------------ */

			// function getTabs (pUser, pActionRequired) {
			// 	//Comento hasta que Eze vea como se hace los tab con lo nuevo de seguridad
			// 	 var _tabs = AuthorizationService.GetTabsByAction(pUser, pActionRequired);

			// 	for (var i = 0; i < _tabs.length; i++) {
			// 		_tabs[i].CONTENT = _tabs[i].CONTENT;
			// 	}

			// 	return _tabs;
			// }
		}
	};

	return module;

})();