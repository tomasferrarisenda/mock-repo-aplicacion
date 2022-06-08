/**
 * @author 			emansilla
 * @description 	description
 */
import * as angular from 'angular';
export default (function () {
    'use strict';

    const module = { init: (ngModule: any) => { } };

    module.init = function (ngModule) {

        ngModule.controller('ModalConfirmSaveController', ModalConfirmSaveController);

        // Inyección de Dependencia
        ModalConfirmSaveController.$inject = ['Logger', '$uibModalInstance', 'TextoPregunta'];

        // Constructor del Controller
        function ModalConfirmSaveController($log, $uibModalInstance, TextoPregunta) {

            /* ------------------------------------------------ LOG ------------------------------------------------ */

            $log = $log.getInstance('ModalConfirmSaveController');
            // $log.debug('ON.-');

            /* ------------------------------------------ API Y VARIABLES ------------------------------------------ */

            var vm = this;
    
            vm.formData = {
                texto: ''
            };

            vm.formControl = {
                error: true,
                loading: false,
                textBody: TextoPregunta,
                guardar: guardar,
                noguardar: noguardar,
                cancelar: cancel
                // validarOk: validarOk,
                // cancel: cancel
            };

            /* ------------------------------------------- IMPLEMENTACIÓN ------------------------------------------- */

            function guardar() {
                $uibModalInstance.close(true);
            }

            function noguardar() {
                $uibModalInstance.close(false);
            }


            function cancel() {
                $uibModalInstance.dismiss("cancelar modal");
            }

            /* --------------------------------------------- ACTIVATE --------------------------------------------- */

            activate();

            function activate() {
                // initOptions();				
            }
        }
    };

    return module;

})();