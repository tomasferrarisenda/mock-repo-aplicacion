/**
 * @author:			Javier Delmastro
 * @description:	Controller para ABM (detalle) de reglas de cantidades de turnos
 * @type:			Controller
 **/
import * as angular from 'angular';

export default (function () {
   'use strict';

	const module = { init : (ngModule: any) => {} };

	module.init = function(module) {

		module.controller('ReglasDeCantidadesEditController', ReglasDeCantidadesEditController);

		ReglasDeCantidadesEditController.$inject = [
			'$location', 'Logger', '$q', '$filter', '$stateParams', '$uibModalInstance',
			'ModalService', 'PlantillaDataService', 'AlertaService',
			'PrestacionGestionDataService', 'GrupoDeMutualesDataService',
			'MantenimientoAgendaDataService',
			'IdServicio', 'IdRecurso', 'IdTipoRecurso', 'IdTipoDemanda',
			'IdReglaEditar'

		];

		function ReglasDeCantidadesEditController(
			$location, $log, $q, $filter, $stateParams, $uibModalInstance,
			ModalService, PlantillaDataService, AlertaService,
			PrestacionGestionDataService, GrupoDeMutualesDataService, MantenimientoAgendaDataService,
			IdServicio, IdRecurso, IdTipoRecurso, IdTipoDemanda,
			IdReglaEditar
		) {

			/* ------------------------------------------------ LOG ------------------------------------------------ */

			$log = $log.getInstance('ReglasDeCantidadesEditController');
			$log.debug('ON.-');

			/* ----------------------------------------- API Y VARIABLESES ----------------------------------------- */

			var vm = this;
			vm.today = new Date();

			if (IdTipoDemanda === 1)
			{
				vm.title = {
					page: "Reglas de cantidades de Turnos"
				};
			}
			else 
			if (IdTipoDemanda === 2)
			{
				vm.title = {
					page: "Reglas de cantidades de Sobreturnos"
				};
			}

			vm.data = {
				// datos basicos de la regla -> Los recibimos como parámetros
				idServicio: IdServicio,
				idRecurso: IdRecurso,
				idTipoRecurso: IdTipoRecurso,
				idTipoDemanda: IdTipoDemanda,
				idReglaEditar: IdReglaEditar,				

				// para el DTO de nueva regla que viene del Back-end
				nuevaRegla: {},

				// colecciones para los combos
				mutuales: {},
				planesMutual: {},
				tiposPrestaciones: {},
				prestaciones: {},
				tiposDeTurno: {},
				sucursales: {},
				diasDeSemana: {},

				// datos seleccionados para la regla en edicion
				idMutual: '',
				idPlanMutual: '', 
				idTipoPrestacion: '',
				idPrestacion: '',
				idTipoTurno: '',
				Sucursal: {},
				idDiaSemana: '',
				atiende: true,
				cantidadMaxima: 0
			};

			vm.formData = {};

			vm.formControl = {
				loading: false,
				error: true,
				reloadPage: activate,
				ok: methodSave,
				cancel: volver,
				limpiarMutual: limpiarMutual,
				optionMutual: ''
			};

			/* ------------------------------------------- IMPLEMENTACIÓN ------------------------------------------- */

			/* FORMULARIO */

			
			function limpiarMutual() {
				if (vm.data.mutualElegida){
					delete vm.data.mutualElegida;
				}
				if (vm.data.planMutual){
					delete vm.data.planMutual;
				}

			}

			function algunaDefinida()
			{
				
				if (!angular.isUndefined(vm.data.nuevaRegla.IdMutual) && vm.data.nuevaRegla.IdMutual !== null)
					return true;

				if (!angular.isUndefined(vm.data.grupoMutual) && vm.data.grupoMutual !== null)
					return true;

				if (!angular.isUndefined(vm.data.nuevaRegla.IdPlanMutual) && vm.data.nuevaRegla.IdPlanMutual !== null)
					return true;

				if (!angular.isUndefined(vm.data.nuevaRegla.IdSucursal) && vm.data.nuevaRegla.IdSucursal !== null)
					return true;

				if (!angular.isUndefined(vm.data.nuevaRegla.IdDiaSemana) && vm.data.nuevaRegla.IdDiaSemana !== null)
					return true;

				if (!angular.isUndefined(vm.data.nuevaRegla.IdPrestacion) && vm.data.nuevaRegla.IdPrestacion !== null)
					return true;

				if (!angular.isUndefined(vm.data.nuevaRegla.IdTipoPrestacion) && vm.data.nuevaRegla.IdTipoPrestacion !== null)
					return true;

				if (!angular.isUndefined(vm.data.nuevaRegla.IdTipoTurno) && vm.data.nuevaRegla.IdTipoTurno !== null)
					return true;

				return false;
			}

			function methodSave() {

				$log.debug('guardando regla de cantidades', vm.data.nuevaRegla, 
					vm.data.idServicio, vm.data.idRecurso, vm.data.idTipoRecurso, vm.data.idTipoDemanda, vm.data.idReglaEditar,

					vm.data.idMutual, vm.data.idPlanMutual,
					vm.data.idTipoPrestacion, vm.data.idPrestacion,
					vm.data.idTipoTurno,
					vm.data.Sucursal,
					vm.data.idDiaSemana,
					vm.data.atiende,
					vm.data.cantidadMaxima);

				// Completar el DTO que enviaremos para grabar al backend
				vm.data.nuevaRegla.IdServicio = vm.data.idServicio ? angular.copy(vm.data.idServicio) : 0;
				vm.data.nuevaRegla.IdRecurso = vm.data.idRecurso ? angular.copy(vm.data.idRecurso) : 0;
				vm.data.nuevaRegla.IdTipoRecurso = vm.data.idTipoRecurso ? angular.copy(vm.data.idTipoRecurso): 0;
				vm.data.nuevaRegla.IdTipoDemanda = vm.data.idTipoDemanda ? angular.copy(vm.data.idTipoDemanda) : 0;

				// dimensiones: 
				vm.data.nuevaRegla.IdMutual = vm.data.mutualElegida ? angular.copy(vm.data.mutualElegida.Id) : 0;
				vm.data.nuevaRegla.CodigoGrupo = vm.data.grupoMutual ? angular.copy(vm.data.grupoMutual.Codigo) : "";
				vm.data.nuevaRegla.IdGrupo = vm.data.grupoMutual ? angular.copy(vm.data.grupoMutual.Id) : 0;
				vm.data.nuevaRegla.IdPlanMutual = vm.data.planMutual ? angular.copy(vm.data.planMutual.Id) : 0;
				vm.data.nuevaRegla.IdSucursal = vm.data.Sucursal ? angular.copy(vm.data.Sucursal.Id) : 0;
				vm.data.nuevaRegla.IdDiaSemana = vm.data.idDiaSemana ? angular.copy(vm.data.idDiaSemana) : 0;
				vm.data.nuevaRegla.IdPrestacion = vm.data.idPrestacion? angular.copy(vm.data.idPrestacion) : 0;
				vm.data.nuevaRegla.IdTipoPrestacion = vm.data.idTipoPrestacion ? angular.copy(vm.data.idTipoPrestacion): 0;
				vm.data.nuevaRegla.IdTipoTurno = vm.data.idTipoTurno ? angular.copy(vm.data.idTipoTurno) : 0;

				// Al menos una de las dimensiones debe estar definida
				// if (!algunaDefinida())
				// {					
				// 	AlertaService.NewWarning("Atención", "Debe definir al menos una dimensión para la regla");
				// 	return;
				// }

				vm.data.nuevaRegla.Atiende = angular.copy(vm.data.atiende);
				vm.data.nuevaRegla.CantidadMaxima = angular.copy(vm.data.cantidadMaxima);
				
				$log.debug('nueva regla guardar',vm.data.nuevaRegla);
				PlantillaDataService.validarGuardarRegla(vm.data.nuevaRegla)
					.then(validarGuardarOk, validarGuardarError);

				function validarGuardarOk(pResponse) {
					if (pResponse.IsOk === true) {

						vm.formControl.loading = true;
						PlantillaDataService.guardarRegla(vm.data.nuevaRegla)
							.then(function(pResp) {

								vm.formControl.loading = false;
								// $uibModalInstance.close("result ok");
								AlertaService.NewSuccess("Guardado","Regla de cantidad de turnos Guardada")

							}).catch(function(pErr) {
								vm.formControl.loading = false;
								AlertaService.NewError("Error","Error de servidor");
								// $uibModalInstance.dismiss(pErr);
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

			

			/* ---------------------------------------------- ACTIVATE ---------------------------------------------- */

			activate();

			function activate() {
				$log.debug('Inicializar ON.-');
				vm.formControl.loading = true;

				//var _nuevaReglaDto = PlantillaDataService.obtenerNuevaRegla();
				var _nuevaReglaDto;
				var _tiposDeTurnos = PlantillaDataService.obtenerTiposDeTurnos();				
				var _prestaciones;
				var _diasSemana = MantenimientoAgendaDataService.obtenerDiasSemana();
				var _tiposPrestaciones = PrestacionGestionDataService.obtenerTiposPrestaciones();

				if (vm.data.idServicio)
					_prestaciones = PrestacionGestionDataService.getTodasPrestacionesXServicio(vm.data.idServicio);
				else $log.debug('vuelve');


				if (vm.data.idReglaEditar == null || vm.data.idReglaEditar == 0) 
				{
					_nuevaReglaDto = PlantillaDataService.obtenerNuevaRegla();
				}
				else
				{
					_nuevaReglaDto = PlantillaDataService.obtenerReglaPorId(vm.data.idReglaEditar);
				}

				var _grupoDeMutuales = GrupoDeMutualesDataService.getAll();

				$q.all([
						_nuevaReglaDto,
						_tiposDeTurnos,
						_prestaciones,
						_diasSemana,
						_tiposPrestaciones,
						_grupoDeMutuales
					])
					.then(successCallback, errorCallback);

				function successCallback(pResults) {

					vm.data.nuevaRegla = pResults[0];
					vm.data.tiposDeTurno = pResults[1];
					vm.data.prestaciones = pResults[2];
					vm.data.diasDeSemana = pResults[3];
					vm.data.tiposPrestaciones = pResults[4];
					vm.data.grupoDeMutuales = pResults[5];

					// se agrega filtrado para tipos de turnos, se saca indistinto e indistinto con practicas
					vm.data.tiposDeTurno = vm.data.tiposDeTurno.filter(x => x.Id !== 3 && x.Id !== 6);

					/*
					var objNingunTipoTurno = {
						Id: 0,
						Nombre: "Cualquiera"
					};

					vm.data.tiposDeTurno.push(objNingunTipoTurno);

					var objNingunaPrestacion = {
						Id: 0,
						Nombre: "Cualquiera"
					};					

					vm.data.tiposPrestaciones.push(objNingunaPrestacion);
					*/

					// Si estoy editando una regla existentew
					if (vm.data.nuevaRegla.Id !== 0) {
						
						// copio a variables locales los datos de la regla a Editar
						vm.data.idServicio = angular.copy(vm.data.nuevaRegla.IdServicio);
						vm.data.idRecurso = angular.copy(vm.data.nuevaRegla.IdRecurso);
						vm.data.idTipoRecurso = angular.copy(vm.data.nuevaRegla.IdTipoRecurso);
						vm.data.idTipoDemanda = angular.copy(vm.data.nuevaRegla.IdTipoDemanda);


						if (vm.data.nuevaRegla.IdMutual) {
							vm.data.idMutual = angular.copy(vm.data.nuevaRegla.IdMutual);
							vm.data.codigoMutual = angular.copy(vm.data.nuevaRegla.CodigoMutual);
							vm.data.IdPlanElegido = angular.copy(vm.data.nuevaRegla.IdPlanMutual);
							if (vm.data.nuevaRegla.IdMutual !== 0){
								//tengo una mutual cargada entonces
								vm.formControl.optionMutual = "mutual";
							}

						}

						if(vm.data.nuevaRegla.IdGrupo){

							if (vm.data.nuevaRegla.IdGrupo !== 0) {
								//tengo una mutual cargada entonces
								vm.formControl.optionMutual = "grupomutual";
								vm.data.grupoMutual = {
									Id: angular.copy(vm.data.nuevaRegla.IdGrupo),
									Codigo: angular.copy(vm.data.nuevaRegla.CodigoGrupo)
								}
							}

						}


						vm.data.idTipoPrestacion = angular.copy(vm.data.nuevaRegla.IdTipoPrestacion);
						vm.data.idPrestacion = angular.copy(vm.data.nuevaRegla.IdPrestacion);
						vm.data.idTipoTurno = angular.copy(vm.data.nuevaRegla.IdTipoTurno);

						vm.data.Sucursal = {
							Id: angular.copy(vm.data.nuevaRegla.IdSucursal),
							Nombre: angular.copy(vm.data.nuevaRegla.Sucursal)
						}

						//vm.data.Sucursal.Id = angular.copy(vm.data.nuevaRegla.IdSucursal);

						vm.data.idDiaSemana = angular.copy(vm.data.nuevaRegla.IdDiaSemana)
						vm.data.atiende = angular.copy(vm.data.nuevaRegla.Atiende);
						vm.data.cantidadMaxima = angular.copy(vm.data.nuevaRegla.CantidadMaxima);
					}

					vm.formControl.loading = false;
					vm.formControl.error = false;
					$log.debug('Inicializar OK.-', pResults);
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