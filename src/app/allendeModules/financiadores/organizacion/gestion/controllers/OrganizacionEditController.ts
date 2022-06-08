/**
 * @author 			Aldo Minoldo
 * @description 	description
 */
import * as angular from 'angular';

export default (function () {
    'use strict';
	 const module = { init : (ngModule: any) => {} };

	module.init = function (module) { 

		module.controller('OrganizacionEditController', OrganizacionEditController);

		OrganizacionEditController.$inject = ['Logger', '$state', '$scope', '$stateParams',
		'OrganizacionGestionDataService','ModalService', 'ORGANIZACION_TABS'
		];

		function OrganizacionEditController ($log, $state, $scope, $stateParams,
			OrganizacionGestionDataService,ModalService, ORGANIZACION_TABS
		) {

			/* ------------------------------------------------ LOG ------------------------------------------------ */
			$log = $log.getInstance('OrganizacionEditController');
			/* ------------------------------------------ API Y VARIABLES ------------------------------------------ */

				var vm = this;

				vm.tabs = ORGANIZACION_TABS;

				vm.title = {
					name: '',
					icon : ''
				};

				vm.data = {
					organizacion: {},
					alicuotasIVA: {},
					condicionImpositiva: {}
				};

				vm.filter = {
					codigo : null,
					razonSocial : '',
					nombreCorto: '',
					cuit : null,
					codigoDeshabilitado : true
				}

				vm.formControl = {
					guardar : guardar,
					cancelar : cancelar
				};

			/* ------------------------------------------ IMPLEMENTACIÓN ------------------------------------------ */

 				function cancelar () {
					$state.go('financiadores.organizacion.list')
				}
				
				function guardar(esValido) {
					if(!esValido) return;
					vm.data.organizacion.Codigo = vm.filter.codigo;
					vm.data.organizacion.RazonSocial = vm.filter.razonSocial;
					vm.data.organizacion.NombreCorto = vm.filter.nombreCorto;
					vm.data.organizacion.Cuit = vm.filter.cuit;
					
					OrganizacionGestionDataService.Guardar(vm.data.organizacion)
					.then(function (result) {
						if(result.IsOk === true){
							ModalService.success("Organización guardada.");
							$state.go('financiadores.organizacion.list');
						}
						else{
							if(result.Message != null) 
								ModalService.warning(result.Message);
						}
					});
				}
				
 				/* ------------------------------ ACTIVATE ------------------------------ */
 				activate();
				function activate () {
					if(!$stateParams.Organizacion){
						cancelar();
						return;
					}
					$state.go('financiadores.organizacion.edit.general');
					vm.title.name = $stateParams.Organizacion.Id === 0 ? 'Nueva Organización' : 'Editar Organización';
					vm.title.icon = $stateParams.Organizacion.Id === 0 ? 'NEW2' : 'EDIT';
					vm.filter.codigoDeshabilitado = $stateParams.Organizacion.Id !== 0;
					
					vm.data.organizacion = $stateParams.Organizacion;
					vm.filter.codigo = vm.data.organizacion.Codigo === 0 ? null : vm.data.organizacion.Codigo;
					vm.filter.razonSocial = vm.data.organizacion.RazonSocial;
					vm.filter.nombreCorto = vm.data.organizacion.NombreCorto;
					vm.filter.cuit = vm.data.organizacion.Cuit === 0 ? null : vm.data.organizacion.Cuit; 
				}
			}
	};
	return module;
})();