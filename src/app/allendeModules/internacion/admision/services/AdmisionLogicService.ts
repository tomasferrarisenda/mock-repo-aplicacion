/**
 * @author 			emansilla
 * @description 	description
 */
import * as angular from 'angular';

import internadoViewTemplate = require('../../internado/templates/internado-view.tpl.html');
import internadoAltaTemplate = require('../templates/internado-alta.tpl.html');
import internadoProrrogaPrintTemplate = require('../../internado/templates/internado-prorrogas-print.tpl.html');
import internadoCensoPrintTemplate = require('../../internado/templates/internado-censo-print.tpl.html');
import internadoGestionCamaTemplate = require('../../internado/templates/internado-gestion-camas.tpl.html');
import internadoPrint = require('../templates/internado-print.tpl.html');
import internadoAval = require('../templates/internado-aval.tpl.html');
import homeTickerTemplate = require('../templates/home-ticket.tpl.html');
import informeHospitalizacionTemplate = require('../templates/informe-hospitalizacion.tpl.html');
import hojaAdmisionTemplate = require('../../internado/templates/internacion-hoja-admision.tpl.html');
import avalDiferenciaHabitacion = require('../templates/aval-diferencia-habitacion.tpl.html');

export default (function () {
	
	const module = { init : (ngModule: any) => {} };
	
	module.init = function (ngModule) {

		ngModule.factory('AdmisionLogicService', AdmisionLogicService);

		AdmisionLogicService.$inject = ['Logger', '$uibModal', '$window', '$filter', 'DateUtils', '$q',
			'AuthorizationService', 'PrintSelectionService', 'PreadmisionLogicService', 'AdmisionDataService',
			'INTERNACION_INFO'];
		
		function AdmisionLogicService ($log, $uibModal, $window, $filter, DateUtils: IDateUtils, $q,
			AuthorizationService, PrintSelectionService, PreadmisionLogicService, AdmisionDataService,
			INFO) {

			/* ------------------------------------------------ LOG ------------------------------------------------ */

			$log = $log.getInstance('AdmisionLogicService');
			$log.debug('ON.-');

			/* ------------------------------------------ API Y VARIABLES ------------------------------------------ */
			
			/* jshint ignore: start */
			var idInternacion = 0;
			var numeroInternado = 0;
			/* jshint ignore: end */
			const service = {
				crearInternacionForAdmision : crearInternacionForAdmision,

				getPorcentajesCargoInternacion : getPorcentajesCargoInternacion,
				getArrayPorcentaje : getArrayPorcentaje,

				newPacienteFromInternacion : newPacienteFromInternacion,
				darDeAlta : darDeAlta,
				print : print,
				printPulsera : printPulsera,
				printCenso: printCensoInternado,
				printGestionCamas : printGestionCamas,
				printProrrogas : printProrrogas,

				showInModal : showInternacion
			};

			return service;

			/* ------------------------------------------- IMPLEMENTACIÓN ------------------------------------------- */

			/**
			 * Select print
			 * @param  {string} pPrintName Nombre de impresion
			 * @return {string}            [description]
			 */
			function selectPrintTemplate (pPrintName) {
				$log.debug('Nombre impresion', pPrintName);
				var printSelect : any = '';
				switch (pPrintName) {
					case 'PrintFichaInternacion':
						printSelect = internadoPrint;
						break;
					case 'PrintAval':
						printSelect = internadoAval;
						break;
					case 'PrintHomeTicket':
						printSelect = homeTickerTemplate;
						break;
					case 'PrintInformeHospitalizacion':
						printSelect = informeHospitalizacionTemplate;
						break;
					case 'PrintHojaAdmision':
						printSelect = hojaAdmisionTemplate;
						break;
					// case 'PrintProrrogaInternacion':
					// 	printSelect = 'internacion/admision/templates/internado-prorroga.tpl';
					// 	break;
					case 'PrintAvalDiferenciaHabitacion':
						printSelect = avalDiferenciaHabitacion;
						break;
					default:
						printSelect = '<div>Sin template</div>';
				}

				return printSelect;
			}

			/**
			 * Retorna una lista de objetos PorcentajeCargoInternacion.
			 * @param  {Array} pPorcentajes     Porcentajes correspondientes a la internacion.
			 * @param  {Array} pTiposPorcentaje Tipos de porcentajes que se pueden cargar a la internacion
			 * @return {Array}                  PorcentajesCargoInternacion
			 */
			function getPorcentajesCargoInternacion (pPorcentajes, pTiposPorcentaje) {
				var _listPorcentajes : Array<any>= [];
				var _porcentajeCargo;
				
				for (var i = 0; i < pPorcentajes.length; i++) {
					// Si el porcentaje no es "undefined" y no está vacío
					if (!angular.isUndefined(pPorcentajes[i]) && pPorcentajes[i] !== '' && pPorcentajes[i] !== 0) {
						// creo el objeto
						_porcentajeCargo = {
							id_tipo_porcentaje : pTiposPorcentaje[i].id_tipo_porcentaje,
							porcentaje : pPorcentajes[i]
						};
					} else {
						_porcentajeCargo = {
							id_tipo_porcentaje : pTiposPorcentaje[i].id_tipo_porcentaje,
							porcentaje : 0
						};
					}
					_listPorcentajes.push(_porcentajeCargo);
				}

				// $log.debug(_listPorcentajes);
				return _listPorcentajes;
			}

			function getArrayPorcentaje (pPorcentajesCargoInternacion, pTiposPorcentaje) {
				var arrayPorcentaje : Array<any>= [];

				for (var i = 0; i < pPorcentajesCargoInternacion.length; i++) {
					for (var j = 0; j < pTiposPorcentaje.length; j++) {
						if (pTiposPorcentaje[j].id_tipo_porcentaje == pPorcentajesCargoInternacion[i].id_tipo_porcentaje) {
							arrayPorcentaje[j] = pPorcentajesCargoInternacion[i].porcentaje;
						}
					}
				}
				return arrayPorcentaje;
			}

			/**
			 * Imprime para una internacion la impresion pasada por parametro
			 * @param  {string} pTemplateName   Template
			 * @param  {User} pUser           Usuario activo en el controller que llama al metodo
			 * @param  {int} pIdInternacion  Id de internacion a imprimir
			 * @return {}                 
			 */
			function print (pPrintSelected, pUser, pIdInternacion) {
				$log.debug('print ON.-', pPrintSelected);

				if (pPrintSelected.Nombre == 'PrintOrden' || pPrintSelected.Nombre == 'PrintRP' || 
					pPrintSelected.Nombre == 'PrintPrequirurgicos') {
					
					return PreadmisionLogicService.print(pUser, pPrintSelected, pIdInternacion);
				} else if (pPrintSelected.Nombre == 'PrintPulseraInternado') {
					return printPulsera(pIdInternacion);
				} else {
					var _template, _modalInstance;

					_template = selectPrintTemplate(pPrintSelected.Nombre);

					_modalInstance = $uibModal.open({
						template: _template,
						controller: 'InternadoPrintController',
						controllerAs : 'vm',
						size: 'lg',
						resolve: {
							User : function () {
								return pUser;
							},
							IdInternacion : function () {
								return pIdInternacion;
							}
						}
					});

					return _modalInstance.result;
				}
			}

			function showInternacion (pIdInternacion, pUser) {
				return $uibModal.open({
					template : internadoViewTemplate,
					controller: 'InternadoShowController',
					controllerAs : 'vm',
					size: 'lg',
					resolve: {
						IdInternacion : function () {
							return pIdInternacion;
						},
						User: function () {
							return pUser;
						},
						Title : function () {
							return 'Ver internado';
						},
						Module : function () {
							return 'INTERNADO';
						}
					}
				}).result;
			}

			/**
			 * Llamada a sistema de impresion de pulsera [windows]
			 * @param  {[type]} pIdInternacion [Id internación]
			 */
			function printPulsera (pIdInternacion) {
				var def = $q.defer();
				AdmisionDataService.getOneInternacion(pIdInternacion)
				.then(successCallback, errorCallback);

				function successCallback (pInternacion) {
					$log.debug('PrintPulseraInternado: Llamado');
					$window.location.assign("pulseraurl:// /NUmPAc=" + pInternacion.id_paciente +
						" /NumInter=" + pInternacion.numero_internado);

					def.resolve('ok');
				}

				function errorCallback(pError) {
					def.reject(pError);
				}

				return def.promise;
			}

			function newPacienteFromInternacion (pPaciemte, pIdInternacion, pUser) {
				var _object = {};
				_object['id_internacion'] = pIdInternacion;
				_object['nombre'] = pPaciemte.nombre;
				_object['fecha_nacimiento'] = pPaciemte.fecha_nacimiento;
				_object['id_tipo_sexo'] = pPaciemte.Sexo.id_tipo_sexo;
				_object['numero_matricula'] = pPaciemte.medico_cabecera;
				_object['diagnostico'] = pPaciemte.diagnostico;
				_object['usuario'] = pUser.userName;
				_object['index'] = pUser.index;
				return _object;
			}

			function darDeAlta (pIdInternacion, pUser) {
				var _modalInstance;

				_modalInstance = $uibModal.open({
					template : internadoAltaTemplate,
					controller: 'InternadoAltaController',
					controllerAs : 'vm',
					size: 'md',
					resolve: {
						IdInternacion : function () {
							return pIdInternacion;
						},
						User: function () {
							return pUser;
						}
					}
				});

				return _modalInstance.result;
			}

			function printGestionCamas (pUser, pOrderBy, pInternados) {
				var template = internadoGestionCamaTemplate,
					title = 'Gestión de camas';
				printInternadoList(pUser, pOrderBy, pInternados, title, template);
			}

			function printCensoInternado (pUser, pOrderBy, pInternados) {
				var template = internadoCensoPrintTemplate,
					title = 'Censo de internados';
				printInternadoList(pUser, pOrderBy, pInternados, title, template);
			}

			function printProrrogas (pUser, pOrderBy, pInternados) {
				var template = internadoProrrogaPrintTemplate,
					title = 'Gestión de prorrogas';
				printInternadoList(pUser, pOrderBy, pInternados, title, template);
			}

			function printInternadoList (pUser, pOrderBy, pInternados, pTitle, pTemplate) {
				var _orderBy = '';

				if (pOrderBy) {
					_orderBy  = pOrderBy;
				}

				return $uibModal.open({
					template: pTemplate,
					controller: 'InternadoCensoController',
					controllerAs: 'vm',
					size: 'lg',
					resolve: {
						User : function () {
							return pUser;
						},
						Title : function () {
							return pTitle;
						},
						Module : function () {
							return INFO.title;
						},
						OrderBy : function () {
							return _orderBy;
						},
						Internados : function () {
							return pInternados;
						}
					}
				});
			}

			function crearInternacionForAdmision (pInternado, pFormData, pUser) {
				var _internacion = PreadmisionLogicService.crearSolicitudPreadmisionCommon(pInternado, pUser);

				_internacion.PorcentajesCargoInternacion = pFormData.porcentajesCargoInternacion;
				
				if (pFormData.facturaEmpresa) {
					_internacion.EmpresaFactura = pInternado.EmpresaFactura;
				} else {
					_internacion.EmpresaFactura = null;
					_internacion.id_organizacion_factura = null;
				}
				_internacion.IntervencionAdmision.fecha_cirugia_probable = DateUtils
					.parseToBe(_internacion.IntervencionAdmision.fecha_cirugia_probable);

				return _internacion;
			}	
		}
	};
	return module;

})();