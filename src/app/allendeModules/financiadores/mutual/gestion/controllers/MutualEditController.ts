/**
 * @author 			Aldo Minoldo
 * @description 	description
 */
import * as angular from 'angular';

export default (function () {
	'use strict';
	const module = { init : (ngModule: any) => {} };

	module.init = function(module) {
		module.controller('MutualEditController', MutualEditController);

		MutualEditController.$inject = ['$scope', 'Logger', '$state', '$stateParams',
			'MutualGestionDataService', 'ModalService',
			'MutualGestionLogicService','MUTUAL_TABS'];

		function MutualEditController($scope, $log, $state, $stateParams,
			MutualGestionDataService, ModalService,
			MutualGestionLogicService, TABS) {
			/* ------------------------------------------ API Y VARIABLES ------------------------------------------ */
			var vm = this;

			vm.tabs = TABS;

			vm.title = {
				name : '',
				icon : ''
			};

			vm.data = {
				mutual: ''
			};

			vm.filter = {
				codigo : null,
				nombre : '',
				nombreCorto : '',
				codigoDeshabilitado : false
			}

			vm.formControl = {
				guardar: guardar,
				cancelar: cancelar
			};

			/* ------------------------------------------ IMPLEMENTACIÓN ------------------------------------------ */
			function cancelar() {
				$state.go('financiadores.mutual.list')
			}

			function guardar(esValido) {
				if(!esValido) return;
				MutualGestionDataService.guardarMutual(vm.data.mutual)
				.then(function (result) {
					if(result.IsOk === true){
						ModalService.success("Mutual guardada.");
						$state.go('financiadores.mutual.list');
					}
					else{
						if(result.Message != null) 
							ModalService.warning(result.Message);
					}
				});
			}

			/* ------------------------------ ACTIVATE ------------------------------ */

			activate();
			function activate() {
				if(!$stateParams.mutualEdit){
					cancelar();
					return;
				}
				if($stateParams.vieneDeListado) $state.go('financiadores.mutual.edit.general');
				vm.title.name = $stateParams.mutualEdit.Id === 0 ? 'Nueva Mutual' : 'Editar Mutual';
				vm.title.icon = $stateParams.mutualEdit.Id === 0 ? 'NEW2' : 'EDIT';
				vm.filter.codigoDeshabilitado = $stateParams.mutualEdit.Id !== 0;
				
				vm.data.mutual = $stateParams.mutualEdit;
				vm.data.mutual.Codigo = vm.data.mutual.Codigo === 0 ? null : vm.data.mutual.Codigo;

				if($stateParams.tabAIr !== null)
					$state.go($stateParams.tabAIr);
			}
		}
	};

	return module;

})();