import * as angular from 'angular';

export default (function () {
	'use strict';
	const module = { init: (ngModule: any) => { } };

	module.init = function (module) {

		module.controller('DestinatariosAlertaListController', DestinatariosAlertaListController);

		// Inyección de Dependencia
		DestinatariosAlertaListController.$inject = ['$log', '$filter', '$uibModalInstance', 'AlertaDataService', 'Alerta'];

		// Constructor del Controller
		function DestinatariosAlertaListController($log, $filter, $uibModalInstance, AlertaDataService, Alerta) {

			$log.debug('DestinatariosAlertaListController: ON.-');

			var vm = this;

			vm.data = {
				usuarios: ''
			};

			vm.formControl = {
				// Manejo del formulario
				error: true,
				loading: false,
				reloadPage: activate,
				volver: volver,
				pageChanged: getPage
			};

			vm.paginacion = {
				pageChanged: getPage,
				currentPage: '',
				pageSize: ''
			};

			vm.filter = {
				usuario: ''
			}

			/* IMPLEMENTACIÓN*/

			function cleanFilters() {
				getPage();
			}

			function validarFilters() {
				if (vm.filter.usuario == null)
					vm.filter.usuario = '';
			}

			function getPage() {
				$log.debug('Get Page ON');
				var begin = ((vm.paginacion.currentPage - 1) * vm.paginacion.pageSize);
				var end = begin + vm.paginacion.pageSize;
				validarFilters();
				vm.filter.usuarios = $filter('filter')
					(vm.data.usuarios, {
						NombreCompleto: vm.filter.usuario
					});
				$log.debug('filtro ', vm.filter.usuarios);
				vm.paginacion.totalItems = vm.filter.usuarios.length;
				vm.filter.usuarios = vm.filter.usuarios.slice(begin, end);
			}

			function volver() {
				$uibModalInstance.close();
			}

			function llenarForm() {
				// body...
			}


			activate();
			/* Método inicializador */
			function activate() {
				AlertaDataService.GetDestinatariosByAlerta(Alerta.Id)
					.then(function (_usuarios) {
						vm.data.usuarios = _usuarios;
						vm.paginacion.currentPage = 1;
						vm.paginacion.pageSize = 10;
						getPage();
					});
			}
		}

	};
	return module;

})();