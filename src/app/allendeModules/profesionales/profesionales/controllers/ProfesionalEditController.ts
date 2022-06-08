/**
 * @author:			Jorge Basiluk
 * @description:	ProfesionalEdit
 * @type:			Controller
 **/
export default (function(){
	const module = { init : (ngModule: any) => {} };

	module.init = function (module) {

		module.controller('ProfesionalEditController', ProfesionalEditController);

		ProfesionalEditController.$inject = ['Logger', '$state', '$scope', 'ModalService', 'User', 'PROFESIONALES_TABS', '$stateParams', 'DateUtils', 'ProfesionalesLogicService'];

		function ProfesionalEditController ($log, $state, $scope, ModalService, User, TABS, $stateParams, DateUtils, ProfesionalesLogicService) {

			/* ------------------------------------------------ LOG ------------------------------------------------ */
            //$log = $log.getInstance('ProfesionalEditController');
            
			/* ----------------------------------------- API Y VARIABLESES ----------------------------------------- */

			var vm = this;
			vm.today = new Date();
			vm.tabs = TABS;
			
			vm.title = {
				name : '',
				icon : ''
			};

			vm.data = {
				profesionalEdit : ''
			};

			vm.formData = {
			};

			vm.filter = {
				profesionalElegida : '',
				fechaIncorporacion : null,
				esNuevo : null,
				numeroMatricula : null,
                nombre : '',
				apellido : '',
				startDate : new Date('1900-01-01')
			};

			vm.formControl = {
				numeroMatriculaChange : numeroMatriculaChange,
                nombreChange : nombreChange,
                apellidoChange : apellidoChange,
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
				$state.go('profesionales.profesionales.list');
			}

			function numeroMatriculaChange(){
				vm.data.profesionalEdit.NumeroMatricula = vm.filter.numeroMatricula;
			}

			function nombreChange(){
				vm.data.profesionalEdit.Nombre = vm.filter.nombre;
			}

			function apellidoChange(){
				vm.data.profesionalEdit.Apellido = vm.filter.apellido;
			}

			$scope.$watch(function() {
				return vm.filter.fechaIncorporacion;
			}, function() {
				vm.data.profesionalEdit.FechaIncorporacion = DateUtils.parseToBe(vm.filter.fechaIncorporacion);
			});

			function guardar(esValido) {
				if(!esValido) return;
				ProfesionalesLogicService.guardarProfesional(vm.data.profesionalEdit).then(function(result){
					if(result.IsOk === true){
						$state.go('profesionales.profesionales.list');
					}
				});
			}

			/* ---------------------------------------------- ACTIVATE ---------------------------------------------- */

			activate();

			function activate () {
				if(!$stateParams.profesionalEdit){
					volver();
					return;
				}
				$state.go('profesionales.profesionales.edit.general');

				vm.formControl.loading = true;
				vm.filter.esNuevo = $stateParams.esNuevo;
				vm.title.name = vm.filter.esNuevo ? 'Nuevo Profesional' : 'Editar Profesional';
				vm.title.icon = vm.filter.esNuevo ? 'NEW2': 'EDIT';
				vm.data.profesionalEdit = $stateParams.profesionalEdit;

				if(!vm.filter.esNuevo) vm.filter.numeroMatricula = vm.data.profesionalEdit.NumeroMatricula;
                if(!vm.filter.esNuevo) vm.filter.nombre = vm.data.profesionalEdit.Nombre;
                if(!vm.filter.esNuevo) vm.filter.apellido = vm.data.profesionalEdit.Apellido;
				vm.filter.fechaIncorporacion = (!vm.filter.esNuevo && vm.data.profesionalEdit.TieneFechaIncorporacion) ? DateUtils.parseToFe(vm.data.profesionalEdit.FechaIncorporacion) : null;
				vm.formControl.loading = false
			}
		}
	};
	return module;
})();