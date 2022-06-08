/**
 * @author:			Pablo Pautasso
 * @description:	controller para manejar el copiar items a otros dias en editar plantilla
 * @type:			Controller
 **/

import * as angular from 'angular';
 
export default (function () {
   'use strict';
   

	const module = { init : (ngModule: any) => {} };

	module.init = function (module) {

		module.controller('PlantillaModalItemCopiarController', PlantillaModalItemCopiarController);

		PlantillaModalItemCopiarController.$inject = [
			'$location', 'Logger', '$q', '$filter', '$uibModalInstance', 'moment', 'orderByFilter',
			'ModalService', 'EventosPlantilla'
		];

		function PlantillaModalItemCopiarController (
			$location, $log, $q, $filter, $uibModalInstance, moment, orderByFilter,
			ModalService, EventosPlantilla) {

			/* ------------------------------------------------ LOG ------------------------------------------------ */

			$log = $log.getInstance('PlantillaModalItemCopiarController');
			$log.debug('ON.-');
			
			/* ----------------------------------------- API Y VARIABLESES ----------------------------------------- */

			var vm = this;
			vm.today = new Date();
			
			vm.title = {
			
			};

			vm.data = {
				events : EventosPlantilla,
				diasOrigen: []
			};

			vm.formData = {
			};

			vm.formControl = {
				loading : false,
				reloadPage : activate,
				guardar : methodSave,
				cancelar : volver,
				selectDiaOrigen : selectDiaOrigen,
				selectDiaDestino : selectDiaDestino,
				checkDiasSelected : checkDiasSelected
			};

			vm.order = {
				id: 1,
				value: 'IdDia',
				descripcion: 'Id (Asc)',
				reverse: false
			}

			vm.diasDestino = [
			{
				IdDia : 1,
				Nombre : "LUNES",
				Selected : false
			},{
				IdDia : 2,
				Nombre : "MARTES",
				Selected : false
			},{

				IdDia : 3,
				Nombre : "MIERCOLES",
				Selected : false
			},{

				IdDia : 4,
				Nombre : "JUEVES",
				Selected : false
			},{

				IdDia : 5,
				Nombre : "VIERNES",
				Selected : false
			},{

				IdDia : 6,
				Nombre : "SABADO",
				Selected : false
			},{

				IdDia : 7,
				Nombre : "DOMINGO",
				Selected : false
			}];

			/* ------------------------------------------- IMPLEMENTACIÓN ------------------------------------------- */

			/* FORMULARIO */

			function methodSave () {

				//voy a copiar los eventos y los voy a devolver como conjunto de eventos
				//
			
				//obtengo dias de origen seleccionados
				var itemDiaOrigenSelected = vm.data.diasOrigen.find(x => x.Selected === true);
				if(itemDiaOrigenSelected.IdDia == 7) itemDiaOrigenSelected.IdDia = 0;

				//obtengo lista de dias de destino seleccionados
				var itemsDiaDestinoSelected : Array<any> = [];

				angular.forEach(vm.diasDestino, function(_diaDestino, key){
					if(_diaDestino.Selected === true)
						itemsDiaDestinoSelected.push(_diaDestino);
				});

				//obtengo los eventos del dia de origen, siempre sera un solo dia de origen y
				//pueden ser uno o varios eventos
				var eventsDiaOrigen: Array<any> = [];
				angular.forEach(vm.data.events, function(evento, key){
					
					if(evento.IdDia === itemDiaOrigenSelected.IdDia){
						eventsDiaOrigen.push(evento);
					}
				});

				//voy a clonar los eventos pasandole los eventos a clonar y a que dias
				clonarEventos(eventsDiaOrigen, itemsDiaDestinoSelected);
				$uibModalInstance.close(vm.data.events);
			}


			function clonarEventos(eventsDiaOrigen, itemsDiaDestinoSelected) {
				
				angular.forEach(itemsDiaDestinoSelected, function(_diaDestino, key){
					

					angular.forEach(eventsDiaOrigen, function(event, key){
						
						$log.debug('eventclone', event);

						var eventClone = angular.copy(event);
						if (_diaDestino.IdDia === 7) _diaDestino.IdDia = 0;
						eventClone.start = moment(event.start, 'HH:mm').day(_diaDestino.IdDia).week(moment().week());
						eventClone.end = moment(event.end, 'HH:mm').day(_diaDestino.IdDia).week(moment().week());
						eventClone.HoraDesde = event.start.format("HH:mm");
						eventClone.HoraHasta = event.end.format("HH:mm");
						eventClone.IdDia = angular.copy(_diaDestino.IdDia);
						eventClone.Dia = angular.copy(_diaDestino.Nombre);
						eventClone.Id = 0;

						if (eventClone.IdTipoPrestacionesAsignables == 4){

							angular.forEach(eventClone.PrestacionesAsignables, function (prestacion) {
								prestacion.Id = 0;
							})
						}
					
						
						eventClone.IdEvent =
							vm.data.events[vm.data.events.length - 1].IdEvent + 1;

						$log.debug('lo copie');
						vm.data.events.push(eventClone);

					});


				});

			}

			function volver () {
				
				$uibModalInstance.dismiss('cancel');
			}

			function setDiasOrigen() {
				
				//seteo los dias de origen
				angular.forEach(vm.data.events, function(item, key){
					
					var  diaToAdd = {
						IdDia : item.IdDia,
						Nombre: vm.diasDestino.find(x => x.IdDia == item.IdDia).Nombre || item.Dia.toUpperCase(),
						Selected : false
					};

					

					if (angular.isUndefined(vm.data.diasOrigen.find(x => x.IdDia === diaToAdd.IdDia && x.Nombre.toUpperCase() === diaToAdd.Nombre.toUpperCase()))){

						// if(diaToAdd.IdDia === 0) diaToAdd.IdDia = 7;
						vm.data.diasOrigen.push(diaToAdd);
					}

				});

				angular.forEach(vm.data.diasOrigen, function(dia_origen, key){
					if(dia_origen.IdDia === 0) dia_origen.IdDia = 7;
				});

				vm.data.diasOrigen = orderByFilter(vm.data.diasOrigen, vm.order.value, vm.order.reverse);

				//con los dias de origen obtengo lista de dias de destino
				angular.forEach(vm.data.diasOrigen, function(diaOrigen, key){

					vm.diasDestino = $.grep(vm.diasDestino, function(e: any) {
								return e.IdDia != diaOrigen.IdDia;
							});
				});

			}


			function selectDiaOrigen(dia) {
				$log.debug('dia',dia);
				dia.Selected = true;
				angular.forEach(vm.data.diasOrigen, function(_dia, key){
					if(dia.IdDia !== _dia.IdDia) _dia.Selected = false;
				});
			}


			function selectDiaDestino(dia) {
				$log.debug('dia',dia);
				dia.Selected = (dia.Selected) ? false : true;
			}



			function checkDiasSelected() {
				
				var ret = true;

				angular.forEach(vm.data.diasOrigen, function(diaOrigen){
					if(diaOrigen.Selected === true){

						angular.forEach(vm.diasDestino, function(diaDestino){
							if(diaDestino.Selected === true) ret = false;
						});
					}
				});

				return ret;

			}
			/* ---------------------------------------------- ACTIVATE ---------------------------------------------- */

			activate();

			function activate () {
				$log.debug('Inicializar ON.-');
				vm.formControl.loading = true;

				$log.debug('obteniendo eventos',vm.data.events);

				//seteo dias obtenidos desde eventos en columna de dia izquierda o 'Origen'
				setDiasOrigen();

				// $q.all([])
				// .then(successCallback, errorCallback);
				
	 			function successCallback (pResults) {
	 				// variable = pResult[0];
	 				
	 				vm.formControl.loading = false;
	 				vm.formControl.error = false;
	 				$log.debug('Inicializar OK.-', pResults);
	 			}

	 			function errorCallback (pError) {
	 				vm.formControl.loading = false;
	 				vm.formControl.error = true;
	 				$log.error('Inicializar ERROR.-', pError);
	 				ModalService.error(pError.message);
	 			}
			}

		}
	};

	return module;
})();