/**
 * @author:			Pedro Ferrer
 * @description:	NormativaEdit
 * @type:			Controller
 **/
export default (function(){
	const module = { init : (ngModule: any) => {} };

	module.init = function (module) {

		module.controller('NormativaEditController', NormativaEditController);

		NormativaEditController.$inject = ['Logger', '$state', 'ModalService', 'User', '$scope'];

		function NormativaEditController ($log, $state, ModalService, User, $scope) {

			/* ------------------------------------------------ LOG ------------------------------------------------ */

			$log = $log.getInstance('NormativaEditController');
			/* ----------------------------------------- API Y VARIABLESES ----------------------------------------- */

			var vm = this;
			vm.today = new Date();

			vm.data = {
				normativas : ''
			};

			vm.formData = {
			};

			vm.formControl = {
				loading : false
			};
			

			/* ------------------------------------------- IMPLEMENTACIÓN ------------------------------------------- */

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
				// extraPlugins : 'colorbutton'
				// Ver/Ocultar toolbar
				toolbarCanCollapse : true,
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

			/* FORMULARIO */
			$scope.$watch(function() {
				return vm.data.normativas;
			}, function() {
				$scope.$parent.vm.data.convenioEdit.Normativas = vm.data.normativas;
			});
			/* ---------------------------------------------- ACTIVATE ---------------------------------------------- */

			activate();

			function activate () {
				vm.formControl.loading = true;
				vm.data.normativas = $scope.$parent.vm.data.convenioEdit.Normativas;
				vm.formControl.loading = false;
			}

		}
	};

	return module;
})();