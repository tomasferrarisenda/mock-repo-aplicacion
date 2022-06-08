export class Entidad {
	Id: number;
	Nombre: string;
	/**
	 *
	 */
	constructor(data?: IEntidadDto) {
		if (data) {
			this.Id = data.Id || 0;
			this.Nombre = data.Nombre || 'Sin nombre';
		} else {
			this.Id = 0;
			this.Nombre = '';
		}
	}
}