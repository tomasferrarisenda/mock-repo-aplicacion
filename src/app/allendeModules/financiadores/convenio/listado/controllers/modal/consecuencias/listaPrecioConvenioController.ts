/**
 * @author:			Pedro Ferrer
 * @description:	listaPrecioConvenioController
 * @type:			Controller
 **/
import * as angular from 'angular';

export default (function(){
	const module = { init : (ngModule: any) => {} };

	module.init = function (module) {

		module.controller('listaPrecioConvenioController', listaPrecioConvenioController);

		listaPrecioConvenioController.$inject = ['Logger', 'ConvenioDataService', '$uibModalInstance', 'idConvenio', 'consecuencia', 'PrefacturableDataService', '$q', '$filter'];

		function listaPrecioConvenioController ($log, ConvenioDataService, $uibModalInstance, idConvenio, consecuencia, PrefacturableDataService, $q, $filter) {

			/* ------------------------------------------------ LOG ------------------------------------------------ */

			$log = $log.getInstance('listaPrecioConvenioController');
			/* ----------------------------------------- API Y VARIABLESES ----------------------------------------- */

			var vm = this;

			vm.title = {
				name : '',
				icon : '',
			};

			vm.paginacion = {
				currentPage: 0,
					pageSize: 0,
					totalItems: 0,
					pageChanged : getPage,
					getPage: getPage
			};

			vm.data = {
				listasPrecio : null,
				consecuencia : consecuencia,
				tipoPrefacturables : null,
				valorDto : null
			};

			vm.filter = {
				nombre : '',
				tipoPrefacturableElegido : null,
				idTipoPrefacturableElegido : null,
				listasPrecio : '',
				puedeGuardar : false
			};

			vm.formControl = {
				cancel : cancel,
				guardar : guardar,
				listasPrecioSeleccion : listasPrecioSeleccion
			};

			/* ------------------------------------------- IMPLEMENTACIÓN ------------------------------------------- */

			/* FORMULARIO */
			function cancel () {
				$uibModalInstance.dismiss('close');
			}

			function guardar () {
				for (var i = 0; i < vm.data.listasPrecio.length; i++) {
					if(vm.data.listasPrecio[i].Seleccionado){
						vm.data.consecuencia.Valores[0].IdValor = vm.data.listasPrecio[i].Id;
						vm.data.consecuencia.Valores[0].Nombre = vm.data.listasPrecio[i].Nombre;
						vm.data.consecuencia.ValorString = vm.data.listasPrecio[i].Nombre;
						break;
					}
				}
				$uibModalInstance.close(vm.data.consecuencia);
			}

			function completarValorDto(nuevoValorDto, elemento){
				nuevoValorDto.IdValor = elemento.Id;
				nuevoValorDto.Nombre = elemento.Nombre;
			}

			function listasPrecioSeleccion(listasPrecio){
				vm.data.listasPrecio.forEach(lista => {
					lista.Seleccionado = false;
				});
				listasPrecio.Seleccionado = true;
				vm.filter.puedeGuardar = true;
			}

			function getPage () {
				var begin = ((vm.paginacion.currentPage - 1) * vm.paginacion.pageSize);
				var end = begin + vm.paginacion.pageSize;
				validar();
				vm.filter.listasPrecio =$filter('filter')
					(vm.data.listasPrecio,{
						Nombre : vm.filter.nombre,
						IdTipoPrefacturable : vm.filter.idTipoPrefacturableElegido
					});
				vm.paginacion.totalItems = vm.filter.listasPrecio.length;
				vm.filter.listasPrecio = vm.filter.listasPrecio.slice(begin, end);
			}

			function validar(){
				vm.filter.nombre = vm.filter.nombre === null ? '' : vm.filter.nombre;
				vm.filter.idTipoPrefacturableElegido = vm.filter.tipoPrefacturableElegido ? vm.filter.tipoPrefacturableElegido.Id : ''
			}

			/* ---------------------------------------------- ACTIVATE ---------------------------------------------- */

			activate();

			function activate () {
				vm.title.name = 'Seleccionar Lista de Precio del Convenio';
				vm.title.icon = 'NEW2';
				vm.data.consecuencia = consecuencia;

				obtenerListasPrecio().then(function(listasPrecio){
					vm.data.listasPrecio = listasPrecio;
					if(vm.data.consecuencia.Valores[0].IdValor !== 0){
						for (var i = 0; i < vm.data.listasPrecio.length; i++) {
							if(vm.data.listasPrecio[i].Id === vm.data.consecuencia.Valores[0].IdValor){
								vm.data.listasPrecio[i].Seleccionado = true;
								vm.filter.puedeGuardar = true;
								break;
							}
						}
					}

					PrefacturableDataService.getAllTipoPrefacturable()
					.then(function(tiposPrefacturable){
						vm.data.tipoPrefacturables = tiposPrefacturable;
					});

					vm.formControl.error = false;
					vm.formControl.loading = false;
					vm.paginacion.currentPage = 1;
 					vm.paginacion.pageSize = 10;
					getPage();
				});
			}

			// TODO: llevar lógica a servicio. @pferrer
			function obtenerListasPrecio(){
				var def = $q.defer();
				ConvenioDataService.ObtenerListasDePreciosConvenioParaSeleccion(idConvenio)
				.then(function(listaPrecios){
					def.resolve(listaPrecios);
				});
				return def.promise;
			}
		}
	};

	return module;
})();