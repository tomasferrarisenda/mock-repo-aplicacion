/**
 * @author 			emansilla
 * @description 	description
 */
import * as angular from 'angular';
export default (function () {
	'use strict';
	
	const module = { init : (ngModule: any) => {} };

	module.init = function (ngModule) { 

		ngModule.controller('ModalController', ModalController);

		// Inyección de Dependencia
		ModalController.$inject = ['Logger', '$uibModalInstance', 'Message', 'TypeModal', 'Value', 'Options',
			'MODAL_TYPE'];

		// Constructor del Controller
		function ModalController ($log, $uibModalInstance, Message, TypeModal, Value, Options,
			MODAL_TYPE) {

			/* ------------------------------------------------ LOG ------------------------------------------------ */

			$log = $log.getInstance('ModalController');
			// $log.debug('ON.-');

			/* ------------------------------------------ API Y VARIABLES ------------------------------------------ */

			var vm = this;
			vm.title = TypeModal.title_type_modal || Message;
			vm.message = Message;
			vm.detail = (Value) ? angular.toJson(Value) : '';
			vm.icon = TypeModal.icon_type_modal;
			vm.btn_cancel = TypeModal.btn_cancel;
			vm.prompt = TypeModal.prompt;
			vm.classHeader = Options.classHeader || TypeModal.class_header;
			vm.classButton = Options.classButton || TypeModal.class_button;

			vm.textCancel = Options.cancel || 'Cancelar';
			vm.textConfirm = Options.ok || 'Aceptar';
			// vm.classButton = 'btn-default';

			vm.formData = {
				texto : Value || ''
			};

			vm.formControl = {
				error : true,
				loading : false,
				showDetail: false,
				validarOk : validarOk,
				ok : selectOk,
				cancel : cancel
			};

			/* ------------------------------------------- IMPLEMENTACIÓN ------------------------------------------- */

			function selectOk () {
				if (MODAL_TYPE.PROMPT.name_type_modal == TypeModal.name_type_modal)
					okPrompt();
				// if (MODAL_TYPE.SELECT.name_type_modal == TypeModal.name_type_modal)
				// 	okSelect();
				else
					okCommon();
			}

			function okCommon () {
				$uibModalInstance.close(true);
			}

			// function okSelect () {
			// 	// body...
			// }

			function okPrompt () {
				$uibModalInstance.close(vm.formData.texto);
			}

			function validarOk () {
				var _flag = true;

				if (vm.prompt) {
					if (vm.formData.texto === '' || angular.isUndefined(vm.formData.texto))
						_flag = false;
				}
				return _flag;
			}

			function cancel () {
				$uibModalInstance.close(false);
			}

			/* --------------------------------------------- ACTIVATE --------------------------------------------- */

			// function initOptions() {
			// 	vm.text
			// }

			activate();
			
			function activate () {
				// initOptions();				
			}				
		}
	};

	return module;

})();