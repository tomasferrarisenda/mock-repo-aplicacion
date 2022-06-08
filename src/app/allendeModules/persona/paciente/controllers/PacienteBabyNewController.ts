/**
 * @author 			emansilla
 * @description 	description
 */
import { ITipoSexoDataService } from '../../../support/basic/services';
import { IProfesionalesDataService } from '../../../profesionales';

export default (function () {
	'use strict';
	
	const module = { init : (ngModule: any) => {} };

	module.init = function (module) {

		module.controller('PacienteBabyNewController', PacienteBabyNewController);

		PacienteBabyNewController.$inject = ['Logger', '$q', '$filter', '$uibModalInstance', 'TITLE_PACIENTE', 'Title',
			'ProfesionalesDataService',
			'TipoSexoDataService'];

		function PacienteBabyNewController($log, $q, $filter, $uibModalInstance, TITLE_PACIENTE, Title,
			ProfesionalesDataService: IProfesionalesDataService,
			TipoSexoDataService: ITipoSexoDataService) {

			/* ------------------------------------------------ LOG ------------------------------------------------ */

			$log = $log.getInstance('PacienteBabyNewController');
			$log.debug('ON.-');

			/* ------------------------------------------ API Y VARIABLES ------------------------------------------ */
			
			var vm = this;

			vm.title = {
				module: TITLE_PACIENTE.MODULE,
				page: TITLE_PACIENTE.NEW_BABY + Title
			};

			vm.formData = {
				cantidadHijos : 1
			};

			vm.data = {
				tiposSexo : [],
				profesionales : [],

				hijos : []
			};

			vm.formControl = {
				error: true,
				loading: false,
				reloadPage: activate,
				ok : returnPaciente,
				cancel : cancel,
				validar: validarForm,
				updateArrayPaciente: updateArrayPaciente
			};

			/* ------------------------------------------- IMPLEMENTACIÓN ------------------------------------------- */

			function inicializarVariables () {
				vm.formData.cantidadHijos = 1;
				vm.data.hijos = [];
				updateArrayPaciente();
			}

			function validarForm () {
				var _flag = true;

				for (var i = 0; i < vm.data.hijos.length; i++) {
					if (vm.data.hijos[i].diagnostico == null) {
						_flag = false;
						break;
					}
				}

				return _flag;
			}

			function updateArrayPaciente () {
				var _paciente;

				// _paciente = {};
				vm.data.hijos = [];

				for (var i = vm.formData.cantidadHijos; i > 0; i--) {
					_paciente = {
						index : i,
						nombre : '',
						fecha_nacimiento: '',
						fechaNacimiento: new Date(),
						horaNacimiento: new Date(),
						Sexo: '',
						diagnostico: null
					};
					vm.data.hijos.push(_paciente);
				}
			}

			function crearPaciente (pHijo) {
				var _paciente = pHijo;
				var _fecha = $filter('date')(pHijo.fechaNacimiento, 'MM/dd/yyyy');
				var _hora = $filter('date')(pHijo.horaNacimiento, 'HH:mm');
				var _fechaHora = _fecha + ' ' + _hora;
				_paciente.fecha_nacimiento = new Date(_fechaHora);
				_paciente.diagnostico = pHijo.diagnostico;
				_paciente.medico_cabecera = vm.formData.medicoCabecera.numero_matricula;

				return _paciente;
			}

			function returnPaciente () {
				for (var i = 0; i < vm.data.hijos.length; i++) {
					vm.data.hijos[i] = crearPaciente(vm.data.hijos[i]);
				};
				// var _paciente = crearPaciente(vm.data.hijos[0]);
				$uibModalInstance.close(vm.data.hijos);
			}

			function cancel () {
				$uibModalInstance.dismiss('cancel');
			}

			/* -------------------------------------------- ACTIVATE -------------------------------------------- */

			activate();

			/* Método inicializador */
			function activate () {
				$log.debug('Inicializar ON.-');
				inicializarVariables();
				vm.formControl.loading = true;

				$q.all([
					TipoSexoDataService.getAllTipoSexoValidos(),
					ProfesionalesDataService.getAllProfesionales()
				])
				.then(activateOk, activateError)
			}

			function activateOk (pResult) {
				vm.data.tiposSexo = pResult[0];
				vm.data.profesionales = pResult[1];
				vm.formControl.loading = false;
			}

			function activateError (pError) {
				vm.formControl.loading = false;
				vm.formControl.error = true;
			}
		};
	};

	return module;

})();