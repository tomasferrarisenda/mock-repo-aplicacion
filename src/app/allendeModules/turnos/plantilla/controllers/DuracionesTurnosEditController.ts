/**
 * @author:			Pablo Pautasso
 * @description:	Controller para ABM de duraciones de turnos
 * @type:			Controller
 **/
import * as angular from 'angular';

export default (function () {
   'use strict';

	const module = { init : (ngModule: any) => {} };

	module.init = function(module) {

		module.controller('DuracionesTurnosEditController', DuracionesTurnosEditController);

		DuracionesTurnosEditController.$inject = [
			'$location', 'Logger', '$q', '$filter', '$stateParams', '$uibModalInstance',
			'ModalService', 'PlantillaDataService', 'AlertaService',
			'PrestacionGestionDataService', 'IdServicio', 'IdRecurso', 'IdTipoRecurso',
			'IdDuracionEditar'

		];

		function DuracionesTurnosEditController(
			$location, $log, $q, $filter, $stateParams, $uibModalInstance,
			ModalService, PlantillaDataService, AlertaService,
			PrestacionGestionDataService, IdServicio, IdRecurso, IdTipoRecurso,
			IdDuracionEditar
		) {

			/* ------------------------------------------------ LOG ------------------------------------------------ */

			$log = $log.getInstance('DuracionesTurnosEditController');
			$log.debug('ON.-');

			/* ----------------------------------------- API Y VARIABLESES ----------------------------------------- */

			var vm = this;
			vm.today = new Date();

			vm.title = {

			};

			vm.data = {

				duracionTurnoNuevo: {},
				duraciones: {},
				idServicio: IdServicio,
				idRecurso: IdRecurso,
				idTipoRecurso: IdTipoRecurso,
				idDuracionTurnoEditar: IdDuracionEditar,
				tipoTurno: {},
				prestacion: {}

			};

			vm.formData = {};

			vm.formControl = {
				loading: false,
				error: true,
				reloadPage: activate,
				ok: methodSave,
				cancel: volver,

				getEdadDuracion: getEdadDuracion
			};

			/* ------------------------------------------- IMPLEMENTACIÓN ------------------------------------------- */

			/* FORMULARIO */

			function inicializarVariables() {}

			function llenarForm() {}

			function verificarSiHayAlgunaDimensionDefinida()
			{
				
				if (!angular.isUndefined(vm.data.duracionTurnoNuevo.IdTipoTurno) && vm.data.duracionTurnoNuevo.IdTipoTurno !== null)
					return true;

				if (!angular.isUndefined(vm.data.duracionTurnoNuevo.IdPrestacion) && vm.data.duracionTurnoNuevo.IdPrestacion !== null)
					return true;

				if (!angular.isUndefined(vm.data.duracionTurnoNuevo.FiltrarEdad) && vm.data.duracionTurnoNuevo.FiltrarEdad !== null && vm.data.duracionTurnoNuevo.FiltrarEdad)
					return true;
				
				return false;
			}

			function methodSave() {

				$log.debug('guardando duracion turno', vm.data.duracionTurnoNuevo, vm.data.tipoTurno,
					vm.data.prestacion, vm.data.idRecurso, vm.data.idServicio, vm.data.idTipoRecurso);

				vm.data.duracionTurnoNuevo.IdTipoTurno = angular.copy(vm.data.tipoTurno.Id);
				vm.data.duracionTurnoNuevo.IdPrestacion = angular.copy(vm.data.prestacion.Id);
				vm.data.duracionTurnoNuevo.IdRecurso = angular.copy(vm.data.idRecurso);
				vm.data.duracionTurnoNuevo.IdServicio = angular.copy(vm.data.idServicio);
				vm.data.duracionTurnoNuevo.IdTipoRecurso = angular.copy(vm.data.idTipoRecurso);

				// Al menos una de las dimensiones debe estar definida
				if (!verificarSiHayAlgunaDimensionDefinida())
				{					
					AlertaService.NewWarning("Atención", "Debe definir al menos una dimensión para la regla de duración");
					return;
				}

				if (vm.data.duracionTurnoNuevo.FiltrarEdad){
					if (vm.data.duracionTurnoNuevo.FiltrarEdadMinima > vm.data.duracionTurnoNuevo.FiltrarEdadMaxima)
					{

						AlertaService.NewWarning("Atención", "La edad minima debe ser menor que la edad máxima");
						return;
					}
				}

				PlantillaDataService.validarGuardarDuracionTurno(vm.data.duracionTurnoNuevo)
					.then(validarGuardarOk, validarGuardarError);

				function validarGuardarOk(pResponse) {

					if (pResponse.IsOk === true) {

						vm.formControl.loading = true;
						PlantillaDataService.guardarDuracionTurno(vm.data.duracionTurnoNuevo)
							.then(function(pResp) {

								vm.formControl.loading = false;
								$uibModalInstance.close("result ok");
								AlertaService.NewSuccess("Guardado","Duracion De Turno Guardado");

							}).catch(function(pErr) {
								vm.formControl.loading = false;
								AlertaService.NewError("Error","Error de servidor");
								$uibModalInstance.dismiss(pErr);
								$log.error('ValidacionNew .-', pErr);
							});
					} else {
						if (pResponse.Message != null)
							AlertaService.NewError("Error",pResponse.Message);
						else
							AlertaService.NewError("Error","Error de servidor");
						vm.formControl.loading = false;
					}

					vm.formControl.loading = false;


				}

				function validarGuardarError(pError) {
					$uibModalInstance.dismiss(pError);
					$log.error(' validarGuardarError ERROR.-', pError);

				}

			}

			function volver() {
				$uibModalInstance.close("cancel modal");

			}

			function getEdadDuracion(duracion) {

				if (duracion.FiltrarEdad) return "De: " + duracion.FiltrarEdadMinima + " a " + duracion.FiltrarEdadMaxima;
				else return "-";

			}

			/* ---------------------------------------------- ACTIVATE ---------------------------------------------- */

			activate();

			function activate() {
				$log.debug('Inicializar ON.-');
				vm.formControl.loading = true;


				var _duracionTurnoNuevoDto = PlantillaDataService.obtenerNuevoDuracionTurno();
				var _tiposDeTurnos = PlantillaDataService.obtenerTiposDeTurnos();
				var _prestaciones;

				if (vm.data.idServicio)
					_prestaciones = PrestacionGestionDataService.getTodasPrestacionesXServicio(vm.data.idServicio);
				else $log.debug('vuelve');



				if (vm.data.idDuracionTurnoEditar) {
					_duracionTurnoNuevoDto = PlantillaDataService.obtenerDuracionTurnoPorId(vm.data.idDuracionTurnoEditar);

				}

				$q.all([
						_duracionTurnoNuevoDto,

						_tiposDeTurnos,
						_prestaciones
					])
					.then(successCallback, errorCallback);

				function successCallback(pResults) {
					vm.data.duracionTurnoNuevo = pResults[0];

					vm.data.tiposDeTurno = pResults[1];
					vm.data.prestaciones = pResults[2];
					
					if (vm.data.duracionTurnoNuevo.Id !== 0) {
						vm.data.tipoTurno.Id = angular.copy(vm.data.duracionTurnoNuevo.IdTipoTurno);
						vm.data.prestacion.Id = angular.copy(vm.data.duracionTurnoNuevo.IdPrestacion);
					}

					vm.formControl.loading = false;
					vm.formControl.error = false;
					$log.debug('Inicializar OK.-', pResults);
				}

				function errorCallback(pError) {
					vm.formControl.loading = false;
					vm.formControl.error = true;
					$log.error('Inicializar ERROR.-', pError);
					AlertaService.NewError("Error",pError.message);
				}
			}

		}
	};

	return module;
})();