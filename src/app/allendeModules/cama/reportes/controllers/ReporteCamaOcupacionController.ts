/**
 * 
 * @author:			Ezequiel Mansilla
 * @description:	Controller para reporte de camas
 * @type:			Controller
 **/
export default (function () {
	'use strict';
	
	const module = { init : (ngModule: any) => {} };

	module.init = function (module) {

		module.controller('ReporteCamaOcupacionController', ReporteCamaOcupacionController);

		ReporteCamaOcupacionController.$inject = ['Logger', '$state', '$stateParams', '$timeout',
			// Injection por state
			'EstadosCama', 'CategoriasHabitacion', 'TiposHabitacionContabiliza', 'ReporteOcupacion', 'User'];

		function ReporteCamaOcupacionController ($log, $state, $stateParams, $timeout,
			// Injection por state
			EstadosCama, CategoriasHabitacion, TiposHabitacionContabiliza, ReporteOcupacion, User) {

			/* ------------------------------------------------ LOG ------------------------------------------------ */

			$log = $log.getInstance('ReporteCamaOcupacionController');
			$log.debug('ON.-');
			
			/* ----------------------------------------- API Y VARIABLESES ----------------------------------------- */

			var vm = this;
			
			vm.title = {
				name : $state.current.data.title,
				icon : $state.current.data.icon
			};

			vm.filter = {
				sucursal : {}
			};

			vm.data = {
				reporte : [],
				resumen : []
			};

			vm.formControl = {
				actualizar : buscarReporte,
				cambiarTiposHabitacionFisica: cambiarTiposHabitacionFisica,
				reload : reloadPage,
				volver : volver
			};

			/* ------------------------------------------- IMPLEMENTACIÓN ------------------------------------------- */

			/* FORMULARIO */

			function volver () {
				$state.go('home');
			}

			function reloadPage() {
				$state.reload();
			}

			function buscarReporte () {
				var _params : any = {};
				if (vm.filter.sucursal && vm.filter.sucursal.id_sucursal)
					_params.idSucursal = vm.filter.sucursal.id_sucursal;

				if(vm.filter.tiposHabitacionFisica && vm.filter.tiposHabitacionFisica.length) {
					_params.tiposHabitacion = [];

					for (var i = 0; i < vm.filter.tiposHabitacionFisica.length; i++) {
						if (vm.filter.tiposHabitacionFisica[i].status)
							_params.tiposHabitacion.push(vm.filter.tiposHabitacionFisica[i].id_tipo_habitacion_fisica);
					}
				}

				$state.go('cama.reportes.ocupacion', _params);
			}

			function cambiarTiposHabitacionFisica(tipoContabiliza) {
				if (tipoContabiliza) {
					for (var i = 0; i < vm.filter.tiposHabitacionFisica.length; i++) {
						vm.filter.tiposHabitacionFisica[i].status = (vm.filter.tiposHabitacionFisica[i].id_tipo_contabiliza_habitacion === tipoContabiliza.Id)
					}
				} else {
					for (var i = 0; i < vm.filter.tiposHabitacionFisica.length; i++) {
						vm.filter.tiposHabitacionFisica[i].status = true;
					}
				}
			}

			function initTiposHabitacionFisica() {
				var active = true;

				// Recorro todos los tipos de habitacion
				for (var i = 0; i < vm.filter.tiposHabitacionFisica.length; i++) {
					// Recorro los tipos de habitacion que estan seleccionados
					
					if ($stateParams.tiposHabitacion && $stateParams.tiposHabitacion.length) {
						active = false;
						for (var j = 0; j < $stateParams.tiposHabitacion.length; j++) {
							if ($stateParams.tiposHabitacion[j] === vm.filter.tiposHabitacionFisica[i].id_tipo_habitacion_fisica) {
								active = true;
								break;
							}
						}
					} else {
						active = true;
					}
					
					vm.filter.tiposHabitacionFisica[i].status = active;
				}
			}

			/* ---------------------------------------------- ACTIVATE ---------------------------------------------- */

			activate();

			function activate () {
				$log.debug('Inicializar ON.-', $stateParams);
				vm.data.reporte = ReporteOcupacion;
				vm.data.estadosCama = EstadosCama;
				vm.data.categoriasHabitacion = CategoriasHabitacion;
				vm.data.tiposHabitacionContabiliza = TiposHabitacionContabiliza;

				$timeout(initTiposHabitacionFisica,1000);
				
				if ($stateParams.idSucursal && $stateParams.idSucursal != 0)
					vm.filter.sucursal.id_sucursal = $stateParams.idSucursal;
			}
		}
	};

	return module;

})();