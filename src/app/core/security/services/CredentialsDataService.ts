/**
* @author:         emansilla
* @description:    Obtención de credenciales del usuario
* @type:           Service
**/
import * as angular from 'angular';
import { IAuthTicketDto, IUsuarioSeguridadDto, IEmpresaHabilitadaDto, IAuthTicketMinDto } from '../models';
import { CurrentUser } from '../models/current-user';

export interface ICredentialsDataService {
	Set(pCredentials: IAuthTicketDto): void;
	Update(pCredentials: IAuthTicketDto): void;
	SetInfo(pUserInfo: IUsuarioSeguridadDto): void;
	changeEmpresa(pEmpresasList: IEmpresaHabilitadaDto): void;
	Clear(): void;
	Create(pUserName, pAccessToken): IAuthTicketMinDto;
	CreateCurrentUser(pCredentials: IAuthTicketDto);
	GetForce();
	Get(): angular.IPromise<CurrentUser>;
}

class dataService implements ICredentialsDataService {

	// #region /* --------------------------------------- CONSTRUCTOR --------------------------------------- */

	/**
	 * @class       CredentialsDataService
	 * @constructor
	 */
	constructor(private $rootScope, private $http, private $q: angular.IQService, private $location, private $log, private StorageService) {
		this.$log = this.$log.getInstance('CredentialsDataService');
		this.$log.debug('ON');
	}

	// #endregion

	// #region /* ----------------------------------------- MÉTODOS ----------------------------------------- */

	Set(pCredentials: IAuthTicketDto): void {
		// $log.debug('SetCredentials. {0}', [angular.toJson(pCredentials)]);
		var expireDate;

		expireDate = new Date();
		expireDate.setDate(expireDate.getDate() + 1);

		this.$rootScope.globals = {
			currentUser: this.CreateCurrentUser(pCredentials)
		};

		this.StorageService.set('globals', this.$rootScope.globals);
		this.$log.debug('SetCredentials. OK.-');
	}

	Update(pCredentials): void {
		this.$rootScope.globals.currentUser.fr = {
			_fra: pCredentials.access_token || pCredentials.Access_token,
			_frr: pCredentials.refresh_token || pCredentials.Refresh_token
		};		
		if(pCredentials.companyId !== undefined){
			this.$rootScope.globals.currentUser.IdEmpresa = parseInt(pCredentials.companyId || pCredentials.CompanyId);
		}
		//this.$rootScope.globals.currentUser.authData.accessToken = pCredentials.access_token,
		//this.$rootScope.globals.currentUser.authData.refreshToken = pCredentials.refresh_token,
		this.StorageService.set('globals', this.$rootScope.globals);
	}

	SetInfo(pUserInfo: IUsuarioSeguridadDto): void {
		this.$log.debug('SetModules', pUserInfo);
		this.$rootScope.globals.currentUser.empresas = pUserInfo.EmpresasHabilitadas;
		this.$rootScope.globals.currentUser.modules = pUserInfo.Modulos;
		this.$rootScope.globals.currentUser.permisos = pUserInfo.Permisos;
		this.$rootScope.globals.currentUser.impresiones = pUserInfo.Impresiones;
		// @deprecate
		// this.$rootScope.globals.currentUser.solapas = pUserInfo.Solapas;
		this.$rootScope.globals.currentUser.sucursales = pUserInfo.Sucursales;
		this.$rootScope.globals.currentUser.servicios = pUserInfo.Servicios;
		this.$rootScope.globals.currentUser.recepciones = pUserInfo.Recepciones;

		this.StorageService.set('globals', this.$rootScope.globals);
	}

	changeEmpresa(pEmpresasList: IEmpresaHabilitadaDto): void {

		this.$log.debug('changeEmpresa', pEmpresasList);
		// var _userInfo = GetForce();
		// _userInfo.empresas = pEmpresasList;
		this.$rootScope.globals.currentUser.empresas = pEmpresasList;
		this.StorageService.set('globals', this.$rootScope.globals);
	}

	Clear(): void {

		this.$rootScope.globals = {};
		this.StorageService.removeItem('globals');
		this.StorageService.removeItem('sa-alertas-activas');
		//this.$http.defaults.headers.common.Authorization = 'Bearer ';
		var clientId = "AppSA";
		var clientSecret = "7SeGvoNkZze03n6L";
		var authorizationBasic = window.btoa(clientId + ':' + clientSecret);
		this.$http.defaults.headers.Authorization = 'Basic ' + authorizationBasic;
	}

	/**
	 * Crea un IAuthTicketDto mínimo para las llamadas HTTP
	 */
	Create(pUserName, pAccessToken): IAuthTicketMinDto {
		return this.CreateWithValues(pUserName, pAccessToken);
	}

	private CreateWithValues(pUserName, pAccessToken): IAuthTicketMinDto {
		// this.$log.debug('CreateWithValues. {0} - {1} - {2}', [pUserName, pAccessToken, pRole]);
		var _credentials = {
			userName: pUserName,
			access_token: pAccessToken
		};
		return _credentials;
	}

	CreateCurrentUser(pCredentials): CurrentUser {
		// this.$log.debug('CreateCurrentUser. {0}', [angular.toJson(pCredentials)]);
		var _credentials: CurrentUser = {
			userName: pCredentials.userName || pCredentials.UserName,
			name: pCredentials.userCompleteName || pCredentials.UserCompleteName,	// Tambien viene en infoSeguridad 
			employeeId: pCredentials.employeeId || pCredentials.EmployeeId,
			id: pCredentials.id || pCredentials.Id,
			sucursales: [],
			fr: {
				_fra: pCredentials.access_token || pCredentials.Access_token,
				_frr: pCredentials.refresh_token || pCredentials.Refresh_token
			}
		};
		return _credentials;
	}

	GetForce() {
		return this.$rootScope.globals.currentUser;
	}

	Get(): angular.IPromise<CurrentUser> {
		// $log.debug('Get ON.-');

		var def: angular.IDeferred<CurrentUser>, _error;

		def = this.$q.defer<CurrentUser>();
		try {

			let _user: CurrentUser = {
				userName: this.$rootScope.globals.currentUser.userName,
				name: this.$rootScope.globals.currentUser.name,
				sucursales: this.$rootScope.globals.currentUser.sucursales,
				servicios: this.$rootScope.globals.currentUser.servicios,
				recepciones: this.$rootScope.globals.currentUser.recepciones,
				id: this.$rootScope.globals.currentUser.id,
				employeeId: this.$rootScope.globals.currentUser.employeeId,
				modules: this.$rootScope.globals.currentUser.modules,
				permisos: this.$rootScope.globals.currentUser.permisos,
				impresiones: this.$rootScope.globals.currentUser.impresiones,
				// @deprecate
				//solapas: this.$rootScope.globals.currentUser.solapas,
				empresas: this.$rootScope.globals.currentUser.empresas,
			};

			// $log.debug('Get OK.-', _user);
			def.resolve(_user);
			// $log.debug('paso por ok');
		} catch (pError) {
			// pError contiene el error no controlado
			_error = {
				message: 'Usuario no logueado.'
			};
			def.reject(_error);
			// $location.url('/Login');
			// $log.error('Get Error.-', _error);
		}
		return def.promise;
	}

	static serviceFactory() {
		const service = ($rootScope, $http, $q, $location, $log, StorageService) => new dataService($rootScope, $http, $q, $location, $log, StorageService);
		service.$inject = ['$rootScope', '$http', '$q', '$location', 'Logger', 'StorageService'];
		return service;
	}
	// #endregion
}

export class CredentialsDataService {
	static init(ngModule: angular.IModule) {
		ngModule.factory('CredentialsDataService', dataService.serviceFactory())
	}
}