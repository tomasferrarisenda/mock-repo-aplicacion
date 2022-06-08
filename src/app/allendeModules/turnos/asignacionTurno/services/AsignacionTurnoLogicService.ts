/**
 * @author:			Pablo Pautasso
 * @description:	Logic service para Asignacion turnos
 * @type:			Service
 **/

import asignacionTurnoNuevoView = require('../templates/asignacion-turno-nuevo.tpl.html');
import asignacionTurnoNuevoVariosPacientesView = require('../templates/asignacion-turnos-varios-pacientes.tpl.html');
import RequerimientosMasPreparacionesView = require('../templates/requerimientos-preparaciones.tpl.html');
// import listaTurnosGeneradosXRecursoView = require('../../common/templates/lista-turnos-generados-recurso.tpl.html')

import * as angular from 'angular';


export default (function () {
	'use strict';


	const module = { init: (ngModule: any) => { } };

	module.init = function (module) {

		module.factory('AsignacionTurnoLogicService', AsignacionTurnoLogicService);

		AsignacionTurnoLogicService.$inject = ['Logger', '$uibModal', 'DateUtils', 'moment', 'AlertaService', '$q'];

		function AsignacionTurnoLogicService($log, $uibModal, DateUtils, moment, AlertaService: IAlertaService, $q) {

			$log = $log.getInstance('AsignacionTurnoLogicService');

			$log.debug('ON.-');

			/* ------------------------------------------ API Y VARIABLES ------------------------------------------ */

			var _turnosDuracion: any = [];
			var _turnosDuracionDelDia;

			const service = {
				parseFecha: parseFecha,
				getcoloresEstadoTurno: getcoloresEstadoTurno,
				obtenerTurnosExtrasPorDuracion: obtenerTurnosExtrasPorDuracion,
				getConfirmOptions: getConfirmOptions,
				criteriosMismoRecurso: criteriosMismoRecurso,
				existePacienteSeleccionado: existePacienteSeleccionado,
				checkTurnosSeleccionados: checkTurnosSeleccionados,
				getCantidadDePrestacionesSeleccionadas: getCantidadDePrestacionesSeleccionadas,
				isMutualSelected: isMutualSelected,
				loadPrestacionesButton: loadPrestacionesButton,
				setearBusquedaTurnosLogic: setearBusquedaTurnos,
				setearBusquedaTurnosUnSoloRecursoLogic: setearBusquedaTurnosUnSoloRecurso,
				setearCriterioDuracionLogic: setearCriterioDuracion,
				getDataTurnoParaOtorgarLogic: getDataTurnoParaOtorgar,
				getBuscarStatus: getBuscarStatus,
				getPrimerTurnoDeLista: getPrimerTurnoDeLista,
				getObservacionesPorSucursalParseadas: getObservacionesPorSucursalParseadas,
				obtenerTiposDeTurnoFiltrado: obtenerTiposDeTurnoFiltrado,
				obtenerPrimerosTurnosLista: obtenerPrimerosTurnosLista,
				obtenerCalendarParaTodosLosRecursos: obtenerCalendarParaTodosLosRecursos
			};

			return service;

			/* ------------------------------------------- IMPLEMENTACIÓN ------------------------------------------- */

			function parseFecha(fechas, to) {
				var _fechas = angular.copy(fechas);
				switch (to) {
					case "toBack":
						angular.forEach(_fechas, function (value) {
							if (value.Fecha != "Recurso Sin Turnos" || value.Fecha != "No atiende esta OOSS") {
								value.Fecha = DateUtils.parseToBe(value.Fecha);
							} else {
								value.Fecha = "0001-01-01T00:00:00";
							}
						});
						break;
					case "toFront":
						angular.forEach(_fechas, function (value) {
							if (value.Fecha != "0001-01-01T00:00:00") {
								value.Fecha = DateUtils.parseToFe(value.Fecha);
							} else {

								if (value.Atiende == false) value.Fecha = "No atiende esta OOSS";
								else value.Fecha = "Recurso Sin Turnos";
							}
						});
						break;
				}
				return _fechas;
			}

			function getcoloresEstadoTurno() {

				var coloresEstadoTurno = [{
					nombre: "Sin Agenda",
					color: "color-blanco-turno"
				},
				{
					nombre: "Hay Asignables",
					color: "color-verde-turno"
				},
				{
					nombre: "Con agenda, sin asignables",
					color: "color-celeste-turno"
				},
				{
					nombre: "Feriado Total",
					color: "color-rojo-turno"
				},
				{
					nombre: "Feriado Parcial",
					color: "color-amarillo-turno"
				},
				{
					nombre: "Receso Total",
					color: "color-gris-turno"
				}
				];

				return coloresEstadoTurno;
			}


			function obtenerTurnosExtrasPorDuracion(pDuracion, pTurno, pTurnosDisponiblesDelDia) {

				$log.debug('obtenerTurnosExtra', pDuracion, pTurno[0], pTurnosDisponiblesDelDia);
				_turnosDuracionDelDia = angular.copy(pTurnosDisponiblesDelDia);
				_turnosDuracion = [];
				// _turnosDuracion.push(pTurno[0]);
				checkTurnosDuracionRecursive(pTurno[0], pDuracion.DuracionIndividual);
				return _turnosDuracion;

			}

			function getSiguienteTurno(_turno, duracion) {

				var turnoSiguiente = '';
				var _horaTurnoSiguiente = moment(_turno.Hora, 'HH:mm').add(_turno.Duracion, 'minutes');
				angular.forEach(_turnosDuracionDelDia, function (Turno, key) {
					if (Turno.Hora === _horaTurnoSiguiente.format('HH:mm') && _turno.IdRecurso === Turno.IdRecurso && _turno.IdSucursal === Turno.IdSucursal) {
						turnoSiguiente = angular.copy(Turno);
					}
				});

				return turnoSiguiente;
			}

			function checkTurnosDuracionRecursive(turno, duracion) {
				if (turno !== '') {

					_turnosDuracion.push(turno);
					if (getDuracionTotalTurnosPorRecursoSelected() < duracion) {
						checkTurnosDuracionRecursive(getSiguienteTurno(turno, duracion), duracion);
					} else return;

				} else return;

			}

			function getDuracionTotalTurnosPorRecursoSelected() {
				var duracionTotal = 0;
				angular.forEach(_turnosDuracion, function (turno, key) {
					duracionTotal = duracionTotal + turno.Duracion;
				});
				return duracionTotal;
			}

			function getConfirmOptions() {

				var confirmOptions = {
					ok: 'Si',
					cancel: 'No'
				};
				return confirmOptions;
			}

			function criteriosMismoRecurso(_criterios) {

				var _ret = false;
				angular.forEach(_criterios, function (criterio) {
					var _criterioToCompare = {
						IdRecurso: criterio.IdRecurso,
						IdCriterio: criterio.Id
					};
					angular.forEach(_criterios, function (criterio2) {

						if (criterio2.Id !== _criterioToCompare.IdCriterio && criterio2.IdRecurso === _criterioToCompare.IdRecurso)
							_ret = true;
					});
				});
				return _ret;
			}

			function existePacienteSeleccionado(pacienteList) {
				var ret = false;
				angular.forEach(pacienteList, function (pac) {

					if (pac.Seleccionado === true) {
						ret = true;
					}
				});
				return ret;
			}

			function checkTurnosSeleccionados(turnos) {
				var ret = false;
				angular.forEach(turnos, function (turno) {
					if (turno.selected) {
						ret = true;

					}
				});

				return ret;
			}

			function getCantidadDePrestacionesSeleccionadas(prestacionesObtenidas) {
				var _ret = 0;
				angular.forEach(prestacionesObtenidas, function (prestacion) {
					if (prestacion.status) _ret++;
				});
				return _ret;
			}

			function isMutualSelected(afiliaciones) {

				var _ret = false;
				if (afiliaciones) {

					if (afiliaciones.length !== 0) {

						angular.forEach(afiliaciones, function (afiliacion) {
							if (afiliacion.PorDefecto === true) {
								_ret = true;
							}
						});
					}
				}
				return _ret;
			}

			function loadPrestacionesButton(prestacionesObtenidas) {
				var ret = "Prestaciones";

				angular.forEach(prestacionesObtenidas, function (prestacion, key) {

					if (prestacion.status === true) {
						if (key == 0) ret = "Prestacion: " + prestacion.Nombre;
						else ret = ret + "-" + prestacion.Nombre;
					}
				});

				if (ret.length > 45) {
					ret = ret.substring(0, 45);
					ret = ret + "...";
				}
				return ret;
			}

			function setearBusquedaTurnos(calendarioObtenido, situacionesGralDia, sucursalesConAbrev, duracionesTurnoObtenido, prestacionesObtenidas) {

				$log.debug("seteando busqueda de turnos para todos los recuros..");
				var def = $q.defer();

				var _calendar = angular.copy(calendarioObtenido);

				angular.forEach(_calendar.SituacionesPorDia, function (value) {
					angular.forEach(situacionesGralDia, function (situacionDia) {
						if (value.IdSituacionGeneral === situacionDia.Id) {
							value.Color = angular.copy(situacionDia.Color);
							value.SituacionDetallada = angular.copy(situacionDia.Nombre);
						}
					});

					angular.forEach(value.TurnosAsignables, function (turno) {
						turno.Fecha = angular.copy(value.Fecha);

						angular.forEach(_calendar.DetallesDeTurnos, function (detalleTurno) {
							if (turno.IdItemDePlantilla === detalleTurno.IdItemDePlantilla) {
								turno.Duracion = angular.copy(detalleTurno.Duracion);
								turno.IdRecurso = angular.copy(detalleTurno.IdRecurso);
								turno.IdSucursal = angular.copy(detalleTurno.IdSucursal);
								turno.IdTipoRecurso = angular.copy(detalleTurno.IdTipoRecurso);
								turno.IdPlantillaTurno = angular.copy(detalleTurno.IdPlantillaTurno);
							}
						});

						angular.forEach(_calendar.Recursos, function (recurso) {
							if (turno.IdRecurso === recurso.IdRecurso) {
								turno.Recurso = angular.copy(recurso.Nombre);
							}
						});

						angular.forEach(sucursalesConAbrev, function (sucursal) {
							if (turno.IdSucursal === sucursal.Id) {
								turno.AbreviaturaSucursal = angular.copy(sucursal.Abreviatura);
								turno.ColorSucursal = angular.copy(sucursal.Color);
								turno.Sucursal = angular.copy(sucursal.Nombre);
							}
						});

						if (duracionesTurnoObtenido) {
							angular.forEach(duracionesTurnoObtenido, function (duracion, key) {
								if (turno.IdRecurso === duracion.IdRecurso) {

									//voy a consultar si tengo varias prestaciones
									//si tengo 1 o menos seleccionadas asigno duracionIndidual
									if (getCantidadDePrestacionesSeleccionadas(prestacionesObtenidas) <= 1) {

										turno.DuracionIndividualRegla = angular.copy(duracion.DuracionIndividual);
										turno.DuracionConjuntaRegla = angular.copy(duracion.DuracionConjunta);
									}
									else {
										//si la cantidad de prestaciones es >  1 
										//sino asigno la duracion conjunta
										turno.DuracionIndividualRegla = angular.copy(duracion.DuracionConjunta);
									}
								}
							});
						}
					});

					//termina forEach general
				});

				def.resolve(_calendar);
				return def.promise;
				// return _calendar;
			}


			function setearBusquedaTurnosUnSoloRecurso(calendarioObtenido, recurso, sucursal, prestacionesObtenidas, duracionesTurnoObtenido, sucursalesConAbrev) {

				$log.debug("seteando busqueda de turnos un solo recurso");
				var def = $q.defer();

				var _calendar = angular.copy(calendarioObtenido);
				angular.forEach(_calendar.SituacionesPorDia, function (situaciones) {

					angular.forEach(situaciones.TurnosAsignables, function (turno) {

						turno.Recurso = angular.copy(recurso.Nombre);
						turno.Sucursal = angular.copy(sucursal.Nombre);
						turno.IdRecurso = angular.copy(_calendar.IdRecurso);
						turno.IdTipoRecurso = angular.copy(_calendar.IdTipoRecurso);
						turno.Duracion = angular.copy(turno.DuracionIndividual);

						//voy a consultar las duraciones para la busqueda
						if (duracionesTurnoObtenido) {

							if (turno.IdRecurso === duracionesTurnoObtenido.IdRecurso) {

								//voy a consultar si tengo varias prestaciones
								//si tengo 1 o menos seleccionadas asigno duracionIndidual
								if (getCantidadDePrestacionesSeleccionadas(prestacionesObtenidas) <= 1) {

									turno.DuracionIndividualRegla = angular.copy(duracionesTurnoObtenido.DuracionIndividual);
									turno.DuracionConjuntaRegla = angular.copy(duracionesTurnoObtenido.DuracionConjunta);
								} else {
									//si la cantidad de prestaciones es >  1 
									//sino asigno la duracion conjunta
									turno.DuracionIndividualRegla = angular.copy(duracionesTurnoObtenido.DuracionConjunta);
								}
							}
						}
						angular.forEach(sucursalesConAbrev, function (sucursal) {
							if (turno.IdSucursal === sucursal.Id) {
								turno.AbreviaturaSucursal = angular.copy(sucursal.Abreviatura);
								turno.ColorSucursal = angular.copy(sucursal.Color);
								turno.Sucursal = angular.copy(sucursal.Nombre);
							}
						});
					});
				}
				);
				def.resolve(_calendar);
				return def.promise;
				// return _calendar;
			}


			/*
			 * funcion para setear el criterio de duracion
			 * es armar el criterio en base a los datos.
			 * Podemos trabajar con dos duraciones: conjunta e individual
			 * Conjunta: cuando tenemos varias prestaciones
			 * Individual: cuando tenemos una prestacion
			 * 
			   vm.data.criterioBusquedaDuracionDto = {
			 		EdadPaciente,
			 		IdRecurso,
					IdServicio,
					IdTipoDeTurno,
					IdTipoRecurso,
					Prestaciones: [],
					IdPaciente (nuevo atributo),
					IdSucursal
			 	 }
			 */
			function setearCriterioDuracion(criterioBusquedaDuracionDto, criterioBusqueda, prestacionesObtenidas, paciente) {

				var ret = angular.copy(criterioBusquedaDuracionDto);
				ret.IdServicio = angular.copy(criterioBusqueda.IdServicio);

				if (criterioBusqueda.IdRecurso) {
					ret.IdRecurso = angular.copy(criterioBusqueda.IdRecurso);
					ret.IdTipoRecurso = angular.copy(criterioBusqueda.IdTipoRecurso);
				} else {
					ret.IdRecurso = 0;
					ret.IdTipoRecurso = 0;
				}
				ret.IdTipoDeTurno = angular.copy(criterioBusqueda.IdTipoDeTurno);
				angular.forEach(prestacionesObtenidas, function (prestacion, key) {
					if (prestacion.status) ret.Prestaciones.push(prestacion.Id);
				});

				ret.EdadPaciente = angular.copy(paciente.Edad);

				ret.IdPaciente = paciente.Id;
				ret.IdSucursal = criterioBusqueda.IdSucursal;


				return ret;
			}

			function getDataTurnoParaOtorgar(turno, prestacionesObtenidas, paciente, servicioMedico) {

				var ret: any = {};

				// Obtengo los datos de la sucursal del turno seleccionado (porque la sucursal del criterio de búsqueda podría ser TODAS)
				var sucursal: any = {};
				sucursal.IdSucursal = turno[0].IdSucursal;
				sucursal.Nombre = turno[0].Sucursal;
				sucursal.ColorSucursal = turno[0].ColorSucursal;

				ret.sucursal = angular.copy(sucursal);

				var pPrestaciones: any = [];

				if(prestacionesObtenidas){
					angular.forEach(prestacionesObtenidas, function (prestacion) {
						if (prestacion.status === true) {
							var prestacionParaAgregar = {
								Id: prestacion.Id,
								Nombre: prestacion.Nombre
							};
							pPrestaciones.push(prestacionParaAgregar);
						}
					});
				}

				ret.prestaciones = angular.copy(pPrestaciones);

				// Obtengo las prestaciones seleccionadas

				angular.forEach(turno, function (tur) {
					tur.IdPaciente = angular.copy(paciente.Id);
					tur.servicioMedicoNombre = angular.copy(servicioMedico.Nombre);
					tur.Afiliaciones = angular.copy(paciente.Afiliaciones);

				});

				var _pacientes: Array<any> = [];
				_pacientes.push(paciente);

				ret.pacientes = angular.copy(_pacientes);

				var _recurso = {
					Nombre: angular.copy(turno[0].Recurso),
					Id: angular.copy(turno[0].IdRecurso)
				};

				ret.recurso = angular.copy(_recurso);

				return ret;
			}

			function getBuscarStatus(servicio, tipoTurno, prestacionesObtenidas, paciente, sucursal) {

				var ret = true;
				let strAlerta = '';
				//controlo paciente y sus afiliaciones
				if (!paciente) {
					ret = false;
					strAlerta = strAlerta + "- Falta seleccionar el paciente."
				} else {
					if (paciente.Afiliaciones) {

						if (paciente.Afiliaciones.find(x => x.PorDefecto == true).MutualActiva) {

							if (paciente.Afiliaciones.find(x => x.PorDefecto == true).VisibleEnTurnos === true) {


								if (!servicio) {
									ret = false;
									strAlerta = strAlerta + " - Falta seleccionar el Servicio."
								}
								if (!tipoTurno || !tipoTurno.hasOwnProperty('Id')) {
									ret = false;
									strAlerta = strAlerta + " - Falta seleccionar el Tipo de Turno."
								}
								if (!prestacionesObtenidas) {
									strAlerta = strAlerta + " - Falta seleccionar alguna Prestacion."
									ret = false;
								} else {
									var prestacionOk = false;
									angular.forEach(prestacionesObtenidas, function (prestacion) {
										if (prestacion.status === true) {
											prestacionOk = true;
										}

									});
									if (!prestacionOk) {
										ret = false;
										strAlerta = strAlerta + " - Falta seleccionar una Prestación."
									}
								}
								if (!sucursal) {
									ret = false;
									strAlerta = strAlerta + " - Falta seleccionar una Sucursal."
								}

							} else {
								ret = false;
								strAlerta = strAlerta + " - No se pueden otorgar turnos para esta mutual."
							}
						} else {
							ret = false;
							strAlerta = strAlerta + " - La mutual seleccionada no esta activa."
						}
					}
				}

				if (strAlerta.length > 1) AlertaService.NewWarning("Atencion", strAlerta);

				return ret;
			}

			function getPrimerTurnoDeLista(turnosCalendario) {

				let _primerTurno: Array<any> = [];

				let banderaFind = false;
				angular.forEach(turnosCalendario.SituacionesPorDia, function (situacionDia) {
					if (situacionDia.CantidadAsignables > 0) {
						//tengo turno para asignar

						angular.forEach(situacionDia.TurnosAsignables, function (turno) {
							if (banderaFind === false) {
								_primerTurno[0] = angular.copy(turno);
								banderaFind = true;
							}
						});
					}
				});
				return _primerTurno;
			}


			function obtenerPrimerosTurnosLista(turnosCalendario) {

				let _primerTurno: Array<any> = [];
				
				angular.forEach(turnosCalendario.Recursos, function (recurso) {
					let banderaFind = false;

					angular.forEach(turnosCalendario.SituacionesPorDia, function (situacionDia) {
						
						if(situacionDia.CantidadAsignables > 0){
							
							if(situacionDia.TurnosAsignables.find(x => x.IdRecurso === recurso.IdRecurso)){

								let _primerAsignable = situacionDia.TurnosAsignables.find(x => x.IdRecurso === recurso.IdRecurso);
								if(banderaFind === false){
									_primerTurno.push(_primerAsignable);
									banderaFind = true;
								}
							}
						}
					})

				});

				return _primerTurno;
			}

			function getObservacionesPorSucursalParseadas(observacion: string, sucursalesParaObservacion) {

				var sucursales = angular.copy(sucursalesParaObservacion);

				angular.forEach(sucursales, function (sucursal) {

					const regexCerro = /\<cerro>(.*?)\<\/cerro>/g;
					const regexNvaCba = /\<nuevacba>(.*?)\<\/nuevacba>/g;

					const str = observacion.replace(/\n/g, '<br>');
					let mC = regexCerro.exec(str);

					if (mC !== null) {
						if (mC[0].includes(sucursal.Nombre.toLowerCase())) {
							sucursal.Observacion = mC[1] || "";
						}
					}

					let mN = regexNvaCba.exec(str);

					if (mN !== null) {
						if (mN[0].includes(sucursal.Nombre.toLowerCase().replace(/\s/g, ""))) {
							sucursal.Observacion = mN[1] || "";
						}
					}


				})

				$log.debug('sucursales', sucursales);


				var sucursalesFiltradas: Array<any> = [];
				//debo hacer el modo reverso

				angular.forEach(sucursales, function (suc) {
					if (!suc.Observacion) {
						suc.Observacion = "";
					} else {
						suc.Observacion = "-------" + suc.Nombre + "-------<br>" + suc.Observacion;
						suc.Observacion = suc.Observacion.replace(/<br>/g, '\n');
						sucursalesFiltradas.push(suc);
					}
				});


				return sucursalesFiltradas;
			}


			function obtenerTiposDeTurnoFiltrado(tiposDeTurnoList) {
				return tiposDeTurnoList.filter(x => x.Id !== 3 && x.Id !== 6);
			}


			function obtenerCalendarParaTodosLosRecursos(data) {	
				var def = $q.defer();
				def.resolve(data);
				return def.promise;
			}

		}
	};

	return module;
})();