/**
 * @author:			Ezequiel Mansilla
 * @description:	Comunicación con BackEnd para seguridad de authentication
 * @type:			Service
 **/
import * as angular from 'angular';
import { IDtoService } from 'core/index';
import { IAuthTicketDto } from '../models';

export interface ISecurityDataService {
	Login(username: string, password: string) : angular.IPromise<IAuthTicketDto>;
	Logout() : any;
	ChangePassword(username: string, oldPassword: string, newPassword: string) : any;
	RefreshToken(dataAccess: any): any;
	ValidateSession(): any;
	// GetInfoSecurityBySystemAndUser(systemName: string, username: string) : any;
}
class SecurityDataService implements ISecurityDataService {
	constructor(
		private DotService: IDtoService,
		private $log: ILogger,
		private $filter: angular.IFilterService,
		private Base64,
		private HTTP_METHOD,
		private ENV){

			this.$log = $log.getInstance('SecurityDataService');
			this.$log.debug('ON.-');
	}

	public Login(username: string, password: string): angular.IPromise<IAuthTicketDto> {
		var params = {
			userName: this.Base64.encode(this.$filter('lowercase')(username)),
			password: this.Base64.encode(password),
			sistema: this.Base64.encode('app-sanatorio-allende')
		};
		return this.DotService.getAccessToken(params);
	}
	
	public Logout(): any {
		var _url = 'Usuario/Logout';
		return this.DotService.Get(_url);
	}

	public ValidateSession(): any { 
		var _url = 'UsuarioAcceso/TokenActivo';
		return this.DotService.Get(_url);
	}

	public ChangePassword(username: string, oldPassword: string, newPassword: string): any {
		const obje = {};
		obje['user_name'] = this.Base64.encode(this.$filter('lowercase')(username));
		obje['old_password'] = this.Base64.encode(oldPassword);
		obje['new_password'] = this.Base64.encode(newPassword);
		var _url = 'UsuarioAcceso/ChangePassword/';
		return this.DotService.getCommon(this.HTTP_METHOD.POST, this.ENV.BACKEND + _url, angular.toJson(obje), null, {isDictionary:true});
	}
	
	public RefreshToken(dataAccess) {

		const _params = {
			companyId: dataAccess.IdEmpresa,
			access_token: dataAccess.authData.accessToken,
			refresh_token: dataAccess.authData.refreshToken
		};
		
		return this.DotService.getAccessToken(_params, true);
	}

	// public GetInfoSecurityBySystemAndUser(systemName: string, username: string): any {
	//	 var _url = 'Usuario/GetInfoSeguridadByUserName/' + username;
	// 	return this.DotService.Get(_url);
	// }
	
	static serviceFactory(DotService, $log, $filter, Base64, HTTP_METHOD, ENV){
		return new SecurityDataService(DotService, $log, $filter, Base64, HTTP_METHOD, ENV);
	}
}
SecurityDataService.serviceFactory.$inject = ['DotService', 'Logger', '$filter', 'Base64', 'HTTP_METHOD', 'ENV'];
export default class {
	public static init(ngModule: any){
		ngModule.factory('SecurityDataService', SecurityDataService.serviceFactory);
	}
}