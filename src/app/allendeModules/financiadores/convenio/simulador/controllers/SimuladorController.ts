/**
 * @author:			drobledo
 * @description:	Simulador de Evaluación de Convenios Controller
 * @type:			Controller
 **/

import * as angular from 'angular';
import { IAmbitoDataService, ITipoSexoDataService } from '../../../../support/basic/services';

export default (function () {
	const module = { init: (ngModule: any) => { } };

	module.init = function (module) {

		module.controller('SimuladorController', SimuladorController);

		SimuladorController.$inject = ['$sce', 'Logger', '$state', 'ModalService', 'SupportLogicService', '$q',
			'ICON_LIST', 'SimuladorDataService', 'ConvenioDataService', 'DateUtils', 'AmbitoDataService',
			'TipoSexoDataService', 'FinanciadorLogicService'];

		function SimuladorController($sce, $log, $state, ModalService, SupportLogicService, $q,
			ICON_LIST, SimuladorDataService, ConvenioDataService, DateUtils, AmbitoDataService: IAmbitoDataService,
			TipoSexoDataService: ITipoSexoDataService, FinanciadorLogicService) {

			/* ------------------------------------------------ LOG ------------------------------------------------ */

			$log = $log.getInstance('SimuladorController');

			/* ------------------------------------------ API Y VARIABLES ------------------------------------------ */

			var vm = this;
			vm.today = new Date();

			vm.title = {
				name: 'Simulador de Evaluación de Convenio',
				icon: 'COGS'
			};

			vm.ICON_LIST = ICON_LIST

			vm.data = {
				ambitos: null,
				sucursales: null,
				servicios: null,
				tiposAfiliado: null,
				tiposConsecuencia: null,
				profesional: null,
				evaluable: null,
				parametros: null,
				resultado: '',
				explicacion: '',
				tiposSexo : [],
				condicionesMedicas : null,
				tiposTurno: null
			};

			vm.filter = {
				mutualElegida: '',
				planElegido: {},
				fecha: '',
				ambito: {},
				sucursal: {},
				servicio: {},
				tipoAfiliado: {},
				tipoConsecuencia: {},
				matriculaProfesional: '',
				nombreProfesional: '',
				codigoNomenclador: '',
				nombreCodigoNomenclador: '',
				filtroConvenioDto : {},
				tipoSexo : '',
				tipoTurno: {},
				condicionMedica: {},
				prestacion: ''
			};

			vm.formControl = {
				loading: false,
				volver: volver,
				evaluar: evaluar,
				infoFinanciador: infoFinanciador
			};

			/* ------------------------------------------- IMPLEMENTACIÓN ------------------------------------------- */

			function volver() {
				$state.go('homesistemas');
			}

			function evaluar() {

				if (!vm.filter.mutualElegida) {
					ModalService.warning('La mutual es requerida para la simulación.');
					return;
				}
				if (vm.filter.codigoNomenclador == null || !vm.filter.codigoNomenclador || vm.filter.codigoNomenclador.Codigo == '') {
					ModalService.warning('El código de nomenclador es requerido para la simulación.');
					return;
				}
				if (!vm.filter.fecha) {
					ModalService.warning('La fecha es requerida para la simulación.');
					return;
				}

				vm.formControl.loading = true;

				if (vm.filter.filtroConvenioDto != null) {
					vm.filter.filtroConvenioDto.IdMutual = vm.filter.mutualElegida.Id;
					vm.filter.filtroConvenioDto.FechaVigencia = DateUtils.parseToBe(vm.filter.fecha);
					vm.filter.filtroConvenioDto.IdTipoEstadoConvenio = 2;
					vm.filter.filtroConvenioDto.CurrentPage = 1;
					vm.filter.filtroConvenioDto.PageSize = 10;

					ConvenioDataService.ObtenerConveniosFiltrados(vm.filter.filtroConvenioDto)
					.then(function(conveniosDto){

						if (!conveniosDto || conveniosDto.RowCount == 0) {
							ModalService.warning('No se encuentra un convenio aprobado para el financiador y la fecha especificados.');
							vm.formControl.loading = false;
							return;
						}
						var _parametros = SimuladorDataService.obtenerNuevoParametrosSimulacionDto();
						var _evaluable = SimuladorDataService.obtenerNuevoEvaluableSimulador();
	
						$q.all([_parametros, _evaluable])
						if (_parametros != null && _evaluable != null) {
							_evaluable.FechaRealizacion = DateUtils.parseToBe(vm.filter.fecha);
							_evaluable.IdFinanciador = vm.filter.mutualElegida.Id;
							_evaluable.IdAmbitoAtencion = vm.filter.ambito ? vm.filter.ambito.Id : 0;
							_evaluable.IdSucursal = vm.filter.sucursal ? vm.filter.sucursal.Id : 0;
							_evaluable.IdPlanMutual = vm.filter.planElegido ? vm.filter.planElegido.Id : 0;
							_evaluable.IdServicioEfector = vm.filter.servicio ? vm.filter.servicio.Id : 0;
							_evaluable.IdProfesionalEfector = vm.data.profesional ?  vm.data.profesional.Id : 0;
							_evaluable.CodigoDeNomenclador = vm.filter.codigoNomenclador ?  vm.filter.codigoNomenclador.Codigo : 0;
							_evaluable.IdTipoAfiliado = vm.filter.tipoAfiliado ? vm.filter.tipoAfiliado.Id : 0;
							_evaluable.IdTipoSexo = vm.filter.tipoSexo ? vm.filter.tipoSexo.Id : 0;
							_evaluable.IdTipoTurno = vm.filter.tipoTurno ? vm.filter.tipoTurno.Id : 0;
							_evaluable.IdCondicionMedica = vm.filter.condicionMedica ? vm.filter.condicionMedica.Id : 0;
							_evaluable.IdPrestacionMedica = vm.filter.prestacion ? vm.filter.prestacion.Id : 0;
							_parametros.Evaluable = _evaluable;
							_parametros.IdTipoConsecuencia = vm.filter.tipoConsecuencia.Id;
						}
						vm.data.parametros = _parametros
		
						SimuladorDataService.simularEvaluacion(vm.data.parametros)
							.then(function (results) {
								vm.data.resultado = results.ResultadoEvaluacion;
								vm.data.explicacion = $sce.trustAsHtml(results.ExplicacionEvaluacion);
							})
							.catch(function (pError) {
								ModalService.error(pError.message);
							});
					}, function(pError){
						ModalService.warning('No se encuentra un convenio aprobado para el financiador y la fecha especificados.');
					});
				}
				vm.formControl.loading = false;
			}

			// Modal de los datos del financiador.
			function infoFinanciador() {
				FinanciadorLogicService.infoFinanciador(vm.filter.mutualElegida.Id);
			}

			/* ---------------------------------------------- ACTIVATE ---------------------------------------------- */
			activate();

			function activate() {
				vm.filter.fecha = vm.today;

				var _ambitos = AmbitoDataService.getAll();
				var _sucursales = SimuladorDataService.obtenerSucursales();
				var _servicios = SimuladorDataService.obtenerServicios();
				var _tiposAfiliado = SimuladorDataService.obtenerTiposAfiliado();
				var _tiposConsecuencia = SimuladorDataService.obtenerTiposConsecuencia();
				var _filtroConvenioDto = ConvenioDataService.ObtenerFiltroConvenioDto();
				var _tiposSexo = TipoSexoDataService.obtenerTiposSexoMF();
				var _tiposTurno = SimuladorDataService.obtenerTiposTurno();
				var _condicionesMedicas = SimuladorDataService.obtenerCondicionesMedicas();
				$q.all([_ambitos, _sucursales, _servicios, _tiposAfiliado, _tiposConsecuencia, _filtroConvenioDto, _tiposSexo, _tiposTurno, _condicionesMedicas])
					.then(activateOk, activateError);
			}

			function activateOk(results) {
				vm.data.ambitos = results[0];

				vm.data.sucursales = results[1];
				vm.filter.sucursal = vm.data.sucursales.find(function (s) { s.Nombre.trim() == "TODAS" });

				vm.data.servicios = results[2];
				vm.filter.servicio = vm.data.servicios.find(function (s) { s.Nombre.trim() == "TODOS" });

				vm.data.tiposAfiliado = results[3];
				vm.filter.tipoAfiliado = vm.data.tiposAfiliado.find(function (s) { s.Nombre.trim() == "TODOS" });

				vm.data.tiposConsecuencia = results[4];
				vm.filter.tipoConsecuencia = vm.data.tiposConsecuencia[0];

				vm.filter.filtroConvenioDto = results[5];

				vm.data.tiposSexo = results[6];

				vm.data.tiposTurno = results[7];
				vm.filter.tipoTurno = vm.data.tiposTurno.find(function (s) { s.Nombre.trim() == "TODOS" });

				vm.data.condicionesMedicas = results[8];
				vm.filter.condicionMedica = vm.data.condicionesMedicas.find(function (s) { s.Nombre.trim() == "NINGUNO" });
			}

			function activateError(pError) {
				ModalService.error(pError.message);
			}
		}
	};

	return module;
})();