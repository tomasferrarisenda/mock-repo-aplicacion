/**
 * @author:			Pedro Ferrer
 * @description:	Informacion de Financiador
 * @type:			Controller
 **/
export default (function(){
	const module = { init : (ngModule: any) => {} };

	module.init = function (module) {

		module.controller('InfoFinanciadorController', InfoFinanciadorController);

        InfoFinanciadorController.$inject = ['Logger', '$uibModalInstance', 'idFinanciador', 'MutualDataService'];

		function InfoFinanciadorController ($log, $uibModalInstance, idFinanciador, MutualDataService) {

			/* ------------------------------------------------ LOG ------------------------------------------------ */

			$log = $log.getInstance('InfoFinanciadorController');
			/* ----------------------------------------- API Y VARIABLESES ----------------------------------------- */

			var vm = this;
		
			vm.title = {
				name : '',
				icon : ''
			};

			vm.data = {
				financiador : ''
			};

			vm.formControl = {
				cancel : cancel
			};

			vm.optionCk = {
				language: 'es',
				allowedContent: false,
				entities: false,
				// skin : 'kama',
				// Remover botones (sin espacios) http://docs.cksource.com/CKEditor_3.x/Developers_Guide/Toolbar
				// Nombre de los botones https://ckeditor.com/old/forums/CKEditor/Complete-list-of-toolbar-items#comment-123266
				removeButtons : 'Table,About,Source,PasteText,PasteFromWord,RemoveFormat,Link,Unlink,Anchor,Image',
				// Remover pluging
				// removePlugins : 'elementspath',
				// extraPlugins : 'colorbutton',
				// Ver/Ocultar toolbar
				toolbarCanCollapse : true,
				setReadOnly : true,
				// Redefinir toolbar
				toolbar: [
					{ name: 'clipboard', groups: [ 'clipboard', 'undo' ], items: [ 'Cut', 'Copy', 'Paste', '-', 'Undo', 'Redo' ] },
					{ name: 'basicstyles', groups: [ 'basicstyles', 'cleanup' ], items: [ 'Bold', 'Italic', 'Underline', 'Strike', 'Subscript', 'Superscript', '-', 'CopyFormatting', 'RemoveFormat' ] },
					{ name: 'editing', groups: [ 'spellchecker' ], items: [ 'Scayt' ] },
					{ name: 'insert', items: [ 'HorizontalRule', 'Smiley', 'SpecialChar', 'PageBreak'] },
					{ name: 'paragraph', groups: [ 'list', 'indent', 'blocks', 'align', 'bidi' ], items: [ 'NumberedList', 'BulletedList', '-', 'Outdent', 'Indent', '-', 'Blockquote', '-', 'BidiLtr', 'BidiRtl'] },
					{ name: 'styles', items: [ 'Styles', 'Format', 'Font', 'FontSize' ] },
					{ name: 'tools', items: [ 'Maximize', 'ShowBlocks'] }
				]
			};
			// Called when the editor is completely ready.
			vm.onReady = function () {
				$log.debug('on ready', vm.optionCk);
			};

			/* ------------------------------------------- IMPLEMENTACIÓN ------------------------------------------- */

			/* FORMULARIO */
			
			function cancel() {
				$uibModalInstance.dismiss('close');
			}

			/* ---------------------------------------------- ACTIVATE ---------------------------------------------- */

			activate();
			function activate () {
				vm.title.name = 'Información del Financiador';
				MutualDataService.ObtenerInfoFinanciador(idFinanciador).then(function(financiador){
					vm.data.financiador = financiador;
				});
			}
		}
	};

	return module;
})();