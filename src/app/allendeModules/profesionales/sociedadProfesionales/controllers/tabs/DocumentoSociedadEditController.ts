/**
 * @author:			Pedro Ferrer
 * @description:	Documentos
 * @type:			Controller
 **/
export default (function () {
	const module = { init: (ngModule: any) => { } };

	module.init = function (module) {

		module.controller('DocumentoSociedadEditController', DocumentoSociedadEditController);

		DocumentoSociedadEditController.$inject = ['Logger', '$state', 'ModalService', 'User', '$q', '$scope', 'SociedadProfesionalesLogicService', 'SociedadProfesionalesDataService', 'AlertaService'];

		function DocumentoSociedadEditController($log, $state, ModalService, User, $q, $scope, SociedadProfesionalesLogicService, SociedadProfesionalesDataService, AlertaService) {

			/* ------------------------------------------------ LOG ------------------------------------------------ */

			$log = $log.getInstance('DocumentoSociedadEditController');

			/* ----------------------------------------- API Y VARIABLESES ----------------------------------------- */

			var vm = this;

			vm.data = {
				docSociedad: '',
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
                vm.data.idEntidadContenedoraDocumentos = $scope.$parent.vm.data.sociedadEdit.Id;
                vm.data.idTipoEntidadContenedoraDocumentos = 7; // Sociedad Profesional...TODO Pasar a constantes

				if ($scope.$parent.vm.data.sociedadEdit.Id === 0) {
					SociedadProfesionalesLogicService.guardarSociedad($scope.$parent.vm.data.sociedadEdit, $scope.$parent.vm.filter.fechaIncorporacion)
					.then(guardarSociedad, canceloGuardar);
				}
				else{
					SociedadProfesionalesDataService.GetNuevoDocumentoAsociadoDto().then(function(documentoAsociado){
						vm.data.docSociedad = documentoAsociado;
						vm.data.docSociedad.IdTipoEntidad = 7; // Entidad Sociedad Profesional = 7
						vm.data.docSociedad.IdTipo = 7; // Documentación Sociedad Profesional
						vm.data.docSociedad.IdEntidad = $scope.$parent.vm.data.sociedadEdit.Id; // Id del Sociedad Profesional
					})
				}
				vm.formControl.loading = false;
			}

			function guardarSociedad(result){
				$scope.$parent.vm.data.sociedadEdit.Id = result.IdEntidadValidada;
				SociedadProfesionalesDataService.GetNuevoDocumentoAsociadoDto().then(function(documentoAsociado){
					vm.data.docSociedad = documentoAsociado;
					vm.data.docSociedad.IdTipoEntidad = 7; // Entidad Sociedad Profesional = 7
					vm.data.docSociedad.IdTipo = 7; // Documentación Sociedad Profesional
					vm.data.docSociedad.IdEntidad = $scope.$parent.vm.data.sociedadEdit.Id; // Id del Sociedad Profesional
					vm.data.idEntidadContenedoraDocumentos = $scope.$parent.vm.data.sociedadEdit.Id;
				})
			}
			function canceloGuardar(){
				$state.go('profesionales.sociedadProfesionales.edit.general');
			}
		}
	};

	return module;
})();