/**
 * @author:			Pedro Ferrer
 * @description:	Documentos
 * @type:			Controller
 **/
export default (function () {
	const module = { init: (ngModule: any) => { } };

	module.init = function (module) {

		module.controller('DocumentoContratoEditController', DocumentoContratoEditController);

		DocumentoContratoEditController.$inject = ['Logger', '$state', 'ModalService', 'User', '$q', '$scope', 'ContratosInternosLogicService', 'ContratosInternosDataService', 'AlertaService'];

		function DocumentoContratoEditController($log, $state, ModalService, User, $q, $scope, ContratosInternosLogicService, ContratosInternosDataService, AlertaService) {

			/* ------------------------------------------------ LOG ------------------------------------------------ */

			$log = $log.getInstance('DocumentoContratoEditController');

			/* ----------------------------------------- API Y VARIABLESES ----------------------------------------- */

			var vm = this;

			vm.data = {
				docContrato: '',
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
                vm.data.idEntidadContenedoraDocumentos = $scope.$parent.vm.data.contratoEdit.Id;
                vm.data.idTipoEntidadContenedoraDocumentos = 6; // Contrato Interno...TODO Pasar a constantes

				if ($scope.$parent.vm.data.contratoEdit.Id === 0) {
					ContratosInternosLogicService.guardarContrato($scope.$parent.vm.data.contratoEdit, $scope.$parent.vm.filter.contratableElegido, $scope.$parent.vm.filter.desde, $scope.$parent.vm.filter.hasta)
					.then(guardarContrato, canceloGuardar);
				}
				else{
					ContratosInternosDataService.GetNuevoDocumentoAsociadoDto().then(function(documentoAsociado){
						vm.data.docContrato = documentoAsociado;
						vm.data.docContrato.IdTipoEntidad = 6; // Entidad Contrato Interno = 5
						vm.data.docContrato.IdTipo = 6; // Documentación Contrato Interno
						vm.data.docContrato.IdEntidad = $scope.$parent.vm.data.contratoEdit.Id; // Id del Contrato Interno
					})
				}
				vm.formControl.loading = false;
			}

			function guardarContrato(result){
				$scope.$parent.vm.data.contratoEdit.Id = result.IdEntidadValidada;
				ContratosInternosDataService.GetNuevoDocumentoAsociadoDto().then(function(documentoAsociado){
					vm.data.docContrato = documentoAsociado;
					vm.data.docContrato.IdTipoEntidad = 6; // Entidad Contrato Interno = 5
					vm.data.docContrato.IdTipo = 6; // Documentación Contrato Interno
					vm.data.docContrato.IdEntidad = $scope.$parent.vm.data.contratoEdit.Id; // Id del Contrato Interno
					vm.data.idEntidadContenedoraDocumentos = $scope.$parent.vm.data.contratoEdit.Id;
				})
			}
			function canceloGuardar(){
				$state.go('profesionales.contratosInternos.edit.general');
			}
		}
	};

	return module;
})();