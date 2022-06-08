/**
 * @author:			Ezequiel Mansilla
 * @description:	Servicio de datos de usuario para permisos
 * @type:			Service
 **/
import { IDtoService } from 'core/index';
import { IUsuarioSeguridadDto } from '../models';

export interface IUserInfoDataService {
	Get(userName: string, systemName: string): any;
}

class UserInfoDataService implements IUserInfoDataService {
	
	constructor(private DtoService: IDtoService, private $log: ILogger) {
		$log = $log.getInstance('UserInfoDataService');
		$log.debug('ON.-');
	}

	public Get(pUserName, pSystemName): angular.IPromise<IUsuarioSeguridadDto> {
		var url = 'Usuario/GetInfoSeguridadByUserName/' + pUserName;
		return this.DtoService.Get(url);
	}

	static serviceFactory(DtoService, $log) {
		return new UserInfoDataService(DtoService, $log);
	}
}
UserInfoDataService.serviceFactory.$inject = ['DotService', 'Logger'];
export default class {
	public static init(ngModule: any) {
		ngModule.factory('UserInfoDataService', UserInfoDataService.serviceFactory);
	}
}