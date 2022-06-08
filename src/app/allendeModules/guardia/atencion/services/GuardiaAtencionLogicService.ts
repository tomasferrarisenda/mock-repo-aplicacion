
import prescripcionView = require('../templates/prescripcion-view.tpl.html');
import PrescripcionDetalleEdit = require('../templates/prescripcion-detalle-edit.tpl.html');
import prescripcionAlta = require('../templates/prescripcion-alta.tpl.html');
import pedidosDetalle = require('../templates/pedidos-detalle.tpl.html');
import newFojaDetalle = require('../templates/new-foja-detalle.tpl.html');

export default (function () {
	'use strict';

	const module = { init: (ngModule: any) => { } };

	module.init = function (module) {

		module.factory('GuardiaAtencionLogicService', GuardiaAtencionLogicService);

		// Inyección de dependencia
		GuardiaAtencionLogicService.$inject = ['$log', '$uibModal', 'GuardiaAtencionDataService',
			'PRIORIDAD_PRESCRIPCION', 'COLOR_GUARDIA'];

		// Definición del servicio
		function GuardiaAtencionLogicService($log, $uibModal, GuardiaAtencionDataService,
			PRIORIDAD_PRESCRIPCION, COLOR_GUARDIA) {

			$log.debug('GuardiaAtencionLogicService: ON.-');

			// API o Interface
			const service = {
				viewPrescripcion: viewPrescripcion,
				editPrescripcion: editPrescripcion,
				altaPrescripcion: altaPrescripcion,
				viewPedidos: viewPedidos,
				NewFoja: NewFoja,
				datosCompletosMedicamento: datosCompletosMedicamento,
				datosCompletosDescartable: datosCompletosDescartable,
				colorearPrioridad: colorearPrioridad,
				separarMateriales: separarMateriales
			};

			return service;

			function viewPrescripcion() {
				var _modalInstance;

				_modalInstance = $uibModal.open({
					template: prescripcionView,
					controller: 'PrescripcionViewController',
					controllerAs: 'vm',
					size: 'lg'
				});

				return _modalInstance.result;
			}

			function editPrescripcion() {
				var _modalInstance;

				_modalInstance = $uibModal.open({
					template: PrescripcionDetalleEdit,
					controller: 'PrescripcionDetalleEditController',
					controllerAs: 'vm',
					size: 'lg'
				});

				return _modalInstance.result;
			}

			function altaPrescripcion() {
				var _modalInstance;

				_modalInstance = $uibModal.open({
					template: prescripcionAlta,
					controller: 'PrescripcionAltaController',
					controllerAs: 'vm',
					size: 'md'
				});

				return _modalInstance.result;
			}

			function viewPedidos(pUser, pPedidos) {
				var _modalInstance;

				_modalInstance = $uibModal.open({
					template: pedidosDetalle,
					controller: 'PedidosDetalleController',
					controllerAs: 'vm',
					size: 'lg',
					resolve: {
						User: function () {
							return pUser;
						},
						Pedidos: function () {
							return pPedidos;
						}
					}
				});

				return _modalInstance.result;
			}

			function NewFoja(pUser) {
				var _modalInstance;

				_modalInstance = $uibModal.open({
					template: newFojaDetalle,
					controller: 'NewFojaGuardiaDetalleController',
					controllerAs: 'vm',
					size: 'lg',
					resolve: {
						User: function () {
							return pUser;
						}
					}
				});

				return _modalInstance.result;
			}


			// function deleteFromList (pList, pIndex) {
			// 	var newList = [];
			// 	var k = 0;
			// 	for (var i = 0; i < pList.length; i++) {
			// 		if(i != pIndex)
			// 		{
			// 			newList[k] = pList[i];
			// 			k++;
			// 		}
			// 	};
			// 	return newList;
			// }


			function datosCompletosMedicamento(pMedicamento) {
				var _return = false;
				if (pMedicamento.id_material) pMedicamento.Id = pMedicamento.id_material;
				if (pMedicamento.Id != null &&
					pMedicamento.TipoDosis != null &&
					pMedicamento.Via != null) {
					_return = true;
				}
				return _return;
			}

			function datosCompletosDescartable(pDescartable) {
				var _return = false;
				if (pDescartable.id_material) pDescartable.Id = pDescartable.id_material;
				if (pDescartable.Id != null) {
					_return = true;
				}
				return _return;
			}


			function colorearPrioridad(pPrioridad) {
				switch (pPrioridad) {
					case PRIORIDAD_PRESCRIPCION.MUY_URGENTE:
						return COLOR_GUARDIA.ROJO;

					case PRIORIDAD_PRESCRIPCION.URGENTE:
						return COLOR_GUARDIA.NARANJA;

					case PRIORIDAD_PRESCRIPCION.MENOR_URGENCIA:
						return COLOR_GUARDIA.AMARILLO;

					case PRIORIDAD_PRESCRIPCION.NO_URGENTE:
						return COLOR_GUARDIA.VERDE;

					case PRIORIDAD_PRESCRIPCION.REALIZADA:
						return COLOR_GUARDIA.AZUL;

				}
			}

			function separarMateriales(pDetalle) {
				var m = 0;
				var d = 0;
				pDetalle.Medicamentos = [];
				pDetalle.Descartables = [];
				for (var i = 0; i < pDetalle.Materiales.length; i++) {
					if (pDetalle.Materiales[i].TipoMaterial.Nombre == 'Medicamento') {
						pDetalle.Medicamentos[m] = pDetalle.Materiales[i];
						m++;
					}
					else if (pDetalle.Materiales[i].TipoMaterial.Nombre == 'Descartable') {
						pDetalle.Descartables[d] = pDetalle.Materiales[i];
						d++;
					}
				}
				return pDetalle;
			}


		}
	};

	return module;
})();