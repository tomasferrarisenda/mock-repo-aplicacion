import * as angular from 'angular';

/**
 * @author:			Jorge Basiluk
 * @description:	SociedadProfesionalesEdit
 * @type:			Controller
 **/
export default (function(){
	const module = { init : (ngModule: any) => {} };

	module.init = function (module) {

		module.controller('SociedadProfesionalesEditController', SociedadProfesionalesEditController);

		SociedadProfesionalesEditController.$inject = ['Logger', '$state', 'ModalService', 'User', 'SOCIEDADES_TABS', '$stateParams', 'SociedadProfesionalesDataService', 'DateUtils', 'SociedadProfesionalesLogicService'];

		function SociedadProfesionalesEditController ($log, $state, ModalService, User, TABS, $stateParams, SociedadProfesionalesDataService, DateUtils, SociedadProfesionalesLogicService) {

			/* ------------------------------------------------ LOG ------------------------------------------------ */

			$log = $log.getInstance('SociedadProfesionalesEditController');
			/* ----------------------------------------- API Y VARIABLESES ----------------------------------------- */

			var vm = this;
			vm.today = new Date();
			vm.tabs = TABS;
			
			vm.title = {
				name : '',
				icon : ''
			};

			vm.data = {
				sociedadEdit : ''
			};

			vm.formData = {
			};

			vm.filter = {
				sociedadElegida : '',
				fechaIncorporacion : null,
				esNuevo : null
			};

			vm.formControl = {
				reloadPage : reloadPage,
				volver : volver,
				guardar : guardar,
				loading : false
			};

			/* ------------------------------------------- IMPLEMENTACIÓN ------------------------------------------- */

			/* FORMULARIO */
			function reloadPage () {
				$state.reload();
			}

			function volver () {
				$state.go('profesionales.sociedadProfesionales.list');
			}

			function guardar (esValido) {
				//if(!esValido) return;
				var sociedadEdit = angular.copy(vm.data.sociedadEdit)
				sociedadEdit.FechaVigenciaEximicionIibb = DateUtils.parseToBe(sociedadEdit.FechaVigenciaEximicionIibb);
				sociedadEdit.FechaIncorporacion = DateUtils.parseToBe(vm.filter.fechaIncorporacion);

				SociedadProfesionalesLogicService.guardarSociedad(sociedadEdit,sociedadEdit.FechaIncorporacion)
					.then(function(result){
						if(result.IsOk === true){
							$state.go('profesionales.sociedadProfesionales.list');
						}
					});
			}			

			/* ---------------------------------------------- ACTIVATE ---------------------------------------------- */

			activate();

			function activate () {
				if(!$stateParams.sociedadEdit){
					volver();
					return;
				}
				$state.go('profesionales.sociedadProfesionales.edit.general');
				
				vm.formControl.loading = true;
				vm.filter.esNuevo = $stateParams.esNuevo;
				vm.title.name = vm.filter.esNuevo ? 'Nueva Sociedad de Profesionales' : 'Editar Sociedad de Profesionales';
				vm.title.icon = vm.filter.esNuevo ? 'NEW2': 'EDIT';
				vm.data.sociedadEdit = $stateParams.sociedadEdit;
				vm.data.sociedadEdit.FechaVigenciaEximicionIibb = DateUtils.parseToFe(vm.data.sociedadEdit.FechaVigenciaEximicionIibb);
				vm.filter.fechaIncorporacion = (!vm.filter.esNuevo && vm.data.sociedadEdit.TieneFechaIncorporacion) ? DateUtils.parseToFe(vm.data.sociedadEdit.FechaIncorporacion) : null;
				vm.formControl.loading = false
			}
		}
	};
	return module;
})();