/**
 * @author 			emansilla
 * @description 	description
 */
import sucursalListSelectorTemplate = require('../templates/sucursal-list-selector.tpl.html');
import listSelectorBaseTemplate = require('../templates/list-selector-base.tpl.html');
import buscadorPacienteTemplate = require('../templates/buscador-paciente.tpl.html');
import searchInternadoTemplate = require('../templates/searchInternados.tpl.html');
import searchPracticaTemplate = require('../templates/searchPracticas.tpl.html');
import searchProfesionalTemplate = require('../templates/searchProfesional.tpl.html');
import searchProfesionalSolicitanteTemplate = require('../templates/searchProfesionalSolicitante.tpl.html');
import searchPrefacturableTemplate = require('../templates/searchPrefacturable.tpl.html');
import editarPrefacturableTemplate = require('../templates/editarPrefacturable.tpl.html');
export default (function () {
	'use strict';
	
	const module = { init : (ngModule: any) => {} };

	module.init = function (module) {

		module.factory('SupportLogicService', SupportLogicService);

		SupportLogicService.$inject = ['Logger', '$uibModal'];
		
		function SupportLogicService ($log, $uibModal) {
			
			/* ------------------------------------------------ LOG ------------------------------------------------ */

			$log = $log.getInstance('SupportLogicService');
			//$log.debug('ON.-');

			/* ------------------------------------------ API Y VARIABLES ------------------------------------------ */

			const service = {
				openSucursalSelector: openSucursalSelector,
				openSucursalOptionalSelector : openSucursalOptionalSelector,
				openSelectorBase: openSelectorBase,
				openBuscadorPaciente: openBuscadorPaciente,
				searchInternados: searchInternados,
				searchPracticas: searchPracticas,
				searchProfesional : searchProfesional,
				searchProfesionalSolicitante: searchProfesionalSolicitante,
				searchPrefacturables : searchPrefacturables,
				editarPrefacturable : editarPrefacturable
			};
			return service;

			/* ------------------------------------------- IMPLEMENTACIÓN ------------------------------------------- */

			function openSucursalSelector (pUser) {
				return $uibModal.open({
					template: sucursalListSelectorTemplate,
					controller : 'SucursalSelectorController',
					keyboard : true,
					controllerAs : 'vm',
					size : 'md',
					resolve : {
						User: function () {
							return pUser;
						},
						Title : function () {
							return 'Seleccionar Sucursal';
						}
					}
				}).result;
			}

			function openSucursalOptionalSelector (sucursales, accion) {
				return $uibModal.open({
					template: sucursalListSelectorTemplate,
					controller : 'SucursalOptionalSelectorController',
					keyboard : true,
					controllerAs : 'vm',
					size : 'md',
					resolve : {
						SucursalOpt : function () {
							return sucursales;
						
						},
						Accion : function () {
							return accion;
						},
						Title : function () {
							return 'Seleccionar Sucursal';
						}
					}
				}).result;
			}

			function openSelectorBase () {
				return $uibModal.open({
					template: listSelectorBaseTemplate,
					controller : 'ListSelectorBaseController',
					keyboard : true,
					controllerAs : 'vm',
					size : 'lg'
				}).result;
			}

			function openBuscadorPaciente (pacienteCollection, esSelectorNuevo, dataSearch, nuevoPaciente) {

				var _pacientes;
				var _esSelectorNew;
				var _dataSearch;
				var _nuevoPaciente;

				if(pacienteCollection){
					_pacientes = pacienteCollection;
				}else _pacientes = '';

				//boton para nuevo paciente en el seelector
				//se usa en turnero
				if (nuevoPaciente) {
					_nuevoPaciente = true;
				} else _nuevoPaciente = false;


				//declaro variable para retrocompatibilidad, si 'esSelectorNuevo' = true
				//habilita el buscador nuevo con nombre separado de apellido, si no le pasamos nada
				//queda como esta buscando por apellidoynombre
				if(esSelectorNuevo){
					_esSelectorNew = true;
				}else _esSelectorNew = false;

				if (dataSearch) {
					_dataSearch = dataSearch;
				} else _dataSearch = '';

				return $uibModal.open({
					template: buscadorPacienteTemplate,
					controller : 'BuscadorPacienteController',
					keyboard : true,
					controllerAs : 'vm',
					size : 'lg',
					resolve: {
						pacientesCollection : function () {
							return _pacientes;
						},
						esSelectorNew : function () {
							return _esSelectorNew;
						}, 
						dataSearch: function () {
							return _dataSearch;
						},
						NuevoPaciente: function () {
							return _nuevoPaciente;
						}

					}
				}).result;
			}

			function searchInternados (pUser) {
				var _modalSearchInternado;

				_modalSearchInternado = $uibModal.open({
					template: searchInternadoTemplate,
					controller: 'SearchInternadosController',
					keyboard : true,
					controllerAs: 'vm',
					size: 'lg',
					resolve: {
						User: function () {
							return pUser;
						}
					}
				});
				
				return _modalSearchInternado.result;
			}

			function searchPracticas (pUser) {
				var _modalSearchPracticas;

				_modalSearchPracticas = $uibModal.open({
					template: searchPracticaTemplate,
					controller: 'SearchPracticasController',
					keyboard : true,
					controllerAs: 'vm',
					size: 'lg',
					resolve: {
						User: function () {
							return pUser;
						}
					}
				});
				
				return _modalSearchPracticas.result;
			}

			function searchProfesional(pUser) {
				var _modalSearchProfesional;

				_modalSearchProfesional = $uibModal.open({
					template: searchProfesionalTemplate,
					controller: 'SearchProfesionalController',
					keyboard : true,
					controllerAs: 'vm',
					size: 'lg',
					resolve: {
						User: function () {
							return pUser;
						}
					}
				});
				
				return _modalSearchProfesional.result;
			}

			function searchProfesionalSolicitante(pUser) {
				var _modalSearchProfesionalSolicitante;

				_modalSearchProfesionalSolicitante = $uibModal.open({
					template: searchProfesionalSolicitanteTemplate,
					controller: 'SearchProfesionalSolicitanteController',
					keyboard : true,
					controllerAs: 'vm',
					size: 'lg',
					resolve: {
						User: function () {
							return pUser;
						}
					}
				});
				
				return _modalSearchProfesionalSolicitante.result;
			}

			function searchPrefacturables(tipoPrefacturable, deshabilitarTipo) {
				return $uibModal.open({
					template: searchPrefacturableTemplate,
					controller: 'SearchPrefacturablesController',
					keyboard : true,
					controllerAs: 'vm',
					size: 'lg',
					resolve: {
						tipoPrefacturable: function () {
							return tipoPrefacturable;
						},
						deshabilitarTipo: function(){
							return deshabilitarTipo;
						}
					}
				}).result;
			}

			function editarPrefacturable(prefacturableEditar, tipoPrefacturableInicial) {
				var _modalEditarPrefacturable;

				_modalEditarPrefacturable = $uibModal.open({
					template: editarPrefacturableTemplate,
					controller: 'EditarPrefacturableController',
					keyboard : true,
					controllerAs: 'vm',
					size: 'lg',
					resolve: {
						PrefacturableEditar: function () {
							return prefacturableEditar;
						},
						TipoInicial: function () {
							return tipoPrefacturableInicial;
						}
					}
				});
				return _modalEditarPrefacturable.result;
			}
		}
	};

	return module;

})();