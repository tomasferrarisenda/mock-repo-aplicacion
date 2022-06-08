/**
 * @author:			Pedro Ferrer
 * @description:	ClausulaEditTpl
 * @type:			Controller
 **/

import * as angular from 'angular';

export default (function(){
	const module = { init : (ngModule: any) => {} };

	module.init = function (module) {

		module.controller('ConsecuenciaEditTplController', ConsecuenciaEditTplController);

		ConsecuenciaEditTplController.$inject = ['Logger', '$state', 'ModalService', 'consecuenciaEditDto', 'idConvenio', 'ConvenioDataService', '$q', 'CONSECUENCIA', '$uibModalInstance', 'ConvenioLogicService'];

		function ConsecuenciaEditTplController ($log, $state, ModalService, consecuenciaEditDto, idConvenio, ConvenioDataService, $q, CONSECUENCIA, $uibModalInstance, ConvenioLogicService) {

			/* ------------------------------------------------ LOG ------------------------------------------------ */

			$log = $log.getInstance('ConsecuenciaEditTplController');
			/* ----------------------------------------- API Y VARIABLESES ----------------------------------------- */

			var vm = this;
			
			vm.title = {
				name : '',
				icon : ''
			};

			vm.data = {
				consecuenciaEdit : null,
				consecuenciaElegida : null,
				muestraLogico : false,
				muestraImporte : false,
				muestraMagia: false,
				muestraCombo: false,
				valorDto : null,
				labelLogico : '',
				valoresPosibles : null
			};

			vm.filter = {
				importe : 0,
				porcentaje : 0,
				valorMagico : null,
				logico : false,
				valorCombo : 0,
				subtipoConsecuenciaElegido : null,
				consecuencias : null,
				subtiposConsecuencia : null
			}

			vm.formControl = {
				buscar : buscar,
				cancel : cancel,
				guardar : guardar,
				cambiarConsecuencia : cambiarConsecuencia
			};

			/* ------------------------------------------- IMPLEMENTACIÓN ------------------------------------------- */

			/* FORMULARIO */
			function buscar() {
				if(vm.data.consecuenciaEdit.IdSubTipoConsecuencia === CONSECUENCIA.PRECIO_FIJO_DE_LISTA){
					listaValoresLimpiar(angular.copy(vm.data.valorDto), vm.data.consecuenciaEdit);
					ConvenioLogicService.seleccionListaPrecio(angular.copy(vm.data.consecuenciaEdit), idConvenio)
					.then(function(result){
						vm.data.consecuenciaEdit = result;
						vm.filter.valorMagico = vm.data.consecuenciaEdit.Valores[0].Nombre;
					})
				}
				else{
					if(vm.data.consecuenciaEdit.IdSubTipoConsecuencia === CONSECUENCIA.REQUISITOS_ADMINISTRATIVOS){
						ConvenioLogicService.seleccionRequisitoAdministrativo(angular.copy(vm.data.consecuenciaEdit))
						.then(function(result){
							vm.data.consecuenciaEdit = result;
							vm.filter.valorMagico = vm.data.consecuenciaEdit.ValoresFormateados;
						})
					}
				}
			}

			function cancel() {
				$uibModalInstance.dismiss('close');
			}

			function listaValoresLimpiar(valorDto, consecuencia){
				valorDto.Id = consecuencia.Valores[0] ? consecuencia.Valores[0].Id : 0;

				//Guardo los valores
				if(vm.filter.subtipoConsecuenciaElegido){
					if((consecuencia.IdSubTipoConsecuencia == CONSECUENCIA.PRECIO_FIJO_DE_LISTA && vm.filter.subtipoConsecuenciaElegido.Id === CONSECUENCIA.REQUISITOS_ADMINISTRATIVOS) 
					|| (consecuencia.IdSubTipoConsecuencia == CONSECUENCIA.REQUISITOS_ADMINISTRATIVOS && vm.filter.subtipoConsecuenciaElegido.Id === CONSECUENCIA.PRECIO_FIJO_DE_LISTA)){
						valorDto.IdValor = 0;
						valorDto.Nombre = '';
					}
					else{
						valorDto.IdValor = vm.data.consecuenciaEdit.Valores[0] ? consecuencia.Valores[0].IdValor : 0;
						valorDto.Nombre = vm.data.consecuenciaEdit.Valores[0] ? consecuencia.Valores[0].Nombre : '';
					}
				}
				
				consecuencia.Valores = [];
				consecuencia.Valores.push(valorDto);
			}

			function asignarValoresALista(consecuencia){
				var valorDto = angular.copy(vm.data.valorDto);

				switch (consecuencia.IdSubTipoConsecuencia) {
					case CONSECUENCIA.INCLUSION:
					case CONSECUENCIA.REQUIERE_PRESUPUESTO_PREVIO_APROBADO:
					case CONSECUENCIA.PERMITE_AUTO_RECEPCION:	
						listaValoresLimpiar(valorDto, consecuencia);
						vm.data.consecuenciaEdit.Valores[0].Valor = vm.filter.logico;
						break;
					case CONSECUENCIA.PRECIO_FIJO:
					case CONSECUENCIA.IMPORTE:
					case CONSECUENCIA.SEGUN_COEFICIENTE:
						listaValoresLimpiar(valorDto, consecuencia);
						vm.data.consecuenciaEdit.Valores[0].Valor = vm.filter.importe;
						break;
					case CONSECUENCIA.PORCENTAJE:
						listaValoresLimpiar(valorDto, consecuencia);
						vm.data.consecuenciaEdit.Valores[0].Valor = vm.filter.porcentaje;
						break;
					case CONSECUENCIA.AUTORIZACION:
						listaValoresLimpiar(valorDto, consecuencia);
						vm.data.consecuenciaEdit.Valores[0].IdValor = vm.filter.valorCombo.Id;
						break;
					default:
						break;
				}
			}

			function guardar() {
				asignarValoresALista(vm.data.consecuenciaEdit);

				ConvenioDataService.ObtenerConsecuenciaConValoresFormateados(vm.data.consecuenciaEdit)
				.then(function(consecuenciaFormateada){
					$uibModalInstance.close(consecuenciaFormateada);
				});
			}

			function borrarValores(){
				vm.filter.logico = false;
				vm.filter.importe = 0;
				vm.filter.porcentaje = 0;
				vm.filter.valorMagico = null;
				vm.filter.valorCombo = 0;
			}

			function ocultarElementos(){
				vm.data.muestraLogico = false;
				vm.data.muestraImporte = false;
				vm.data.muestraMagia = false;
				vm.data.muestraPorcentaje = false;
				vm.data.muestraCombo = false;
			}

			function cambiarConsecuencia(){
				borrarValores();
				ocultarElementos();
				listaValoresLimpiar(vm.data.valorDto, vm.data.consecuenciaEdit);

				if(vm.filter.subtipoConsecuenciaElegido){
					vm.data.consecuenciaEdit.IdSubTipoConsecuencia = vm.filter.subtipoConsecuenciaElegido.Id;
					vm.data.consecuenciaEdit.NombreSubTipoConsecuencia = vm.filter.subtipoConsecuenciaElegido.Nombre;
					vm.data.consecuenciaEdit.IdTipoConsecuencia = vm.filter.subtipoConsecuenciaElegido.IdTipoConsecuencia;
					vm.data.consecuenciaEdit.NombreTipoConsecuencia = vm.filter.subtipoConsecuenciaElegido.NombreTipoConsecuencia;

					switch (vm.filter.subtipoConsecuenciaElegido.Id) {
						case CONSECUENCIA.INCLUSION:
						case CONSECUENCIA.REQUIERE_PRESUPUESTO_PREVIO_APROBADO:
						case CONSECUENCIA.PERMITE_AUTO_RECEPCION:
							vm.data.labelLogico = vm.filter.subtipoConsecuenciaElegido.Id === CONSECUENCIA.INCLUSION ? 'Incluido' : 
											vm.filter.subtipoConsecuenciaElegido.Id === CONSECUENCIA.PERMITE_AUTO_RECEPCION ? 'Permite Auto Recepción' : 
											vm.filter.subtipoConsecuenciaElegido.Id === CONSECUENCIA.AUTORIZACION ? '' : 'Requiere Presupuesto Previo Aprobado';
							vm.data.muestraLogico = true;
							vm.filter.logico = vm.data.consecuenciaEdit.ValorLogico;
							break;
						case CONSECUENCIA.PRECIO_FIJO:
						case CONSECUENCIA.SEGUN_COEFICIENTE:
						case CONSECUENCIA.IMPORTE:
							vm.data.muestraImporte = true;
							vm.filter.importe = vm.filter.subtipoConsecuenciaElegido.ValorNumerico;
							break;
						case CONSECUENCIA.PORCENTAJE:
							vm.data.muestraPorcentaje = true;
							vm.filter.porcentaje = vm.filter.subtipoConsecuenciaElegido.ValorNumerico;
							break;
						case CONSECUENCIA.PRECIO_FIJO_DE_LISTA:
						case CONSECUENCIA.REQUISITOS_ADMINISTRATIVOS:
							vm.data.muestraMagia = true;
							vm.filter.valorMagico = vm.filter.subtipoConsecuenciaElegido.ValorString;
							break;
						case CONSECUENCIA.AUTORIZACION:
							ConvenioDataService.ObtenerValoresPosiblesPorSubTipoConsecuencia(vm.filter.subtipoConsecuenciaElegido.Id)
								.then(function(valores){
									vm.data.valoresPosibles = valores;
									vm.data.muestraCombo = true;
									//vm.filter.valorCombo = vm.filter.subtipoConsecuenciaElegido.ValorLista;
									vm.filter.valorCombo = valores.find(x => x.Id == vm.data.consecuenciaEdit.ValorLista);
								});
							break;
						case CONSECUENCIA.SEGUN_NOMENCLADOR:
						default:
							break;
					}
				}
			}

			function inicializarConsecuencia(consecuencia){
				switch (consecuencia.IdSubTipoConsecuencia) {
					case CONSECUENCIA.INCLUSION:
					case CONSECUENCIA.REQUIERE_PRESUPUESTO_PREVIO_APROBADO:
					case CONSECUENCIA.PERMITE_AUTO_RECEPCION:
						vm.data.labelLogico = vm.filter.subtipoConsecuenciaElegido.Id === CONSECUENCIA.INCLUSION ? 'Incluido' :
									          vm.filter.subtipoConsecuenciaElegido.Id === CONSECUENCIA.PERMITE_AUTO_RECEPCION ? 'Permite Auto Recepción' : 
											  vm.filter.subtipoConsecuenciaElegido.Id === CONSECUENCIA.AUTORIZACION ? '' :
											  'Requiere Presupuesto Previo Aprobado';
						vm.data.muestraLogico = true;
						vm.filter.logico = consecuencia.ValorLogico;
						break;
					case CONSECUENCIA.PRECIO_FIJO:
					case CONSECUENCIA.SEGUN_COEFICIENTE:
					case CONSECUENCIA.IMPORTE:
						vm.data.muestraImporte = true;
						vm.filter.importe = consecuencia.ValorNumerico;
						break;
					case CONSECUENCIA.PORCENTAJE:
						vm.data.muestraPorcentaje = true;
						vm.filter.porcentaje = consecuencia.ValorNumerico;
						break;
					case CONSECUENCIA.PRECIO_FIJO_DE_LISTA:
					case CONSECUENCIA.REQUISITOS_ADMINISTRATIVOS:
						vm.data.muestraMagia = true;
						vm.filter.valorMagico = consecuencia.ValorString;
						break;
					case CONSECUENCIA.AUTORIZACION:
						ConvenioDataService.ObtenerValoresPosiblesPorSubTipoConsecuencia(vm.filter.subtipoConsecuenciaElegido.Id)
							.then(function(valores){
								vm.data.valoresPosibles = valores;
								vm.data.muestraCombo = true;
								vm.filter.valorCombo = valores.find(x=> x.Id == consecuencia.ValorLista);
							});
						break;
					case CONSECUENCIA.SEGUN_NOMENCLADOR:
					default:
						break;
				}
			}

			/* ---------------------------------------------- ACTIVATE ---------------------------------------------- */

			activate();

			function activate () {
				vm.title.name = consecuenciaEditDto === null ? 'Nueva consecuencia' : 'Editar consecuencia #' + consecuenciaEditDto.Id;
				vm.title.icon = consecuenciaEditDto === null ? 'NEW2' : 'EDIT';

				obtenerConsecuenciaDto().then(function(consecuencia){
					vm.data.consecuenciaEdit = consecuencia;

					ConvenioDataService.ObtenerSubTiposConsecuencia()
					.then(function(subtiposConsecuencia){
						vm.data.subtiposConsecuencia = subtiposConsecuencia;
						if(vm.data.consecuenciaEdit.IdSubTipoConsecuencia > 0){
							ConvenioDataService.ObtenerSubTipoConsecuencia(vm.data.consecuenciaEdit.IdSubTipoConsecuencia)
							.then(function(subtipoElegido){
								vm.filter.subtipoConsecuenciaElegido = subtipoElegido;
								inicializarConsecuencia(vm.data.consecuenciaEdit);
							});
						}
					});
				});

				ConvenioDataService.ObtenerNuevoValorConsecuenciaEditDto().then(function(valorDto){
					vm.data.valorDto = valorDto;
				});
			}

			function obtenerConsecuenciaDto(){
				var def = $q.defer();
				if(consecuenciaEditDto){
					def.resolve(consecuenciaEditDto);
				}
				else{
					ConvenioDataService.ObtenerNuevaConsecuenciaParaEdicion()
					.then(function(consecuencia){
						def.resolve(consecuencia);
					});
				}
				return def.promise;
			}
		}
	};

	return module;
})();