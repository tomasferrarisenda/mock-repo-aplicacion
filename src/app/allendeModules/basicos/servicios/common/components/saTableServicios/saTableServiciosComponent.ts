/**
 * @author:			Pablo Pautasso
 * @description:	directiva para tabla de turnos disponibles con posbilidad de asignar
 * @type:			Directive
 **/
import * as angular from 'angular';

import saTableServiciosTemplate = require('../saTableServicios/saTableServiciosTemplate.html');

export default (function () {
    'use strict';

    const module = { init: (ngModule: any) => { } };

    module.init = function (module) {

        module.component('saTableServicios', {
            template: saTableServiciosTemplate,
            bindings: {
                data: '=',
                tableClass: '<?',
                rowSelected: '&?',
                clickRowFunc: '&?'
            },
            controller: TableServiciosController,
            controllerAs: 'vm'
        });

        TableServiciosController.$inject = ['$q', 'Logger'];

        function TableServiciosController($q, $log) {
            
            /* ------------------------------------------------ LOG ------------------------------------------------ */

            $log = $log.getInstance('saTurnosPorPaciente');
            $log.debug('ON.-');

            /* ------------------------------------------ API Y VARIABLES ------------------------------------------ */

            var vm = this;
            vm.today = new Date();

            /* Component Events */
            vm.$onInit = activate;
            // vm.$onChanges = updateComponent;

            vm.rowClick = rowClick;

            /* ---------------------------------------------- SUPPORT ----------------------------------------------- */

            function rowClick(row) {

                cleanSelectedRows();
                row.selected = true;

                vm.clickRowFunc({
                    pObject: row
                });
            }


            function cleanSelectedRows() {

                angular.forEach(vm.data, function (row) {

                    row.selected = false;

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