/**
 * @author 			emansilla
 * @description 	description
 */
export default (function () {
	'use strict';
	
	const module = { init : (ngModule: any) => {} };

	module.init = function (module) {

		module.controller('PrequirurgicoViewController', PrequirurgicoViewController);

		PrequirurgicoViewController.$inject = ['Logger', '$q', 'ServicioMedicoDataService', 'PracticaMedicaDataService',
			'Prequirurgicos', 'Title', 'Module', '$uibModalInstance'];

		function PrequirurgicoViewController ($log, $q, ServicioMedicoDataService, PracticaMedicaDataService,
			Prequirurgicos, Title, Module, $uibModalInstance) {

			/* ------------------------------------------------ LOG ------------------------------------------------ */

			$log = $log.getInstance('PrequirurgicoViewController');
			$log.debug('ON.-');

			/* ------------------------------------------ API Y VARIABLES ------------------------------------------ */
			
			var vm = this;

			vm.title = {
				module : Module,
				page : Title
			};

			vm.formData = {
				prequirurgicos : '',

				practicaRayos: '',
				noResultRayos: true,

				practicaCardiologia: '',
				noResultCardiologia: true,

				practicaLaboratorio: '',
				noResultLaboratorio: true,

				observacionesRayos : '',
				observacionesCardiologia : '',
				observacionesLaboratorio: '',
				observacionesAnestesia : '',
				observacionesHemoterapia : '',
				observacionesHematologia: ''
			};

			vm.data = {
				practicasPrequirurgicosRayos : [],
				practicasPrequirurgicosCardiologia : [],
				practicasPrequirurgicosLaboratorio : [],
				practicasPrequirurgicosAnestesia : [],
				practicasPrequirurgicosHemoterapia : [],
				practicasPrequirurgicosHematologia : [],

				practicasRayos : [],
				practicasCardiologia : [],
				practicasLaboratorio : [],

				servicioRayos : {},
				servicioCardiologia : {},
				servicioLaboratorioCentral : {},
				servicioAnestesia : {},
				servicioHemoterapia : {},
				servicioHematologia : {}
			};

			vm.formControl = {
				error: true,
				loading: false,
				ok : returnPrequirurgicos,
				cancel : cancel,
				selectAll : marcarPrequirurgicosComoIncluidos,
				unselectAll : marcarPrequirurgicosComoNoIncluidos,

				getPracticasRayos : getPracticasRayos,
				getPracticasCardiologia : getPracticasCardiologia,
				getPracticasLaboratorio : getPracticasLaboratorio,

				addPracticaPrequirurgicoRayos : addPracticaPrequirurgicoRayos,
				addPracticaPrequirurgicoCardiologia : addPracticaPrequirurgicoCardiologia,
				addPracticaPrequirurgicoLaboratorio : addPracticaPrequirurgicoLaboratorio,
			};

			/* ------------------------------------------- IMPLEMENTACIÓN ------------------------------------------- */

			function inicializarVariables () {
				
			}

			function returnPrequirurgicos () {
				// angular.copy(vm.data.protesisActual, Protesis);
				var _listPrequirurgicos = crearListaPrequirurgicosPorServicio();
				$log.debug('Return pPrequirurgicos: ',_listPrequirurgicos);
				$uibModalInstance.close(_listPrequirurgicos);
			}

			function cancel () {
				$uibModalInstance.dismiss('cancel');
			}

			function crearPrequirurgicoRayos () {
				return crearPrequirurgico(
					vm.data.servicioRayos,
					vm.data.practicasPrequirurgicosRayos,
					vm.formData.observacionesRayos);
			}

			function crearPrequirurgicoCardiologia () {
				return crearPrequirurgico(
					vm.data.servicioCardiologia,
					vm.data.practicasPrequirurgicosCardiologia,
					vm.formData.observacionesCardiologia);
			}

			function crearPrequirurgicoLaboratorioCentral () {
				return crearPrequirurgico(
					vm.data.servicioLaboratorioCentral,
					vm.data.practicasPrequirurgicosLaboratorio,
					vm.formData.observacionesLaboratorio);
			}

			function crearPrequirurgicoAnestesia () {
				return crearPrequirurgico(
					vm.data.servicioAnestesia,
					vm.data.practicasPrequirurgicosAnestesia,
					vm.formData.observacionesAnestesia);
			}

			function crearPrequirurgicoHemoterapia () {
				return crearPrequirurgico(
					vm.data.servicioHemoterapia,
					vm.data.practicasPrequirurgicosHemoterapia,
					vm.formData.observacionesHemoterapia);
			}

			function crearPrequirurgicoHematologia () {
				return crearPrequirurgico(
					vm.data.servicioHematologia,
					vm.data.practicasPrequirurgicosHematologia,
					vm.formData.observacionesHematologia);
			}

			function crearPrequirurgico (pServicio, pPracticasMedicas, pObservaciones) {
				var _prequirurgico;

				_prequirurgico = {
					id_servicio : pServicio.id_servicio_medico,
					observaciones : pObservaciones,
					Detalles : crearDetallesPrequirurgico(pPracticasMedicas)
				};

				return _prequirurgico;
			}

			function crearDetallesPrequirurgico (pPracticasMedicas) {
				var _detalles : Array<any>= [];

				for (var i = 0; i < pPracticasMedicas.length; i++) {
					if (pPracticasMedicas[i].incluido)
						_detalles.push({
							PracticaMedica: pPracticasMedicas[i]
						});
				}

				return _detalles;
			}

			function crearListaPrequirurgicosPorServicio () {
				var _listPrequirurgicos : Array<any> = [];

				var _prequirurgicoRayos,
					_prequirurgicoCardiologia,
					_prequirurgicoLaboratorioCentral,
					_prequirurgicoAnestesia,
					_prequirurgicoHemoterapia,
					_prequirurgicoHematologia;

				_prequirurgicoRayos = crearPrequirurgicoRayos();
				_prequirurgicoCardiologia = crearPrequirurgicoCardiologia();
				_prequirurgicoLaboratorioCentral = crearPrequirurgicoLaboratorioCentral();
				_prequirurgicoAnestesia = crearPrequirurgicoAnestesia();
				_prequirurgicoHemoterapia = crearPrequirurgicoHemoterapia();
				_prequirurgicoHematologia = crearPrequirurgicoHematologia();


				if (_prequirurgicoRayos.Detalles.length)
					_listPrequirurgicos.push(_prequirurgicoRayos);

				if (_prequirurgicoCardiologia.Detalles.length)
					_listPrequirurgicos.push(_prequirurgicoCardiologia);

				if (_prequirurgicoLaboratorioCentral.Detalles.length)
					_listPrequirurgicos.push(_prequirurgicoLaboratorioCentral);

				if (_prequirurgicoAnestesia.Detalles.length)
					_listPrequirurgicos.push(_prequirurgicoAnestesia);

				if (_prequirurgicoHemoterapia.Detalles.length)
					_listPrequirurgicos.push(_prequirurgicoHemoterapia);

				if (_prequirurgicoHematologia.Detalles.length)
					_listPrequirurgicos.push(_prequirurgicoHematologia);

				return _listPrequirurgicos;
			}

			function marcarTodosIncluidos (pPracticas) {
				for (var i = 0; i < pPracticas.length; i++) {
					pPracticas[i].incluido = true;
				}
			}

			function marcarPracticasComoNoIncluidos (pPracticas) {
				for (var i = 0; i < pPracticas.length; i++) {
					pPracticas[i].incluido = false;
				}
			}

			function marcarPrequirurgicosComoIncluidos () {
				marcarTodosIncluidos(vm.data.practicasPrequirurgicosRayos);
				marcarTodosIncluidos(vm.data.practicasPrequirurgicosCardiologia);
				marcarTodosIncluidos(vm.data.practicasPrequirurgicosLaboratorio);
				marcarTodosIncluidos(vm.data.practicasPrequirurgicosAnestesia);
				marcarTodosIncluidos(vm.data.practicasPrequirurgicosHemoterapia);
				marcarTodosIncluidos(vm.data.practicasPrequirurgicosHematologia);
			}

			function marcarPrequirurgicosComoNoIncluidos() {
				marcarPracticasComoNoIncluidos(vm.data.practicasPrequirurgicosRayos);
				marcarPracticasComoNoIncluidos(vm.data.practicasPrequirurgicosCardiologia);
				marcarPracticasComoNoIncluidos(vm.data.practicasPrequirurgicosLaboratorio);
				marcarPracticasComoNoIncluidos(vm.data.practicasPrequirurgicosAnestesia);
				marcarPracticasComoNoIncluidos(vm.data.practicasPrequirurgicosHemoterapia);
				marcarPracticasComoNoIncluidos(vm.data.practicasPrequirurgicosHematologia);
			}

			function marcarPrequirurgicosComoIncluidosFromPrequirurgicos () {
				vm.formData.observacionesRayos = marcarTodosIncluidosFromPrequirurgicos(
					vm.data.servicioRayos,
					vm.data.practicasPrequirurgicosRayos);
				vm.formData.observacionesCardiologia = marcarTodosIncluidosFromPrequirurgicos(
					vm.data.servicioCardiologia,
					vm.data.practicasPrequirurgicosCardiologia);
				vm.formData.observacionesLaboratorio = marcarTodosIncluidosFromPrequirurgicos(
					vm.data.servicioLaboratorioCentral,
					vm.data.practicasPrequirurgicosLaboratorio);
				vm.formData.observacionesAnestesia = marcarTodosIncluidosFromPrequirurgicos(
					vm.data.servicioAnestesia,
					vm.data.practicasPrequirurgicosAnestesia);
				vm.formData.observacionesHemoterapia = marcarTodosIncluidosFromPrequirurgicos(
					vm.data.servicioHemoterapia,
					vm.data.practicasPrequirurgicosHemoterapia);
				vm.formData.observacionesHematologia = marcarTodosIncluidosFromPrequirurgicos(
					vm.data.servicioHematologia,
					vm.data.practicasPrequirurgicosHematologia);
			}

			function cargarObservaciones (pIdServicio, oObservaciones) {

			}

			function marcarTodosIncluidosFromPrequirurgicos (pServicio, pPracticas) {
				var _prequirurgico, _detalle, _esPrequirurgico, _observaciones;

				_observaciones = '';

				// Recorro los prequirurgicos cabecera (por servicio)
				for (var i = 0; i < Prequirurgicos.length; i++) {

					_prequirurgico = Prequirurgicos[i];

					if (_prequirurgico.id_servicio == pServicio.id_servicio_medico) {

						// Recorro los detalles
						for (var j = 0; j < _prequirurgico.Detalles.length; j++) {

							_esPrequirurgico = false;
							_detalle = _prequirurgico.Detalles[j];
							// Recorro las practicas
							for (var k = 0; k < pPracticas.length; k++) {
								if (_detalle.PracticaMedica.id_practica_medica == pPracticas[k].id_practica_medica) {
									pPracticas[k].incluido = true;
									_esPrequirurgico = true;
									break;
								}
							}

							if (!_esPrequirurgico) {
								_detalle.PracticaMedica.incluido = true;
								pPracticas.push(_detalle.PracticaMedica);
							}
						}
						_observaciones = _prequirurgico.observaciones;
						break;
					}
				}

				return _observaciones;
			}

			function getPracticasRayos () {
				PracticaMedicaDataService.getAllPracticasMedicaByServicio(vm.data.servicioRayos)
				.then(function (pPracticasMedicas) {
					vm.data.practicasRayos = pPracticasMedicas;
				});
			}

			function getPracticasCardiologia () {
				PracticaMedicaDataService.getAllPracticasMedicaByServicio(vm.data.servicioCardiologia)
				.then(function (pPracticasMedicas) {
					vm.data.practicasCardiologia = pPracticasMedicas;
				});
			}

			function getPracticasLaboratorio () {
				PracticaMedicaDataService.getAllPracticasMedicaByServicio(vm.data.servicioLaboratorioCentral)
				.then(function (pPracticasMedicas) {
					vm.data.practicasLaboratorio = pPracticasMedicas;
				});
			}

			function addPracticaPrequirurgicoRayos (pEvent) {
				$log.debug('Practica a agregar', vm.formData.practicaRayos);
				if (pEvent.keyCode === 13 && !vm.formData.noResultRayos) {
					$log.debug('APRETO EL ENTER');
					vm.formData.practicaRayos.incluido=true;
					vm.data.practicasPrequirurgicosRayos.push(vm.formData.practicaRayos);
					vm.data.practicasRayos = [];
					vm.formData.practicaRayos = '';
				}
			}

			function addPracticaPrequirurgicoCardiologia( pEvent) {
				$log.debug('Practica a agregar', vm.formData.practicaCardiologia);
				if (pEvent.keyCode === 13 && !vm.formData.noResultCardiologia) {
					$log.debug('APRETO EL ENTER');
					vm.formData.practicaCardiologia.incluido=true;
					vm.data.practicasPrequirurgicosCardiologia.push(vm.formData.practicaCardiologia);
					vm.data.practicasCardiologia = [];
					vm.formData.practicaCardiologia = '';
				}
			}

			function addPracticaPrequirurgicoLaboratorio (pEvent) {
				$log.debug('Practica a agregar', vm.formData.practicaLaboratorio);
				if (pEvent.keyCode === 13 && !vm.formData.noResultLaboratorio) {
					$log.debug('APRETO EL ENTER');
					vm.formData.practicaLaboratorio.incluido=true;
					vm.data.practicasPrequirurgicosLaboratorio.push(vm.formData.practicaLaboratorio);
					vm.data.practicasLaboratorio = [];
					vm.formData.practicaLaboratorio = '';
				}
			}

			/* ---------------------------------------------- ACTIVATE ---------------------------------------------- */

			activate();

			/* Método inicializador */
			function activate () {
				$log.debug('Inicializar ON.-', Prequirurgicos);
				inicializarVariables();
				vm.formControl.loading = true;

				var _servicioRayos = ServicioMedicoDataService.getServicioMedicoRayos();
				var _servicioLaboratorio = ServicioMedicoDataService.getServicioMedicoLaboratorioCentral();
				var _servicioCardiologia = ServicioMedicoDataService.getServicioMedicoCardiologia();
				var _servicioAnestesia = ServicioMedicoDataService.getServicioMedicoAnestesia();
				var _servicioHemoterapia = ServicioMedicoDataService.getServicioMedicoHemoterapia();
				var _servicioHematologia = ServicioMedicoDataService.getServicioMedicoHematologia();

				var _practicasPrequirurgicosRayos = PracticaMedicaDataService.getAllPracticasMedicaPrequirurgicoRayos();
				var _practicasPrequirurgicosCariologia = PracticaMedicaDataService.getAllPracticasMedicaPrequirurgicoCardiologia();
				var _practicasPrequirurgicosLaboratorio = PracticaMedicaDataService.getAllPracticasMedicaPrequirurgicoLaboratorio();
				var _practicasPrequirurgicosAnestesia = PracticaMedicaDataService.getAllPracticasMedicaPrequirurgicoAnestesia();
				var _practicasPrequirurgicosHemoterapia = PracticaMedicaDataService.getAllPracticasMedicaPrequirurgicoHemoterapia();
				var _practicasPrequirurgicosHematologia = PracticaMedicaDataService.getAllPracticasMedicaPrequirurgicoHematologia();

				$q.all([
					_practicasPrequirurgicosRayos,
					_practicasPrequirurgicosCariologia,
					_practicasPrequirurgicosLaboratorio,
					_practicasPrequirurgicosAnestesia,
					_practicasPrequirurgicosHemoterapia,
					_practicasPrequirurgicosHematologia,

					_servicioRayos, _servicioLaboratorio, _servicioCardiologia, _servicioAnestesia, _servicioHemoterapia,_servicioHematologia
				])
				.then(activateOk, activateError);
			}

			function activateOk (pResults) {
				// angular.copy(Protesis, vm.data.protesisActual);
				$log.debug('Inicializar OK.-', pResults);
				vm.data.practicasPrequirurgicosRayos = pResults[0];
				vm.data.practicasPrequirurgicosCardiologia = pResults[1];
				vm.data.practicasPrequirurgicosLaboratorio = pResults[2];
				vm.data.practicasPrequirurgicosAnestesia = pResults[3];
				vm.data.practicasPrequirurgicosHemoterapia = pResults[4];
				vm.data.practicasPrequirurgicosHematologia = pResults[5];

				vm.data.servicioRayos = pResults[6];
				vm.data.servicioLaboratorioCentral = pResults[7];
				vm.data.servicioCardiologia = pResults[8];
				vm.data.servicioAnestesia = pResults[9];
				vm.data.servicioHemoterapia = pResults[10];
				vm.data.servicioHematologia = pResults[11];

				if (!Prequirurgicos.length) {
					marcarPrequirurgicosComoIncluidos();
				} else {
					marcarPrequirurgicosComoIncluidosFromPrequirurgicos();
				}
				vm.formControl.loading = false;
			}

			function activateError (pError) {
				$log.debug('Inicializar ERROR.-', pError);
				vm.formControl.loading = false;
				vm.formControl.error = true;
			}
		};
	};

	return module;

})();