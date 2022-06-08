/**
 * @author:			Pedro Ferrer
 * @description:	UnidadArancelariaEditTpl
 * @type:			Controller
 **/
export default (function(){
	const module = { init : (ngModule: any) => {} };

	module.init = function (module) {

		module.controller('UnidadArancelariaEditTplController', UnidadArancelariaEditTplController);

		UnidadArancelariaEditTplController.$inject = ['Logger', '$state', 'ModalService', 'ConvenioDataService', '$scope', '$uibModalInstance', 'idUnidadEdit', '$q', '$stateParams'];

		function UnidadArancelariaEditTplController ($log, $state, ModalService, ConvenioDataService, $scope, $uibModalInstance, idUnidadEdit, $q, $stateParams) {

			/* ------------------------------------------------ LOG ------------------------------------------------ */

			$log = $log.getInstance('UnidadArancelariaEditTplController');
			/* ----------------------------------------- API Y VARIABLESES ----------------------------------------- */

			var vm = this;
			vm.today = new Date();
			
			vm.title = {
				name : '',
				icon : ''
			};

			vm.data = {
				unidades : ''
			};

			vm.filter = {
				unidadElegida : '',
				planMutual : '',
				valor : '',
				idMutual : '',
				idPlanElegido : '',
				EsUnidadBasica : false,
				nombrePlanInicial : ''
			};

			vm.formControl = {		
				cancel : cancel,
				guardar : guardar
			};

			vm.unidadDevolucion = {
				Id: null,
				NombrePlanMutual : '',
				NombreTipoUnidad : '',
				NombreUnidad:'',
				Valor: null
			};

			/* ------------------------------------------- IMPLEMENTACIÓN ------------------------------------------- */

			/* FORMULARIO */
			function guardar(isValid) {
				if(!vm.filter.planMutual && !vm.filter.EsUnidadBasica){
					ModalService.warning("Verifique por favor. -Seleccione un plan.");
					return;
				}

				if(isValid){
					vm.data.unidadArancelariaEdit.IdPlanMutual = vm.filter.planMutual ? vm.filter.planMutual.Id : 0;
					vm.data.unidadArancelariaEdit.NombrePlanMutual = vm.filter.planMutual ? vm.filter.planMutual.Nombre : 'TODOS';
					vm.data.unidadArancelariaEdit.IdUnidadArancelaria = vm.filter.unidadElegida.Id;
					vm.data.unidadArancelariaEdit.IdTipoUnidadArancelaria = vm.filter.unidadElegida.IdTipoUnidadArancelaria;
					vm.data.unidadArancelariaEdit.NombreTipoUnidadArancelaria = vm.filter.unidadElegida.NombreTipoUnidadArancelaria;
					vm.data.unidadArancelariaEdit.NombreUnidadArancelaria = vm.filter.unidadElegida.Nombre;
					vm.data.unidadArancelariaEdit.Valor = vm.filter.valor;
				
					ConvenioDataService.GuardarUnidadArancelariaConvenio(vm.data.unidadArancelariaEdit)
					.then(function(result){
						if (result.IsOk === false) {
							ModalService.warning("Verifique por favor. " + result.Message);
						}
						else {
							vm.unidadDevolucion.Id = result.Entidad.Id;
							vm.unidadDevolucion.NombrePlanMutual = result.Entidad.NombrePlanMutual;
							vm.unidadDevolucion.NombreTipoUnidad = result.Entidad.NombreTipoUnidadArancelaria;
							vm.unidadDevolucion.NombreUnidad = result.Entidad.NombreUnidadArancelaria;
							vm.unidadDevolucion.Valor = result.Entidad.Valor;
							$uibModalInstance.close(vm.unidadDevolucion);
							ModalService.success("Se ha guardado la unidad arancelaria.");
						}
					});
				}
			}

			$scope.$watch(function() {
				return vm.filter.valor;
			}, function() {
				if(vm.filter.valor===null)
					vm.filter.valor = 0;
			});

			function cancel() {
				$uibModalInstance.dismiss('close');
			}

			/* ---------------------------------------------- ACTIVATE ---------------------------------------------- */

			activate();

			function activate () {

				vm.title.icon = idUnidadEdit === null ? 'NEW2' : 'EDIT';
				vm.title.name = idUnidadEdit === null ? 'Nueva unidad arancelaria' : 'Editar unidad arancelaria';

				obtenerUnidadArancelariaDto().then(function(unidadEdit){
					vm.data.unidadArancelariaEdit = unidadEdit;
					vm.filter.EsUnidadBasica = unidadEdit.IdPlanMutual === 0 && unidadEdit.Id !== 0;
					vm.filter.nombrePlanInicial = vm.filter.EsUnidadBasica ? "Todos" : null;
					ConvenioDataService.ObtenerTodosUnidadArancelaria()
					.then(function(unidades){
						vm.data.unidades = unidades;
						for (var i = vm.data.unidades.length - 1; i >= 0; i--){
							if(vm.data.unidades[i].Id == vm.data.unidadArancelariaEdit.IdUnidadArancelaria){
								vm.filter.unidadElegida = vm.data.unidades[i];
								break;
							}
						}
						vm.filter.valor = vm.data.unidadArancelariaEdit.Valor;
						vm.filter.idMutual = $stateParams.convenioEdit.IdFinanciador;
						vm.filter.idPlanElegido = vm.data.unidadArancelariaEdit.IdPlanMutual;
					});
				});
			}

			function obtenerUnidadArancelariaDto(){
				var def = $q.defer();
				if(idUnidadEdit){
					ConvenioDataService.ObtenerUnidadArancelariaConvenioParaEdicion(idUnidadEdit)
					.then(function(unidadArancelaria){
						def.resolve(unidadArancelaria);
					});
				}
				else{
					ConvenioDataService.ObtenerNuevaUnidadArancelariaConvenioParaEdicion($stateParams.convenioEdit.Id)
					.then(function(unidadArancelaria){
						def.resolve(unidadArancelaria);
					});
				}
				return def.promise;
			}
		}
	};

	return module;
})();