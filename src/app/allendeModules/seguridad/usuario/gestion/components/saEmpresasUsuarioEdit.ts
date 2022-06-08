/**
 * @author:			Pablo Pautasso
 * @description:	directiva para tabla de turnos disponibles con posbilidad de asignar
 * @type:			Directive
 **/
import * as angular from 'angular';

import saEmpresasUsuarioEditTemplate = require('../components/sa-empresas-usuario-edit.tpl.html');

export default (function () {
    'use strict';

    const module = { init: (ngModule: any) => { } };

    module.init = function (module) {

        module.component('saEmpresasUsuarioEdit', {
            template: saEmpresasUsuarioEditTemplate,
            bindings: {
                data: '=',

            },
            controller: EmpresasUsuarioEditController,
            controllerAs: 'vm'
        });

        EmpresasUsuarioEditController.$inject = ['$q', 'Logger'];

        function EmpresasUsuarioEditController($q, $log
        ) {
            /* ------------------------------------------------ LOG ------------------------------------------------ */

            $log = $log.getInstance('EmpresasUsuarioEditController');
            $log.debug('ON.-');

            /* ------------------------------------------ API Y VARIABLES ------------------------------------------ */

            var vm = this;
            vm.today = new Date();

            /* Component Events */
            vm.$onInit = activate;
            // vm.$onChanges = updateComponent;

            vm.rowClick = rowClick;

            vm.formControl = {
                changeHabilitada: changeHabilitada,
                changePorDefecto: changePorDefecto
            }

            /* ---------------------------------------------- SUPPORT ----------------------------------------------- */

            function rowClick(row) {

            }

            function changeHabilitada(empresa) {

                if (!empresa.Habilitada) {
                    empresa.PorDefecto = false;
                }

            }

            function changePorDefecto(empresa) {

                $log.debug('$changePorDefecto', empresa);
                if(empresa.PorDefecto){
                    cleanPorDefecto();
                    empresa.PorDefecto = true;
                    empresa.Habilitada = true;

                }
            }

            function cleanPorDefecto() {
                angular.forEach(vm.data, function (empresa, key) {
                    empresa.PorDefecto = false;
                });
            }
            /* ---------------------------------------------- ACTIVATE ---------------------------------------------- */

            function activate() {
                $log.debug('$onInit');

            }

        }
    };

    return module;
})();