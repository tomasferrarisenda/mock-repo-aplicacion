/**
 * @author:			Pablo Pautasso
 * @description:	modal controller para asignacion de turno nuevo
 * @type:			controller
 **/

import * as angular from 'angular';

export default (function () {
    'use strict';

    const module = { init: (ngModule: any) => { } };

    module.init = function (module) {

        module.controller('AsignacionTurnosVariosPacienteController', AsignacionTurnosVariosPacienteController);

        AsignacionTurnosVariosPacienteController.$inject = [
            '$location', 'Logger', '$q', '$filter', '$uibModalInstance', 'moment',
            'AlertaService',
            'TurnoDataService',
            'TurnosPorPaciente', 'CriterioBusquedaList', 'Pacientes'
        ];

        function AsignacionTurnosVariosPacienteController(
            $location, $log, $q, $filter, $uibModalInstance, moment,
            AlertaService,
            TurnoDataService,
            TurnosPorPaciente, CriterioBusquedaList, Pacientes

        ) {

            /* ------------------------------------------------ LOG ------------------------------------------------ */

            $log = $log.getInstance('AsignacionTurnosVariosPacienteController');
            $log.debug('ON.-');

            /* ----------------------------------------- API Y VARIABLESES ----------------------------------------- */

            var vm = this;
            vm.today = new Date();

            vm.title = {

            };

            vm.data = {
                turnosPorPaciente: TurnosPorPaciente,
                criterioBusquedaList: CriterioBusquedaList,
                pacientes: Pacientes,
                prestaciones: {}
            };

            vm.formData = {};

            vm.formControl = {

                loading: false,
                error: true,
                reloadPage: activate,
                ok: methodSave,
                cancel: cancel

            };

            /* ------------------------------------------- IMPLEMENTACIÓN ------------------------------------------- */

            /* FORMULARIO */

            function methodSave() {
                
                vm.formControl.loading = true;
                
                //Guardar turnos
                var _pilaLlamadasValidar: Array<any> = [];
                var _pilaTurnosOtorgar: Array<any> = [];

                $log.debug('obje para buscar', vm.data.nuevoTurnoAsignable, vm.data.nuevoMultipleTurnosAsignable);

                $log.debug('turno a otorgar', vm.data.pacientes, vm.data.turnosPorPaciente, vm.data.criterioBusquedaList);

                var _turnosPorPaciente = obtenerTurnosPorPaciente(vm.data.pacientes);

                $log.debug('_turnosPorPaciente', _turnosPorPaciente);

                //voy paciente por paciente armando los turnos
                angular.forEach(_turnosPorPaciente, function (paciente) {
                    
                    //como puedo tener varios turnos armo los grupos
                    angular.forEach(paciente, function (grupoTurnos) {


                        var _turnoAGuardar: any = {};

                        if (grupoTurnos.length > 1) {

                            $log.debug('turnos length > 1');

                            vm.data.nuevoMultipleTurnosAsignable.TurnosElegidosDto = angular.copy(grupoTurnos);
                            vm.data.nuevoMultipleTurnosAsignable.CriterioBusquedaDto = vm.data.criterioBusquedaList.find(x => x.Id === grupoTurnos[0].CriterioBusquedaId);

                            //seteamoos criterio busqueda en turno multiple
                            vm.data.nuevoMultipleTurnosAsignable.CriterioBusquedaDto.IdRecurso = angular.copy(grupoTurnos[0].IdRecurso);
                            vm.data.nuevoMultipleTurnosAsignable.CriterioBusquedaDto.IdSucursal = angular.copy(grupoTurnos[0].IdSucursal);
                            vm.data.nuevoMultipleTurnosAsignable.CriterioBusquedaDto.IdTipoRecurso = angular.copy(grupoTurnos[0].IdTipoRecurso);

                            //////finalizo para turno multiple
                            ///
                            //seteo duracioninvidual para cada turno
                            angular.forEach(vm.data.nuevoMultipleTurnosAsignable.TurnosElegidosDto, function (turno, key) {
                                turno.DuracionIndividual = angular.copy(turno.Duracion);
                            });

                            vm.data.nuevoMultipleTurnosAsignable.Observaciones = angular.copy(grupoTurnos[0].observacionTurno); 
                            vm.data.nuevoMultipleTurnosAsignable.Duracion = angular.copy(grupoTurnos[0].DuracionIndividualRegla);

                            _turnoAGuardar = angular.copy(vm.data.nuevoMultipleTurnosAsignable);

                            //section para fix sexopaciente y fecha
                            // _turnoAGuardar.CriterioBusquedaDto.SexoPaciente = _paciente.NombreTipoSexo.charAt(0);
                            
                            _pilaLlamadasValidar.push(TurnoDataService.validarAsignarTurnosMultiples(_turnoAGuardar));
                            _pilaTurnosOtorgar.push(_turnoAGuardar);


                        } else {

                            $log.debug('tengo un solo turno', vm.data.nuevoTurnoAsignable);

                            vm.data.nuevoTurnoAsignable.TurnoElegidoDto = angular.copy(grupoTurnos[0]);
                            vm.data.nuevoTurnoAsignable.TurnoElegidoDto.DuracionIndividual = angular.copy(grupoTurnos[0].Duracion);
                            vm.data.nuevoTurnoAsignable.CriterioBusquedaDto = vm.data.criterioBusquedaList.find(x => x.Id === grupoTurnos[0].CriterioBusquedaId);

                            vm.data.nuevoTurnoAsignable.Observaciones = angular.copy(grupoTurnos[0].observacionTurno);

                            vm.data.nuevoTurnoAsignable.CriterioBusquedaDto.IdRecurso = angular.copy(grupoTurnos[0].IdRecurso);
                            vm.data.nuevoTurnoAsignable.CriterioBusquedaDto.IdTipoRecurso = angular.copy(grupoTurnos[0].IdTipoRecurso);

                            _turnoAGuardar = angular.copy(vm.data.nuevoTurnoAsignable);

                            //section para fix sexopaciente y fecha
                            // _turnoAGuardar.CriterioBusquedaDto.SexoPaciente = _paciente.NombreTipoSexo.charAt(0);
                            _turnoAGuardar.TurnoElegidoDto.Fecha = angular.copy(moment(_turnoAGuardar.TurnoElegidoDto.Fecha)
                                .format("MM-DD-YYYY"));
                                                        
                            _pilaLlamadasValidar.push(TurnoDataService.validarAsignarTurno(_turnoAGuardar));
                            _pilaTurnosOtorgar.push(_turnoAGuardar);


                        }

                        $log.debug('Turno a guardar', _turnoAGuardar);

                    });

                });


                //Espero todas las llamadas del validar distintos turnos
                $q.all(_pilaLlamadasValidar)
                .then(function (pResult) {
                    
                    $log.debug('validar asignar turnos varios  -OK', pResult);
                    var _banderaOk = false;
                    var _llamadasOtorgar: Array<any> = [];

                    angular.forEach(pResult, function (result) {

                        if(result.IsOk !== true){
                            _banderaOk = true;
                        }
                    });

                    //si no tengo todos los validar Ok, no continuo
                    if (!_banderaOk){
                        
                        //recorro turnos a otorgar y hago la pila de llamadas
                        angular.forEach(_pilaTurnosOtorgar, function (turnoAGuardar) {

                            if (turnoAGuardar.TurnosElegidosDto){

                                _llamadasOtorgar.push(TurnoDataService.asignarTurnosMultiple(turnoAGuardar));

                            }else {
                                _llamadasOtorgar.push(TurnoDataService.asignarTurno(turnoAGuardar));
                            }
                           
                        });

                        //espero la pila de llamadas de otorgar turnos varios
                        $q.all(_llamadasOtorgar)
                        .then(function (pResultOtorgar) {

                            $log.debug('ASIGNAR turnos varios  -OK', pResultOtorgar);
                            vm.formControl.loading = false;
                            AlertaService.NewSuccess("Turnos Otorgados correctamente");
                            $uibModalInstance.close(true);

                        }, function (pErrorOtorgar) {

                            $log.error('validar asignar turnos varios -ERROR ', pErrorOtorgar);
                            vm.formControl.loading = false;

                        });

                    } else {
                        $log.error('ERROR EN VALIDAR ASIGNACION TURNOS ', pResult);
                        vm.formControl.loading = false;
                    }

                    

                }, function (pError) {
                    
                    $log.error('validar asignar turnos varios -ERROR ', pError);
                    vm.formControl.loading = false;

                });

                

            }

    
            function obtenerTurnosPorPaciente(_pacientesColection) {

                var _pacientes: Array<any> = [];

                angular.forEach(_pacientesColection, function (paciente) {

                    var turnosPorPaciente: Array<any> = [];

                    var _turnos: Array<any> = [];
                    angular.forEach(paciente.Turnos, function (_turnoColect) {

                        if (_turnos.length === 0) {
                            _turnos = paciente.Turnos.filter(x => x.IdGrupoTurno === _turnoColect.IdGrupoTurno);
                            turnosPorPaciente.push(_turnos);
                        }
                        else {
                            if (!_turnos.find(x => x.IdGrupoTurno === _turnoColect.IdGrupoTurno)) {
                                _turnos = [];
                                _turnos = paciente.Turnos.filter(x => x.IdGrupoTurno === _turnoColect.IdGrupoTurno);
                                turnosPorPaciente.push(_turnos);
                            }
                        }

                    });

                    _pacientes.push(turnosPorPaciente);
                });


                return _pacientes;

            }

            function cancel() {

                $uibModalInstance.dismiss('cancel');
            }

            function setearDatos() {
                angular.forEach(vm.data.pacientes, function (paciente) {

                    paciente.Turnos = [];
                    angular.forEach(vm.data.turnosPorPaciente, function (turno) {

                        if (paciente.Id === turno.IdPaciente) {
                            paciente.Turnos.push(turno);
                        }

                    });

                });
            }

            /* ---------------------------------------------- ACTIVATE ---------------------------------------------- */

            activate();

            function activate() {

                vm.formControl.loading = true;
                $log.debug('Inicializar ON.-', vm.data.turnosPorPaciente, vm.data.criterioBusquedaList, vm.data.pacientes);

                setearDatos();

                var _nuevoTurnoAsignable = TurnoDataService.obtenerNuevoTurnoAsignable();
                var _nuevosTurnosAsignables = TurnoDataService.obtenerNuevoMultipleTurnoAsignable();

                $q.all([
                    _nuevoTurnoAsignable,
                    _nuevosTurnosAsignables,
                ])
                    .then(successCallback, errorCallback);

                function successCallback(pResults) {

                    $log.debug('Inicializar OK. pResults-', pResults);

                    vm.data.nuevoTurnoAsignable = pResults[0];
                    vm.data.nuevoMultipleTurnosAsignable = pResults[1];


                }

                function errorCallback(pError) {
                    vm.formControl.loading = false;
                    $log.error('Inicializar ERROR.-', pError);
                    AlertaService.NewError("Error", pError.message);
                }


                vm.formControl.loading = false;


            }
        };

    }
    return module;
})();