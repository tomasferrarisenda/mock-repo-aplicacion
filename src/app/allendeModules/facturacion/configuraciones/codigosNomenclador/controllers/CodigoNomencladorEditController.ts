/**
 * @author 			jbasiluk
 * @description 	description
 */
export default (function(){
	const module = { init : (ngModule: any) => {} };

	module.init = function (module) { 

		module.controller('CodigoNomencladorEditController', CodigoNomencladorEditController);

		CodigoNomencladorEditController.$inject = ['Logger', '$q', '$uibModalInstance', 'CodigosNomencladorDataService', 'AlertaService', 'CodigoNomencladorSeleccionado'];

		// Constructor del Controller
		function CodigoNomencladorEditController ($log, $q, $uibModalInstance, CodigosNomencladorDataService, AlertaService, CodigoNomencladorSeleccionado) {

			/* ------------------------------------------ API Y VARIABLES ------------------------------------------ */

			//$log = $log.getInstance('CodigoNomencladorEditController');
			//$log.debug('ON.-');

			var vm = this;

			vm.data = {
				codigoNomenclador: '',
				nomencladores : [],
				subcomponentes : [],
				tiposCodigosNomenclador : [],
				codigosUnidadesNomenclador : [],
				frecuenciasCodigosNomenclador : [],
				unidadesArancelarias : [],
				complejidadesAdac : [],
				complejidadesCN : [],
				capitulos: [],
				editCN : false
			};

			vm.filter = {
				nomenclador : '',					
				subcomponente : '',
				tipoCodigoNomenclador : '',
				codigoUnidadNomenclador : '',
				frecuenciaCodigoNomenclador : '',
				unidadArancelariaEspecialista : '',
				unidadArancelariaAyudante : '',
				unidadArancelariaAnestesista : '',
				unidadArancelariaGasto : '',
				complejidadAdac : '',
				complejidadCN : '',
				capitulo : ''
			};

			vm.formControl = {
				ok: guardar,
				cancel: cancel,
				error: true,
				loading: false,
				sucursalCheck: false,
				pisosCheck: false,
				buildingData : false
			};

			/* ------------------------------------------ IMPLEMENTACIÓN ------------------------------------------ */

 			/* FORMULARIO */

 			
			function cancel () {
				$uibModalInstance.close('cancel');
			}

			function guardar(isValid) {
				if(!isValid) return;

				var cn = vm.data.codigoNomenclador;
				
				if(vm.filter.nomenclador != null && vm.filter.nomenclador.Id > 0) {
					cn.IdNomenclador = vm.filter.nomenclador.Id;
				} else {
					cn.IdNomenclador = 0;
				}

				if(vm.filter.subcomponente != null && vm.filter.subcomponente.Id > 0) {
					cn.IdTipoComponente = vm.filter.subcomponente.Id;
				} else {
					cn.IdTipoComponente = 0;
				}

				if(vm.filter.tipoCodigoNomenclador != null && vm.filter.tipoCodigoNomenclador.Id > 0) {
					cn.IdTipoCodigoNomenclador = vm.filter.tipoCodigoNomenclador.Id;
				} else {
					cn.IdTipoCodigoNomenclador = 0;
				}
					
				if(vm.filter.codigoUnidadNomenclador != null && vm.filter.codigoUnidadNomenclador.Id > 0) {
					cn.IdCodigoUnidadNomenclador = vm.filter.codigoUnidadNomenclador.Id;
				} else {
					cn.IdCodigoUnidadNomenclador = 0;
				}

				if(vm.filter.frecuenciaCodigoNomenclador != null && vm.filter.frecuenciaCodigoNomenclador.Id > 0) {
					cn.IdFrecuenciaCodigoDeNomenclador = vm.filter.frecuenciaCodigoNomenclador.Id;
				} else {
					cn.IdFrecuenciaCodigoDeNomenclador = 0;
				}

				if(vm.filter.unidadArancelariaEspecialista != null && vm.filter.unidadArancelariaEspecialista.Id > 0) {
					cn.IdUnidadArancelariaEspecialista = vm.filter.unidadArancelariaEspecialista.Id;
				} else {
					cn.IdUnidadArancelariaEspecialista = 0;
				}

				if(vm.filter.unidadArancelariaAyudante != null && vm.filter.unidadArancelariaAyudante.Id > 0) {
					cn.IdUnidadArancelariaAyudante = vm.filter.unidadArancelariaAyudante.Id;
				} else {
					cn.IdUnidadArancelariaAyudante = 0;
				}

				if(vm.filter.unidadArancelariaAnestesista != null && vm.filter.unidadArancelariaAnestesista.Id > 0) {
					cn.IdUnidadArancelariaAnestesista = vm.filter.unidadArancelariaAnestesista.Id;
				} else {
					cn.IdUnidadArancelariaAnestesista = 0;
				}

				if(vm.filter.unidadArancelariaGasto != null && vm.filter.unidadArancelariaGasto.Id > 0) {
					cn.IdUnidadArancelariaGasto = vm.filter.unidadArancelariaGasto.Id;
				} else {
					cn.IdUnidadArancelariaGasto = 0;
				}

				if(vm.filter.capitulo != null && vm.filter.capitulo.Id > 0) {
					cn.IdCapituloNomenclador = vm.filter.capitulo.Id;
				} else {
					cn.IdCapituloNomenclador = 0;
				}

				if(vm.filter.complejidadAdac != null && vm.filter.complejidadAdac.Id > 0) {
					cn.ComplejidadAdac = vm.filter.complejidadAdac.Id;
				} else {
					cn.ComplejidadAdac = 0;
				}

				if(vm.filter.complejidadCN != null && vm.filter.complejidadCN.Id > 0) {
					cn.IdComplejidadCodigoNomenclador = vm.filter.complejidadCN.Id;
				} else {
					cn.IdComplejidadCodigoNomenclador = 0;
				}

				CodigosNomencladorDataService.guardarCodigoNomenclador(cn)

				.then(addOk, addError);
					function addOk (pResponse) {
						if(pResponse.IsOk === true){
							$uibModalInstance.close("ok");
							//activate();
							//AlertaService.NewSuccess("Receso Confirmado","Receso correctamente agregado o editado");
						} else {
							AlertaService.NewError("Error", pResponse.Message);
						}
					}

					function addError (pError) {
						$uibModalInstance.dismiss(pError);
					}
			}

			/* ------------------------------ ACTIVATE ------------------------------ */

			activate();
			
			function activate () {
				vm.formControl.loading = true;

				var _nomencladores = CodigosNomencladorDataService.getAllNomencladores();
				var _subcomponentes = CodigosNomencladorDataService.getAllTiposComponentes();
				var _tiposCodigosNomenclador = CodigosNomencladorDataService.getAllTiposCodigoNomenclador();
				var _codigosUnidadesNomenclador = CodigosNomencladorDataService.getAllCodigosUnidadesNomenclador();
				var _frecuenciasCodigosNomenclador = CodigosNomencladorDataService.getAllFrecuenciasCodigosDeNomenclador();
				var _complejidadesAdac = CodigosNomencladorDataService.getAllComplejidadesAdac();
				var _unidadesArancelarias = CodigosNomencladorDataService.getAllUnidadesArancelarias();
				var _capitulos = CodigosNomencladorDataService.getAllCapitulosNomenclador();
				var _complejidadesCN = CodigosNomencladorDataService.getAllComplejidadesCodigoNomenclador();

				$q.all([_nomencladores, _subcomponentes, _tiposCodigosNomenclador, _codigosUnidadesNomenclador, _frecuenciasCodigosNomenclador, _complejidadesAdac, _unidadesArancelarias, _capitulos, _complejidadesCN]).then(activateOk, activateError);
					
				function activateOk (results) {
					vm.data.codigoNomenclador = CodigoNomencladorSeleccionado;

					vm.data.nomencladores = results[0];
					vm.data.subcomponentes = results[1];
					vm.data.tiposCodigosNomenclador = results[2];
					vm.data.codigosUnidadesNomenclador = results[3];
					vm.data.frecuenciasCodigosNomenclador = results[4];
					vm.data.complejidadesAdac = results[5];
					vm.data.unidadesArancelarias = results[6];
					vm.data.capitulos = results[7];
					vm.data.complejidadesCN = results[8];

					vm.data.editCN = vm.data.codigoNomenclador.Id > 0;

					if(vm.data.codigoNomenclador.IdNomenclador > 0) {
						for (var i = 0; i < vm.data.nomencladores.length; i++) {
							if(vm.data.nomencladores[i].Id == vm.data.codigoNomenclador.IdNomenclador){
								vm.filter.nomenclador = vm.data.nomencladores[i];	
								break;
							}
						}
					}

					if(vm.data.codigoNomenclador.IdTipoComponente > 0) {						
						for (var i = 0; i < vm.data.subcomponentes.length; i++) {
							if(vm.data.subcomponentes[i].Id == vm.data.codigoNomenclador.IdTipoComponente){
								vm.filter.subcomponente = vm.data.subcomponentes[i];	
								break;
							}
						}
					}

					if(vm.data.codigoNomenclador.IdTipoCodigoNomenclador > 0) {
						for (var i = 0; i < vm.data.tiposCodigosNomenclador.length; i++) {
							if(vm.data.tiposCodigosNomenclador[i].Id == vm.data.codigoNomenclador.IdTipoCodigoNomenclador){
								vm.filter.tipoCodigoNomenclador = vm.data.tiposCodigosNomenclador[i];	
								break;
							}
						}
					}

					if(vm.data.codigoNomenclador.IdCodigoUnidadNomenclador > 0) {
						for (var i = 0; i < vm.data.codigosUnidadesNomenclador.length; i++) {
							if(vm.data.codigosUnidadesNomenclador[i].Id == vm.data.codigoNomenclador.IdCodigoUnidadNomenclador){
								vm.filter.codigoUnidadNomenclador = vm.data.codigosUnidadesNomenclador[i];	
								break;
							}
						}
					}

					if(vm.data.codigoNomenclador.IdFrecuenciaCodigoDeNomenclador > 0) {
						for (var i = 0; i < vm.data.frecuenciasCodigosNomenclador.length; i++) {
							if(vm.data.frecuenciasCodigosNomenclador[i].Id == vm.data.codigoNomenclador.IdFrecuenciaCodigoDeNomenclador){
								vm.filter.frecuenciaCodigoNomenclador = vm.data.frecuenciasCodigosNomenclador[i];	
								break;
							}
						}
					}

					if(vm.data.codigoNomenclador.ComplejidadAdac > 0) {
						for (var i = 0; i < vm.data.complejidadesAdac.length; i++) {
							if(vm.data.complejidadesAdac[i].Id == vm.data.codigoNomenclador.ComplejidadAdac){
								vm.filter.complejidadAdac = vm.data.complejidadesAdac[i];	
								break;
							}
						}
					}

					if(vm.data.codigoNomenclador.IdUnidadArancelariaEspecialista > 0) {
						for (var i = 0; i < vm.data.unidadesArancelarias.length; i++) {
							if(vm.data.unidadesArancelarias[i].Id == vm.data.codigoNomenclador.IdUnidadArancelariaEspecialista){
								vm.filter.unidadArancelariaEspecialista = vm.data.unidadesArancelarias[i];	
								break;
							}
						}
					}

					if(vm.data.codigoNomenclador.IdUnidadArancelariaAyudante > 0) {
						for (var i = 0; i < vm.data.unidadesArancelarias.length; i++) {
							if(vm.data.unidadesArancelarias[i].Id == vm.data.codigoNomenclador.IdUnidadArancelariaAyudante){
								vm.filter.unidadArancelariaAyudante = vm.data.unidadesArancelarias[i];	
								break;
							}
						}
					}

					if(vm.data.codigoNomenclador.IdUnidadArancelariaAnestesista > 0) {
						for (var i = 0; i < vm.data.unidadesArancelarias.length; i++) {
							if(vm.data.unidadesArancelarias[i].Id == vm.data.codigoNomenclador.IdUnidadArancelariaAnestesista){
								vm.filter.unidadArancelariaAnestesista = vm.data.unidadesArancelarias[i];	
								break;
							}
						}
					}

					if(vm.data.codigoNomenclador.IdUnidadArancelariaGasto > 0) {
						for (var i = 0; i < vm.data.unidadesArancelarias.length; i++) {
							if(vm.data.unidadesArancelarias[i].Id == vm.data.codigoNomenclador.IdUnidadArancelariaGasto){
								vm.filter.unidadArancelariaGasto = vm.data.unidadesArancelarias[i];	
								break;
							}
						}
					}

					if(vm.data.codigoNomenclador.IdCapituloNomenclador > 0) {
						for (var i = 0; i < vm.data.capitulos.length; i++) {
							if(vm.data.capitulos[i].Id == vm.data.codigoNomenclador.IdCapituloNomenclador){
								vm.filter.capitulo = vm.data.capitulos[i];	
								break;
							}
						}
					}	

					if(vm.data.codigoNomenclador.IdComplejidadCodigoNomenclador > 0) {
						for (var i = 0; i < vm.data.complejidadesCN.length; i++) {
							if(vm.data.complejidadesCN[i].Id == vm.data.codigoNomenclador.IdComplejidadCodigoNomenclador){
								vm.filter.complejidadCN = vm.data.complejidadesCN[i];	
								break;
							}
						}
					}	

					vm.formControl.loading = false;
				}

				function activateError (pError) {
					$uibModalInstance.dismiss(pError);
				}
			}
		}
	};

	return module;
})();