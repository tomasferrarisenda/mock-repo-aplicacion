
import fileUploadTemplate = require('./fw-btn-upload-file.tpl.html');
import * as angular from 'angular';

export default (function () {
	'use strict';
	const module = { init : (ngModule: any) => {} };

	module.init = function (ngModule) {

		ngModule.directive('fwFileUpload', fwFileUpload);

		fwFileUpload.$inject = ['$log', 'DtoService', 'ModalService'];

		function fwFileUpload ($log, DtoService, ModalService) : any {
			return {
				restrict : 'E',
				scope : {
					file : '=?',
					data : '=?',
					extensions : '=?',
					fileExtensions : '@?',
					needConfirmation : '@?',
					confirmationMessage : '@?',
					botonSubir : '=',
					url : '@'
				},
				template: fileUploadTemplate,
				link: function (scope, element, attrs) {

					scope.limpiar = limpiar;
					scope.subir = subir;
					
					if(angular.isUndefined(scope.fileExtensions)){
						scope.extensions = '';
					} else {
						scope.extensions = scope.fileExtensions;
					}

					if(angular.isUndefined(scope.needConfirmation)){
						scope.needConfirmation = true;
					}

					if(angular.isUndefined(scope.confirmationMessage)){
						scope.confirmationMessage = '¿Está seguro que desea subir el archivo seleccionado?';
					}

					function limpiar() {
						scope.file = null;
					}

					function subir() {
						if(scope.needConfirmation){
							ModalService.confirm(scope.confirmationMessage,
								function (pResult) {
									if (pResult) {
										DtoService.UploadFile(scope.url, scope.file, scope.data).then(uploadFileOK, uploadFileError);
									}
								}
							);
						} else {
							DtoService.UploadFile(scope.url, scope.file, scope.data).then(uploadFileOK, uploadFileError);
						}
					}

					function uploadFileOK(returnData){
						scope.$emit('uploadDone', returnData);
						limpiar();
					}
		
					function uploadFileError (pResponse) {
						scope.$emit('uploadFailed', pResponse);
					}
				}
			};
		}
	};
	return module;
})();