/**
 * @author:			Rodrigo Bassi
 * @description:	
 * @type:			Controller
 **/
import * as angular from 'angular';

export default (function () {
	'use strict';
	const module = { init : (ngModule: any) => {} };

	module.init = function (module) {

		module.controller('PrescripcionFacturacionController', PrescripcionFacturacionController);

		PrescripcionFacturacionController.$inject = ['Logger', '$state', '$uibModalInstance', 'Prescripcion',
		'GuardiaAdministracionDataService','AlertaService'];

		function PrescripcionFacturacionController ($log, $state, $uibModalInstance, Prescripcion, 
			GuardiaAdministracionDataService, AlertaService) {

			/* ------------------------------------------------ LOG ------------------------------------------------ */

			$log = $log.getInstance('PrescripcionFacturacionController');
			$log.debug('ON.-');
			
			/* ----------------------------------------- API Y VARIABLESES ----------------------------------------- */

			var vm = this;
			vm.today = new Date();
			
			vm.title = {
				name : $state.current.data.title,
				icon : $state.current.data.icon
			};

			vm.data = {
				prescripcion: Prescripcion,
				itemsfacturables:[],
				// destinos:[
				// {Id:1, Nombre:"Particular", color:"color-verde-turno"},
				// {Id:2, Nombre:"Obra Social", color:"color-celeste-turno"},
				// {Id:3, Nombre:"Documento a Cobrar", color:"color-rojo-turno"},
				// {Id:4, Nombre:"Reintegro", color:"color-warning"}
				// ]
				destinos:[],
				participanteConCuentas: {},
				cuentaElegida : null			
			};

			vm.formData = {
				destino:'',
				marcarTodos : false,
				btnDisabled : true,
				checkDisabled : false
			};


			vm.formControl = {		
				reloadPage : reloadPage,
				volver : volver,
				clickFila:clickFila,
				cambiaDestino:cambiaDestino,
				selectMarcarTodos:selectMarcarTodos,
				mostrarDisable:mostrarDisable,
				btnGuardarDisabled:btnGuardarDisabled,
				cambiaCuenta:cambiaCuenta,
				guardar : guardar

			};


			/* ------------------------------------------- IMPLEMENTACIÓN ------------------------------------------- */

			/* FORMULARIO */

			function inicializarVariables () {
			}
			
			function llenarForm () {
			}

			function reloadPage () {
				$uibModalInstance.close();
			}

			function volver () {
			$uibModalInstance.dismiss('cancel');
			}

			function clickFila(itemfacturable) {
				$log.debug('click en item facturable',itemfacturable);

				var todosSeleccionados = true;
				if (vm.data.prescripcion.Facturado == false){

					for (var i = 0; i < vm.data.itemsfacturables.length; i++) {
						if (vm.data.itemsfacturables[i].Id ==  itemfacturable.Id){
							if (vm.data.itemsfacturables[i].Seleccionado == true) {
								vm.data.itemsfacturables[i].Seleccionado = false;	
							}
							else {
								vm.data.itemsfacturables[i].Seleccionado = true;
							}
							
						}
						if (!vm.data.itemsfacturables[i].Seleccionado) {
							todosSeleccionados = false;
						}

					}
				}	
				else{
					todosSeleccionados = false;
				}



				vm.formData.marcarTodos = todosSeleccionados;
				mostrarDisable();
				
				// if (todosSeleccionados == true) {
				// 	vm.formData.marcarTodos = true;
				// }
				// else {
				// 	vm.formData.marcarTodos = false;
				// }

				// body...
			}

			function mostrarDisable() {
				$log.debug('Activar Desactivar Disable el Select');
				var alMenosUnSeleccionado = false;

				for (var i = 0; i < vm.data.itemsfacturables.length; i++) {
					if (vm.data.itemsfacturables[i].Seleccionado == true) {
						alMenosUnSeleccionado = true;
					}
				}

				vm.formData.mostrarDisable = alMenosUnSeleccionado;
				// body...
			}


			function cambiaDestino() {
				$log.debug('Asigna destino a los seleccionados',vm.data.destino);
				if (vm.formData.destino) {
					for (var i = 0; i < vm.data.itemsfacturables.length; i++) {
						if (vm.data.itemsfacturables[i].Seleccionado == true) {
							vm.data.itemsfacturables[i].Destino = vm.formData.destino;
							vm.data.itemsfacturables[i].Seleccionado = false;	

						}
					}
					vm.formData.marcarTodos = false;
				}

				mostrarDisable();
				btnGuardarDisabled();
				// body...
			}

			function selectMarcarTodos() {
				if (vm.data.prescripcion.Facturado == false){
					for (var i = 0; i < vm.data.itemsfacturables.length; i++) {
						vm.data.itemsfacturables[i].Seleccionado = vm.formData.marcarTodos;
						}

				}
					mostrarDisable();

				// body...
			}


			function btnGuardarDisabled() {
				var faltanSeleccionar = false;
				$log.debug('Activar Desactivar Disabled Boton Guardar');
				for (var i = 0; i < vm.data.itemsfacturables.length; i++) {
					if (!vm.data.itemsfacturables[i].Destino) {
						faltanSeleccionar = true;
					}
					if  (!vm.data.itemsfacturables[i].Matricula)  {
						faltanSeleccionar = true;
					}

				}

				vm.formData.btnDisabled = faltanSeleccionar;
				// body...
			}


			function cambiaCuenta() {
				$log.debug('Asigna Cuenta a los seleccionados',vm.data.cuentaElegida);
				$log.debug('Asigna Matricula a los seleccionados',vm.data.participanteConCuentas);
				if (vm.data.cuentaElegida) {
					$log.debug('pasa');
					for (var i = 0; i < vm.data.itemsfacturables.length; i++) {
						if (vm.data.itemsfacturables[i].Seleccionado == true) {
							vm.data.itemsfacturables[i].Matricula = vm.data.participanteConCuentas.Id;
							vm.data.itemsfacturables[i].Cuenta = vm.data.cuentaElegida.Numero;
							vm.data.itemsfacturables[i].Seleccionado = false;	

						}
					}
					vm.formData.marcarTodos = false;
				}

				mostrarDisable();
				btnGuardarDisabled();


				// body...
			}


			function guardar() {
				var cabecera: any = {};
				cabecera.IdPrescripcion = vm.data.prescripcion.Id;
				cabecera.DetallePrescripcion = [];
				for (var i = 0; i < vm.data.itemsfacturables.length; i++) {
					var item : any = {};
					item.Id = vm.data.itemsfacturables[i].Id;
					item.IdTipo = vm.data.itemsfacturables[i].IdTipo;
					item.IdDestino = vm.data.itemsfacturables[i].Destino.Id;
					item.Matricula = vm.data.itemsfacturables[i].Matricula;
					item.Cuenta = vm.data.itemsfacturables[i].Cuenta;
					item.IdPrescripcion = vm.data.prescripcion.Id;
					cabecera.DetallePrescripcion.push(item);

				}

				GuardiaAdministracionDataService.GuardarFacturables(cabecera)
				.then(function () {
					$log.debug('Guardo OK!');
					AlertaService.NewSuccess("Cambio Guardado!");
					$uibModalInstance.close();
					// body...
				}, function (pError) {
					$log.error('GuardarFacturables Error ',pError);
					// body...
				});

			}	

			/* ---------------------------------------------- ACTIVATE ---------------------------------------------- */

			activate();

			function activate () {
				$log.debug('Inicializar facturacion Guardia ON.-');
				GuardiaAdministracionDataService.GetFacturablesById(vm.data.prescripcion.Id)
				.then(function (itemsfacturables) {
					vm.data.itemsfacturables=itemsfacturables;
					$log.debug('items facturables guardia',vm.data.itemsfacturables);
					// body...
				}, function (pError) {
					$log.error('GetFacturablesById Error ',pError);
					// body...
				});
				GuardiaAdministracionDataService.GetDestinos()
					.then(function (destinos) {
						vm.data.destinos = destinos;
						// body...
					}, function (pError) {
						$log.error('get Destinos Error',pError);
					});
					$log.debug('Trae Destinos ',vm.data.destinos);
					 
					// vm.data.prescripcion.Facturado es true o false... en base a eso pongo disabled o no al check 	
					vm.formData.checkDisabled = vm.data.prescripcion.Facturado;

					
			}

		}
	};

	return module;
})();