/**
 * @author 			emansilla
 * @description 	description
 */
import * as angular from 'angular';
import { ICredentialsDataService } from './CredentialsDataService';
export interface IAuthorizationService {
	tienePermisoById(user: any, id: number) : boolean;
	getImpresionesByIdPermiso(user: any, id: number) : any;
	getPremisosByIdPadre(user: any, id: number) : any;
	getIdsPremisosByIdPadre(user: any, id: number) : any;
	getImpresionesByIdsPermiso(user: any, ids: Array<number>) : any;
	getTabs(id: number, tabs: Array<any>, base: any, user: any) : any;
}
class AuthorizationService implements IAuthorizationService {

	constructor(private $log: ILogger, private CredentialsDataService: ICredentialsDataService) {
		this.$log = $log.getInstance('AuthorizationService');
		this.$log.debug('ON.-');
	}

	public tienePermisoById (pUser, pId) {
		let user = pUser;
		if (!pUser) user = this.CredentialsDataService.GetForce();

		var _permisos = user.permisos;

		for (var i = 0; i < _permisos.length; i++) {
			if (_permisos[i].Id == pId)
				return true;
		}

		return false;
	}

	public getImpresionesByIdPermiso (pUser, pIdPermiso) {
		var _impresiones = pUser.impresiones,
			_impresionesReturn : Array<any> = [],
			_print : any = '';

		if (_impresiones) {
			for (var i = _impresiones.length - 1; i >= 0; i--) {
				_print = _impresiones[i];
	
				for (var j = _print.IdsPermisos.length - 1; j >= 0; j--) {
					if (_print.IdsPermisos[j] == pIdPermiso) {
						_impresionesReturn.push(_print);
						break;
					}
				}
			}
		}

		return _impresionesReturn;
	}

	public getIdsPremisosByIdPadre (pUser, pIdPermiso) {
		this.$log.debug('getIdsPremisosByIdPadre', pUser, pIdPermiso);
		var permisos = this.getPremisosByIdPadre(pUser, pIdPermiso),
			permisosIds : Array<any> = [];

		angular.forEach(permisos, function(permiso : any){
			permisosIds.push(permiso.Id);
		});

		this.$log.debug('getIdsPremisosByIdPadre return',permisosIds);
		return permisosIds;
	}

	public getImpresionesByIdsPermiso (pUser, pIdsPermiso) {
		var _impresiones = pUser.impresiones,
			_impresionesReturn: Array<any> = [],
			_print : any = '';

		for (var i = _impresiones.length - 1; i >= 0; i--) {
			_print = _impresiones[i];

			for (var j = _print.IdsPermisos.length - 1; j >= 0; j--) {

				for (var k = pIdsPermiso.length - 1; k >= 0; k--) {
					if (pIdsPermiso[k] == _print.IdsPermisos[j]) {
						_impresionesReturn.push(_print);
						break;
					}
				}
			}
		}

		return _impresionesReturn;
	}

	public getTabs(pId, pTabs, pBase, pUser) {
		return this.getTabsByPermisoId (pId, pTabs, pBase, pUser);
	}

	public getPremisosByIdPadre (pUser, pId) {
		var _permisos = pUser.permisos,
			_permisoHijo : any = '',
			_permisosHijos : Array<any>= [];

		for (var i = 0; i < _permisos.length; i++) {
			
			_permisoHijo = _permisos[i];
			
			for (var j = 0; j < _permisoHijo.IdsPermsosPadres.length; j++) {
				if (_permisoHijo.IdsPermsosPadres[j] == pId) {
					_permisosHijos.push(_permisoHijo);
					break;
				}
			}
		}
		this.$log.debug('Permisos hijos', _permisosHijos);
		return _permisosHijos;
	}

	public getTabsByPermisoId (pId, pTabs, pBase, pUser) {
		var _tabsReturn: Array<any> = [],
			TABScopy: Array<any> = [];

		angular.copy(pTabs, TABScopy);

		for (var i = 0; i < TABScopy.length; i++) {
			TABScopy[i].ID = i + 1;
			TABScopy[i].CONTENT = TABScopy[i].CONTENT;

			for (var j = 0; j < TABScopy[i].IdsPermisosPadres.length; j++) {
				if (TABScopy[i].IdsPermisosPadres[j] == pId) {
					var index = _tabsReturn.length + 1;
					var tab = TABScopy[i];
					tab.index = index;
					_tabsReturn.push(tab);
				}
			}
		}

		return _tabsReturn;
	}

	static serviceFactory($log, credentialsDataService) {
		return new AuthorizationService($log, credentialsDataService);
	}
}

AuthorizationService.serviceFactory.$inject = ['Logger', 'CredentialsDataService'];

export default class {
	public static init(ngModule: any) {
		ngModule.factory('AuthorizationService', AuthorizationService.serviceFactory);
	}
}