/**
 * @author:			Pedro Ferrer
 * @description:	ListaPrecioEditTpl
 * @type:			Controller
 **/
import { ISupportDataService } from '../../../../../support/basic/services';

export default (function(){
	const module = { init : (ngModule: any) => {} };

	module.init = function (module) {

		module.controller('ItemListaFacturacionMutualEditController', ItemListaFacturacionMutualEditController);

		ItemListaFacturacionMutualEditController.$inject = ['Logger', '$state', 'ModalService', 'item', 'idTipoPrefacturable', '$uibModalInstance', '$q',
			'MutualGestionDataService', 'SupportDataService', '$scope'];

		function ItemListaFacturacionMutualEditController ($log, $state, ModalService, item, idTipoPrefacturable, $uibModalInstance, $q,
			MutualGestionDataService, SupportDataService: ISupportDataService, $scope) {

			/* ------------------------------------------------ LOG ------------------------------------------------ */

			$log = $log.getInstance('ItemListaFacturacionMutualEditController');
			/* ----------------------------------------- API Y VARIABLESES ----------------------------------------- */

			var vm = this;
			vm.today = new Date();
			
			vm.title = {
				name : '',
				icon : ''
			};

			vm.data = {
				itemPrefacturable : '',
				prefacturableElegido : '',
				initTipo : {Id:''},
				edicionTipo : false,
				filtrarPrefacturable : {}
			};

			vm.formControl = {
				guardar : guardar,
				cancel : cancel
			};

			vm.itemDevolucion = {
				Id : null,
				Codigo : '',
				Nombre : '',
				NombreTipoPrefacturable: ''
			};

			/* ------------------------------------------- IMPLEMENTACIÓN ------------------------------------------- */

			/* FORMULARIO */
			function guardar(){
                vm.data.itemPrefacturable.IdPrefacturable = vm.data.prefacturableElegido.Id;
				vm.data.itemPrefacturable.Codigo = vm.data.prefacturableElegido.Codigo;
				vm.data.itemPrefacturable.Nombre = vm.data.prefacturableElegido.Nombre;
				vm.data.itemPrefacturable.IdTipoPrefacturable = vm.data.prefacturableElegido.IdTipo;
				vm.data.itemPrefacturable.NombreTipoPrefacturable = vm.data.prefacturableElegido.NombreTipo;
				$uibModalInstance.close(vm.data.itemPrefacturable);
			}

			function cancel(){
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

					if (vm.data.itemPrefacturable.Codigo && vm.data.itemPrefacturable.IdTipoPrefacturable){
						filtrarPrefacturable.CodigoDesde = vm.data.itemPrefacturable.Codigo;
						filtrarPrefacturable.CodigoHasta = vm.data.itemPrefacturable.Codigo;
						filtrarPrefacturable.IdTipoPrefacturable = vm.data.itemPrefacturable.IdTipoPrefacturable;

						SupportDataService.ObtenerPrefacturablePorFiltro(filtrarPrefacturable)
						.then(function(prefacturable){
							vm.data.prefacturableElegido = prefacturable[0];
							vm.data.initTipo.Id = vm.data.prefacturableElegido.IdTipoPrefacturable;
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
					MutualGestionDataService.ObtenerNuevoItemEdit()
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