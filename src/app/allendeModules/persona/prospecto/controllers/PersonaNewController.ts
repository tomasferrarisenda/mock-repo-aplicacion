/**
 * @author 			emansilla
 * @description 	description
 */

import { ISupportDataService } from '../../../support/basic/services';
import { IPersonaDataService } from '../services';

export default (function () {
	'use strict';
	
	const module = { init : (ngModule: any) => {} };

	module.init = function (module) {

		module.controller('PersonaNewController', PersonaNewController);

		// Inyeccion de dependencia
		PersonaNewController.$inject = ['Logger', '$q', '$uibModalInstance', 'User',
			'SupportDataService', 'PersonaDataService',
			'TipoDocumento', 'NumeroDocumento'];
		
		// Constructor del Controller
		function PersonaNewController ($log, $q, $uibModalInstance, User,
			SupportDataService: ISupportDataService, PersonaDataService: IPersonaDataService,
			TipoDocumento, NumeroDocumento) {
				
			/* ------------------------------------------------ LOG ------------------------------------------------ */

			$log = $log.getInstance('PersonaNewController');
			$log.debug('ON.-');
				
			/* ------------------------------------------ API Y VARIABLES ------------------------------------------ */

			var vm = this;

			vm.data = {
				user: {},
				persona: {},
				estadosCivil: [],
				tiposDocumento: [],
				tipoDocumento: TipoDocumento,
				numeroDocumento: NumeroDocumento
			};

			vm.formData = {
			};

			vm.formControl = {
				loading: false,
				validarOk: validarFormulario,
				cancel : cancelarModal,
				ok : nuevaPersona,
				llenarForm: llenarFormulario
			};

			vm.validar = {
				error: validarError
			};

			/* ------------------------------------------ IMPLEMENTACIÓN ------------------------------------------ */

			function validarError (pBool) {
				if (!pBool) {
					return 'error';
				}
				return '';
			}

			function validarFormulario () {
				var _flag = false;
				return _flag;
			}

			function cancelarModal () {
				$uibModalInstance.dismiss('Creación de persona cancelada.');
			}

			function nuevaPersona () {
				var _persona = vm.data.persona;
				PersonaDataService.addOnePersona(_persona)
				.then(function (pPersona) {
					$log.debug('AdmisionNewController: AddOnePersona OK.-');
					$uibModalInstance.close(pPersona);
				}, function (pError) {
					$uibModalInstance.dismiss(pError);
					$log.debug('AdmisionNewController: AddOnePersona ERROR.-', pError);
				});
			}

			function llenarFormulario () {
				vm.data.persona.numero_documento = vm.data.numeroDocumento;
				vm.data.persona.TipoDocumento = vm.data.tipoDocumento;
			}

			/* --------------------------------------------- ACTIVATE --------------------------------------------- */

			activate();

			function activate () {
				vm.formControl.loading = true;
				$log.debug('Inicializar ON.-');

				PersonaDataService
				.getOnePersonaByDocumento(vm.data.tipoDocumento.id_tipo_documento, vm.data.numeroDocumento)
				.then(function (pPersona) {
					if (pPersona) { 
						// Si se encuentra la persona, la devuelvo.
						$uibModalInstance.close(pPersona);
					} else noEncontrePersona();
				}, function (pError) {
						noEncontrePersona();
				});
			}

			function noEncontrePersona() { 
					// Si no se encuentra la persona, cargo el formulario.

					var _estadosCivil = SupportDataService.getAllEstadosCivil();
					var _tiposDocumento = SupportDataService.getAllTiposDocumento();

					$q.all([_estadosCivil, _tiposDocumento])
					.then(function (pResults) {
						$log.debug('Inicializar OK.-', pResults);
						vm.data.estadosCivil = pResults[0];
						vm.data.tiposDocumento = pResults[1];
						vm.formControl.llenarForm();
						vm.formControl.loading = false;
					}, function (pError) {
						$log.debug('Inicializar ERROR.-', pError);
						vm.formControl.loading = false;
						$uibModalInstance.dismiss(pError);
					});
			}
		}
	};

	return module;

})();