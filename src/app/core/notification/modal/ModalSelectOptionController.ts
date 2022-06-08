/**
* @author:         Pablo pautasso  
* @description:    Controller para manejar modal de selector de opciones    
* @type:           Controller
**/
import * as angular from 'angular';

export default (function () {
    'use strict';

    const module = { init: (ngModule: any) => { } };

    module.init = function (ngModule) {

        ngModule.controller('ModalSelectOptionController', ModalSelectOptionController);

        ModalSelectOptionController.$inject = [
            '$location', 'Logger', '$q', '$filter', '$uibModalInstance',
            'ModalService', 'Options', 'Title'

        ];

        function ModalSelectOptionController(
            $location, $log, $q, $filter, $uibModalInstance,
            ModalService, Options, Title
        ) {

            /* ------------------------------------------------ LOG ------------------------------------------------ */

            $log = $log.getInstance('ModalSelectOptionController');
            $log.debug('ON.-');

            /* ----------------------------------------- API Y VARIABLESES ----------------------------------------- */

            var vm = this;
            vm.today = new Date();

            vm.title = {
                page: 'Seleccione una opción para continuar',
                icon: 'QUESTION'
            };

            vm.data = {
                options: Options,
            };

            vm.selectOption = selectOption;

            vm.formControl = {
                loading: false,
                error: true,
                cancel: cancel
            };
            /* ------------------------------------------- IMPLEMENTACIÓN ------------------------------------------- */

            /* FORMULARIO */
            function cancel() {
                $uibModalInstance.dismiss(false);
            }

            function selectOption(option) {

                if(!option.disabled)
                $uibModalInstance.close(option);
                
            }

            /* -------------------------------------------- ACTIVATE ------------------------------------------------ */


            activate();

            function activate() {
                $log.debug('INICIANLIZANDO OK', vm.data.options);
                if(Title){
                    vm.title.page = angular.copy(Title);
                }

            };


        }
    };

    return module;

})();