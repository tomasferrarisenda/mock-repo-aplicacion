/**
 * @author:			Pedro Ferrer
 * @description:	ClausulaEditController
 * @type:			Controller
 **/

export default (function(){
	const module = { init : (ngModule: any) => {} };

	module.init = function (module) {

		module.controller('ClausulaEditController', ClausulaEditController);

		ClausulaEditController.$inject = ['Logger', '$state', 'ModalService', 'User', '$stateParams', 'ConvenioDataService', 'ConvenioLogicService', '$q'];

		function ClausulaEditController ($log, $state, ModalService, User, $stateParams, ConvenioDataService, ConvenioLogicService, $q) {

			/* ------------------------------------------------ LOG ------------------------------------------------ */

			$log = $log.getInstance('ClausulaEditController');
			/* ----------------------------------------- API Y VARIABLESES ----------------------------------------- */

			var vm = this;
			vm.today = new Date();
			
			vm.title = {
				name : '',
				icon : ''
			};

			vm.data = {
				convenioEdit : null
			};

			vm.filter = {
				codigoMutual : '',
				vigenciaDesde : '',
				vigenciaHasta : '',
				tipoEstadoConvenioElegido : '',
				observaciones : ''
			};

			vm.formControl = {		
				volver : volver,
				guardar : guardar,
				editarCondicion : editarCondicion,
				borrarCondicion : borrarCondicion,
				editarConsecuencia : editarConsecuencia,
				borrarConsecuencia : borrarConsecuencia,
				loading : false
			};

			vm.convenio = {
				Id : ''
			}

			/* ------------------------------------------- IMPLEMENTACIÓN ------------------------------------------- */

			/* FORMULARIO */
			function volver () {
				$state.go('financiadores.convenios.edit.clausula',
				{
					convenioEdit : $stateParams.convenioEdit,
					esNuevo : false,
					vigenciaDesde : vm.filter.vigenciaDesde,
					vigenciaHasta : vm.filter.vigenciaHasta,
					estadoConvenio : vm.filter.tipoEstadoConvenioElegido,
					tabAIr : 'financiadores.convenios.edit.clausula'
				});
			}

			function guardar(){
				if(vm.data.clausulas.Condiciones.length === 0 || vm.data.clausulas.Consecuencias.length === 0){
					ModalService.warning("Verifique por favor. -Debe existir por lo menos una condición y una consecuencia.");
					return;
				}
				vm.data.clausulas.Observaciones = vm.filter.observaciones;
				ConvenioDataService.GuardarClausulaEnConvenio(vm.data.clausulas).then(function(result){
					if (result.IsOk === false) {
						ModalService.warning("Verifique por favor. " + result.Message);
					}
					else {
						var esNuevo = true;
						for (var i = vm.data.convenioEdit.Clausulas.Rows.length - 1; i >= 0; i--) {
							if(vm.data.convenioEdit.Clausulas.Rows[i].Id == result.Entidad.Id){
								vm.data.convenioEdit.Clausulas.Rows[i] = result.Entidad;
								esNuevo = false;
								break;
							}
						}
						if(esNuevo)
							vm.data.convenioEdit.Clausulas.Rows.push(result.Entidad);

						ModalService.success("La cláusula ha sido guardada.");
						volver();
					}
				});
			}

			function editarCondicion(condicion, index){
				ConvenioLogicService.editarCondicion(condicion, vm.data.convenioEdit.IdFinanciador, vm.data.convenioEdit.Id)
				.then(function(condicionEdit){
					if(condicion === null){
						vm.data.clausulas.Condiciones.push(condicionEdit);
					}
					else
					{
						vm.data.clausulas.Condiciones[index] = condicionEdit;
					}
				});
			}

			function borrarCondicion(index){
				vm.data.clausulas.Condiciones.splice(index, 1);
			}

			function editarConsecuencia(consecuencia, index){
				ConvenioLogicService.editarConsecuencia(consecuencia, vm.data.convenioEdit.Id)
				.then(function(consecuenciaEdit){
					if(consecuencia === null){
						vm.data.clausulas.Consecuencias.push(consecuenciaEdit);
					}
					else
					{
						vm.data.clausulas.Consecuencias[index] = consecuenciaEdit;
					}
				});
			}

			function borrarConsecuencia(index){
				vm.data.clausulas.Consecuencias.splice(index, 1);
			}

			/* ---------------------------------------------- ACTIVATE ---------------------------------------------- */
			activate();

			function activate () {
				if(!$stateParams.convenioEdit){
					volver();
					return;
				}
				vm.formControl.loading = true;
				vm.data.convenioEdit = $stateParams.convenioEdit;

				obtenerClausulaDto().then(function(clausulaEdit){
					vm.data.clausulas = clausulaEdit;
					vm.filter.codigoMutual = clausulaEdit.CodigoFinanciador;
					vm.filter.vigenciaDesde = $stateParams.vigenciaDesde;
					vm.filter.vigenciaHasta = $stateParams.vigenciaHasta;
					vm.filter.tipoEstadoConvenioElegido = $stateParams.estadoConvenio;
					vm.filter.observaciones = clausulaEdit.Observaciones;

					vm.title.name = vm.data.clausulas.Id > 0 ? 'Editar cláusula #'+ vm.data.clausulas.Id : 'Nueva cláusula';
					vm.title.icon = vm.data.clausulas.Id > 0 ? 'EDIT' : 'NEW2';
					vm.formControl.loading = false;
				});
			}

			function obtenerClausulaDto(){
				var def = $q.defer();
				if($stateParams.idClausulaEdit){
					ConvenioDataService.ObtenerClausulaDto($stateParams.idClausulaEdit)
					.then(function(clausulaEdit){
						def.resolve(clausulaEdit);
					});
				}
				else{
					ConvenioDataService.ObtenerNuevaClausulaDelConvenioDtoParaEdicion(vm.data.convenioEdit.Id)
					.then(function(clausulaEdit){
						def.resolve(clausulaEdit);
					});
				}
				return def.promise;
			}
		}
	};

	return module;
})();