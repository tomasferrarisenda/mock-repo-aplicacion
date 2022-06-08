/**
 * @author 			emansilla
 * @description 	description
 */
import { ISupportDataService } from '../../../support/basic/services';

export default (function () {
	'use strict';
	
	const module = { init : (ngModule: any) => {} };

	module.init = function (module) {

		module.controller('EmpresaNewController', EmpresaNewController);

		// Inyeccion de dependencia
		EmpresaNewController.$inject = ['Logger', '$q', '$uibModalInstance', 'User',
			'SupportDataService', 'EmpresaDataService', 'Cuit'];
		
		// Constructor del Controller
		function EmpresaNewController ($log, $q, $uibModalInstance, User,
			SupportDataService: ISupportDataService, EmpresaDataService, Cuit) {
				
			/* ------------------------------------------------ LOG ------------------------------------------------ */

			$log = $log.getInstance('EmpresaNewController');
			$log.debug('ON.-');

			/* ------------------------------------------ API Y VARIABLES ------------------------------------------ */

			var vm = this;

			vm.data = {
				user : {},
				empresa : {},
				alicuotasIva : [],
				numeroCuit : Cuit
			}

			vm.formData = {
			}

			vm.formControl = {
				loading : false,
				cancel : cancelarModal,
				ok : nuevaEmpresa,
				llenarForm: llenarForm
			}

			vm.validar = {
				error : validarError
			}

			/* ------------------------------------------ IMPLEMENTACIÓN ------------------------------------------ */

			function validarError (pBool) {
				if (!pBool) {
					return 'error';
				}
				return '';
			}

			function llenarForm () {
				vm.data.empresa.Cuit = vm.data.numeroCuit;
			}

			function cancelarModal () {
				$uibModalInstance.dismiss('Creación de empresa cancelada.');
			}

			function nuevaEmpresa () {
				$log.debug('AddOneOrganizacion ON.-');
				var _empresa = vm.data.empresa;
				EmpresaDataService.addOneOrganizacion(_empresa)
				.then(function (pEmpresa) {
					$log.debug('AddOneOrganizacion OK.-', pEmpresa);
					$uibModalInstance.close(pEmpresa);
				}, function (pError) {
					$uibModalInstance.dismiss(pError.message);
					$log.error('AddOneOrganizacion ERROR.-', pError);
				});
			}

			/* ---------------------------------------------- ACTIVATE ---------------------------------------------- */

			activate();

			function activate () {
				vm.formControl.loading = true;
				$log.debug('Inicializar ON.-');

				EmpresaDataService.getOneOrganizacionByCuit(vm.data.numeroCuit)
				.then(function (pEmpresa) {
					// Si existe la empresa la devuelvo
					if (pEmpresa) {
						$uibModalInstance.close(pEmpresa);

					} else { 
						var _alicuotasIva = SupportDataService.getAllAlicuotasIva();

						$q.all([_alicuotasIva])
						.then(function (pResults) {
							$log.debug('Inicializar OK.-', pResults);
							vm.data.alicuotasIva = pResults[0];
							vm.formControl.llenarForm();
							vm.formControl.loading = false;
						}, function (pError) {
							$log.debug('Inicializar ERROR.-', pError);
							$uibModalInstance.dismiss(pError);
						});		
					}
				}, function (pError) {
					
					$uibModalInstance.close(false);
				})
			}
		}
	}

	return module;
})();