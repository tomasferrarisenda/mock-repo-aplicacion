/**
 * @author 			emansilla
 * @description 	description
 */
export default (function () {
	
	const module = { init : (ngModule: any) => {} };

	module.init = function (module) { 

		module.controller('EvolucionNewController', EvolucionNewController);

		// // Inyección de Dependencia
		EvolucionNewController.$inject = [
			'Logger', '$filter', '$q',
			'EvolucionDataService', 'User', 'ModalService', 
			'Title', 'Module'
		];

		// Constructor del Controller
		function EvolucionNewController (
			$log, $filter, $q,
			EvolucionDataService, User, ModalService,
			Title, Module) {

			/* ------------------------------------------------ LOG ------------------------------------------------ */

			$log = $log.getInstance('EvolucionNewController');
			$log.debug('ON.-');

			/* ------------------------------------------ API Y VARIABLES ------------------------------------------ */

			var vm = this;
			vm.title = {
				module: Module,
				page: Title,
			};

			vm.formData = {
				textEvolucion : ''
			};

			vm.optionCk = {
				language: 'es',
				allowedContent: false,
				entities: false,
				skin : 'kama',
				// Remover botones (sin espacios) http://docs.cksource.com/CKEditor_3.x/Developers_Guide/Toolbar
				removeButtons : 'Table,About,Source,Subscript,Superscript,Scayt',
				// Remover pluging
				removePlugins : 'elementspath',
				extraPlugins : 'colorbutton'
				// Ver/Ocultar toolbar
				// toolbarCanCollapse : true,
				// Redefinir toolbar
				// toolbar : [	
				// ]
			};

			// Called when the editor is completely ready.
			vm.onReady = function () {
			    $log.debug('on ready', vm.optionCk);
			};

			vm.data = {
				// Información traida desde la BD
				lista: [],
				objeto: {}
			};

			vm.formControl = {
				// Manejo del formulario
				error : true,
				loading : false,
				reload : activate,
				volver : volver,
				verEvolucion : verEvolucion,
				validarForm : validarForm,
				llenarForm : llenarForm
			};

			/* ------------------------------------------- IMPLEMENTACIÓN ------------------------------------------- */

			/* FORMULARIO */

			function volver () {
				// Ejemplo
				// $location.url('/Home');
			}

			function validarForm () {
				// body...
			}

			function llenarForm () {
				// body...
			}

			function verEvolucion() {
				$log.debug('Evolucion', vm.formData.textEvolucion);
			}

			function inicializarVariables () {
				vm.formData.textEvolucion = '';
			}

			/* ---------------------------------------------- ACTIVATE ---------------------------------------------- */

			activate();
				
			function activate () {
				$log.debug('Inicializar ON.-');

				inicializarVariables();

				vm.formControl.loading = true;

				activateOk();

				// $q.all([llamadas])
				// .then(activateOk, activateError);
				
				function activateOk (pResults?) {
					vm.formControl.loading = false;
					vm.formControl.error = false;
					$log.debug('Inicializar OK.-', pResults);
				}

				function activateError (pError) {
					vm.formControl.loading = false;
					vm.formControl.error = true;
					ModalService.error(pError.message);
					$log.error('Inicializar ERROR.-', pError);
				}
			}

		}
	};

	return module;
})();