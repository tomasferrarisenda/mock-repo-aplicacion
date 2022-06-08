/**
 * @author:			Pedro Ferrer
 * @description:	ListaFacturacionMutual
 * @type:			Controller
 **/
export default (function () {
	const module = { init: (ngModule: any) => { } };

	module.init = function (module) {

		module.controller('ListaEditFacturacionMutualController', ListaEditFacturacionMutualController);

		ListaEditFacturacionMutualController.$inject = ['Logger', '$state', '$scope', 'ModalService', '$stateParams',
			'MutualGestionDataService', 'MutualGestionLogicService', '$q', 'PrefacturableDataService'];

		function ListaEditFacturacionMutualController($log, $state, $scope, ModalService, $stateParams,
			MutualGestionDataService, MutualGestionLogicService, $q, PrefacturableDataService) {

			/* ------------------------------------------------ LOG ------------------------------------------------ */

			$log = $log.getInstance('ListaEditFacturacionMutualController');

			/* ----------------------------------------- API Y VARIABLESES ----------------------------------------- */

			var vm = this;

			vm.title = {
				name: '',
				icon: ''
			};

			vm.data = {
				tipoPrefacturables: '',
				listaFacturacionMutual: '',
				guardoLista: false,
				archivoImportado: '',
				archivoDevuelto: '',
				selectorVisible: false,
				listaFacturacionListDto : ''
			};

			vm.filter = {
				codigo: '',
				nombreCompleto: '',
				nombreCorto: '',
				nombreLista: '',
				descripcion: '',
				tipoPrefacturableElegido: ''
			};

			vm.formControl = {
				cancelar: cancelar,
				guardar: guardar,
				editarPrefacturable: editarPrefacturable,
				borrarPrefacturable: borrarPrefacturable,
				limpiarLista: limpiarLista,
				selectorImportacion: selectorImportacion,
				exportarExcel: exportarExcel,
				loading: false
			};

			/* ------------------------------------------- IMPLEMENTACIÓN ------------------------------------------- */

			/* FORMULARIO */
			function cancelar() {
				$state.go('financiadores.mutual.edit',
					{
						mutualEdit: $stateParams.mutualEdit,
						vieneDeListado : false,
						tabAIr : 'financiadores.mutual.edit.listaFacturacion'
					});
			}

			function guardar(isValid) {
				if (isValid) {
					vm.data.listaFacturacionMutual.Nombre = vm.filter.nombreLista;
					vm.data.listaFacturacionMutual.Descripcion = vm.filter.descripcion;
					vm.data.listaFacturacionMutual.IdTipoPrefacturableDeLaLista = vm.filter.tipoPrefacturableElegido ? vm.filter.tipoPrefacturableElegido.Id : 0;
					vm.data.listaFacturacionMutual.NombrePrefacturableDeLaLista = vm.filter.tipoPrefacturableElegido ? vm.filter.tipoPrefacturableElegido.Nombre : 'Todos';

					vm.data.listaFacturacionMutual.IdFinanciador = $stateParams.mutualEdit.Id;
					vm.data.listaFacturacionMutual.CodigoFinanciador = $stateParams.mutualEdit.Codigo;
					vm.data.listaFacturacionMutual.NombreFinanciador = $stateParams.mutualEdit.Nombre;

					MutualGestionDataService.GuardarListaFacturacionMutual(vm.data.listaFacturacionMutual)
						.then(function (result) {
							if (result.IsOk === false) {
								ModalService.warning("Verifique por favor. " + result.Message);
							}
							else {
								vm.data.listaFacturacionMutual.Id = result.IdEntidadValidada;
								MutualGestionDataService.ObtenerNuevoListasFacturacionMutualListDto().then(function (listaFacturacionListDto) {
									vm.data.listaFacturacionListDto = listaFacturacionListDto
									
									vm.data.listaFacturacionListDto.Id = vm.data.listaFacturacionMutual.Id;
									vm.data.listaFacturacionListDto.Nombre = vm.data.listaFacturacionMutual.Nombre;
									vm.data.listaFacturacionListDto.Descripcion = vm.data.listaFacturacionMutual.Descripcion;
									vm.data.listaFacturacionListDto.IdTipoPrefacturableDeLaLista = vm.data.listaFacturacionMutual.IdTipoPrefacturableDeLaLista;
									vm.data.listaFacturacionListDto.NombreTipoPrefacturableDeLaLista = vm.data.listaFacturacionMutual.NombrePrefacturableDeLaLista;
									vm.data.listaFacturacionListDto.IdFinanciador = vm.data.listaFacturacionMutual.IdFinanciador;
									
									var esNuevo = true;
									for (var i = $stateParams.mutualEdit.ListasMutual.Rows.length - 1; i >= 0; i--) {
										if ($stateParams.mutualEdit.ListasMutual.Rows[i].Id == vm.data.listaFacturacionListDto.Id) {
											$stateParams.mutualEdit.ListasMutual.Rows[i] = vm.data.listaFacturacionListDto;
											esNuevo = false;
											break;
										}
									}
									if (esNuevo)
										$stateParams.mutualEdit.ListasMutual.Rows.push(vm.data.listaFacturacionListDto);

									ModalService.success("La lista ha sido guardada.");
									cancelar();
								})
							}
						})
						.catch(function (pError) {
							ModalService.error("Error en el servidor.", pError.message);
						});
				}
			}

			function editarPrefacturable(item, indice) {
				MutualGestionLogicService.editarItemListaFacturacion(item, vm.filter.tipoPrefacturableElegido ? vm.filter.tipoPrefacturableElegido.Id : null)
					.then(function (prefacturable) {
						if (item) { // Edicion
							vm.data.listaFacturacionMutual.Items.Rows[indice] = prefacturable;
						}
						else { //Nuevo
							vm.data.listaFacturacionMutual.Items.Rows.push(prefacturable);
						}
					});
			}

			function borrarPrefacturable($index) {
				vm.data.listaFacturacionMutual.Items.Rows.splice($index, 1);
			}

			function limpiarLista() {
				if (vm.data.listaFacturacionMutual.Items.Rows.length > 0) {
					ModalService.confirm("¿Confirma la eliminación de todos los ítems de la lista?",
						function (pResult) {
							if (pResult) {
								vm.data.listaFacturacionMutual.Items.Rows = [];
								ModalService.success("Se han eliminado todos los ítems.");
							}
						});
				}
				else {
					ModalService.warning("La lista de ítems está vacía.");
				}
			}

			function selectorImportacion() {
				vm.data.selectorVisible = !vm.data.selectorVisible;
			}

			function onUploadDone(data) {
				vm.data.listaFacturacionMutual.Items = data.Items;
				if (data.Items.Rows.some(element => !element.Codigo)) {
					ModalService.warning("Por favor verifique. Algunos items importados no son correctos.");
				}
				else {
					ModalService.success("La importación ha finalizado.");
				}
			}

			function exportarExcel() {
				MutualGestionDataService.ExportarExcel(vm.data.listaFacturacionMutual.Id);
			}

			/* ---------------------------------------------- ACTIVATE ---------------------------------------------- */
			activate();

			function activate() {

				if (!$stateParams.mutualEdit) {
					cancelar();
					return;
				}
				vm.formControl.loading = true;

				obtenerListaFacturacionMutual().then(function (listaFacturacionMutual) {
					vm.data.listaFacturacionMutual = listaFacturacionMutual;

					vm.filter.codigo = $stateParams.mutualEdit.Codigo;
					vm.filter.nombreCompleto = $stateParams.mutualEdit.Nombre;
					vm.filter.nombreCorto = $stateParams.mutualEdit.NombreCorto;

					vm.filter.nombreLista = vm.data.listaFacturacionMutual.Nombre
					vm.filter.descripcion = vm.data.listaFacturacionMutual.Descripcion

					vm.title.name = vm.data.listaFacturacionMutual.Id > 0 ? 'Editar lista de facturación del financiador' : 'Nueva lista de facturación del financiador';
					vm.title.icon = vm.data.listaFacturacionMutual.Id > 0 ? 'EDIT' : 'NEW2';

					PrefacturableDataService.getAllTipoPrefacturable().then(function (tiposPrefacturable) {
						vm.data.tipoPrefacturables = tiposPrefacturable;
						for (var i = vm.data.tipoPrefacturables.length - 1; i >= 0; i--) {
							if (vm.data.tipoPrefacturables[i].Id == vm.data.listaFacturacionMutual.IdTipoPrefacturableDeLaLista) {
								vm.filter.tipoPrefacturableElegido = vm.data.tipoPrefacturables[i];
								break;
							}
						}
						vm.formControl.loading = false;
					});
				});

				$scope.$on('uploadDone', (event, data) => {
					onUploadDone(data);
				});
			}

			function obtenerListaFacturacionMutual() {
				var def = $q.defer();
				if ($stateParams.idListaEdit) {
					MutualGestionDataService.ObtenerListaFacturacionDtoParaEdicion($stateParams.idListaEdit)
						.then(function (listaEdit) {
							def.resolve(listaEdit);
						});
				}
				else {
					MutualGestionDataService.ObtenerNuevaListaDtoParaEdicion()
						.then(function (listaEdit) {
							def.resolve(listaEdit);
						});
				}
				return def.promise;
			}
		}
	};
	return module;
})();