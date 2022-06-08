/**
* @author:         Pablo pautasso  
* @description:    Controller para manejar modal de text area
* @type:           Controller
**/
import * as angular from 'angular';

export default (function () {
	'use strict';

	const module = { init: (ngModule: any) => { } };

	module.init = function (ngModule) {

		ngModule.controller('ModalTextAreaController', ModalTextAreaController);

		ModalTextAreaController.$inject = [
			'$location', 'Logger', '$q', '$filter', '$uibModalInstance',
			'ModalService', 'Options', 'AlertaService'
		];

		function ModalTextAreaController(
			$location, $log, $q, $filter, $uibModalInstance,
			ModalService, Options, AlertaService
		) {

			/* ------------------------------------------------ LOG ------------------------------------------------ */

			$log = $log.getInstance('ModalTextAreaController');
			$log.debug('ON.-');

			/* ----------------------------------------- API Y VARIABLESES ----------------------------------------- */

			var vm = this;
			vm.today = new Date();

			vm.title = {
				page: 'Seleccione una opción para continuar',
				icon: 'QUESTION'
			};

			vm.data = {
				options: Options,
			};

			vm.maxlength = 255;
 
			vm.guardar = guardar;

			vm.formControl = {
				loading: false,
				error: true,
				cancel: cancel,
				readOnly: false,
			};
			/* ------------------------------------------- IMPLEMENTACIÓN ------------------------------------------- */

			/* FORMULARIO */
			function cancel() {
				$uibModalInstance.dismiss(false);
			}

			function guardar(option) {

				if(vm.data.textAreaData){
					$uibModalInstance.close(vm.data.textAreaData);
				}

			}

			// vm.optionCk = {
			// 	language: 'es',
			// 	allowedContent: false,
			// 	entities: false,
			// 	// skin : 'kama',
			// 	// Remover botones (sin espacios) http://docs.cksource.com/CKEditor_3.x/Developers_Guide/Toolbar
			// 	// Nombre de los botones https://ckeditor.com/old/forums/CKEditor/Complete-list-of-toolbar-items#comment-123266
			// 	removeButtons: 'Table,About,Source,PasteText,PasteFromWord,RemoveFormat,Link,Unlink,Anchor,Image',
			// 	// Remover pluging
			// 	// removePlugins : 'elementspath',
			// 	// extraPlugins : 'colorbutton'
			// 	// Ver/Ocultar toolbar
			// 	toolbarCanCollapse: true,
			// 	// Redefinir toolbar
			// 	toolbar: [
			// 		{ name: 'clipboard', groups: ['clipboard', 'undo'], items: ['Cut', 'Copy', 'Paste', '-', 'Undo', 'Redo'] },
			// 		{ name: 'basicstyles', groups: ['basicstyles', 'cleanup'], items: ['Bold', 'Italic', 'Underline', 'Strike', 'Subscript', 'Superscript', '-', 'CopyFormatting', 'RemoveFormat'] },
			// 		{ name: 'editing', groups: ['spellchecker'], items: ['Scayt'] },
			// 		{ name: 'insert', items: ['HorizontalRule', 'Smiley', 'SpecialChar', 'PageBreak'] },
			// 		{ name: 'paragraph', groups: ['list', 'indent', 'blocks', 'align', 'bidi'], items: ['NumberedList', 'BulletedList', '-', 'Outdent', 'Indent', '-', 'Blockquote', '-', 'BidiLtr', 'BidiRtl'] },
			// 		{ name: 'styles', items: ['Styles', 'Format', 'Font', 'FontSize'] },
			// 		{ name: 'tools', items: ['Maximize', 'ShowBlocks'] }
			// 	]
			// };
			// // Called when the editor is completely ready.
			// vm.onReady = function () {
			// 	$log.debug('on ready', vm.optionCk);
			// };


			/* -------------------------------------------- ACTIVATE ------------------------------------------------ */


			activate();

			function activate() {
				$log.debug('INICIALIZANDO OK', vm.data.options);
				vm.data.textAreaData = angular.copy(vm.data.options.data);
				vm.title.page = angular.copy(vm.data.options.tituloModal);
				vm.title.icon = angular.copy(vm.data.options.icon);

				if(vm.data.options.maxlength) {
					vm.maxlength = angular.copy(vm.data.options.maxlength);
				}

				vm.formControl.readOnly = angular.copy(vm.data.options.readOnly);
			};


		}
	};

	return module;

})();