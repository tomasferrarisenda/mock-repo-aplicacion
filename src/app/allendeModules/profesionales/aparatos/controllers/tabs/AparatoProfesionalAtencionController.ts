/**
 * @author:			Pedro Ferrer
 * @description:	Participaciones
 * @type:			Controller
 **/
import { IProfesionalesDataService } from '../../../../profesionales';
import ContratableDataService from '../../../common/services/ContratableDataService';

export default (function () {
    const module = { init: (ngModule: any) => { } };

    module.init = function (module) {

        module.controller('AparatoProfesionalAtencionController', AparatoProfesionalAtencionController);

        AparatoProfesionalAtencionController.$inject = ['Logger', '$state', 'ModalService', '$scope', 'AparatosDataService', 'AparatoLogicService',
            'ProfesionalesDataService', 'ContratableLogicService', 'ContratableDataService', 'AlertaService'];

        function AparatoProfesionalAtencionController($log, $state, ModalService, $scope, AparatosDataService, AparatoLogicService,
            ProfesionalesDataService: IProfesionalesDataService, ContratableLogicService, ContratableDataService, AlertaService) {

            /* ------------------------------------------------ LOG ------------------------------------------------ */

            $log = $log.getInstance('AparatoProfesionalAtencionController');
            /* ----------------------------------------- API Y VARIABLESES ----------------------------------------- */

            var vm = this;

            vm.data = {
                aparato: {}
            };

            vm.filter = {

            }

            vm.formControl = {
                loading: false,
                editarProfesionalesQueLoAtienden: editarProfesionalesQueLoAtienden,
                borrarProfesionalesQueLoAtienden: borrarProfesionalesQueLoAtienden

            };

            /* ------------------------------------------- IMPLEMENTACIÓN ------------------------------------------- */

            //Editar Profesional //
            function editarProfesionalesQueLoAtienden() {

                if ($scope.$parent.vm.data.aparato.Id > 0) { //Aparato.Id es Mayor que 0//Edicion
                    ContratableDataService.ObtenerServicioPorRecurso($scope.$parent.vm.data.aparato.Id, $scope.$parent.vm.data.aparato.IdTipoRecurso)
                        .then(function (servicios) { // Recibo una Lista de Servicios
                            if (servicios.length > 0) {
                                ContratableLogicService.searchProfesionalAtencion(servicios[0].Id).then(function (profesionalAtencion) {
                                    
                                    //Para que No se carguen 2 (dos) Profesionales identicos -- find (es un array buscar del filtro)
                                    // si en la lista de Profesionales Que lo Atienden, Encuentra (find) el IdProfesional igual (===) profesionalAtencion.IdProfesional, entonces mostrar error.
                                    if (vm.data.aparato.ProfesionalesQueLoAtienden.Rows.find(profesional => profesional.IdProfesional === profesionalAtencion.IdProfesional)) {
                                        //Ventana de alerta para mostrar al Usuario
                                        AlertaService.NewWarning("El profesional ya se encuentra asignado.");
                                        return;
                                    }
                                    vm.data.aparato.ProfesionalesQueLoAtienden.Rows.push(profesionalAtencion)
                                });
                            }
                            else {
                                AlertaService.NewWarning("El aparato no tiene servico asignado.");
                                return;
                            }
                        })
                }

                else {
                    //Abrir Modal de Advertencia cuando no tienen ningun Servicio Asignado
                    ModalService.warning("Verifique por favor. " + " -Debe guardar el aparato y asignarlo a un servicio desde 'Centro De Servicios - Prestaciones'");
                }
            }

            //Borrar Profesional //
            function borrarProfesionalesQueLoAtienden(index) {
                vm.data.aparato.ProfesionalesQueLoAtienden.Rows.splice(index, 1);
            }

            /* FORMULARIO */

            /* ---------------------------------------------- ACTIVATE ---------------------------------------------- */

            activate();
            function activate() {
                vm.formControl.loading = true;
                vm.data.aparato = $scope.$parent.vm.data.aparato;

                if ($scope.$parent.vm.data.aparato === "") {
                    $state.go('profesionales.aparatos.edit.general');
                    return;
                }

                vm.formControl.loading = false;
            }

        }
    };

    return module;
})();