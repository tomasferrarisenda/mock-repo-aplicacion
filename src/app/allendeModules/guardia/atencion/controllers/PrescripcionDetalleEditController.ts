import * as angular from 'angular';

export default (function () {
	'use strict';
	const module = { init : (ngModule: any) => {} };

	module.init = function (module) {

		module.controller('PrescripcionDetalleEditController', PrescripcionDetalleEditController);

		PrescripcionDetalleEditController.$inject = ['$scope', '$log', '$q', '$filter', '$location', 'COLOR_GUARDIA', 'AlertaService',
		'TITLE_ATENCION', 'ACTION_ATENCION', 'GuardiaAtencionDataService', 'GuardiaAtencionLogicService',
		'GuardiaAtencionAuthService', '$uibModalInstance'];

		function PrescripcionDetalleEditController ($scope, $log, $q, $filter,$location, COLOR_GUARDIA, AlertaService,
			TITLE_ATENCION,ACTION_ATENCION, GuardiaAtencionDataService, GuardiaAtencionLogicService,
			GuardiaAtencionAuthService , $uibModalInstance) {

			$log.debug('PrescripcionDetalleEditController: ON.-');

			/* ------------------------------ API Y VARIABLES ------------------------------ */
			


			$scope.color = COLOR_GUARDIA;

			$scope.title = {
				module: TITLE_ATENCION.MODULE,
				page: TITLE_ATENCION.NEW_MEDICAMENTO
			};

			$scope.formData = {
				detalle: '',
				medicamento: '',
				descartable: '',
				observacion: ''
			};

			$scope.data = {
				detalle: [],
				vias: [],
				tiposDosis: [],
				usuario: ''
			};

			$scope.formControl = {
				error: true,
				loading: false,
				existeMedicamentos: false,
				cargarMedicamentos: false,
				medicamentoCargado: false,
				descartableCargado: false,
				existeDescartables: false,
				cargarDescartables: false,
				existeObservaciones: false,

				sumaMedicamentos: sumaMedicamentos,
				restaMedicamentos: restaMedicamentos,
				sumaDescartables: sumaDescartables,
				restaDescartables: restaDescartables,
				cargarMedicamento: cargarMedicamento,
				cargarDescartable: cargarDescartable,
				datoCargadoMedicamento: datoCargadoMedicamento,
				datoCargadoDescartable: datoCargadoDescartable,
				newMedicamento:newMedicamento,
				newDescartable: newDescartable,
				reemplazar: reemplazar,
				reloadPage: activate,
				ok : guardar,
				cancel : cancel
			};

			/* ------------------------------ IMPLEMENTACIÓN ------------------------------ */


			function inicializarVariables () {
				$scope.data.prescripcion = GuardiaAtencionDataService.prescripcion;
				$scope.data.ubicacion = GuardiaAtencionDataService.ubicacion;
				$scope.data.detalle = angular.copy(GuardiaAtencionDataService.detalle);
				$log.debug("DEtalle: ",$scope.data.detalle);
				$scope.data.paciente  = GuardiaAtencionDataService.prescripcion.Paciente;
				$scope.data.vias = GuardiaAtencionDataService.vias;
				$scope.data.tiposDosis = GuardiaAtencionDataService.tiposDosis;
				for (var i = 0; i < $scope.data.detalle.Materiales.length; i++) {
					// getMaterial($scope.data.detalle.Materiales[i],i);
					comprobarStock(i);
					$scope.data.detalle.Materiales[i].minimo = true;
					var tipoDosis = {
						Nombre: $scope.data.detalle.Materiales[i].TipoDosis
					};
					var via = {
						Nombre: $scope.data.detalle.Materiales[i].Via
					};
					$scope.data.detalle.Materiales[i].TipoDosis = tipoDosis;
					$scope.data.detalle.Materiales[i].Via = via;
				}
				$scope.data.detalle = GuardiaAtencionLogicService.separarMateriales($scope.data.detalle);
				if($scope.data.detalle.Medicamentos.length != 0)
				{
					$scope.formControl.existeMedicamentos = true;
				}
				if($scope.data.detalle.ObservacionMedica != null)
				{
					$scope.formControl.existeObservaciones = true;
				}
				// $scope.data.detalle.id_usuario_realiza = $scope.data.usuario.Id;
				// $log.debug("usuarioREaliza",scope.data.detalle.id_usuario_realiza);
			}

			function comprobarStock(j) {
				for (var i = 0; i < $scope.data.medicamentos.length; i++) {
					if($scope.data.medicamentos[i].Id == $scope.data.detalle.Materiales[j].Producto.Id)
					{
						$scope.data.detalle.Materiales[j].hayStock = true;
						$scope.data.detalle.Materiales[j].Producto.StockNuevaCordoba = $scope.data.medicamentos[i].StockNuevaCordoba;
						$scope.data.medicamentos.splice(i,1);
					}		
				}
				if(!$scope.data.detalle.Materiales[j].hayStock)
				{
					$scope.data.detalle.Materiales[j].costo = 0;
					// $scope.data.detalle.Materiales[j].maximo = true;
				}
				if($scope.data.detalle.Materiales[j].costo == 0)
				{
					$scope.data.detalle.Materiales[j].maximo = true;
				}
			}

			function sumaMedicamentos(pMaterial) {
				for (var i = 0; i < $scope.data.detalle.Medicamentos.length; i++) {
					if($scope.data.detalle.Medicamentos[i].Producto.Id == pMaterial.Producto.Id)
					{
						$scope.data.detalle.Medicamentos[i].Cantidad += 1;
						$scope.data.detalle.Medicamentos[i].minimo = false;
						if($scope.data.detalle.Medicamentos[i].Cantidad == $scope.data.detalle.Medicamentos[i].Producto.StockNuevaCordoba)
						{
							$scope.data.detalle.Medicamentos[i].maximo = true;
						}
					}
				}
			}

			function restaMedicamentos(pMaterial) {
				for (var i = 0; i < $scope.data.detalle.Medicamentos.length; i++) {
					if($scope.data.detalle.Medicamentos[i].Producto.Id == pMaterial.Producto.Id)
					{
						$scope.data.detalle.Medicamentos[i].Cantidad -= 1;
						$scope.data.detalle.Medicamentos[i].maximo = false;
						if($scope.data.detalle.Medicamentos[i].Cantidad == 0)
						{
							$scope.data.detalle.Medicamentos[i].minimo = true;
						}
					}
				}
			}

			function sumaDescartables(pMaterial) {
				for (var i = 0; i < $scope.data.detalle.Descartables.length; i++) {
					if($scope.data.detalle.Descartables[i].Producto.Id == pMaterial.Producto.Id)
					{
						$scope.data.detalle.Descartables[i].Cantidad += 1;
						$scope.data.detalle.Descartables[i].minimo = false;
						if($scope.data.detalle.Descartables[i].Cantidad == $scope.data.detalle.Descartables[i].Producto.StockNuevaCordoba)
						{
							$scope.data.detalle.Descartables[i].maximo = true;
						}
					}
				}
			}

			function restaDescartables(pMaterial) {
				for (var i = 0; i < $scope.data.detalle.Descartables.length; i++) {
					if($scope.data.detalle.Descartables[i].Producto.Id == pMaterial.Producto.Id)
					{
						$scope.data.detalle.Descartables[i].Cantidad -= 1;
						$scope.data.detalle.Descartables[i].maximo = false;
						if($scope.data.detalle.Descartables[i].Cantidad == 0)
						{
							$scope.data.detalle.Descartables[i].minimo = true;
						}
					}
				}
			}


			function guardar() {
				var detalle = GuardiaAtencionDataService.detalle;
				for (var i = $scope.data.detalle.Medicamentos.length - 1; i >= 0; i--) {
					for (var j = detalle.Materiales.length - 1; j >= 0; j--) {
						if(detalle.Materiales[j].Id == $scope.data.detalle.Medicamentos[i].Id)
						{
							detalle.Materiales[j].Cantidad = $scope.data.detalle.Medicamentos[i].Cantidad;
						}
					}
					if(!$scope.data.detalle.Medicamentos[i].Id)
					{
						var medicamento = {
							IdProducto: $scope.data.detalle.Medicamentos[i].Producto.Id,
					        Cantidad: $scope.data.detalle.Medicamentos[i].Cantidad,
					        Dosis: $scope.data.detalle.Medicamentos[i].Dosis,
					        IdTipoDosis: $scope.data.detalle.Medicamentos[i].TipoDosis.Id,
					        IdVia: $scope.data.detalle.Medicamentos[i].Via.Id,
				        	IdPrescripcionDetalleMaterial: $scope.data.detalle.Medicamentos[i].IdPrescripcionDetalleMaterial
						};
						detalle.Materiales.push(medicamento);
					}
				}

				for (var i = $scope.data.detalle.Descartables.length - 1; i >= 0; i--) {
					for (var j = detalle.Materiales.length - 1; j >= 0; j--) {
						if(detalle.Materiales[j].Id == $scope.data.detalle.Descartables[i].Id)
						{
							detalle.Materiales[j].Cantidad = $scope.data.detalle.Descartables[i].Cantidad;
						}
					}
					if(!$scope.data.detalle.Descartables[i].Id)
					{
						var descartable = {
							IdProducto: $scope.data.detalle.Descartables[i].Producto.Id,
					        Cantidad: $scope.data.detalle.Descartables[i].Cantidad
						};
						detalle.Materiales.push(descartable);
					}
				}
				detalle.ObservacionEnfermeria = $scope.formData.observacion;
				GuardiaAtencionDataService.realizarPrescripcion(detalle)
					.then(function() {
						AlertaService.NewSuccess('Indicacion Realizada');
						// limpiar();
 						// actualizarPrescripcion()
 						$uibModalInstance.close();
					});

			}

			function cancel () {
				$uibModalInstance.dismiss('cancel');
			}

			function cargarMedicamento() {
				if(!$scope.formControl.cargarMedicamentos)
				{
					$scope.formControl.cargarMedicamentos = true;
				}
				else
				{
					$scope.formControl.cargarMedicamentos = false;
				}
			}

			function cargarDescartable() {
				if(!$scope.formControl.cargarDescartables)
				{
					$scope.formControl.cargarDescartables = true;
				}
				else
				{
					$scope.formControl.cargarDescartables = false;
				}
			}

			function datoCargadoMedicamento () {
				$scope.formControl.medicamentoCargado = GuardiaAtencionLogicService.datosCompletosMedicamento($scope.formData.medicamento);
 			}

 			function datoCargadoDescartable() {
 				$scope.formControl.descartableCargado = GuardiaAtencionLogicService.datosCompletosDescartable($scope.formData.descartable);
 			}

			function newMedicamento() {
				var medicamento : any = {
					Producto: $scope.formData.medicamento,
					TipoDosis: $scope.formData.medicamento.TipoDosis,
					Via: $scope.formData.medicamento.Via,
					Dosis: $scope.formData.medicamento.Dosis,
					cargadoPorEnfermeria: true,
					Cantidad: 0,
					minimo: true,
					maximo: ($scope.formData.medicamento.StockNuevaCordoba == 0)
				};

				for (var i = $scope.data.detalle.Medicamentos.length - 1; i >= 0; i--) {
					if($scope.data.detalle.Medicamentos[i].reemplazado)
					{
						medicamento.IdPrescripcionDetalleMaterial=$scope.data.detalle.Medicamentos[i].Id;
						$scope.data.detalle.Medicamentos[i].yaReemplazado = true;
						$scope.data.detalle.Medicamentos[i].reemplazado = false;
					}
				}

				// $scope.data.detalle.Medicamentos = GuardiaAtencionLogicService.addFromList($scope.data.detalle.Medicamentos,medicamento);
				var existe = false;
				for (var i = 0; i < $scope.data.detalle.Medicamentos.length; i++) {
					if($scope.data.detalle.Medicamentos[i].Producto.Id == medicamento.Producto.Id)
						existe = true;
				}
				if(!existe)
					$scope.data.detalle.Medicamentos.push(medicamento);
				$log.debug('medicamento',medicamento,$scope.data.detalle.Medicamentos);
				$scope.formData.medicamento = '';
				datoCargadoMedicamento();
				cargarMedicamento();
			}

			function reemplazar(pMedicamento) {
				for (var i = $scope.data.detalle.Medicamentos.length - 1; i >= 0; i--) {
					if($scope.data.detalle.Medicamentos[i].Id != pMedicamento.Id)
					{
						$scope.data.detalle.Medicamentos[i].reemplazado = false;
					}
				}
			}

			function newDescartable() {
				var descartable = {
					Producto: $scope.formData.descartable,
					Cantidad: 0,
					minimo: true,
					maximo: ($scope.formData.descartable.StockNuevaCordoba == 0)
				};
				// $scope.data.detalle.Descartables = GuardiaAtencionLogicService.addFromList($scope.data.detalle.Descartables,descartable);
				$log.debug('descartable',descartable,$scope.data.detalle.Descartables);
				var existe = false;
				for (var i = 0; i < $scope.data.detalle.Descartables.length; i++) {
					if($scope.data.detalle.Descartables[i].Producto.Id == descartable.Producto.Id)
						existe = true;
				}
				if(!existe)
					$scope.data.detalle.Descartables.push(descartable);

				$scope.formData.descartable = '';
				datoCargadoDescartable();
				if($scope.data.detalle.Descartables.length != 0)
				{
					$scope.formControl.existeDescartables = true;
				}
				else
				{
					$scope.formControl.existeDescartables = false;
				}
				cargarDescartable();
			}



			/* ------------------------------ ACTIVATE ------------------------------ */

			activate();

			/* Método inicializador */
			function activate () {
				$log.debug('PrescripcionDetalleEditController: Inicializar ON.-');

			// 	vm.formControl.loading = true;

				$q.all([
					GuardiaAtencionDataService.getAllMedicamentosByUbicacion(),
					GuardiaAtencionDataService.getAllDescartablesByUbicacion(),
					// GuardiaAtencionDataService.getUsuarioByNombre(GuardiaAtencionDataService.usuario.userName)
				])
				.then(activateOk, activateError);
			}

			function activateOk (pResult) { 
				$scope.data.medicamentos = pResult[0];
				// $log.debug('$scope.data.medicamentos',$scope.data.medicamentos);
				$scope.data.descartables = pResult[1];
				// $scope.data.usuario = pResult[2];
				$log.debug('medicamentos',$scope.data.medicamentos);
				// $log.debug('$scope.data.descartables',$scope.data.descartables);
				$scope.formControl.loading = false;
				inicializarVariables();
			}

			function activateError () {
				$scope.formControl.loading = false;
				$scope.formControl.error = true;
			}
		}
	};

	return module;
})();