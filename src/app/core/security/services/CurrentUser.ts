/**
 * @author:			Ezequiel Mansilla
 * @description:	Creación de usuario
 * @type:			Service
 **/
import * as angular from 'angular';

export default (function () {
	'use strict';

	const module = { init : (ngModule: any) => {} };

	module.init = function (ngModule) {

		ngModule.factory('CurrentUser', CurrentUser);

		CurrentUser.$inject = ['StorageService'];
		
		function CurrentUser (StorageService) {

			/* ------------------------------------------------ LOG ------------------------------------------------ */

			// $log = $log.getInstance('CurrentUser');
			// $log.debug('ON.-');

			/* ------------------------------------------ API Y VARIABLES ------------------------------------------ */

			var USER_KEY = 'utoken';
			var USER_INFO_KEY = 'aditionalInformation';

			var profile : any  = {};
			var aditionalInformation : any = initializeAditionalInformation();

			return {
				profile : initializeProfile(),
				profileFull : profileFull,
				aditionalInformation : aditionalInformation,
				setProfile : setProfile,
				setProfileFromTicker : setProfileFromTicker,
				setAditionalInfo : setAditionalInfo,
				setAditionalInfoFromObject : setAditionalInfoFromObject,
				logout : logout
			};

			/* ------------------------------------------ IMPLEMENTACION ------------------------------------------ */

			function initializeProfile () {
				// $log.debug('initializeProfile ON');
				var user = {
					id : '',
					userName : '',
					fullName : '',
					employeeId : '',
					token : '',
					get loggedIn() {
						// $log.debug('initializeProfile loggedIn', this.token);
						return (this.token);
					}
				};

				var localUser = StorageService.get('utoken');
				// $log.debug('localUser', localUser);
				if (localUser) {
					user.id = localUser.id;
					user.userName = localUser.userName;
					user.fullName = localUser.fullName;
					user.employeeId = localUser.employeeId;
					user.token = localUser.token;
					// $log.debug('user', user);
				}

				// $log.debug('initializeProfile OK', user);
				return user;
			}

			function initializeAditionalInformation () {
				// $log.debug('initializeAditionalInformation ON');
				var userInformation = {
					modules : [],
					permisos : [],
					impresiones : [],
					solapas : [],
					sucursales : [],
					servicios : [],
					recepciones : []
				};

				var localUserInformation = StorageService.get(USER_INFO_KEY);
				if (localUserInformation) {
					angular.copy(localUserInformation, userInformation);
				}

				// $log.debug('initializeAditionalInformation OK');
				return userInformation;
			}

			function profileFull () {
				var profileFull = profile;

				profileFull.modules = aditionalInformation.modules;
				profileFull.permisos = aditionalInformation.permisos;
				profileFull.impresiones = aditionalInformation.impresiones;
				profileFull.solapas = aditionalInformation.solapas;
				profileFull.sucursales = aditionalInformation.sucursales;
				profileFull.servicios = aditionalInformation.servicios;
				profileFull.recepciones = aditionalInformation.recepciones;


				return profileFull;
			}

			function setProfile (pUserName, pToken, pFullName, pId, pEmployeeId) {
				// $log.debug('setProfile ON.-');
				profile = initializeProfile();

				profile.userName = pUserName;
				profile.token = pToken;
				profile.fullName = pFullName;
				profile.id = pId;
				profile.employeeId = pEmployeeId;

				StorageService.set(USER_KEY, profile);
				// $log.debug('setProfile OK.-', profile);
				// $log.debug('setProfile localStorage', StorageService.get(USER_KEY));
			}

			function setProfileFromTicker (pTicket) {
				setProfile(
					pTicket.userName,
					pTicket.access_token,
					pTicket.userCompleteName,
					pTicket.id,
					pTicket.employeeId
				);
			}

			function logout () {
				// StorageService.removeItem(USER_KEY);
				// StorageService.removeItem(USER_INFO_KEY);
				StorageService.clearAll();
				profile = {};
				aditionalInformation = {};
			}

			function setAditionalInfo (pModules, pPermisos, pImpresiones, pSolapas, pSucursales, pServicios, pRecepciones) {
				aditionalInformation.modules = pModules;
				aditionalInformation.permisos = pPermisos;
				aditionalInformation.impresiones = pImpresiones;
				aditionalInformation.solapas = pSolapas;
				aditionalInformation.sucursales = pSucursales;
				aditionalInformation.servicios = pServicios;
				aditionalInformation.recepciones = pRecepciones;
				StorageService.set(USER_INFO_KEY, aditionalInformation);
			}

			function setAditionalInfoFromObject (pUserInfo) {
				setAditionalInfo(
					pUserInfo.Modulos,
					pUserInfo.Permisos,
					pUserInfo.Impresiones,
					pUserInfo.Solapas,
					pUserInfo.Sucursales,
					pUserInfo.Servicios,
					pUserInfo.Recepciones
				);
			}

		}
	};

	return module;
})();