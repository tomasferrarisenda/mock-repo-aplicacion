/**
 * @author:			Pedro Ferrer
 * @description:	ListaDimensionableEditTplController
 * @type:			Controller
 **/
import * as angular from 'angular';

export default (function () {
    const module = { init: (ngModule: any) => { } };

    module.init = function (module) {

        module.controller('ListaDimensionableEditTplController', ListaDimensionableEditTplController);

		ListaDimensionableEditTplController.$inject = ['Logger', '$state', 'ModalService', 'condicion', '$q', 'ConvenioDataService', '$uibModalInstance', '$scope', 'orderByFilter', '$filter', 
			'idFinanciador', 'idConvenio', 'TIPO_OPERABLE', 'idDimension'];

		function ListaDimensionableEditTplController($log, $state, ModalService, condicion, $q, ConvenioDataService, $uibModalInstance, $scope, orderByFilter, $filter, 
			idFinanciador, idConvenio, TIPO_OPERABLE, idDimension) {

            /* ------------------------------------------------ LOG ------------------------------------------------ */
            $log = $log.getInstance('ListaDimensionableEditTplController');
            /* ----------------------------------------- API Y VARIABLESES ----------------------------------------- */

            var vm = this;

            vm.title = {
                name: '',
                icon: '',
            };

            vm.paginacion = {
                currentPage: 0,
                pageSize: 0,
                totalItems: 0,
                pageChanged: getPage,
                getPage: getPage
            };

            vm.data = {
                listas: null,
                condicion: condicion,
                valorDto: null,
                tiposLista: ''
            };

            vm.filter = {
                codigo: '',
                nombre: '',
                descripcion: '',
                listas: '',
                listaElegida: ''
            };

            vm.formControl = {
                cancel: cancel,
                guardar: guardar,
                listaSeleccion: listaSeleccion
            };

            /* ------------------------------------------- IMPLEMENTACIÓN ------------------------------------------- */

            /* FORMULARIO */
            function cancel() {
                $uibModalInstance.dismiss('close');
            }

            function guardar() {
                for (var j = 0; j < vm.data.listas.length; j++) {
                    if (vm.data.listas[j].Seleccionado) {
                        var nuevoValorDto = angular.copy(vm.data.valorDto)
                        completarValorDto(nuevoValorDto, vm.data.listas[j]);
                        nuevoValorDto.Id = vm.data.condicion.Valores && vm.data.condicion.Valores[0] ? vm.data.condicion.Valores[0].Id : 0;
                        vm.data.condicion.Valores = [];
                        vm.data.condicion.Valores.push(nuevoValorDto);
                        break;
                    }
                }
                ConvenioDataService.ObtenerCondicionConValoresFormateados(vm.data.condicion).then(function (condicionFormateada) {
                    $uibModalInstance.close(condicionFormateada);
                });
            }

            function completarValorDto(nuevoValorDto, lista) {
                nuevoValorDto.IdValor = lista.Id;
                nuevoValorDto.Nombre = lista.Nombre;
                nuevoValorDto.IdTipoOperable = TIPO_OPERABLE.LISTA_PREFACTURABLE;
                nuevoValorDto.IdTipoValor = lista.IdTipoLista;
            }

            function listaSeleccion(lista, vieneDeDobleClick) {
                vm.data.listas.forEach(element => {
                    element.Seleccionado = false;
                });
                lista.Seleccionado = true;
                if (vieneDeDobleClick) {
                    guardar();
                }
            }

            function getPage() {
                var begin = ((vm.paginacion.currentPage - 1) * vm.paginacion.pageSize);
                var end = begin + vm.paginacion.pageSize;
                validar();
                
                if (vm.filter.listaElegida) {
                    vm.filter.listas = $filter('filter')
                        (vm.data.listas, {
                            Id: vm.filter.codigo,
                            Nombre: vm.filter.nombre,
                            Descripcion: vm.filter.descripcion,
                            IdTipoLista: vm.filter.listaElegida.Id
                        });
                }
                else {
                    vm.filter.listas = $filter('filter')
                        (vm.data.listas, {
                            Id: vm.filter.codigo,
                            Nombre: vm.filter.nombre,
                            Descripcion: vm.filter.descripcion
                        });
                }

                vm.paginacion.totalItems = vm.filter.listas.length;
                vm.filter.listas = vm.filter.listas.slice(begin, end);
            }

            function validar() {
                vm.filter.codigo = vm.filter.codigo === null ? '' : vm.filter.codigo;
                vm.filter.nombre = vm.filter.nombre === null ? '' : vm.filter.nombre;
                vm.filter.descripcion = vm.filter.descripcion === null ? '' : vm.filter.descripcion;
            }
            /* ---------------------------------------------- ACTIVATE ---------------------------------------------- */

            activate();

            function activate() {
                vm.title.name = 'Seleccionar Lista de Facturación';
                vm.title.icon = 'EDIT';
                vm.data.condicion = condicion;

                obtenerListas().then(function (listas) {
                    vm.data.listas = listas;

                    //Recorrido y seteo de Descripcion a '' para que funcionse el filtro de getPage()
                    vm.data.listas.forEach(lista => {
                        if(!lista.Descripcion)
                            lista.Descripcion = '';
                    });

                    if (condicion.Valores) {
                        for (var i = 0; i < condicion.Valores.length; i++) {
                            for (var j = 0; j < vm.data.listas.length; j++) {
                                if (condicion.Valores[i].IdValor == vm.data.listas[j].Id) {
                                    vm.data.listas[j].Seleccionado = true;
                                    break;
                                }
                            }
                        }
                    }

                    ConvenioDataService.TipoListaPrefacturablesObtenerTodos().then(function (tiposLista) {
                        vm.data.tiposLista = tiposLista;
                    });

                    vm.formControl.error = false;
                    vm.formControl.loading = false;
                    vm.paginacion.currentPage = 1;
                    vm.paginacion.pageSize = 10;
                    getPage();
                });

                ConvenioDataService.ObtenerNuevoValorCondicionEditDto().then(function (valorDto) {
                    vm.data.valorDto = valorDto;
                });
            }

            function obtenerListas() {
				var def = $q.defer();
				let idTipoPrefacturable = 0
				switch (idDimension) {
					case 7: // CODIGO DE NOMENCLADOR
						idTipoPrefacturable = 1;
						break;
					case 12: // MEDICAMENTO
						idTipoPrefacturable = 2;
						break;
					case 13: // DESCARTABLE
						idTipoPrefacturable = 3;
						break;
				}
                ConvenioDataService.ObtenerListasPrefacturablesPorTipo(idFinanciador, idConvenio, idTipoPrefacturable)
                    .then(function (listas) {
                        def.resolve(listas);
                    });
                return def.promise;
            }
        }
    };

    return module;
})();