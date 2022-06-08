/**
* @author: aminolodo
* @description: Tab en Profesionales/Equipos
* @type: Controller
**/
import { IProfesionalesDataService } from '../../../profesionales';


export default (function () {
	const module = { init: (ngModule: any) => { } };

	module.init = function (module) {

		module.controller('EquipoProfesionalAtencionController', EquipoProfesionalAtencionController);

		EquipoProfesionalAtencionController.$inject = ['$state', '$scope',
			'ProfesionalesDataService', 'ContratableDataService', 'ContratableLogicService', 'AlertaService'];

		function EquipoProfesionalAtencionController($state, $scope,
			ProfesionalesDataService: IProfesionalesDataService, ContratableDataService, ContratableLogicService, AlertaService) {


			/* ----------------------------------------- API Y VARIABLESES ----------------------------------------- */

			var vm = this;

			vm.data = {
				equipo: {}
			};
			
			
			vm.formControl = {
				loading: false,
				editarProfesionalAtencion: editarProfesionalAtencion,
				borrarProfesionalAtencion: borrarProfesionalAtencion,
			};

			/* ------------------------------------------- IMPLEMENTACIÓN ------------------------------------------- */

			
			function editarProfesionalAtencion() {
				if ($scope.$parent.vm.data.equipo.Id > 0) {
					ContratableDataService.ObtenerServicioPorRecurso($scope.$parent.vm.data.equipo.Id, $scope.$parent.vm.data.equipo.IdTipoRecurso).then(function (servicioRecurso) {
						if (servicioRecurso.length > 0) {
							ContratableLogicService.searchProfesionalAtencion(servicioRecurso[0].Id)
								.then(function (profesionalElegido) {

									if (vm.data.ProfesionalesQueLoAtienden.Rows.find(profesional => profesional.IdProfesional === profesionalElegido.IdProfesional)) {

										AlertaService.NewWarning("El profesional ya se encuentra asignado.");
										return;
									}
									
									vm.data.ProfesionalesQueLoAtienden.Rows.push(profesionalElegido);
								});
						}
						else {
							AlertaService.NewWarning("El equipo no tiene servicio asociado");
						}
					})
				}
			}


			function borrarProfesionalAtencion(index) {
				vm.data.ProfesionalesQueLoAtienden.Rows.splice(index, 1);
			}

			/* ---------------------------------------------- ACTIVATE ---------------------------------------------- */

			activate();
			function activate() {
				vm.formControl.loading = true;
				vm.data.ProfesionalesQueLoAtienden = $scope.$parent.vm.data.equipo.ProfesionalesQueLoAtienden
					;

				if ($scope.$parent.vm.data.equipo === "") {
					$state.go('profesionales.equipos.edit.general');
					return;
				}

				
				vm.formControl.loading = false;
			}


		}
	};

	return module;
})();