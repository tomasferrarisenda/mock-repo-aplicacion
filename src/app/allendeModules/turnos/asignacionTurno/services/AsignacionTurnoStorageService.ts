
/**
 * @author 			ppautasso
 * @description 	Servicio de alertas
 */

export interface IAsignacionTurnoStorageHelperService {

	setStorageObj(key: string, value: any): any;
	getStorageObj(key: string): any;
	cleanStorage(key: string): void;
	existStoredObjects(key: string): boolean;
}

class storageHelperService implements IAsignacionTurnoStorageHelperService {
	private _fecha = new Date();

	constructor(private $log, private DEBUG, private StorageService) {

		this.$log = $log.getInstance('AsignacionTurnoStorageHelperService');
		this.$log.debug('ON.-');
	}

	setStorageObj(key: string, value: any) {
		this.$log.debug('setStorage', key, value);
		this.StorageService.set(key, value);
	}
	getStorageObj(key: string) {

		this.$log.debug('getStorageObj', key);
		if (this.StorageService.get(key))
			return this.StorageService.get(key);
		else return;
	}
	cleanStorage(key: string) {

		this.$log.debug('cleanStorage', key);
		this.StorageService.removeItems(key);

	}
	existStoredObjects(key: string) {
		if (this.StorageService.get(key))
			return true;
		else return false;
	}

	static serviceFactory($log, DEBUG, StorageService) {
		return new storageHelperService($log, DEBUG, StorageService);
	}

}
storageHelperService.serviceFactory.$inject = ['Logger', 'DEBUG', 'StorageService'];

export class AsignacionTurnoStorageHelperService {
	static init(ngModule: angular.IModule) {
		ngModule.factory('AsignacionTurnoStorageHelperService', storageHelperService.serviceFactory);
	}
}