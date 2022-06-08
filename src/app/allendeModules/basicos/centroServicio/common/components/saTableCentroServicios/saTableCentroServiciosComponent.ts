/**
 * @author:			Pablo Pautasso
 * @description:	directiva para tabla de turnos disponibles con posbilidad de asignar
 * @type:			Directive
 **/
import saTableCentroServiciosTemplate = require('../saTableCentroServicios/saTableCentroServiciosComponent.html');
import * as angular from 'angular';


export default (function () {
	'use strict';

	const module = { init: (ngModule: any) => { } };

	module.init = function (module) {

		module.component('saTableCentroServicios', {
			template: saTableCentroServiciosTemplate,
			bindings: {
				data: '=',
				tableClass: '<?',
				rowSelected: '&?',
				columns: '<',
				clickRowFunc: '&?',
				colorRow: '<?',
				titulogrid: '@?',
				btnClick: '&?',
				tooltipBtn: '@?',
				deleteClick: '&?',
				changeActivo: '&?'
			},
			controller: TableCentroServiciosController,
			controllerAs: 'vm'
		});

		TableCentroServiciosController.$inject = ['$q', 'Logger'];

		function TableCentroServiciosController($q, $log) {
			/* ------------------------------------------------ LOG ------------------------------------------------ */

			$log = $log.getInstance('saTableServiciosController');
			$log.debug('ON.-');

			/* ------------------------------------------ API Y VARIABLES ------------------------------------------ */

			var vm = this;
			vm.today = new Date();


			/* Component Events */
			vm.$onInit = activate;
			// vm.$onChanges = updateComponent;

			vm.rowClick = rowClick;
			vm.getCol = getCol;
			// vm.deleteClick = deleteClick;
			// vm.btnClick = btnClick;


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



			function getCol(servicioStatus) {

				switch (servicioStatus) {
					case true:
						return 'color-verde';
					case false:
						return 'color-rojo';
					default:
						return '';
				}
			};

			// function deleteClick(row) {

			// }

			/* ---------------------------------------------- ACTIVATE ---------------------------------------------- */


			function activate() {
				$log.debug('$onInit');

			}

		}
	};

	return module;
})();