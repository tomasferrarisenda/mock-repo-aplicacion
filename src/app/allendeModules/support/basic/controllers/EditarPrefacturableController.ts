/**
 * @author 			
 * @description 	description
 */
import { ISupportDataService } from '../../../support/basic/services';

export default (function () {
	'use strict';
	
	const module = { init : (ngModule: any) => {} };

	module.init = function (module) { 

		module.controller('EditarPrefacturableController', EditarPrefacturableController);

		// Inyección de Dependencia
		EditarPrefacturableController.$inject = ['$log','$uibModalInstance',
			'SupportDataService', 'PrefacturableEditar', 'TipoInicial'];

		// Constructor del Controller
		function EditarPrefacturableController ($log, $uibModalInstance,
			SupportDataService: ISupportDataService, PrefacturableEditar, TipoInicial) {

			/* ---------------------------------------- API Y VARIABLES ---------------------------------------- */

			var vm = this;

			vm.title = {
				name : '',
				icon : ''
			};

			vm.formControl = {
				cancel : cancel,
				returnPrefacturable : returnPrefacturable
			};

			vm.data = {
				prefacturableEditar : {},
				initTipo : {},
				esNuevo : false,
			};

			/* ----------------------------------------- IMPLEMENTACIÓN ----------------------------------------- */
			function cancel() {
				$uibModalInstance.dismiss('cancel');
			}

			function returnPrefacturable() {
				$log.debug('MIERDAAAAAAAAAAAAAA');
				$uibModalInstance.close(vm.data.prefacturableEditar);
			}
			/* -------------------------------------------- ACTIVATE -------------------------------------------- */

			activate();

			function activate () {
				vm.title.name = PrefacturableEditar ? 'EDITAR PREFACTURABLE' : 'AGREGAR PREFACTURABLE';
				vm.title.icon = PrefacturableEditar ? 'EDIT' : 'NEW2';
				vm.data.esNuevo = PrefacturableEditar ? false : true;

				if(PrefacturableEditar){
					SupportDataService.ObtenerPrefacturablePorId(PrefacturableEditar.IdTipoPrefacturable, PrefacturableEditar.IdPrefacturable)
					.then(function(prefacturable){
						vm.data.prefacturableEditar = prefacturable;
					});
				}
				else{
					vm.data.initTipo = TipoInicial;
				}
			}
		}
	};
	return module;

})();