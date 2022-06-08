/**
 * @author:			Pedro Ferrer
 * @description:	ListaPrecioEditTpl
 * @type:			Controller
 **/
import { ISupportDataService } from '../../../../../support/basic/services';

export default (function(){
	const module = { init : (ngModule: any) => {} };

	module.init = function (module) {

		module.controller('ItemListaPrecioEditTplController', ItemListaPrecioEditTplController);

		ItemListaPrecioEditTplController.$inject = ['Logger', '$state', 'ModalService', 'item', 'idTipoPrefacturable', '$uibModalInstance', '$q',
			'ConvenioDataService', 'SupportDataService', '$scope'];

		function ItemListaPrecioEditTplController ($log, $state, ModalService, item, idTipoPrefacturable, $uibModalInstance, $q,
			ConvenioDataService, SupportDataService: ISupportDataService, $scope) {

			/* ------------------------------------------------ LOG ------------------------------------------------ */

			$log = $log.getInstance('ItemListaPrecioEditTplController');
			/* ----------------------------------------- API Y VARIABLESES ----------------------------------------- */

			var vm = this;
			vm.today = new Date();
			
			vm.title = {
				name : '',
				icon : ''
			};

			vm.data = {
				itemPrefacturable : '',
				prefacturableEditar : '',
				initTipo : {Id:''},
				edicionTipo : false,
				filtrarPrefacturable : {}
			};

			vm.filter = {
				importe : 0
			};

			vm.formControl = {
				guardar : guardar,
				cancelar : cancelar
			};

			vm.itemDevolucion = { //TODO : Obtener un item vacio ItemListaPrecioConvenioListDto desde backEnd
				Id : null,
				Codigo : '',
				Nombre : '',
				NombreTipoPrefacturable: '',
				Importe : ''
			};

			/* ------------------------------------------- IMPLEMENTACIÓN ------------------------------------------- */

			/* FORMULARIO */
			function guardar(){
				vm.data.itemPrefacturable.IdTipoPrefacturable = vm.data.prefacturableEditar.IdTipo;
				vm.data.itemPrefacturable.Importe = vm.filter.importe;
				vm.data.itemPrefacturable.IdPrefacturable = vm.data.prefacturableEditar.Id;
				vm.data.itemPrefacturable.CodigoPrefacturable = vm.data.prefacturableEditar.Codigo;
				vm.data.itemPrefacturable.NombrePrefacturable = vm.data.prefacturableEditar.Nombre;
				vm.data.itemPrefacturable.NombreTipoPrefacturable = vm.data.prefacturableEditar.NombreTipo;
				$uibModalInstance.close(vm.data.itemPrefacturable);
			}

			$scope.$watch(function() {
				return vm.filter.importe;
			}, function() {
				if(vm.filter.importe===null)
					vm.filter.importe = 0;
			});


			function cancelar(){
				$uibModalInstance.dismiss('close');
			}
			/* ---------------------------------------------- ACTIVATE ---------------------------------------------- */

			activate();

			function activate () {
				var filtrarPrefacturable : any = {};
				vm.data.initTipo.Id = idTipoPrefacturable;
				vm.data.edicionTipo = idTipoPrefacturable ? true : false;

				vm.title.name = item === null ? 'Nuevo item' : 'Editar item';
				vm.title.icon = item === null ? 'NEW2' : 'EDIT';

				obtenerItemListaDto().then(function(itemDto){
					vm.data.itemPrefacturable = itemDto;
					vm.filter.importe = vm.data.itemPrefacturable.Importe;

					if (vm.data.itemPrefacturable.CodigoPrefacturable && vm.data.itemPrefacturable.IdTipoPrefacturable){
						filtrarPrefacturable.CodigoDesde = vm.data.itemPrefacturable.CodigoPrefacturable;
						filtrarPrefacturable.CodigoHasta = vm.data.itemPrefacturable.CodigoPrefacturable;
						filtrarPrefacturable.IdTipoPrefacturable = vm.data.itemPrefacturable.IdTipoPrefacturable;

						SupportDataService.ObtenerPrefacturablePorFiltro(filtrarPrefacturable)
						.then(function(prefacturable){
							vm.data.prefacturableEditar = prefacturable[0];
							vm.data.initTipo.Id = vm.data.prefacturableEditar.IdTipoPrefacturable;
						});
					}
				});
			}

			function obtenerItemListaDto(){
				var def = $q.defer();
				if(item){
					def.resolve(item);
				}
				else{
					ConvenioDataService.ObtenerNuevoItemListaPreciosConvenioDtoParaEdicion()
					.then(function(itemLista){
						def.resolve(itemLista);
					});
				}
				return def.promise;
			}
		}
	};

	return module;
})();