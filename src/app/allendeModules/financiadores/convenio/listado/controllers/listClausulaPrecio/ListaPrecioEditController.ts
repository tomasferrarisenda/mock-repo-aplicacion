/**
 * @author:			Pedro Ferrer
 * @description:	ListaPrecioEdit
 * @type:			Controller
 **/
export default (function(){
	const module = { init : (ngModule: any) => {} };

	module.init = function (module) {

		module.controller('ListaPrecioEditController', ListaPrecioEditController);

		ListaPrecioEditController.$inject = ['Logger', '$state', '$scope', 'ModalService', 'User', '$stateParams', 
		'ConvenioDataService', 'PrefacturableDataService', 'ConvenioLogicService', '$q'];

		function ListaPrecioEditController ($log, $state, $scope, ModalService, User, $stateParams,
			 ConvenioDataService, PrefacturableDataService, ConvenioLogicService, $q) {

			/* ------------------------------------------------ LOG ------------------------------------------------ */

			$log = $log.getInstance('ListaPrecioEditController');
			
			/* ----------------------------------------- API Y VARIABLESES ----------------------------------------- */

			var vm = this;
			vm.today = new Date();
			
			vm.title = {
				name : '',
				icon : ''
			};

			vm.data = {
				listaPrecioEdit : '',
				tipoPrefacturables : '',
				guardoLista : false,
				archivoImportado : '',
				archivoDevuelto : '',
				selectorVisible : false,
				convenioEdit : ''
			};

			vm.filter = {
				codigoMutual : '',
				vigenciaDesde : '',
				vigenciaHasta : '',
				tipoEstadoConvenioElegido : '',
				tipoPrefacturableElegido : '',
				nombre : '',
				descripcion : ''
			};

			vm.formControl = {		
				volver : volver,
				guardar : guardar,
				editarPrefacturable : editarPrefacturable,
				borrarPrefacturable : borrarPrefacturable,
				limpiarLista : limpiarLista,
				selectorImportacion : selectorImportacion,
				exportarExcel : exportarExcel,
				exportarPdf : exportarPdf,
				loading : false
			};

			$scope.$on('uploadDone', function(event, data) {
				onUploadDone(data);
			});

			vm.listaPrecio = {
				Id : null,
				NombreLista : '',
				DescripcionLista :'',
				NombreTipoPrefacturableDeLaLista : ''
			};

			/* ------------------------------------------- IMPLEMENTACIÓN ------------------------------------------- */

			/* FORMULARIO */
			function volver(){
				$state.go('financiadores.convenios.edit',
				{
					convenioEdit : vm.data.convenioEdit,
					esNuevo : false,
					vigenciaDesde : vm.filter.vigenciaDesde,
					vigenciaHasta : vm.filter.vigenciaHasta,
					estadoConvenio : vm.filter.tipoEstadoConvenioElegido,
					tabAIr : 'financiadores.convenios.edit.listaPrecio'
				});
			}

			function guardar(isValid){
				if(isValid){
					vm.data.listaPrecioEdit.Nombre = vm.filter.nombre;
					vm.data.listaPrecioEdit.Descripcion = vm.filter.descripcion;
					vm.data.listaPrecioEdit.IdTipoPrefacturable = vm.filter.tipoPrefacturableElegido ? vm.filter.tipoPrefacturableElegido.Id : 0;
					vm.data.listaPrecioEdit.NombreTipoPrefacturable = vm.filter.tipoPrefacturableElegido ? vm.filter.tipoPrefacturableElegido.Nombre : 'Todos';

					ConvenioDataService.GuardarListaPreciosConvenio(vm.data.listaPrecioEdit)
					.then(function (result) {
						if (result.IsOk === false) {
							ModalService.warning("Verifique por favor. " + result.Message);
						}
						else {
							vm.data.listaPrecioEdit.Id = result.Entidad.Id;
							vm.listaPrecio.Id = result.Entidad.Id;
							vm.listaPrecio.NombreLista = result.Entidad.Nombre;
							vm.listaPrecio.DescripcionLista = result.Entidad.Descripcion;
							vm.listaPrecio.NombreTipoPrefacturableDeLaLista = result.Entidad.NombreTipoPrefacturable;

							var esNuevo = true;
							for (var i = vm.data.convenioEdit.ListasPrecios.Rows.length - 1; i >= 0; i--) {
								if(vm.data.convenioEdit.ListasPrecios.Rows[i].Id == vm.listaPrecio.Id){
									vm.data.convenioEdit.ListasPrecios.Rows[i] = vm.listaPrecio;
									esNuevo = false;
									break;
								}
							}
							if(esNuevo)
								vm.data.convenioEdit.ListasPrecios.Rows.push(vm.listaPrecio);

							ModalService.success("La lista ha sido guardada.");
							volver();
						}
					})
					.catch(function (pError) {
						ModalService.error("Error en el servidor.", pError.message);
					});
				}
			}

			function editarPrefacturable(item, indice){
				ConvenioLogicService.editarItemListaPrecio(item, vm.filter.tipoPrefacturableElegido ? vm.filter.tipoPrefacturableElegido.Id : null)
				.then(function(prefacturable){
					if(item){ // Edicion
						vm.data.listaPrecioEdit.Items[indice] = prefacturable;
					}
					else{ //Nuevo
						vm.data.listaPrecioEdit.Items.push(prefacturable);
					}
				});
			}

			function borrarPrefacturable($index){
				vm.data.listaPrecioEdit.Items.splice($index,1);
			}

			function limpiarLista(){
				if(vm.data.listaPrecioEdit.Items.length > 0){
					ModalService.confirm("¿Confirma la eliminación de todos los ítems de la lista?",
					function(pResult) {
						if (pResult) {
							vm.data.listaPrecioEdit.Items = [];
							ModalService.success("Se han eliminado todos los ítems.");
						}
					});
				}
				else{
					ModalService.warning("La lista de ítems está vacía.");
				}
			}

			function selectorImportacion(){
				vm.data.selectorVisible = !vm.data.selectorVisible;
			}

			function onUploadDone(data){
				vm.data.listaPrecioEdit.Items = data.Items;
				if(data.Items.some(element => !element.CodigoPrefacturable || element.Importe <= 0)){
					ModalService.warning("Por favor verifique. Algunos items importados no son correctos.");
				}
				else {
					ModalService.success("La importación ha finalizado.");
				}
			}

			function exportarExcel(){
				ConvenioDataService.ExportarExcel(vm.data.listaPrecioEdit.Id);
			}

			function exportarPdf(){
				ConvenioDataService.ExportarPdf(vm.data.listaPrecioEdit.Id);
			}

			/* ---------------------------------------------- ACTIVATE ---------------------------------------------- */
			activate();

			function activate () {

				if(!$stateParams.convenioEdit){
					volver();
					return;
				}
				vm.formControl.loading = true;
				vm.data.convenioEdit = $stateParams.convenioEdit;

				obtenerListaPrecioDto().then(function(listaPrecioEdit){
					vm.data.listaPrecioEdit = listaPrecioEdit;
					vm.filter.nombre = vm.data.listaPrecioEdit.Nombre;
					vm.filter.descripcion = vm.data.listaPrecioEdit.Descripcion;
					vm.filter.codigoMutual = vm.data.listaPrecioEdit.CodigoFinanciador;
					vm.filter.vigenciaDesde = $stateParams.vigenciaDesde;
					vm.filter.vigenciaHasta = $stateParams.vigenciaHasta;
					vm.filter.tipoEstadoConvenioElegido = $stateParams.estadoConvenio;
					vm.filter.observaciones = vm.data.listaPrecioEdit.Observaciones;

					vm.title.name = vm.data.listaPrecioEdit.Id > 0 ? 'Editar lista de precios #'+ vm.data.listaPrecioEdit.Id : 'Nueva lista de precio';
					vm.title.icon = vm.data.listaPrecioEdit.Id > 0 ? 'EDIT' : 'NEW2';

					PrefacturableDataService.getAllTipoPrefacturable()
					.then(function(tiposPrefacturable){
						vm.data.tipoPrefacturables = tiposPrefacturable;
						for (var i = vm.data.tipoPrefacturables.length - 1; i >= 0; i--){
							if (vm.data.tipoPrefacturables[i].Id == vm.data.listaPrecioEdit.IdTipoPrefacturable){
								vm.filter.tipoPrefacturableElegido = vm.data.tipoPrefacturables[i];
								break;
							}
						}
						vm.formControl.loading = false;
					});
				});
			}

			function obtenerListaPrecioDto(){
				var def = $q.defer();
				if($stateParams.idListaEdit){
					ConvenioDataService.ObtenerListaPrecioDto($stateParams.idListaEdit)
					.then(function(listaEdit){
						def.resolve(listaEdit);
					});
				}
				else{
					ConvenioDataService.ObtenerNuevaListaPrecioDelConvenioDtoParaEdicion(vm.data.convenioEdit.Id)
					.then(function(listaEdit){
						def.resolve(listaEdit);
					});
				}
				return def.promise;
			}
		}
	};

	return module;
})();