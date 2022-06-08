/**
 * @author:			Pablo Pautasso
 * @description:	controller para la lista de recursos -  ABM
 * @type:			Controller
 **/
export default (function () {

	const module = { init: (ngModule: any) => { } };

	module.init = function (module) {

		module.controller('RecursosGestionListController', RecursosGestionListController);

		RecursosGestionListController.$inject = [
			'$location', 'Logger', '$q', '$filter', 'orderByFilter',
			'RecursosDataService'

		];

		function RecursosGestionListController(
			$location, $log, $q, $filter, orderByFilter,
			RecursosDataService
		) {

			/* ------------------------------------------------ LOG ------------------------------------------------ */

			$log = $log.getInstance('RecursosGestionListController');
			$log.debug('ON.-');

			/* ----------------------------------------- API Y VARIABLESES ----------------------------------------- */

			var vm = this;
			vm.today = new Date();

			vm.title = {
				page: 'Gestion de Recursos'
			};

			vm.data = {
			}

			vm.formData = {
			}

			vm.paginacion = {
				currentPage: 0,
				pageSize: 0,
				totalItems: 0,
				pageChanged: getPage,
				getPage: getPage
			};

			vm.formControl = {
				loading: false,
				error: true,
				reloadPage: activate
			}

			vm.filter = {
				Nombre: '',
				Codigo: '',
				tipoRecurso: '',
				nombreRecurso: '',
				clean: cleanFilters,
				validar: validarFilters
			};

			/* ------------------------------------------- IMPLEMENTACIÓN ------------------------------------------- */

			/* FORMULARIO */

			function inicializarVariables() {
			}

			function llenarForm() {
			}

			/* PAGINACIÓN */

			function cleanFilters() {
				vm.filter.id = '';
				vm.filter.nombreRecurso = '';
				vm.filter.tipoRecurso = '';
				vm.paginacion.pageChanged();
			}

			function validarFilters() {
				if (vm.filter.id === null)
					vm.filter.id = '';

				if (vm.filter.nombreRecurso === null)
					vm.filter.nombreRecurso = '';

				if (vm.filter.tipoRecurso === null)
					vm.filter.tipoRecurso = '';


				vm.order = {
					id: 1,
					value: 'Codigo',
					descripcion: 'Codigo (Asc)',
					reverse: false
				};

			}


			function getPage() {


				var begin = ((vm.paginacion.currentPage - 1) * vm.paginacion.pageSize);
				var end = begin + vm.paginacion.pageSize;
				vm.filter.validar();
				vm.data.recursos = orderByFilter(vm.data.recursos, vm.order.value, vm.order.reverse);

				vm.filter.recursos = $filter('filter')
					(vm.data.recursos, {
						Id: vm.filter.id,
						Nombre: vm.filter.nombreRecurso,
						TipoRecurso: vm.filter.tipoRecurso.Nombre

					});

				vm.paginacion.totalItems = vm.filter.recursos.length;
				vm.filter.recursos = vm.filter.recursos.slice(begin, end);
			}


			/* ---------------------------------------------- ACTIVATE ---------------------------------------------- */

			activate();


			function activate() {

				vm.formControl.loading = true;
				vm.formControl.stateLoading = true;

				var _recursos = RecursosDataService.getAll();
				var _tipoRecursos = RecursosDataService.getAllTipos();

				$q.all([_recursos, _tipoRecursos])
					.then(activateOk, activateError);


				function activateOk(pResults) {


					vm.data.recursos = pResults[0];
					vm.data.tipoRecursos = pResults[1];
					$log.debug('Inicializar OK.-', pResults);

					cleanFilters();
					vm.paginacion.currentPage = 1;
					vm.paginacion.pageSize = 6;
					vm.paginacion.getPage();
					vm.formControl.loading = false;
					vm.formControl.stateLoading = false;


				}

				function activateError(pError) {
					vm.formControl.loading = false;
					vm.formControl.stateLoading = false;

					//$uibModalInstance.dismiss(pError);
					$log.error('Inicializar ERROR.-', pError);
				}
			}

		}
	};

	return module;

})();