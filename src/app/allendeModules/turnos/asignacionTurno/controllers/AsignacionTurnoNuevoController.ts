/**
 * @author:			Pablo Pautasso
 * @description:	modal controller para asignacion de turno nuevo
 * @type:			controller
 **/

import * as angular from 'angular';

export default (function () {
	'use strict';

	const module = { init: (ngModule: any) => { } };

	module.init = function (module) {

		module.controller('AsignacionTurnoNuevoController', AsignacionTurnoNuevoController);

		AsignacionTurnoNuevoController.$inject = [
			'$location', 'Logger', '$q', '$filter', '$uibModalInstance', 'moment',
			'AlertaService', 'PrestacionGestionDataService',
			'TurnoDataService',
			'Paciente', 'CriterioBusqueda', 'Turno', 'Recurso', 'Servicio', 'Sucursal', 'TipoTurno', 'Prestaciones',
			'IdTurnoReprogramar', 'ObservacionesPorSucursal'
		];

		function AsignacionTurnoNuevoController(
			$location, $log, $q, $filter, $uibModalInstance, moment,
			AlertaService, PrestacionGestionDataService,
			TurnoDataService,
			Paciente, CriterioBusqueda, Turnos, Recurso, Servicio, Sucursal, TipoTurno, Prestaciones,
			IdTurnoReprogramar, ObservacionesPorSucursal
		) {

			/* ------------------------------------------------ LOG ------------------------------------------------ */

			$log = $log.getInstance('AsignacionTurnoNuevoController');
			$log.debug('ON.-');

			/* ----------------------------------------- API Y VARIABLESES ----------------------------------------- */

			var vm = this;
			vm.today = new Date();

			vm.title = {

			};

			vm.data = {
				turnos: angular.copy(Turnos),
				nuevoTurnoAsignable: [],
				nuevoMultipleTurnosAsignable: [],
				criterioBusqueda: CriterioBusqueda,
				pacientes: Paciente,
				recurso: Recurso,
				servicio: Servicio,
				sucursal: Sucursal,
				tipoTurno: TipoTurno,
				prestaciones: Prestaciones,
				idTurnoReprogramar: IdTurnoReprogramar,
				NormativasMutual: "",
				RequisitosAdministrativos: "",
				Preparaciones: "",
				observacionesPlantilla: ObservacionesPorSucursal,
				checkSolicitudEstudios: false,
			};

			vm.formData = {};

			vm.formControl = {
				loading: false,
				error: true,
				reloadPage: activate,
				ok: methodSave,
				cancel: cancel,
				selectPaciente: selectPaciente,
				copiarRequerimientos: copiarRequerimientos,
				validationLoading: false
			};

			/* ------------------------------------------- IMPLEMENTACIÓN ------------------------------------------- */

			/* FORMULARIO */

			function methodSave() {

				$log.debug('turno a otorgar', vm.data.turnos, vm.data.criterioBusqueda, vm.data.observacionTurno);

				var _turnoAGuardar: any = {};

				vm.formControl.validationLoading = true;
				// var _turnoAGuardar = {};

				if (vm.data.turnos.length > 1) {

					$log.debug('turnos length > 1');

					vm.data.nuevoMultipleTurnosAsignable.TurnosElegidosDto = angular.copy(vm.data.turnos);
					vm.data.nuevoMultipleTurnosAsignable.CriterioBusquedaDto = angular.copy(vm.data.criterioBusqueda);

					//seteamoos criterio busqueda en turno multiple
					vm.data.nuevoMultipleTurnosAsignable.CriterioBusquedaDto.IdRecurso = angular.copy(vm.data.turnos[0].IdRecurso);
					vm.data.nuevoMultipleTurnosAsignable.CriterioBusquedaDto.IdSucursal = angular.copy(vm.data.turnos[0].IdSucursal);
					vm.data.nuevoMultipleTurnosAsignable.CriterioBusquedaDto.IdTipoRecurso = angular.copy(vm.data.turnos[0].IdTipoRecurso);

					//////finalizo para turno multiple
					///
					//seteo duracioninvidual para cada turno
					angular.forEach(vm.data.nuevoMultipleTurnosAsignable.TurnosElegidosDto, function (turno, key) {
						turno.DuracionIndividual = angular.copy(turno.Duracion);
					});

					vm.data.nuevoMultipleTurnosAsignable.Observaciones = angular.copy(vm.data.observacionTurno);
					vm.data.nuevoMultipleTurnosAsignable.Duracion = angular.copy(vm.data.turnos[0].DuracionIndividualRegla);

					//voy a setear el nuevo tipo de turno
					if (vm.data.nuevoMultipleTurnosAsignable.TurnosElegidosDto[0] && vm.data.nuevoMultipleTurnosAsignable.TurnosElegidosDto[0].IdTipoTurnoRecomendado) {
						vm.data.nuevoMultipleTurnosAsignable.CriterioBusquedaDto.IdTipoDeTurno =
							vm.data.nuevoMultipleTurnosAsignable.TurnosElegidosDto[0].IdTipoTurnoRecomendado;
					}

					_turnoAGuardar = angular.copy(vm.data.nuevoMultipleTurnosAsignable);

					if(vm.data.idTurnoReprogramar === 0)
					asignarTurnoMultiple(_turnoAGuardar);
					else asignarTurnoMultipleConReprogramacion(_turnoAGuardar);
					

				} else {

					$log.debug('tengo un solo turno', vm.data.nuevoTurnoAsignable);

					vm.data.nuevoTurnoAsignable.TurnoElegidoDto = angular.copy(vm.data.turnos[0]);
					vm.data.nuevoTurnoAsignable.TurnoElegidoDto.DuracionIndividual = angular.copy(vm.data.turnos[0].Duracion);
					vm.data.nuevoTurnoAsignable.CriterioBusquedaDto = angular.copy(vm.data.criterioBusqueda);
					vm.data.nuevoTurnoAsignable.Observaciones = angular.copy(vm.data.observacionTurno);

					vm.data.nuevoTurnoAsignable.CriterioBusquedaDto.IdRecurso = angular.copy(vm.data.turnos[0].IdRecurso);
					vm.data.nuevoTurnoAsignable.CriterioBusquedaDto.IdTipoRecurso = angular.copy(vm.data.turnos[0].IdTipoRecurso);

					//voy a setear el nuevo tipo de turno
					if (vm.data.nuevoTurnoAsignable.TurnoElegidoDto && vm.data.nuevoTurnoAsignable.TurnoElegidoDto.IdTipoTurnoRecomendado) {
						vm.data.nuevoTurnoAsignable.CriterioBusquedaDto.IdTipoDeTurno =
							vm.data.nuevoTurnoAsignable.TurnoElegidoDto.IdTipoTurnoRecomendado;
					}

					_turnoAGuardar = angular.copy(vm.data.nuevoTurnoAsignable);

					_turnoAGuardar.TurnoElegidoDto.Fecha = angular.copy(moment(_turnoAGuardar.TurnoElegidoDto.Fecha)
						.format("MM-DD-YYYY"));
					

					if(vm.data.idTurnoReprogramar === 0)
					asignarTurnoSimple(_turnoAGuardar);
					else asignarTurnoSimpleConReprogramacion(_turnoAGuardar);

				}
				$log.debug('Turno a guardar', _turnoAGuardar);
			}

			//func para asignar un turno simple
			function asignarTurnoSimple(_turnoSimple) {

				$log.debug('asignarTurno SIMPLE ', _turnoSimple);
				vm.formControl.loading = true;

				TurnoDataService.asignarTurno(_turnoSimple)
					.then(asignarTurnoOk, asignarTurnoError);

				function asignarTurnoOk(pResults) {
					vm.formControl.validationLoading = false;
					$log.debug('asignarTurno Ok', pResults);
					if (pResults.IsOk) {
						AlertaService.NewSuccess("Operacion Exitosa", "El turno ha sido otorgado correctamente");
						$uibModalInstance.close('Ok');
					} else {
						AlertaService.NewWarning("Atención", pResults.Message);
						vm.formControl.loading = false;
					}
				}
				function asignarTurnoError(pError) {
					vm.formControl.loading = false;
					$log.error('Error asignar turno', pError);
					vm.formControl.validationLoading = false;

				}

			}

			//func para validar y asignar un turno multiple duracion
			function asignarTurnoMultiple(_turnoMultiple) {

				$log.debug('asignarTurno MULTIPLE ', _turnoMultiple);

				vm.formControl.loading = true;
				TurnoDataService.validarAsignarTurnosMultiples(_turnoMultiple)
					.then(validarAsignarMultipleOk, validarAsignarMultipleError);

				function validarAsignarMultipleOk(pResultValidar) {
					$log.error('pResultValidar', pResultValidar);
					//se agrega validationLoading para evitar multiple click
					if (pResultValidar.IsOk === true) {

						vm.formControl.loading = true;
						TurnoDataService.asignarTurnosMultiple(_turnoMultiple)
							.then(asignarMultipleOk, asignarTurnoError);

					} else {
						vm.formControl.loading = false;
						$log.error('validate ', pResultValidar.IsOk);
						AlertaService.NewError("Error", pResultValidar.Message);
					}
				}

				function validarAsignarMultipleError(pValidarError) {
					$log.error('pValidarError', pValidarError);
					vm.formControl.validationLoading = false;
					vm.formControl.loading = false;
				}

				function asignarMultipleOk(pResult) {
					vm.formControl.loading = false;
					vm.formControl.validationLoading = false;
					$log.debug('asignarTurno Ok', pResult);

					if (pResult.IsOk) {
						AlertaService.NewSuccess("Operacion Exitosa", "El turno ha sido otorgado correctamente");
						$uibModalInstance.close('Ok');
					} else {
						AlertaService.NewWarning("Atención", pResult.Message);
						vm.formControl.loading = false;
						vm.formControl.validationLoading = false;
					}

				}
				function asignarTurnoError(pError) {
					vm.formControl.loading = false;
					$log.error('Error asignar turno', pError);
					vm.formControl.validationLoading = false;
				}
				vm.formControl.loading = false;
				vm.formControl.validationLoading = false;
			}

			//asignamos turno simple con id de turno a reprogramar
			function asignarTurnoSimpleConReprogramacion(_turnoAGuardar) {

				$log.error('turno simple con repro', vm.data.idTurnoReprogramar);
				vm.formControl.loading = true;

				vm.data.reprogramacionTurnoSimple.AsignarTurnoDto = angular.copy(_turnoAGuardar);
				vm.data.reprogramacionTurnoSimple.IdTurnoPorReprogramar = angular.copy(vm.data.idTurnoReprogramar);

				TurnoDataService.reprogramarTurnoSimpleManualmente(vm.data.reprogramacionTurnoSimple)
					.then(asignarTurnoOk, asignarTurnoError);

				function asignarTurnoOk(pResults) {

					AlertaService.NewSuccess("Operacion Exitosa", "El turno ha sido otorgado correctamente");
					$uibModalInstance.close('OkReprogramado');

				}
				function asignarTurnoError(pError) {
					vm.formControl.loading = false;
					$log.error('Error asignar turno', pError);
					vm.formControl.validationLoading = false;

				}

			}

			function asignarTurnoMultipleConReprogramacion(_turnoAGuardar) {
				$log.error('turno multiple con repro', vm.data.idTurnoReprogramar);
				vm.formControl.loading = true;
				vm.data.reprogramacionTurnoMultiple.AsignarTurnoMultipleDto = angular.copy(_turnoAGuardar);
				vm.data.reprogramacionTurnoMultiple.IdTurnoPorReprogramar = angular.copy(vm.data.idTurnoReprogramar);

				TurnoDataService.reprogramarTurnoMultipleManualmente(vm.data.reprogramacionTurnoMultiple)
					.then(asignarTurnoMultipleReprogramacionOk, asignarTurnoMultipleReprogramacionError);

				function asignarTurnoMultipleReprogramacionOk(pResult) {
					vm.formControl.loading = false;
					vm.formControl.validationLoading = false;
					$log.debug('asignarTurno Ok', pResult);
					AlertaService.NewSuccess("Operacion Exitosa", "El turno ha sido otorgado correctamente");
					$uibModalInstance.close('OkReprogramado');
				}

				function asignarTurnoMultipleReprogramacionError(pError) {
					vm.formControl.loading = false;
					$log.error('Error asignar turno', pError);
					vm.formControl.validationLoading = false;
				}
				vm.formControl.loading = false;

			}

			function cancel() {
				$uibModalInstance.dismiss('cancel');
			}

			function selectPaciente(paciente) {

				$log.debug('selectPaciente', paciente, vm.data.turnos, vm.data.criterioBusqueda, vm.data.pacientes);
				angular.forEach(vm.data.pacientes, function (pacient) {

					if (pacient.Id == paciente) {
						vm.data.pacienteSeleccionado = angular.copy(pacient);
					}
				});

				$log.debug('paciente seleccionado', vm.data.pacienteSeleccionado);
			}

			function ObtenerPreparaciones() {

				let pListaIds: Array<any> = [];;
				vm.data.prestaciones.forEach(prestacion => {
					pListaIds.push(prestacion.Id);
				});

				PrestacionGestionDataService.obtenerPorIds(pListaIds).then(obtenerPreparacionesOk, obtenerPreparacionesError);

				function obtenerPreparacionesOk(resultados) {
					$log.debug("Preparaciones obtenidas: ", resultados);
					vm.data.Preparaciones = resultados;

				}

				function obtenerPreparacionesError(pError) {
					$log.error('errorObtenerPreparaciones', pError);
				}
			}


			function evaluarConvenio() {

				vm.formControl.loading = true;

				var _turnoAGuardar: any = {};

				$log.debug('tengo un solo turno', vm.data.nuevoTurnoAsignable);

				vm.data.nuevoTurnoAsignable.TurnoElegidoDto = angular.copy(vm.data.turnos[0]);
				vm.data.nuevoTurnoAsignable.TurnoElegidoDto.DuracionIndividual = angular.copy(vm.data.turnos[0].Duracion);
				vm.data.nuevoTurnoAsignable.CriterioBusquedaDto = angular.copy(vm.data.criterioBusqueda);
				vm.data.nuevoTurnoAsignable.Observaciones = angular.copy(vm.data.observacionTurno);

				vm.data.nuevoTurnoAsignable.CriterioBusquedaDto.IdRecurso = angular.copy(vm.data.turnos[0].IdRecurso);
				vm.data.nuevoTurnoAsignable.CriterioBusquedaDto.IdTipoRecurso = angular.copy(vm.data.turnos[0].IdTipoRecurso);

				_turnoAGuardar = angular.copy(vm.data.nuevoTurnoAsignable);

				//section para fix sexopaciente y fecha
				// _turnoAGuardar.CriterioBusquedaDto.SexoPaciente = "M";
				_turnoAGuardar.TurnoElegidoDto.Fecha = angular.copy(moment(_turnoAGuardar.TurnoElegidoDto.Fecha)
					.format("MM-DD-YYYY"));
				//_turnoAGuardar.CriterioBusquedaDto.IdPlan = 1;
				// evaluarTurnoContraConvenio

				TurnoDataService.evaluarTurnoContraConvenio(_turnoAGuardar).then(evaluarOk);

				function evaluarOk(pResults) {
					$log.debug('Resultado de evaluar el turno (Ok)', pResults);
					vm.formControl.loading = false;

					vm.data.NormativasMutual = pResults.NormativasMutual;
					vm.data.RequisitosAdministrativos = pResults.RequisitosAdministrativos;
					vm.data.PrestacionesNoIncluidas = pResults.PrestacionesNoIncluidas;
					vm.data.PrestacionesRequierenPresupuesto = pResults.PrestacionesRequierenPresupuesto;
					vm.data.ImporteTotalCoseguro = pResults.ImporteTotalCoseguro;
					vm.data.ImporteTotalParticular = pResults.ImporteTotalParticular;
				}
			}


			function copiarRequerimientos() {
				let copyText: any = document.getElementById("textrequerimientos");
				if (copyText) {
					copyText.select();
					document.execCommand("copy");
				}
			}

			/* ---------------------------------------------- ACTIVATE ---------------------------------------------- */

			activate();

			function activate() {

				$log.debug('Inicializar ON.-', vm.data.turnos, vm.data.criterioBusqueda, vm.data.pacientes);

				angular.forEach(vm.data.turnos, function (value) {

					value.Fecha = angular.copy(moment(new Date(value.Fecha), "mm/dd/yyyy")
						.format('MM-DD-YYYY'));
					value.FechaToShow = angular.copy(moment(new Date(value.Fecha), "mm/dd/yyyy")
						.format('DD-MM-YYYY'));

				});

				vm.formControl.loading = true;

				var _nuevoTurnoAsignable = TurnoDataService.obtenerNuevoTurnoAsignable();
				var _nuevosTurnosAsignables = TurnoDataService.obtenerNuevoMultipleTurnoAsignable();
				var _reprogramacionTurnoSimpleManualmente = TurnoDataService.obtenerNuevoReprogramarTurnoSimple();
				var _reprogramacionTurnoMultipleManualmente = TurnoDataService.obtenerNuevoReprogramarTurnoMultiple();

				$q.all([
					_nuevoTurnoAsignable,
					_nuevosTurnosAsignables,
					_reprogramacionTurnoSimpleManualmente,
					_reprogramacionTurnoMultipleManualmente
				])
					.then(successCallback, errorCallback);

				function successCallback(pResults) {

					$log.debug('Inicializar OK. pResults-', pResults);

					vm.data.nuevoTurnoAsignable = pResults[0];
					vm.data.nuevoMultipleTurnosAsignable = pResults[1];

					vm.data.reprogramacionTurnoSimple = pResults[2];
					vm.data.reprogramacionTurnoMultiple = pResults[3];



					vm.data.paciente = angular.copy(vm.data.pacientes[0]);

					// Concatenar las prestaciones
					vm.data.prestacionesConcatenadas = "";

					if (vm.data.prestaciones.length == 1) {
						vm.data.prestacionesConcatenadas = vm.data.prestaciones[0].Nombre;
					} else {
						vm.data.prestacionesConcatenadas = vm.data.prestaciones.map(e => e.Nombre).join(" - ");
					}

					vm.data.mutualyplan = "";
					angular.forEach(vm.data.turnos[0].Afiliaciones, function (mutual) {
						if (mutual.PorDefecto) {
							vm.data.mutualyplan = mutual.MutualNombreCorto + ' - ' + mutual.PlanMutualNombre;
						}
					})

					// Tomo la hora del turno 
					vm.data.horaTurno = vm.data.turnos[0].Hora;

					if (vm.data.tipoTurno.Id === 1) {
						vm.data.tipoTurno.Nombre = '';
					}
					// Genero la fecha en formato: lunes 25 de septiembre de 2017
					var fechaTurno = moment(new Date(vm.data.turnos[0].Fecha), "mm/dd/yyyy").format('MM-DD-YYYY');
					vm.data.fechaFormateada = moment(fechaTurno).format('dddd DD [de] MMMM [de] YYYY');

					//solicitud de estudios check
					if(vm.data.prestaciones.filter(x => x.IdItemSolicitudEstudios != 0)){
						vm.data.checkSolicitudEstudios = true;
					}

					// voy a obtener las preparaciones y evaluar el convenio

					ObtenerPreparaciones();
					evaluarConvenio();

					// voy a ocultar el loading => termine de trabajar
					vm.formControl.loading = false;
					vm.formControl.error = false;
				}

				function errorCallback(pError) {
					vm.formControl.loading = false;
					vm.formControl.error = true;
					$log.error('Inicializar ERROR.-', pError);
					AlertaService.NewError("Error", pError.message);
				}
			}

		}
	};

	return module;
})();