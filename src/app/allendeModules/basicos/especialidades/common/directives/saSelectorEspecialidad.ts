/**
 * @author:			ppautasso
 * @description:	Selector de Servicios Medicos
 * @type:			Directive
 **/

import * as angular from 'angular';

import saSelectorEspecialidadView = require('../templates/sa-selector-especialidad.tpl.html');

export default (function () {
    'use strict';



    const module = { init: (ngModule: any) => { } };

    module.init = function (module) {

        // REUTILIZABLE: [DIRECTIVE] Buscador general de @ServiciosMedicos. Se usa con [ng-model].
        module.directive('saSelectorEspecialidad', saSelectorEspecialidad);

        saSelectorEspecialidad.$inject = ['$log', '$q', '$filter', 'EspecialidadMedicaDataService',
            'SelectorService', 'AlertaService'
        ];

        function saSelectorEspecialidad($log, $q, $filter, EspecialidadMedicaDataService,
            SelectorService: ISelectorService, AlertaService) {
            return {
                restrict: 'E',
                require: '?ngModel',
                scope: {

                    ngDisabled: '=?',
                    clean: '&?',
                    ifLabel: '=?',
                    idsucursal: '=?',
                    idservicio: '=?'
                },
                template: saSelectorEspecialidadView,
                link: link
            };

            function link(scope, attrs, element, controller) {

                if (!controller) return;

                scope.idservicio = (angular.isUndefined(attrs.idservicio)) ? false : scope.idservicio;
                scope.idsucursal = (angular.isUndefined(attrs.idsucursal)) ? false : scope.idsucursal;
                scope.ifLabel = (angular.isUndefined(scope.ifLabel)) ? true : scope.ifLabel;
                scope.ifTooltip = scope.ifLabel ? false : true;

                if (!scope.idservicio || !scope.idsucursal) {

                    EspecialidadMedicaDataService.getAll()
                        .then(function (pResults) {
                            $log.debug('especialidades medicas  getall', pResults);
                            scope.data.especialidades = pResults;

                        }, function (pError) {

                            $log.error('Error Servicios', pError);

                        });
                }
                /* ----------------------------------------- API Y VARIABLES ----------------------------------------- */

                scope.data = {
                    especialidadSeleccionado: null,
                    especialidades: []
                };

                scope.filter = {
                    nombreEspecialidad: ''
                };

                scope.required = (attrs.ngRequired || attrs.required) ? true : false;
                scope.disabled = (angular.isUndefined(scope.ngDisabled)) ? false : scope.ngDisabled;
                //scope.loading = (angular.isUndefined(attrs.loading)) ? false : scope.loading;

                scope.buscar = buscar;
                scope.updateModel = updateModel;
                scope.limpiarDatos = limpiarDatos;
                scope.formControl = {
                    buscando: false
                };

                /* ----------------------------------------- IMPLEMENTACION ----------------------------------------- */


                function updateModel(especialidad) {
                    controller.$setViewValue(especialidad);
                }

                // scope.$watch('loading', function(newValue) {
                // 	updateDirective(newValue);
                // });

                scope.$watch(function () {
                    return controller.$modelValue;
                }, function (newValue) {

                    updateDirective(newValue);

                });

                function updateDirective(pValue) {


                    scope.data.especialidadSeleccionada = controller.$modelValue;
                    if (controller.$modelValue != null) {
                        scope.filter.nombreEspecialidad = pValue.Nombre;
                    } else {
                        scope.filter.nombreEspecialidad = '';
                    }

                }

                function buscar() {

                    scope.formControl.buscando = true;

                    if (scope.idsucursal && scope.idservicio) {

                        //busco con sucursal y servicio, ahora veo si son todas las sucursales o alguna especifica

                       
                        
                        //consulto si la sucursal es 'TODAS' = 0
                        if (scope.idsucursal.Id === 0) {

                            //  SelectorService.newSelector('lg', "Especialidades", 'EspecialidadMedicaDataService',
                            //     'obtenerTodasDeUnServicio', 'Nombre', false, scope.idservicio)

                            SelectorService.newSelector({
                                nombreSelector: 'Especialidades',
                                dataService: 'EspecialidadMedicaDataService',
                                method: 'obtenerTodasDeUnServicio',
                                isTableBackEnd: false,
                                columns: ['Nombre'],
                                objCriterio: scope.idservicio
                            })

                                .then(function (result) {

                                    scope.formControl.buscando = false;
                                    if (result) {

                                        $log.debug('obteniendo especialidades por servicio y sucursal', result);
                                        setDatosObtenidos(result);

                                    } else {
                                        AlertaService.NewWarning("Alerta", "No hay datos para seleccionar");
                                    }
                                }, function (pError) {
                                    scope.formControl.buscando = false;
                                    $log.error('error...', pError);
                                    limpiarDatos();
                                    return;
                                });
                        }

                        else {

                            var _obj = {
                                IdSucursal: scope.idsucursal.Id,
                                IdServicio: scope.idservicio.Id
                            }

                            // SelectorService.newSelector('lg', "Especialidades", 'EspecialidadMedicaDataService',
                            //     'obtenerTodasDeUnServicioEnSucursal', 'Nombre', false, _obj)

                            SelectorService.newSelector({
                                nombreSelector: 'Especialidades',
                                dataService: 'EspecialidadMedicaDataService',
                                method: 'obtenerTodasDeUnServicioEnSucursal',
                                isTableBackEnd: false,
                                columns: ['Nombre'],
                                objCriterio: _obj
                            })

                                .then(function (result) {

                                    scope.formControl.buscando = false;
                                    if (result) {

                                        $log.debug('obteniendo especialidades por servicio y sucursal', result);
                                        setDatosObtenidos(result);

                                    } else {
                                        AlertaService.NewWarning("Alerta", "No hay datos para seleccionar");
                                    }
                                }, function (pError) {
                                    scope.formControl.buscando = false;
                                    $log.error('error...', pError);
                                    limpiarDatos();
                                    return;
                                });
                        }


                    } else {

                        //levanto selector con todas las especialidades
                        // SelectorService.newSelector('lg', "Especialidades", 'EspecialidadMedicaDataService',
                        //     'getAll', 'Nombre', false, undefined)

                        SelectorService.newSelector({
                            nombreSelector: 'Especialidades',
                            dataService: 'EspecialidadMedicaDataService',
                            method: 'getAll',
                            isTableBackEnd: false,
                            columns: ['Nombre']
                        })

                            .then(function (result) {

                                scope.formControl.buscando = false;
                                if (result) {

                                    $log.debug('obteniendo especialidades getAll', result);
                                    setDatosObtenidos(result);

                                } else {
                                    AlertaService.NewWarning("Alerta", "No hay datos para seleccionar");
                                }
                            }, function (pError) {
                                scope.formControl.buscando = false;
                                $log.error('error...', pError);
                                limpiarDatos();
                                return;
                            });
                    }

                }

                function setDatosObtenidos(pDatos) {

                    scope.data.especialidadSeleccionada = pDatos;
                    if (pDatos != null) {
                        scope.filter.nombreEspecialidad = pDatos.Nombre;
                    }
                    updateModel(pDatos);

                }

                function buscarServicioYSucursal() {

                    if (scope.idsucursal && scope.idservicio) {

                        if (scope.idsucursal.Id === 0) {

                            scope.formControl.buscando = true;

                            EspecialidadMedicaDataService.obtenerTodasDeUnServicio(scope.idservicio)
                                .then(function (pResults) {

                                    scope.formControl.buscando = false;

                                    scope.data.especialidades = pResults;

                                }, function (pError) {
                                    scope.formControl.buscando = false;

                                    $log.error('Error Servicios', pError);

                                });

                        } else {

                            scope.formControl.buscando = true;

                            var _obj = {
                                IdSucursal: scope.idsucursal.Id,
                                IdServicio: scope.idservicio.Id
                            }
                            EspecialidadMedicaDataService.obtenerTodasDeUnServicioEnSucursal(_obj)
                                .then(function (pResults) {

                                    scope.formControl.buscando = false;

                                    scope.data.especialidades = pResults;

                                }, function (pError) {
                                    scope.formControl.buscando = false;

                                    $log.error('Error Servicios', pError);

                                });
                        }

                    }


                }


                function limpiarDatos() {
                    scope.data.especialidadSeleccionada = null;
                    scope.filter.nombreServicio = '';
                    updateModel(null);
                    //scope.clean();
                }

                scope.$watch(function () {
                    return scope.limpiar;
                }, function (newValue, oldValue) {
                    if (newValue) {
                        activate();
                        scope.limpiar = false;
                    }
                });


                scope.$watch(function () {
                    return scope.idservicio;
                }, function (newValue, oldValue, scope) {
                    if (newValue !== oldValue) {
                        if (scope.idsucursal) {
                            limpiarDatos();
                            buscarServicioYSucursal();
                        }
                    }
                });

                scope.$watch(function () {
                    return scope.idsucursal;
                }, function (newValue, oldValue, scope) {
                    if (newValue !== oldValue) {
                        if (scope.idservicio) {
                            limpiarDatos();
                            buscarServicioYSucursal();
                        }
                    }
                });

                scope.$watch(function () {
                    return scope.ngDisabled;
                }, function (pNewVal) {
                    scope.disabled = pNewVal;
                    if (scope.disabled)
                        limpiarDatos();
                });


                /* -------------------------------------------- ACTIVATE -------------------------------------------- */

                activate();

                function activate() {
                    //$log.debug('saSelectorEspecialidad ON');
                }
            }
        }
    };

    return module;
})();