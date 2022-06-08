/**
 * @author:			Pablo Pautasso
 * @description:	directiva para tabla de turnos disponibles con posbilidad de asignar
 * @type:			Directive
 **/
import * as angular from 'angular';

import saTablaTurnosView = require('../templates/sa-tabla-turnos-asignacion-multiple.tpl.html');

export default (function () {
    'use strict';

    const module = { init: (ngModule: any) => { } };

    module.init = function (module) {

        module.directive('saTablaTurnosAsignacionMultipleDirective', saTablaTurnosAsignacionMultipleDirective);

        saTablaTurnosAsignacionMultipleDirective.$inject = ['$log', '$filter', '$timeout', 'moment', 'AlertaService', 'AsignacionTurnoLogicService',
    'AsignacionTurnoModalService'];

        function saTablaTurnosAsignacionMultipleDirective($log, $filter, $timeout, moment, AlertaService, AsignacionTurnoLogicService, 
            AsignacionTurnoModalService) {
            return {
                restrict: 'E',
                replace: true,
                scope: {
                    data: '=',
                    titulogrid: '@?',
                    multiselect: '<?',
                    //boton otorgar
                    minRows: '<?',
                    extraColumn: '=?',
                    btnOtorgar: '&?',
                    btnOtorgarText: '@?',
                    duracionturno: '=?',
                    tableClass: '<?',
                    rowSelected: '&?',
                    criterios: '=?'
                },
                template: saTablaTurnosView,
                link: function (scope, element, attrs) {
                    scope.sinDatos = 'Sin datos';

                    scope.btnClick = btnClick;
                    scope.rowClick = rowClick;

                    scope.multiPaciente = false;
                    scope.ifMultiPaciente = ifMultiPaciente;

                    //scope.tableClass = (angular.isUndefined(scope.tableClass)) ? false : true;
                    scope.minRows = (angular.isUndefined(scope.minRows)) ? 5 : scope.minRows;
                    scope.checkCriterios = checkCriterios;

                    scope.$watch(function () {
                        return scope.data;
                    }, function (pNewVal, oldValue) {
                            $log.debug('watch scope.data newval', pNewVal);
                            scope.data = pNewVal;
                            if (scope.data) {
                                if(scope.data.length !== 0){
                                    scope.multiPaciente = ifMultiPaciente(scope.data);
                                    $log.debug('scope.MultiPaciente',scope.multiPaciente);
                                }
                            }
                    });


                    function ifMultiPaciente(data) {
                        
                        var _idPrimerPaciente = data[0].Criterios[0].IdPaciente;
                        var _ret = false;
                        angular.forEach(data, function (turno) {
                            angular.forEach(turno.Criterios, function (criterio) {  
                                if(criterio.IdPaciente !== _idPrimerPaciente) _ret = true;
                            })
                        });
                        return _ret;
                    }

                    scope.$watch(function () {
                        return scope.duracionturno;
                    }, function (pNewVal) {
                        $log.debug('duracion turno', pNewVal);
                        scope.duracionturno = pNewVal;
                    });


                    function btnClick() {
                        var currentSelection = getSelectedRows();
                        scope.btnOtorgar({
                            pObject: currentSelection
                        });
                    }

                    function rowClick(row) {


                        $log.debug('row selected', row);
                        // $log.debug('criterio selected', criterio);

                        //consulto si esta activado el multiselect y de ahi decido

                        if (scope.multiselect) {

                            if (row.DuracionIndividualRegla !== 0) {

                                row.selected = true;

                                $log.debug('tengo duracion de turno');

                                //check si hay otro tipo de recurso seleccionado
                                if (isOtroRecursoSeleccionado(row)) {
                                    cleanSelectedRowsNoMultiSelect(row);

                                }

                                //check si hay turnos ya seleccionados del mismo recurso ent limpio
                                if (checkIfTurnosMismoRecurso(row)) {

                                    cleanSelectedRows();
                                }
                                //llamo a la funcion recursiva
                                checkTurnosDuracionRecursive(row);
                                
                                //ya tengo seleccionados los turnos pero vuelvo a preguntar si hay algun error
                                if (checkIfTurnosMultiplesError(row)) {
                                    cleanSelectedRows();
                                    AlertaService.NewWarning("Alerta",
                                        "El turno seleccionado no cumple con requisitos minimos de duracion");
                                }

                            } else {
                                cleanSelectedRowsNoMultiSelect(row);
                                row.selected = (row.selected) ? false : true;
                            }
                        } else {
                            cleanSelectedRowsNoMultiSelect(row);
                            row.selected = (row.selected) ? false : true;

                        }

                        scope.rowSelected({
                            pObject: row
                        });

                    }


                    function checkCriterios() {

                        var _ret = false;
                        if (scope.criterios.length > 1) {
                            var _criterioPacienteId = angular.copy(scope.criterios[0].IdPaciente);
                            angular.forEach(scope.criterios, function (criterio) {
                                //tengo distintos pacientes en los criterios de busqueda
                                if(criterio.IdPaciente !== _criterioPacienteId) _ret = true;
                            })
                        }
                        return _ret;
                    }


                    /* -------------------------------------- SUPPORT METHODS --------------------------------------- */

                    function checkIfTurnosMultiplesError(turno) {

                        var ret = false;
                        //obtengo los turnos del recurso del turno seleccionado
                        var turnosPorRecursoClick = getTurnosPorRecurso(turno);
                        if (getDuracionTotalTurnosPorRecursoSelected(turnosPorRecursoClick) < turno.DuracionIndividualRegla) {
                            ret = true;
                        }
                        return ret;
                    }

                    function cleanSelectedRows() {
                        angular.forEach(scope.data, function (row) {
                            row.selected = false;
                        });
                    }

                    function cleanSelectedRowsNoMultiSelect(turnoRow) {
                        angular.forEach(scope.data, function (row) {
                            if (turnoRow.IdRow !== row.IdRow)
                                row.selected = false;
                        });
                    }

                    function getSelectedRows() {

                        var selectedRows: Array<any> = [];
                        angular.forEach(scope.data, function (row) {
                            if (row.selected) selectedRows.push(row);
                        });
                        return selectedRows;
                    }

                    function isOtroRecursoSeleccionado(turnoSeleccionado) {

                        var ret = false;
                        var selectedRows = getSelectedRows();
                        angular.forEach(selectedRows, function (turno, key) {
                            if (turno.IdRecurso !== turnoSeleccionado.IdRecurso)
                                ret = true;
                        });
                        return ret;
                    }


                    function duracionDeTurnosSeleccionados() {

                        var duracion = 0;
                        var turnoSelected = getSelectedRows();
                        angular.forEach(turnoSelected, function (_turno) {
                            if (_turno.selected) {
                                duracion = duracion + _turno.Duracion;
                            }
                        });

                        return duracion;
                    }

                    function getSiguienteTurno(_turno) {

                        var turnoSiguiente = '';
                        var turnosPorRecursoClick = getTurnosPorRecurso(_turno);
                        var _horaTurnoSiguiente = moment(_turno.Hora, 'HH:mm').
                            add(_turno.Duracion, 'minutes');

                        angular.forEach(turnosPorRecursoClick, function (Turno, key) {
                            if (Turno.Hora === _horaTurnoSiguiente.format('HH:mm') && _turno.IdRecurso === Turno.IdRecurso && _turno.IdSucursal === Turno.IdSucursal) {
                                turnoSiguiente = angular.copy(Turno);
                            }
                        });

                        return turnoSiguiente;
                    }

                    function checkTurnosDuracionRecursive(turno) {
                        if (turno !== '') {

                            selectTurno(turno.IdRow);
                            var turnosPorRecursoClick = getTurnosPorRecurso(turno);
                            // $log.debug('getTurnosPorRecurso', turnosPorRecursoClick);
                            if (getDuracionTotalTurnosPorRecursoSelected(turnosPorRecursoClick) < turno.DuracionIndividualRegla) {
                                checkTurnosDuracionRecursive(getSiguienteTurno(turno));
                            } else return;

                        } else return;

                    }

                    function getTurnosPorRecurso(turnoClicked) {

                        var turnosPorRecurso: Array<any> = [];
                        angular.forEach(scope.data, function (turno, key) {
                            if (turno.IdRecurso === turnoClicked.IdRecurso) {
                                turnosPorRecurso.push(turno);
                            }
                        });
                        return turnosPorRecurso;
                    }

                    function getDuracionTotalTurnosPorRecursoSelected(turnosPorRecursoColleccion) {

                        var duracionTotal = 0;
                        angular.forEach(turnosPorRecursoColleccion, function (turno, key) {
                            if (turno.selected)
                                duracionTotal = duracionTotal + turno.Duracion;
                        });
                        return duracionTotal;
                    }


                    function selectTurno(idRow) {

                        angular.forEach(scope.data, function (row, key) {
                            if (row.IdRow === idRow) row.selected = true;
                        });
                    }

                    function checkIfTurnosMismoRecurso(turno) {

                        var ret = false;
                        angular.forEach(scope.data, function (_turno, key) {
                            if (turno.IdRecurso === _turno.IdRecurso) {
                                ret = true;
                            }
                        });
                        return ret;
                    }

                    /*--------------------------------------------- MENU CONTEXTUAL --------------------------------------*/
                    scope.menuOptions = [
                        // NEW IMPLEMENTATION
                        {
                            text: "Requerimientos",
                            displayed: function (modelValue) {

                                rowClick(modelValue.row);
                                return (true);
                            },
                            click: ($itemScope, $event, modelValue, text, $li) => {
                                
                                $log.debug('click row', $itemScope);
                                //tengo un turno del dia seleccionado, continuo entonces con ese
                                // let dataTurnoRequerimiento = getDataTurnoParaOtorgar(turnos);
                                AsignacionTurnoModalService.openRequerimientosMasPreparaciones(null, getSelectedRows(), $itemScope.row.Criterios[0]);
                                   
                            }
                        },

                    ];

                    /* -------------------------------------------- END --------------------------------------------- */

                }
            };
        }
    };

    return module;
})();