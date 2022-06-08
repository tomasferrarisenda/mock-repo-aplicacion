/**
 * @author:			Pedro Ferrer
 * @description:	Documentos
 * @type:			Controller
 **/
export default (function () {
	const module = { init: (ngModule: any) => { } };

	module.init = function (module) {

		module.controller('DocumentoMutualEditController', DocumentoMutualEditController);

		DocumentoMutualEditController.$inject = ['Logger', '$state', 'ModalService', 'User', '$q', '$scope', 'MutualGestionLogicService', 'MutualGestionDataService', 'AlertaService'];

		function DocumentoMutualEditController($log, $state, ModalService, User, $q, $scope, MutualGestionLogicService, MutualGestionDataService, AlertaService) {

			/* ------------------------------------------------ LOG ------------------------------------------------ */

			$log = $log.getInstance('DocumentoMutualEditController');

			/* ----------------------------------------- API Y VARIABLESES ----------------------------------------- */

			var vm = this;

			vm.data = {
				docMutual: '',
				documentos: '',
				extensionesArchivos: '',
				selectorvisible: false,
                idEntidadContenedoraDocumentos: 0,
                idTipoEntidadContenedoraDocumentos : 0
			};

			vm.formControl = {
				loading : false
			};

			/* ---------------------------------------------- ACTIVATE ---------------------------------------------- */

			activate();

			function activate() {
				vm.formControl.loading = true;
				vm.data.extensionesArchivos = ".pdf,.xls,.xlsx,.doc,.docx,.ppt,.pptx,.csv,.txt,.rtf,.odt,.ods,.odp,.zip,.rar,.html,.xml,.xlsm,.docm,.jpg,.jpeg,.png"
				vm.data.url = "DocumentoAsociado/UploadDocument";
                vm.data.idEntidadContenedoraDocumentos = $scope.$parent.vm.data.mutual.Id;
                vm.data.idTipoEntidadContenedoraDocumentos = 3; // FINANCIADOR...TODO Pasar a constantes

				if ($scope.$parent.vm.data.mutual.Id === 0) {
					MutualGestionLogicService.guardarMutual($scope.$parent.vm.data.mutual)
					.then(guardarMutual, canceloGuardar);
				}
				else{
					MutualGestionDataService.GetNuevoDocumentoAsociadoDto().then(function(documentoAsociado){
						vm.data.docMutual = documentoAsociado;
						vm.data.docMutual.IdTipoEntidad = 3; // Entidad FINANCIADOR = 3
						vm.data.docMutual.IdTipo = 3; // Documentación FINANCIADOR
						vm.data.docMutual.IdEntidad = $scope.$parent.vm.data.mutual.Id; // Id del FINANCIADOR
					})
				}
				vm.formControl.loading = false;
			}

			function guardarMutual(result){
				$scope.$parent.vm.data.mutual.Id = result.IdEntidadValidada;
				MutualGestionDataService.GetNuevoDocumentoAsociadoDto().then(function(documentoAsociado){
					vm.data.docMutual = documentoAsociado;
					vm.data.docMutual.IdTipoEntidad = 3; // Entidad FINANCIADOR = 3
					vm.data.docMutual.IdTipo = 3; // Documentación FINANCIADOR
					vm.data.docMutual.IdEntidad = $scope.$parent.vm.data.mutual.Id; // Id del FINANCIADOR
					vm.data.idEntidadContenedoraDocumentos = $scope.$parent.vm.data.mutual.Id;
				})
			}
			function canceloGuardar(){
				$state.go('financiadores.mutual.edit.general');
			}
		}
	};

	return module;
})();