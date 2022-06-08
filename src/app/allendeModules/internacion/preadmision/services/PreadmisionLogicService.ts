/**
 * @author 			emansilla
 * @description 	description
 */
import * as angular from 'angular';
import preadmisionPrintTemplate = require('../templates/preadmision-print.tpl.html');
import prequirurgicoPrintTemplate = require('../templates/prequirurgico-print.tpl.html');
import presupuestoProtesisTemplate = require('../templates/protesis-presupuesto-print.tpl.html');
import preadmisionDeleteTemplate = require('../templates/preadmision-delete.tpl.html');
import cantidadDiasTemplate = require('../templates/preadmision-cantidad-dias.tpl.html');
import plantillaTemplate = require('../templates/preadmision-plantillas.tpl.html');
import prequirurgicoEditTemplate = require('../templates/prequirurgico-edit.tpl.html');
import preadmisionSaveTemplate = require('../templates/preadmision-save.tpl.html');

export default (function () {
	'use strict';
	
	const module = { init : (ngModule: any) => {} };

	module.init = function (module) {

		module.factory('PreadmisionLogicService', PreadmisionLogicService);

		PreadmisionLogicService.$inject = [
			'Logger', '$uibModal', '$filter', '$location', '$q', 'DateUtils',
			'AuthorizationService', 'PrintSelectionService', 'PreadmisionDataService',
			'ACTION_PREADMISION'
		];
		
		function PreadmisionLogicService (
			$log, $uibModal, $filter, $location, $q, DateUtils,
			AuthorizationService, PrintSelectionService, PreadmisionDataService,
			ACTION) {

			/* ------------------------------------------------ LOG ------------------------------------------------ */

			$log = $log.getInstance('PreadmisionLogicService');
			$log.debug('ON.-');

			/* ------------------------------------------ API Y VARIABLES ------------------------------------------ */

			const service = {
				addOnePreadmision : addOnePreadmision,
				getAllSolicitudesByMedicoAndPaciente : getAllSolicitudesByMedicoAndPaciente,

				openCargaCantidadDias : openCargaCantidadDias,
				esQuirurgico : esQuirurgico,

				crearSolicitudPreadmisionCommon : crearSolicitudPreadmisionCommon,
				crearSolicitudPreadmisionForNew : crearSolicitudPreadmisionForNew,
				crearSolicitudPreadmisionForEdit : crearSolicitudPreadmisionForEdit,

				openSolicitudPreadmisionForEdit : openSolicitudPreadmisionForEdit,
				
				// Protesis
				habilitarTabPrescripcion : habilitarTabPrescripcion,

				print : print,
				printPrequirurgicos : printPrequirurgicos,
				remove : remove,

				openTemplates : openTemplates,
				copyTemplate : copyTemplate,
				
				openPrequirurgicos : openPrequirurgicos,

				saveSolicitud : saveSolicitud,

				// Tabs

				nextTab : nextTab,
				previousTab : previousTab
			};
			return service;

			/* ------------------------------------------- IMPLEMENTACIÓN ------------------------------------------- */

			/**
			 * Imprime para una internacion la impresion pasada por parametro
			 * @param  {User} pUser           Usuario activo en el controller que llama al metodo
			 * @param  {int} pIdInternacion  Id de internacion a imprimir
			 * @return {}                 
			 */
			function print (pUser, pTypePrint, pIdSolicitud) {
				$log.debug('Print', pUser, pTypePrint, pIdSolicitud);

				if (!angular.isUndefined(pIdSolicitud) &&  pIdSolicitud !== 0)
					PreadmisionDataService.idSolicitud = pIdSolicitud;
				
				if (pTypePrint.Nombre == 'PrintPrequirurgicos') {
					return printPrequirurgicos(pUser);
				} else if (pTypePrint.Nombre == 'PrintPresupuesto') {
					return PrintPresupuesto(pUser);
				} else {
					
					return $uibModal.open({
						template: preadmisionPrintTemplate,
						controller : 'PreadmisionViewController',
						controllerAs : 'vm',
						size : 'lg',
						resolve : {
							User : function () {
								return pUser;
							},
							PrintType : function () {
								return pTypePrint.Nombre;
							},
							Title : function () {
								return 'Solicitud Nº ';
							},
							Module : Module
						}
					}).result;
				}
			}

			function printPrequirurgicos (pUser) {
				return $uibModal.open({
					template: prequirurgicoPrintTemplate,
					controller : 'PrequirurgicoPrintController',
					controllerAs : 'vm',
					size : 'lg',
					resolve : {
						User: function () {
							return pUser;
						}
					}
				}).result;
			}

			function PrintPresupuesto (pUser) {
				return $uibModal.open({
					template: presupuestoProtesisTemplate,
					controller : 'ProtesisPresupuestoPrintController',
					controllerAs : 'vm',
					size : 'lg',
					resolve : {
						User: function () {
							return pUser;
						},
						Title : function () {
							return 'PRESUPUESTO DE ELEMENTOS - SOLICITUD Nº ';
						},
						Module : Module
					}
				}).result;
			}

			function remove (pUser) {

				return $uibModal.open({
					template: preadmisionDeleteTemplate,
					controller: 'PreadmisionDeleteController',
					controllerAs: 'vm',
					size: 'lg',
					resolve: {
						User: function () {
							return pUser;
						}
					}
				}).result;
			}

			function openCargaCantidadDias (pUser, pDiasInternacion) {

				return $uibModal.open({
					template: cantidadDiasTemplate,
					controller: 'PreadmisionCantidadDiasController',
					controllerAs : 'vm',
					size: 'md',
					resolve: {
						User: function () {
							return pUser;
						},
						DiasInternacion : function () {
							return pDiasInternacion;
						}
					}
				}).result;
			}

			function openTemplates (pNumeroMatricula) {
				
				return $uibModal.open({
					template: plantillaTemplate,
					controller : 'PreadmisionTemplateListController',
					controllerAs : 'vm',
					size : 'lg',
					resolve : {
						NumeroMatricula : function () {
							return pNumeroMatricula;
						},
						Title : function () {
							return 'Lista de template de preadmisión';
						},
						Module : Module
					}
				}).result;
			}

			function copyTemplate (pInternacionSrc, pInternacionDest) {
				var _detalleIntervencion, _protesis, _diaInternacion, _prequirurgico, _detallePrequirurgico;

				pInternacionDest.PrioridadSolicitud = pInternacionSrc.PrioridadSolicitud;
				pInternacionDest.TipoInternacion = pInternacionSrc.TipoInternacion;
				pInternacionDest.diagnostico = pInternacionSrc.diagnostico;
				pInternacionDest.EstadoPaciente = pInternacionSrc.EstadoPaciente;
				pInternacionDest.EnfermedadCie = pInternacionSrc.EnfermedadCie;

				// Intervencion
				pInternacionDest.IntervencionAdmision = {
					DetallesIntervencion : [],
					nombre_procedimiento : pInternacionSrc.IntervencionAdmision.nombre_procedimiento
				};

				// Intervencion Detalle
				for (var i = 0; i < pInternacionSrc.IntervencionAdmision.DetallesIntervencion.length; i++) {
					if (pInternacionSrc.IntervencionAdmision.DetallesIntervencion[i].id_origen_practica == 28) {
						_detalleIntervencion = {
							PracticaMedica : pInternacionSrc.IntervencionAdmision.DetallesIntervencion[i].PracticaMedica
						};
						pInternacionDest.IntervencionAdmision.DetallesIntervencion.push(_detalleIntervencion);
					}
				}

				// ProtesisPreadmision
				if (pInternacionSrc.ProtesisPreadmision.length) {

					for (var i = 0; i < pInternacionSrc.ProtesisPreadmision.length; i++) {
						_protesis = {
							nombre_protesis : pInternacionSrc.ProtesisPreadmision[i].nombre_protesis,
							ProveedorPreadmisionSugerido : pInternacionSrc.ProtesisPreadmision[i].ProveedorPreadmisionSugerido,
							TipoProtesis : pInternacionSrc.ProtesisPreadmision[i].TipoProtesis,
							observaciones_protesis : pInternacionSrc.ProtesisPreadmision[i].observaciones_protesis
						};
						pInternacionDest.ProtesisPreadmision.push(_protesis);
					}
				}

				// DiasInternacion
				pInternacionDest.cantidad_dias_internacion = 0;
				pInternacionDest.DiasInternacion = [];

				if (pInternacionSrc.DiasInternacion.length) {
					for (var i = 0; i < pInternacionSrc.DiasInternacion.length; i++) {
						_diaInternacion = {
							cantidad_dias : pInternacionSrc.DiasInternacion[i].cantidad_dias,
							id_categoria_habitacion : pInternacionSrc.DiasInternacion[i].id_categoria_habitacion
						};
						pInternacionDest.cantidad_dias_internacion += pInternacionSrc.DiasInternacion[i].cantidad_dias;
						pInternacionDest.DiasInternacion.push(_diaInternacion);
					}
				}

				// Prequirurgicos
				pInternacionDest.Prequirurgicos = [];
				if (pInternacionSrc.Prequirurgicos.length) {
					for (var i = 0; i < pInternacionSrc.Prequirurgicos.length; i++) {
						_prequirurgico =  {
							ServicioMedico : pInternacionSrc.Prequirurgicos[i].ServicioMedico,
							Detalles : []
						};
						for (var j = 0; j < pInternacionSrc.Prequirurgicos[i].Detalles.length; j++) {
							_detallePrequirurgico = {
								PracticaMedica : pInternacionSrc.Prequirurgicos[i].Detalles[j].PracticaMedica
							};
							_prequirurgico.Detalles.push(_detallePrequirurgico);
						}
						pInternacionDest.Prequirurgicos.push(_prequirurgico);
					}
				}
				
			}

			function habilitarTabPrescripcion (pBool, pTabs) {
				for (var i = 0; i < pTabs.length; i++) {
					if (pTabs[i].NAME == 'PRESCRIPCION') {
						pTabs[i].HIDE = !pBool;
					}
				}
			}

			function openPrequirurgicos (pPrequirurgicos) {
				
				return $uibModal.open({
					template: prequirurgicoEditTemplate,
					controller : 'PrequirurgicoViewController',
					controllerAs : 'vm',
					size : 'lg',
					resolve : {
						Prequirurgicos : function () {
							return pPrequirurgicos;
						},
						Title : function () {
							return 'Prequirúrgicos';
						},
						Module : Module
					}
				}).result;
			}

			/**
			 * [saveSolicitud description]
			 * @param  {[type]} pScope [description]
			 * @return {[type]}        [description]
			 */
			function saveSolicitud (pScope) {

				return $uibModal.open({
					template: preadmisionSaveTemplate,
					scope : pScope,
					size : 'md'
				}).result;
			}

			function esQuirurgico (pTipoInternacion) {
				if (angular.isUndefined(pTipoInternacion))
					return false;
				else 
					return pTipoInternacion.EsQuirurgica;
			}

			function nextTab (pIndex, pTabs) {

				var _count = pTabs.length,
					_idNext = pIndex;

				$log.debug('Next Tab: ', _idNext, pTabs);

				if (pIndex + 1 <= _count) {
					_idNext = pIndex + 1;
				}

				// if (pIndex + 1 <= _count) {

				// 	_idNext = pIndex + 1;

				// 	for (var i = 0; i < _count; i++) {

				// 		if (pTabs[i].Id == _idNext) {
				// 			if (pTabs[i].HIDE) {
				// 				_idNext ++;
				// 			}
				// 		} else {
				// 			pTabs[i].ACTIVE = false;
				// 		}
				// 	}
				// }

				return _idNext;
			}

			function previousTab (pIndex, pTabs) {

				var _count = pTabs.length,
					_idAnt = pIndex;

				if (pIndex - 1 > 0) {
					_idAnt = pIndex - 1;
				}
					
				// if (pIndex - 1 > 0) {
				// 	_idAnt = pIndex - 1;
				// 	for (var i = 0; i < _count; i++) {
				// 		if (pTabs[i].ID == _idAnt) {

				// 			if (pTabs[i].HIDE) {
				// 				_idAnt --;
				// 			}
				// 		}
				// 	}
				// }

				return _idAnt;
			}

			function crearSolicitudPreadmisionCommon (pSolicitud, pUser) {
				var _intervencion : any,
					_solicitud : any = {};

				angular.copy(pSolicitud, _solicitud);

				// Fix para que llegue al controller.
				if (_solicitud.TipoAfiliado) {
					_solicitud.id_tipo_afiliado = _solicitud.TipoAfiliado.Id;
					_solicitud.TipoAfiliado = null;
				}

				if (_solicitud.Mutual)
					_solicitud.Mutual.TipoAfiliado = null;

				if (_solicitud.Paciente) {

					if (_solicitud.Paciente.Telefonos)
						_solicitud.Paciente.Telefonos = [];

					if (_solicitud.Paciente.Responsables)
						_solicitud.Paciente.Responsables = [];

					if (_solicitud.Paciente.Mutual)
						_solicitud.Paciente.Mutual.TipoAfiliado = null;
				}

				if (_solicitud.IntervencionAdmision) {

					if (_solicitud.IntervencionAdmision.TipoAfiliado) {
						_solicitud.IntervencionAdmision.id_tipo_afiliado = _solicitud.IntervencionAdmision.TipoAfiliado.Id;
						
						_solicitud.IntervencionAdmision.TipoAfiliado = null;
					}
					if (_solicitud.IntervencionAdmision.Mutual) {	
						_solicitud.IntervencionAdmision.Mutual.TipoAfiliado = null;
					}
				}

				if (_solicitud.Intervenciones && _solicitud.Intervenciones.length) {

					for (var i = 0; i < _solicitud.Intervenciones.length; i++) {
						_intervencion = _solicitud.Intervenciones[i];

						if (_intervencion.Mutual) {
							_intervencion.Mutual.TipoAfiliado = null;
						}
						_intervencion.TipoAfiliado = null;
					}
				}

				_solicitud.usuario_modifica = pUser.userName.substring(0,30);

				return _solicitud;
			}

			function crearSolicitudPreadmisionForNew (pSolicitud, pTurno, pUser) {
				var _solicitud = crearSolicitudPreadmisionCommon(pSolicitud, pUser);

				_solicitud.fecha_admision_probable = $filter('date')(pSolicitud.fecha_admision_probable, 'MM/dd/yyyy');

				if (pSolicitud.TipoInternacion.EsQuirurgica) {
				 	if (pTurno == null)
				 		_solicitud.IntervencionAdmision.fecha_cirugia_probable = 
				 			$filter('date')(pSolicitud.IntervencionAdmision.fecha_cirugia_probable, 'MM/dd/yyyy');
				 	else 
				 		_solicitud.IntervencionAdmision.fecha_cirugia_probable = pTurno.fecha_cirugia;
				} else {
					_solicitud.IntervencionAdmision.fecha_cirugia_probable = null;
				}

				if (!_solicitud.EnfermedadCie) {
					_solicitud.id_cie_enfermedad = null;
				}

				$log.debug('CrearSolicitudForNew -', _solicitud, angular.toJson(_solicitud));
				return _solicitud;
			}

			function crearSolicitudPreadmisionForEdit (pSolicitud, pFormData, pUser) {
				var _solicitud = crearSolicitudPreadmisionCommon(pSolicitud, pUser);

				_solicitud.IntervencionAdmision.observaciones_admision = pFormData.observacionesAdmision;

				_solicitud.IntervencionAdmision.fecha_cirugia_probable = $filter('date')
					(pSolicitud.IntervencionAdmision.fecha_cirugia_probable, 'MM/dd/yyyy');

				_solicitud.IntervencionAdmision.fecha_cirugia_real = $filter('date')
					(pFormData.fechaCirugiaReal, 'MM/dd/yyyy');

				_solicitud.IntervencionAdmision.fecha_recepcion_probable = $filter('date')
					(pFormData.fechaRecepcionProbableMateriales, 'MM/dd/yyyy');
				
				// Ver diagnostico cie10
				_solicitud.IntervencionAdmision.EstadoAdmision = pFormData.estadoAdmision;
				_solicitud.IntervencionAdmision.fecha_autorizado = $filter('date')
					(pFormData.fechaAutorizacion, 'MM/dd/yyyy');
				_solicitud.IntervencionAdmision.numero_orden = pFormData.numeroOrden;
				_solicitud.IntervencionAdmision.DificultadGestion = pFormData.dificultadGestionAdmision;
				_solicitud.cantidad_dias_aprobados = pFormData.cantidadDiasAutorizados;
				_solicitud.fecha_admision_probable = DateUtils.parseToBe(_solicitud.fecha_admision_probable);

				_solicitud.IntervencionAdmision.DetallesIntervencion = pFormData.detallesIntervencion;
				_solicitud.diagnostico = pFormData.diagnosticoAdmision;
				_solicitud.DiasInternacion = pSolicitud.DiasInternacion;
				_solicitud.cantidad_dias_internacion = pFormData.cantidadDias;

				$log.debug('CrearSolicitudForEdit -', _solicitud);
				return _solicitud;
			}

			function openSolicitudPreadmisionForEdit (pSolicitud, pFormData) {
				// SOLAPA PACIENTE
				pFormData.requiereMedicoCirujano = (pSolicitud.MedicoCabecera != null);

				// SOLAPA INFORME
				// TODO: prueba de validacion es solo por directiva
				// (pSolicitud.Prequirurgicos) ?
					// 	 pFormData.prequirurgicoValido = true : pFormData.prequirurgicoValido = false;
				// (pSolicitud.EnfermedadCie) ? pFormData.enfermedadCie = true : pFormData.enfermedadCie = false;
				
				// SOLAPA ADMISION
				for (var i = 0; i < pSolicitud.IntervencionAdmision.DetallesIntervencion.length; i++) {
					// Origen 29 -> "Administrativo"
					if (pSolicitud.IntervencionAdmision.DetallesIntervencion[i].id_origen_practica == 29) {
						pFormData.detallesIntervencion
							.push(pSolicitud.IntervencionAdmision.DetallesIntervencion[i]);
					}
				}
				pFormData.observacionesAdmision = pSolicitud.IntervencionAdmision.observaciones_admision;
				pFormData.diagnosticoAdmision = pSolicitud.diagnostico;
				if (pSolicitud.IntervencionAdmision.EstadoAdmision.nombre_estado_admision != 'SIN GESTIÓN') {
					pFormData.estadoAdmision = pSolicitud.IntervencionAdmision.EstadoAdmision;
				}
				pFormData.dificultadGestionAdmision = pSolicitud.IntervencionAdmision.DificultadGestion;
				pFormData.fechaAutorizacion = DateUtils.parseToFe(pSolicitud.IntervencionAdmision.fecha_autorizado);
				pFormData.numeroOrden = pSolicitud.IntervencionAdmision.numero_orden;
				pFormData.cantidadDiasAutorizados = pSolicitud.cantidad_dias_aprobados;
				if (pSolicitud.cantidad_dias_internacion != 0) {
					pFormData.cantidadDias = pSolicitud.cantidad_dias_internacion;
				}
				
				pSolicitud.IntervencionAdmision.fecha_cirugia_probable = DateUtils
					.parseToFe(pSolicitud.IntervencionAdmision.fecha_cirugia_probable);

				if (!angular.isDate(pSolicitud.fecha_admision_probable)) {
					pSolicitud.fecha_admision_probable = DateUtils
						.parseToFe(pSolicitud.fecha_admision_probable);
				}

				// SOLAPA CIRUGIA
				if (pSolicitud.IntervencionAdmision.fecha_cirugia_real != '0001-01-01T00:00:00' &&
					pSolicitud.IntervencionAdmision.fecha_cirugia_real != null) {
					pFormData.fechaCirugiaReal = $filter('date')
						(pSolicitud.IntervencionAdmision.fecha_cirugia_real, 'dd/MM/yyyy');
				}

				pFormData.esQuirurgico = pSolicitud.TipoInternacion.EsQuirurgica;
			}

			function Module () {
				return 'PREADMISIÓN';
			}

			function getAllSolicitudesByMedicoAndPaciente(pMatricula, pClavePaciente) {
				// var fechaDesde = new Date(),
				// 	fechaHasta = new Date();

				// fechaDesde.setDate(fechaDesde.getDate() - 6);
				// fechaHasta.setDate(fechaHasta.getDate() + 1);

				if (pMatricula === '' || pClavePaciente === '') {
					// var obj = {};
					// obj['fechaDesde'] = $filter('date')(fechaDesde, 'MM/dd/yyyy');
					// obj['fechaHasta'] = $filter('date')(fechaHasta, 'MM/dd/yyyy');
					return PreadmisionDataService.getAllPreadmisionLazy();
				} else {
					return PreadmisionDataService.getAllPreadmisionByMedicoAndPacienteLazy(pMatricula, pClavePaciente);
				}
				// return def.promise;
			}

			function addOnePreadmision (pSolicitud) {
				var def = $q.defer();

				switch ($location.path()) {
					case ACTION.NEW_NORMAL:
						PreadmisionDataService.addOnePreadmision(pSolicitud)
							.then(saveSolicitudPreadmisionOk, saveSolicitudPreadmisionError);
						break;
					case ACTION.NEW_URGENTE_GUARDIA:
						PreadmisionDataService.addOneUrgentGuardia(pSolicitud)
							.then(saveSolicitudPreadmisionOk, saveSolicitudPreadmisionError);
						break;
					case ACTION.NEW_URGENTE_CE:
						PreadmisionDataService.addOneUrgentConsultorioExterno(pSolicitud)
							.then(saveSolicitudPreadmisionOk, saveSolicitudPreadmisionError);
						break;
					case ACTION.NEW_ART:
						PreadmisionDataService.addOneUrgentArt(pSolicitud)
							.then(saveSolicitudPreadmisionOk, saveSolicitudPreadmisionError);
						break;
				}

				function saveSolicitudPreadmisionOk (pSolicitudReturn) {
					def.resolve(pSolicitudReturn);
				}

				function saveSolicitudPreadmisionError (pError) {
					def.reject(pError);
				}

				return def.promise;
			}

		}
	};

	return module;

})();