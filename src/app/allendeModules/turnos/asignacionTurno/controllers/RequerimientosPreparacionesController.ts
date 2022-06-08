/**
 * @author:			jdelmastro
 * @description:	Controller para visualizar la preparación y requerimientos de los criterios de busqueda de turnos actuales
 * @type:			Controller
 **/

import * as angular from 'angular';

export default (function () {
    const module = { init: (ngModule: any) => { } };

    module.init = function (module) {
        module.controller('RequerimientosPreparacionesController', RequerimientosPreparacionesController);

        RequerimientosPreparacionesController.$inject = [
            '$q',
            'Logger',
            'moment',
            'PrestacionGestionDataService',
            '$uibModalInstance',
            'DataTurnos',
            'Turnos',
            'CriterioBusqueda',
            'TurnoDataService'
        ];

        function RequerimientosPreparacionesController(
            $q,
            $log,
            moment,
            PrestacionGestionDataService,
            $uibModalInstance,
            DataTurnos,
            Turnos,
            CriterioBusqueda,
            TurnoDataService) {

            /* ------------------------------------------------ LOG ------------------------------------------------ */
            $log = $log.getInstance('RequerimientosPreparacionesController');

            /* ----------------------------------------- API Y VARIABLESES ----------------------------------------- */

            var vm = this;

            vm.title = {
                page: "Prepaciones y Requerimientos",
                icon: "LIST"
            };

            vm.data = {
                nuevoTurnoAsignable: {},
                nuevoMultipleTurnosAsignable: {},
                criterioBusqueda: CriterioBusqueda,
                dataTurnos: DataTurnos,
                turnos: Turnos,
                Preparaciones: []
            };

            vm.formControl = {
                //cancel: cancel,
                cerrar: cerrar,
                error: true,
                loading: false,
                copiarRequerimientos: copiarRequerimientos

                /*PROFESIONAL*/
                // buscarProfesionalEnter: buscarProfesionalEnter,
                // buscarProfesional: buscarProfesional,
                // buscarProfesionales: buscarProfesionales							
            };

            /* ------------------------------------------ IMPLEMENTACIÓN ------------------------------------------ */

            function cerrar() {
                $uibModalInstance.close("ok");
            }

            function copiarRequerimientos() {
                let copyText: any = document.getElementById("textrequerimientos");
                if (copyText) {
                    copyText.select();
                    document.execCommand("copy");
                }
            }

            /* ------------------------------ ACTIVATE ------------------------------ */

            activate();

            function activate() {
                vm.formControl.loading = true;

                var _nuevoTurnoAsignable = TurnoDataService.obtenerNuevoTurnoAsignable();
                var _nuevosTurnosAsignables = TurnoDataService.obtenerNuevoMultipleTurnoAsignable();

                $q.all([
                    _nuevoTurnoAsignable,
                    _nuevosTurnosAsignables,

                ]).then(function (pResults) {

                    vm.data.nuevoTurnoAsignable = pResults[0];
                    vm.data.nuevoMultipleTurnosAsignable = pResults[1];

                    $log.debug('activate', vm.data.dataTurnos, vm.data.turnos);
                    ObtenerPreparaciones(vm.data.criterioBusqueda.Prestaciones);
                    evaluarConvenio();

                }, function (pError) {
                    $log.error('Error activate', pError);
                });


            }

            function ObtenerPreparaciones(pListaIds) {

                PrestacionGestionDataService.obtenerPorIds(pListaIds).then(obtenerPreparacionesOk, obtenerPreparacionesError);

                function obtenerPreparacionesOk(resultados) {
                    $log.debug("Preparaciones obtenidas: ", resultados);
                    vm.data.Preparaciones = resultados;
                    vm.formControl.loading = true;
                }

                function obtenerPreparacionesError(pError) {
                    $uibModalInstance.dismiss(pError);
                    vm.formControl.loading = false;
                }
            }

            function evaluarConvenio() {

                vm.formControl.loading = true;

                var _turnoAGuardar: any = {};

                $log.debug('tengo un solo turno', vm.data.nuevoTurnoAsignable);

                vm.data.nuevoTurnoAsignable.TurnoElegidoDto = angular.copy(vm.data.turnos[0]);
                vm.data.nuevoTurnoAsignable.TurnoElegidoDto.DuracionIndividual = angular.copy(vm.data.turnos[0].Duracion);
                vm.data.nuevoTurnoAsignable.CriterioBusquedaDto = angular.copy(vm.data.criterioBusqueda);
                vm.data.nuevoTurnoAsignable.Observaciones = angular.copy(vm.data.observacionTurno);

                vm.data.nuevoTurnoAsignable.CriterioBusquedaDto.IdRecurso = angular.copy(vm.data.turnos[0].IdRecurso);
                vm.data.nuevoTurnoAsignable.CriterioBusquedaDto.IdTipoRecurso = angular.copy(vm.data.turnos[0].IdTipoRecurso);

                _turnoAGuardar = angular.copy(vm.data.nuevoTurnoAsignable);

                _turnoAGuardar.Email = "";
                _turnoAGuardar.Observaciones = "";

                _turnoAGuardar.TurnoElegidoDto.Duracion = 0;
                _turnoAGuardar.TurnoElegidoDto.DuracionIndividual = 0;

                //section para fix sexopaciente y fecha
                // _turnoAGuardar.CriterioBusquedaDto.SexoPaciente = "M";
                _turnoAGuardar.TurnoElegidoDto.Fecha = angular.copy(moment(_turnoAGuardar.TurnoElegidoDto.Fecha)
                    .format("MM-DD-YYYY"));
                //_turnoAGuardar.CriterioBusquedaDto.IdPlan = 1;
                // evaluarTurnoContraConvenio

                TurnoDataService.evaluarTurnoContraConvenio(_turnoAGuardar).then(evaluarOk);

                function evaluarOk(pResults) {
                    $log.debug('Resultado de evaluar el turno (Ok)', pResults);

                    vm.data.NormativasMutual = pResults.NormativasMutual;
                    vm.data.RequisitosAdministrativos = pResults.RequisitosAdministrativos;
                    vm.data.PrestacionesNoIncluidas = pResults.PrestacionesNoIncluidas;
                    vm.data.PrestacionesRequierenPresupuesto = pResults.PrestacionesRequierenPresupuesto;
                    vm.data.ImporteTotalCoseguro = pResults.ImporteTotalCoseguro;
                    vm.data.ImporteTotalParticular = pResults.ImporteTotalParticular;
                    vm.data.Autorizacion = pResults.Autorizacion;
                    vm.formControl.loading = false;
                }
            }

        }
    }

    return module;
})();