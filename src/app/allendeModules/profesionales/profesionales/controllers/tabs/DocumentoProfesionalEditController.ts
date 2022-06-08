/**
 * @author:			Pedro Ferrer
 * @description:	Documentos
 * @type:			Controller
 **/
export default (function () {
	const module = { init: (ngModule: any) => { } };

	module.init = function (module) {

		module.controller('DocumentoProfesionalEditController', DocumentoProfesionalEditController);

		DocumentoProfesionalEditController.$inject = ['Logger', '$state', 'ModalService', 'User', '$q', '$scope', 'ProfesionalesLogicService', 'ProfesionalesDataService', 'AlertaService'];

		function DocumentoProfesionalEditController($log, $state, ModalService, User, $q, $scope, ProfesionalesLogicService, ProfesionalesDataService, AlertaService) {

			/* ------------------------------------------------ LOG ------------------------------------------------ */

			$log = $log.getInstance('DocumentoProfesionalEditController');

			/* ----------------------------------------- API Y VARIABLESES ----------------------------------------- */

			var vm = this;

			vm.data = {
				docProfesional: '',
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
                vm.data.idEntidadContenedoraDocumentos = $scope.$parent.vm.data.profesionalEdit.Id;
                vm.data.idTipoEntidadContenedoraDocumentos = 5; // Profesional...TODO Pasar a constantes

				if ($scope.$parent.vm.data.profesionalEdit.Id === 0) {
					ProfesionalesLogicService.guardarProfesional($scope.$parent.vm.data.profesionalEdit)
					.then(guardarProfesional, canceloGuardar);
				}
				else{
					ProfesionalesDataService.GetNuevoDocumentoAsociadoDto().then(function(documentoAsociado){
						vm.data.docProfesional = documentoAsociado;
						vm.data.docProfesional.IdTipoEntidad = 5; // Entidad Profesional = 5
						vm.data.docProfesional.IdTipo = 5; // Documentación Profesional
						vm.data.docProfesional.IdEntidad = $scope.$parent.vm.data.profesionalEdit.Id; // Id del profesional
					})
				}
				vm.formControl.loading = false;
			}

			function guardarProfesional(result){
				$scope.$parent.vm.data.profesionalEdit.Id = result.IdEntidadValidada;
				ProfesionalesDataService.GetNuevoDocumentoAsociadoDto().then(function(documentoAsociado){
					vm.data.docProfesional = documentoAsociado;
					vm.data.docProfesional.IdTipoEntidad = 5; // Entidad Profesional = 5
					vm.data.docProfesional.IdTipo = 5; // Documentación Profesional
					vm.data.docProfesional.IdEntidad = $scope.$parent.vm.data.profesionalEdit.Id; // Id del profesional
					vm.data.idEntidadContenedoraDocumentos = $scope.$parent.vm.data.profesionalEdit.Id;
				})
			}
			function canceloGuardar(){
				$state.go('profesionales.profesionales.edit.general');
			}
		}
	};

	return module;
})();