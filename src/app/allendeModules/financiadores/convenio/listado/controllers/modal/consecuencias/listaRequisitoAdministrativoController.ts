/**
 * @author:			Pedro Ferrer
 * @description:	listaRequisitoAdministrativoController
 * @type:			Controller
 **/
import * as angular from 'angular';

export default (function(){
	const module = { init : (ngModule: any) => {} };

	module.init = function (module) {

		module.controller('listaRequisitoAdministrativoController', listaRequisitoAdministrativoController);

		listaRequisitoAdministrativoController.$inject = ['Logger', '$state', 'ModalService', '$q', 'ConvenioDataService', '$uibModalInstance', '$scope', 'orderByFilter', '$filter', 'consecuencia', 'TIPO_REQUISITO'];

		function listaRequisitoAdministrativoController ($log, $state, ModalService, $q, ConvenioDataService, $uibModalInstance, $scope, orderByFilter, $filter, consecuencia, TIPO_REQUISITO) {

			/* ------------------------------------------------ LOG ------------------------------------------------ */

			$log = $log.getInstance('listaRequisitoAdministrativoController');
			/* ----------------------------------------- API Y VARIABLESES ----------------------------------------- */

			var vm = this;

			vm.TIPO_REQUISITO = TIPO_REQUISITO;

			vm.title = {
				name : '',
				icon : '',
			};

			vm.data = {
				listaRequisitos : null,
				consecuencia : consecuencia,
				valorDto : null
			};

			vm.filter = {
				puedeGuardar : 0
			};

			vm.formControl = {
				cancel : cancel,
				guardar : guardar,
				requisitoSeleccion : requisitoSeleccion
			};

			/* ------------------------------------------- IMPLEMENTACIÓN ------------------------------------------- */

			/* FORMULARIO */
			function cancel () {
				$uibModalInstance.dismiss('close');
			}

			function guardar () {
				var elementoExiste;
				for (var j = 0; j < vm.data.listaRequisitos.length; j++) {
					elementoExiste = false;
					for (var i = 0; i < vm.data.consecuencia.Valores.length; i++) {
						if(vm.data.consecuencia.Valores[i].IdValor === vm.data.listaRequisitos[j].Id || ( vm.data.consecuencia.Valores[i].IdValor === 0)){
							elementoExiste = true;
							if(vm.data.listaRequisitos[j].Seleccionado){
								var nuevoValorDto = angular.copy(vm.data.valorDto)
								completarValorDto(nuevoValorDto, vm.data.listaRequisitos[j]);
								nuevoValorDto.Id = vm.data.consecuencia.Valores[i].Id;
								vm.data.consecuencia.Valores[i] = nuevoValorDto;
							}
							else{
								vm.data.consecuencia.Valores.splice(i,1);
								i= i-1;
							}
							break;
						}
					}
					if(!elementoExiste && vm.data.listaRequisitos[j].Seleccionado){
						var nuevoValorDto = angular.copy(vm.data.valorDto)
						completarValorDto(nuevoValorDto, vm.data.listaRequisitos[j]);
						vm.data.consecuencia.Valores.push(nuevoValorDto);
					}
				}
				ConvenioDataService.ObtenerConsecuenciaConValoresFormateados(vm.data.consecuencia)
				.then(function(consecuenciaFormateada){
					$uibModalInstance.close(consecuenciaFormateada);
				});
			}

			function completarValorDto(nuevoValorDto, elemento){
				nuevoValorDto.IdValor = elemento.Id;
				nuevoValorDto.Nombre = elemento.Nombre;
				nuevoValorDto.Valor = elemento.TextoInformativo;
			}

			function requisitoSeleccion(requisito){
				requisito.Seleccionado = !requisito.Seleccionado;
				if(requisito.Seleccionado)
					vm.filter.puedeGuardar++;
				else{
					if(requisito.IdTipoRequisitoAdministrativo === TIPO_REQUISITO.TEXTO_INFORMATIVO){
						requisito.TextoInformativo = "";
					}
					vm.filter.puedeGuardar--;
				}
			}
			/* ---------------------------------------------- ACTIVATE ---------------------------------------------- */
			

			activate();

			function activate () {
				vm.title.name = 'Seleccionar Requisitos Administrativos';
				vm.title.icon = 'NEW2';
				vm.data.consecuencia = consecuencia;

				ObtenerRequisitosAdministrativosParaSeleccion().then(function(listaRequisitos){
					vm.data.listaRequisitos = listaRequisitos;
					
					for (var i = 0; i < vm.data.listaRequisitos.length; i++) {
						for(var j = 0; j < vm.data.consecuencia.Valores.length; j++)
						if(vm.data.listaRequisitos[i].Id === vm.data.consecuencia.Valores[j].IdValor){
							vm.data.listaRequisitos[i].Seleccionado = true;
							vm.filter.puedeGuardar++;
							if(vm.data.listaRequisitos[i].IdTipoRequisitoAdministrativo === TIPO_REQUISITO.TEXTO_INFORMATIVO){
								vm.data.listaRequisitos[i].TextoInformativo = vm.data.consecuencia.Valores[j].Valor;
							}
						}
					}
				});

				ConvenioDataService.ObtenerNuevoValorCondicionEditDto().then(function(valorDto){
					vm.data.valorDto = valorDto;
				});
			}

			function ObtenerRequisitosAdministrativosParaSeleccion(){
				var def = $q.defer();
				ConvenioDataService.ObtenerRequisitosAdministrativosParaSeleccion(vm.data.consecuencia.Id)
				.then(function(listaRequisitos){
					def.resolve(listaRequisitos);
				});
				return def.promise;
			}
		}
	};

	return module;
})();