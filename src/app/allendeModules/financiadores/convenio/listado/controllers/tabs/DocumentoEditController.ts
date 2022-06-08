/**
 * @author:			Pedro Ferrer
 * @description:	Documentos
 * @type:			Controller
 **/
export default (function () {
	const module = { init: (ngModule: any) => { } };

	module.init = function (module) {

		module.controller('DocumentoEditController', DocumentoEditController);

		DocumentoEditController.$inject = ['Logger', '$state', 'ModalService', 'User', '$q', '$scope', 'ConvenioLogicService', 'ConvenioDataService', 'AlertaService'];

		function DocumentoEditController($log, $state, ModalService, User, $q, $scope, ConvenioLogicService, ConvenioDataService, AlertaService) {

			/* ------------------------------------------------ LOG ------------------------------------------------ */

			$log = $log.getInstance('DocumentoEditController');

			/* ----------------------------------------- API Y VARIABLESES ----------------------------------------- */

			var vm = this;
			vm.today = new Date();

			vm.title = {
				name: $state.current.data.title,
				icon: $state.current.data.icon
			};

			vm.data = {
				docAsociado: '',
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
				vm.data.idEntidadContenedoraDocumentos = $scope.$parent.vm.data.convenioEdit.Id;
				vm.data.idTipoEntidadContenedoraDocumentos = 1; // Convenio...TODO Pasar a constantes

				if ($scope.$parent.vm.data.convenioEdit.Id === 0) {
					ConvenioLogicService.guardarConvenio($scope.$parent.vm.data.convenioEdit, $scope.$parent.vm.filter.mutualElegida, $scope.$parent.vm.filter.vigenciaDesde, $scope.$parent.vm.filter.vigenciaHasta, $scope.$parent.vm.filter.estadoConvenio.Id)
					.then(guardoConvenio, canceloGuardar);
				}
				else{
					ConvenioDataService.getNuevoDocumentoAsociadoDto().then(function(documentoAsociado){
						vm.data.docAsociado = documentoAsociado;
						vm.data.docAsociado.IdTipoEntidad = 1; // Entidad 1 = CONVENIO
						vm.data.docAsociado.IdTipo = 1; // Documentación convenio
						vm.data.docAsociado.IdEntidad = $scope.$parent.vm.data.convenioEdit.Id; // Id del convenio
					})
				}
				vm.formControl.loading = false;
			}

			function guardoConvenio(result){
				$scope.$parent.vm.data.convenioEdit = result.Entidad;
				ConvenioDataService.getNuevoDocumentoAsociadoDto().then(function(documentoAsociado){
					vm.data.docAsociado = documentoAsociado;
					vm.data.docAsociado.IdTipoEntidad = 1; // Entidad 1 = CONVENIO
					vm.data.docAsociado.IdTipo = 1; // Documentación convenio
					vm.data.docAsociado.IdEntidad = $scope.$parent.vm.data.convenioEdit.Id; // Id del convenio
				})
			}
			function canceloGuardar(){
				$state.go('financiadores.convenios.edit.normativa');
			}
		}
	};

	return module;
})();