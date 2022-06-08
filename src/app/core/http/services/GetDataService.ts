import { IDtoService } from "./DtoService";

export interface IGetDataService<T> {
	obtenerTodos(): angular.IPromise<T>;
	obtenerPorId(id: number): angular.IPromise<T>;
	obtenerPorIds(ids: string): angular.IPromise<T>;
}

export class GetDataService<T> implements IGetDataService<T> {
	
	constructor(protected $log: ILogger, protected http: IDtoService, protected baseApi: string) { }

	public obtenerTodos() {
		this.$log.debug('GetDataService::obtenerTodos');
		return this.http.Get(this.baseApi + 'ObtenerTodos');
	}

	public obtenerPorId(id: number) {
		this.$log.debug('GetDataService::obtenerPorId',id);
		return this.http.Get(this.baseApi + 'ObtenerPorId/' + id);
	}

	public obtenerPorIds(ids: string) {
		this.$log.debug('GetDataService::obtenerPorIds', ids);
		return this.http.Get(this.baseApi + 'ObtenerPorIds/' + ids);
	}
}