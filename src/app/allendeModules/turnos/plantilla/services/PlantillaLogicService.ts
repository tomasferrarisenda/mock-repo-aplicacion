/**
 * @author:			Pablo Pautasso
 * @description:	
 * @type:			Service
 **/
import * as angular from 'angular';

import plantillaNewView = require('../templates/plantilla-new.tpl.html');
import plantillaVerView = require('../templates/plantilla-view.tpl.html');
import duracionesTurnosEditView = require('../templates/duraciones-turnos-edit.tpl.html');
import reglasCantidadesEditView = require('../templates/reglas-cantidades-edit.tpl.html');
import plantillaImpactoAplicarView = require('../templates/plantilla-impacto-aplicar.tpl.html');
import plantillaItemsCopiarView = require('../templates/plantilla-items-copiar.tpl.html');
import turnosPorGenerarView = require('../templates/turnos-por-generar.tpl.html');

export default (function () {
	'use strict';


	const module = { init: (ngModule: any) => { } };

	module.init = function (module) {

		module.factory('PlantillaLogicService', PlantillaLogicService);

		PlantillaLogicService.$inject = ['Logger', '$uibModal'];

		function PlantillaLogicService($log, $uibModal) {

			$log = $log.getInstance('PlantillaLogicService');

			$log.debug('ON.-');

			/* ------------------------------------------ API Y VARIABLES ------------------------------------------ */

			const service = {
				nuevoItemDePlantilla: nuevoItemDePlantilla,
				viewPlantilla: viewPlantilla,
				viewPlantillaTurnosPorGenerar: viewPlantillaTurnosPorGenerar,

				viewListDuracionTurnos: viewListDuracionTurnos,
				viewReglaCantidadTurnosDetalle: viewReglaCantidadTurnosDetalle,

				viewImpactoAplicarPlantilla: viewImpactoAplicarPlantilla,

				openItemCopiarPlantilla: openItemCopiarPlantilla,
				abrirReglasDeTurnos: abrirReglasDeTurnos,

				setearObservacionesParaSucursales: setearObservacionesParaSucursales,
				getObservacionToShow: getObservacionToShow,

				verPrestacionesServicioRecurso: verPrestacionesServicioRecurso
			};

			return service;

			/* ------------------------------------------- IMPLEMENTACIÓN ------------------------------------------- */

			function nuevoItemDePlantilla(startTime, endTime, pServicio, pRecurso, pItemPlantillaAEditar, esSobreturno) {


				return $uibModal.open({
					template: plantillaNewView,
					controller: 'PlantillaModalNewController',
					controllerAs: 'vm',
					size: 'lg',
					resolve: {

						StartTime: function () {
							return startTime;
						},
						EndTime: function () {
							return endTime;
						},
						Title: function () {
							return 'Opciones de plantilla';
						},
						Servicio: function () {
							return pServicio;
						},
						Recurso: function () {
							return pRecurso;
						},
						ItemPlantillaAEditar: function () {
							return pItemPlantillaAEditar;
						},
						EsSobreturno: function () {
							return esSobreturno;
						}

					}

				}).result;

			}


			function viewPlantilla(pPlantilla, pServicio, pRecurso) {

				return $uibModal.open({
					template: plantillaVerView,
					controller: 'PlantillaModalViewController',
					controllerAs: 'vm',
					size: 'lg',
					resolve: {
						IdPlantilla: function () {
							return pPlantilla;
						},
						ServicioMedico: function () {
							return pServicio;
						},
						Recurso: function () {
							return pRecurso;
						},
						Title: function () {
							return 'View de plantilla';
						},
						//Module: Module
					}

				}).result;

			}


			function viewPlantillaTurnosPorGenerar(pIdPlantilla) {
				return $uibModal.open({
					template: turnosPorGenerarView,
					controller: 'TurnosPorGenerarController',
					controllerAs: 'vm',
					size: 'lg',
					resolve: {
						IdPlantilla: function () { return pIdPlantilla; },
						Title: function () { return 'Turnos que genera la plantilla (Modelo para una semana)'; }
					}
				}).result;
			}


			function viewListDuracionTurnos(pIdServicio, pIdRecurso, pIdTipoRecurso, pIdDuracionTurno) {

				return $uibModal.open({
					template: duracionesTurnosEditView,
					controller: 'DuracionesTurnosEditController',
					controllerAs: 'vm',
					size: 'lg',
					resolve: {
						IdServicio: function () {
							return pIdServicio;
						},
						IdRecurso: function () {
							return pIdRecurso;
						},
						IdTipoRecurso: function () {
							return pIdTipoRecurso;
						},
						IdDuracionEditar: function () {
							return pIdDuracionTurno;
						},
						Title: function () {
							return 'View de plantilla';
						}

					}

				}).result;

			}

			function viewReglaCantidadTurnosDetalle(pIdServicio, pIdRecurso, pIdTipoRecurso, pIdTipoDemanda, pIdRegla) {

				return $uibModal.open({
					template: reglasCantidadesEditView,
					controller: 'ReglasDeCantidadesEditController',
					controllerAs: 'vm',
					size: 'lg',
					resolve: {
						IdServicio: function () {
							return pIdServicio;
						},
						IdRecurso: function () {
							return pIdRecurso;
						},
						IdTipoRecurso: function () {
							return pIdTipoRecurso;
						},
						IdReglaEditar: function () {
							return pIdRegla;
						},
						IdTipoDemanda: function () {
							return pIdTipoDemanda;
						},
						Title: function () {
							return 'Vista de Reglas de Cantidades de Turnos';
						}

					}

				}).result;

			}

			function viewImpactoAplicarPlantilla(_plantilla) {


				return $uibModal.open({
					template: plantillaImpactoAplicarView,
					controller: 'ImpactoAplicarPlantillaController',
					controllerAs: 'vm',
					size: 'lg',
					resolve: {
						Plantilla: function () {
							return _plantilla;
						}

					}

				}).result;


			}


			function openItemCopiarPlantilla(_eventsPlantilla) {

				return $uibModal.open({
					template: plantillaItemsCopiarView,
					controller: 'PlantillaModalItemCopiarController',
					controllerAs: 'vm',
					size: 'md',
					resolve: {
						EventosPlantilla: function () {
							return _eventsPlantilla;
						}

					}

				}).result;
			}

			function abrirReglasDeTurnos(pIdServicio, pIdRecurso, pIdTipoRecurso) {
				return $uibModal.open({
					component: 'saReglasDeTurnosConsulta',
					size: 'lg',
					resolve: {
						IdServicio: function () {
							return pIdServicio;
						},
						IdRecurso: function () {
							return pIdRecurso;
						}, 
						IdTipoRecurso: function () {
							return pIdTipoRecurso;
						}
					}
				}).result;
			}


			function setearObservacionesParaSucursales(resultPlantillas) {

				let mC, mN;
				
				angular.forEach(resultPlantillas, function (plantilla) {

					if (plantilla.Observaciones && (plantilla.Observaciones.includes("<cerro>") || (plantilla.Observaciones.includes("<nuevacba>")))){

						const regexCerro = /\<cerro>(.*?)\<\/cerro>/g;
						const regexNvaCba = /\<nuevacba>(.*?)\<\/nuevacba>/g;
						
						let strNueva = angular.copy(plantilla.Observaciones.replace(/\n/g, '<br>'));
						let strCerro = angular.copy(plantilla.Observaciones.replace(/\n/g, '<br>'));
						
	
						mC = regexCerro.exec(strCerro);
	
						if (mC !== null) {
							if (!plantilla.ObservacionToShow) plantilla.ObservacionToShow = '';
	
							plantilla.ObservacionToShow = plantilla.ObservacionToShow + ' ' + mC[1];
						}
	
						mN = regexNvaCba.exec(strNueva);
	
						if (mN !== null) {
							if (!plantilla.ObservacionToShow) plantilla.ObservacionToShow = '';
	
							plantilla.ObservacionToShow = plantilla.ObservacionToShow + ' ' + mN[1];
						}
	
						plantilla.ObservacionToShow = plantilla.ObservacionToShow.replace(/<br>/g, '\n');
					}
					

				});

				return resultPlantillas;

			}

			function getObservacionToShow(observacionConTags, sucursalesHab) {
				
				var sucursales = angular.copy(sucursalesHab);
				var retStr = '';

				angular.forEach(sucursales, function (sucursal) {

					const regexCerro = /\<cerro>(.*?)\<\/cerro>/g;
					const regexNvaCba = /\<nuevacba>(.*?)\<\/nuevacba>/g;

					const str = observacionConTags.replace(/\n/g, '<br>');
					let mC = regexCerro.exec(str);

					if (mC !== null) {
						if (mC[0].includes(sucursal.Nombre.toLowerCase())) {
							retStr = mC[1];
						}
					}

					let mN = regexNvaCba.exec(str);

					if (mN !== null) {
						if (mN[0].includes(sucursal.Nombre.toLowerCase().replace(/\s/g, ""))) {
							retStr = mN[1];
						}
					}

				})

				retStr = retStr.replace(/<br>/g, '\n');

				return retStr;

			}

			function verPrestacionesServicioRecurso(pServicio, pRecurso, pEntidad) {
				return $uibModal.open({
					component: 'saPrestacionesPorRecursoYServicioModal',
					size: 'lg',
					resolve: {
						Servicio: function () {
							return pServicio;
						},
						Recurso: function () {
							return pRecurso;
						},
						Entidad: function () {
							return pEntidad;
						}
					}
				}).result;
			}

		}
	};

	return module;
})();