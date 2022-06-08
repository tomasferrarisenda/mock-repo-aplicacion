/**
 * @author:			Pedro Ferrer
 * @description:	Cuentas Por Defecto
 * @type:			Controller
 **/
import { IProfesionalesDataService } from '../../services';

export default (function () {
	const module = { init: (ngModule: any) => { } };

	module.init = function (module) {

		module.controller('SegurosTplController', SegurosTplController);

		SegurosTplController.$inject = ['Logger', '$state', 'ModalService', 'DateUtils',
			'ProfesionalesDataService', '$scope', '$uibModalInstance', 'idSeguroEdit', '$q', '$stateParams', 'idProfesionalEdit'];

		function SegurosTplController($log, $state, ModalService, DateUtils,
			ProfesionalesDataService: IProfesionalesDataService, $scope, $uibModalInstance, idSeguroEdit, $q, $stateParams, idProfesionalEdit) {

			/* ------------------------------------------------ LOG ------------------------------------------------ */
			$log = $log.getInstance('SegurosTplController');
			/* ----------------------------------------- API Y VARIABLESES ----------------------------------------- */

			var vm = this;
			vm.today = new Date();

			vm.title = {
				name: '',
				icon: ''
			};

			vm.data = {
				seguroEdit: '',
				companias: [],
				nombreCompania: ''
			};

			vm.filter = {
				fechadesdeMin: '',
				fechaDesde: '',
				fechaHasta: '',
				idCompania: '',
				numeroPoliza: '',
				montoAsegurado: '',
				prima: '',
				companiaSeguro: {
					Id: 0,
					Nombre: ''
				},
				startDate : new Date('1900-01-01'),
				changeFechaDesde: changeFechaDesde
			};

			vm.formControl = {
				cancel: cancel,
				guardar: guardar,
				limpiarDatos: limpiarDatos,	

			};

			/* ------------------------------------------- IMPLEMENTACIÓN ------------------------------------------- */


			function changeFechaDesde() {
				setTimeout(() => {
					vm.filter.fechadesdeMin = vm.filter.fechaDesde;
					vm.filter.fechadesdeMin.setDate(vm.filter.fechaDesde.getDate() - 1);
						
				});
			
			}

			function guardar(isValid) {
				vm.data.seguroEdit.IdProfesional = idProfesionalEdit;
				vm.data.seguroEdit.IdCompaniaSeguro = vm.filter.companiaSeguro.Id //vm.filter.idCompania;
				vm.data.seguroEdit.NumeroPoliza = vm.filter.numeroPoliza;
				vm.data.seguroEdit.MontoAsegurado = vm.filter.montoAsegurado;
				vm.data.seguroEdit.Prima = vm.filter.prima;
				vm.data.seguroEdit.Desde = DateUtils.parseToBe(vm.filter.fechaDesde);
				vm.data.seguroEdit.Hasta = DateUtils.parseToBe(vm.filter.fechaHasta);
				ProfesionalesDataService.SeguroGuardar(vm.data.seguroEdit)
					.then(function (result) {
						if (result.IsOk === false) {
							ModalService.warning("Verifique por favor. " + result.Message);
						}
						else {
							$uibModalInstance.close(result);
							ModalService.success("Se ha guardado el seguro.");
						}
					});
			}

			function cancel() {
				$uibModalInstance.dismiss('close');
			}

			/* ---------------------------------------------- ACTIVATE ---------------------------------------------- */

			activate();

			function activate() {

				vm.title.icon = idSeguroEdit === null ? 'NEW2' : 'EDIT';
				vm.title.name = idSeguroEdit === null ? 'Nuevo Seguro' : 'Editar Seguro';

				obtenerSeguroDto().then(function (seguroEdit) {
					vm.data.seguroEdit = seguroEdit;

					vm.filter.numeroPoliza = vm.data.seguroEdit.NumeroPoliza;
					vm.filter.montoAsegurado = vm.data.seguroEdit.MontoAsegurado;
					vm.filter.prima = vm.data.seguroEdit.Prima;
					if (vm.data.seguroEdit.TieneDesde) vm.filter.fechaDesde = DateUtils.parseToFe(vm.data.seguroEdit.Desde);
					if (vm.data.seguroEdit.TieneHasta) vm.filter.fechaHasta = DateUtils.parseToFe(vm.data.seguroEdit.Hasta);

					// ProfesionalesDataService.CompaniasObtenerTodos().then(function (companias) {
					// 	vm.data.companias = companias;
					// 	if (vm.data.seguroEdit.IdCompaniaSeguro !== 0) vm.filter.idCompania = vm.data.seguroEdit.IdCompaniaSeguro;
					// });

					 ProfesionalesDataService.CompaniasObtenerTodos().then(function (resultadoCompanias) {
					 	vm.data.companias = resultadoCompanias;
						if (vm.data.seguroEdit.IdCompaniaSeguro !== 0) {
							vm.data.companias.forEach(compania => {
								if (compania.Id === vm.data.seguroEdit.IdCompaniaSeguro) {
									vm.filter.companiaSeguro = compania ;
								}
							});
						}

					 });


				});
			}

			function limpiarDatos(){
				vm.filter.companiaSeguro = {};
				vm.filter.companiaSeguro.Id = 0
				vm.filter.companiaSeguro.Nombre = ''
			}
		

			function obtenerSeguroDto() {
				var def = $q.defer();
				if (idSeguroEdit) {
					ProfesionalesDataService.SeguroObtenerPorId(idSeguroEdit)
						.then(function (seguroDto) {
							def.resolve(seguroDto);
						});
				}
				else {
					ProfesionalesDataService.SeguroObtenerNuevo()
						.then(function (seguroDto) {
							def.resolve(seguroDto);
						});
				}
				return def.promise;
			}
		}
	};

	return module;
})();