/**
 * @author:			Pablo Pautasso
 * @description:	Logic service para common de turnos
 * @type:			Service
 **/
import * as angular from 'angular';

export default (function () {
   'use strict';
   

	const module = { init : (ngModule: any) => {} };

	module.init = function (module) {

		module.factory('TurnosCommonLogicService', TurnosCommonLogicService);

		TurnosCommonLogicService.$inject = ['Logger', '$uibModal', '$state', 'StateHelperService', 'moment', 'ModalService'];
		
		function TurnosCommonLogicService($log, $uibModal, $state, StateHelperService, moment, ModalService) {

			$log = $log.getInstance('TurnosCommonLogicService');

			$log.debug('ON.-');

			/* ------------------------------------------ API Y VARIABLES ------------------------------------------ */

			const service = {
				openTurnosPaciente : openTurnosPaciente,
				openMotivosCancelacionDeUnTurno: openMotivosCancelacionDeUnTurno,
				openObservacionesPorSucursal: openObservacionesPorSucursal,
				goToPrevWithParams : goToPrevWithParams,
				getBloquesListaTurnos: getBloquesListaTurnos,
				openSelectorRecursosModalPorMutual: openSelectorRecursosModalPorMutual,
				openObservacionTurno: openObservacionTurno,
				openCancelacionDeTurnosModal: openCancelacionDeTurnosModal,
				parsearObservaciones: parsearObservaciones,
				openCalendarioTurnosPorRecurso: openCalendarioTurnosPorRecurso
			};

			return service;

			/* ------------------------------------------- IMPLEMENTACIÓN ------------------------------------------- */

			function openTurnosPaciente (pPaciente, pEsHistorico, pBusquedaPorServicio, pReprogramacion) {

				return $uibModal.open({
					component: 'saTurnosPorPaciente',
					size : 'lg',
					keyboard: true,
					resolve : {
						paciente : function () {
							return pPaciente;
						},
						EsHistorico: function () {
							return pEsHistorico;
						},
						BusquedaPorServicio: function () {
							return pBusquedaPorServicio;
						},
						PuedeReprogrmar: function () {
							return pReprogramacion;
						}
					}
				}).result;
				
			}

			function openMotivosCancelacionDeUnTurno(pIdTurno) {

				return $uibModal.open({
					component: 'saVerMotivosCancelacionTurno',
					size: 'lg',
					keyboard: true,
					resolve: {
						IdTurno: function () {
							return pIdTurno;
						}
					}
				}).result;

			}

			function openSelectorRecursosModalPorMutual(pRecursos) {

				return $uibModal.open({
					component: 'saRecursosSelectorModalPorMutual',
					size: 'lg',
					keyboard: true,
					resolve: {
						Recursos: function () {
							return pRecursos;
						}
					}
				}).result;

			}

			function openObservacionesPorSucursal(data, sucursales, readonly, btnGuardar) {

				return $uibModal.open({
					component: 'saObservacionPorSucursales',
					size: 'lg',
					keyboard: false,
					backdrop: 'static',
					resolve: {
						Data: function () {
							return data;
						},
						Sucursales: function () {
							return sucursales;
						},
						Readonly: function () {
							return readonly;
						},
						BtnGuardar: function () {
							return btnGuardar;
						}
					}
				}).result;

			}


			function goToPrevWithParams(params) {
				$log.debug('obteniendo parametros',params);
				var prevState = StateHelperService.getPrevState();
				$state.go(prevState.name, params);
			}


			function getBloquesListaTurnos(listaTurnos, sucursales) {
				$log.debug('getBloquesListaTurnos',listaTurnos, sucursales);
				let primerItem = angular.copy(listaTurnos[0]);
				let bloqueIndice = 1;

				var bloques: Array<any> = [];

				if(tengoDistintaSucursal(listaTurnos)){

					angular.forEach(listaTurnos, function (_item, key) {
						if (primerItem.IdSucursal !== _item.IdSucursal && _item.EsSobreTurno === false) {
							//tengo un bloque!
							var turnoAnterior = angular.copy(listaTurnos[key-1])
							bloques.push(crearBloqueSucursal(turnoAnterior.IdSucursal, primerItem.Hora, _item.Hora, bloqueIndice, sucursales));
							bloqueIndice = bloqueIndice + 1;
							primerItem = angular.copy(_item);
						}
						//consulto si es el ultimo turno
						if(key === listaTurnos.length - 1){
							//tengo el ultimo turno
							var _diff = moment(listaTurnos[listaTurnos.length - 1].Hora, "HH:mm").diff(moment(listaTurnos[listaTurnos.length - 2].Hora, "HH:mm"), 'minutes');
							var horaFin = moment(_item.Hora, "HH:mm").add(_diff, 'minutes').format("HH:mm");

							bloques.push(crearBloqueSucursal(_item.IdSucursal, primerItem.Hora, horaFin, bloqueIndice, sucursales));
						}
					});

				}else {
					// var _difTurnos = listaTurnos[0].Hora
					var _diff = moment(listaTurnos[listaTurnos.length - 1].Hora, "HH:mm").diff(moment(listaTurnos[listaTurnos.length - 2].Hora, "HH:mm"), 'minutes');
					var horaFin = moment(listaTurnos[listaTurnos.length - 1].Hora, "HH:mm").add(_diff, 'minutes').format("HH:mm");
					
					bloques.push(crearBloqueSucursal(primerItem.IdSucursal, primerItem.Hora, horaFin, bloqueIndice, sucursales))
				}

				return bloques;
			}

			function crearBloqueSucursal(idSucursal, horaDesde, horaHasta, idBloque, sucursales) {
				let  bloque = {
					IdBloque: idBloque,
					HoraDesde: horaDesde,
					HoraHasta: horaHasta,
					Sucursal: sucursales.find(x => x.Id == idSucursal),
				};
				
				return bloque;
			}
			
			function tengoDistintaSucursal(listaTurnos) {
				let bandera = false;
				
				angular.forEach(listaTurnos, function (item) {
					if(listaTurnos[0].IdSucursal !== item.IdSucursal) bandera = true;
				})

				return bandera;
			}

			function openObservacionTurno(pObservacion) {
				//levanto modal de observacion desactivado para ver turno
				ModalService.textAreaModal({
					tituloModal: "Observación",
					icon: "VIEW",
					guardarOption: false,
					data: pObservacion,
					readOnly: true,
					sizeModal: "lg"
				});
			}

			function openCancelacionDeTurnosModal(pTurno) {
				return $uibModal.open({
					component: 'saCancelarTurno',
					size: 'lg',
					keyboard: true,
					resolve: {
						Turno: function () {
							return pTurno;
						}
					}
				}).result;
			}

			function parsearObservaciones(pObservaciones){
				let ret = "";
				angular.forEach(pObservaciones, (observacion) => {
					ret = ret + observacion.Usuario + ' - ' + moment(observacion.Fecha).format("DD/MM/YYYY - HH:mm:ss") + ": \r\n" + observacion.Observacion + "\r\n" + "\r\n";
				});

				return ret;
			}

			function openCalendarioTurnosPorRecurso (pRecurso, pServicio, pSucursal, pSeleccionarDia) {

				return $uibModal.open({
					component: 'saCalendarioOcupacionTurnosModal',
					size : 'lg',
					keyboard: true,
					resolve : {
						Recurso : function () {
							return pRecurso;
						},
						Servicio: function () {
							return pServicio;
						},
						Sucursal: function () {
							return pSucursal;
						},
						SeleccionarDia: function () {
							return pSeleccionarDia;
						}
					}
				}).result;
			}


		}
	};

	return module;
})();