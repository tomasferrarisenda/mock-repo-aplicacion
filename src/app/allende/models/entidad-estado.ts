import { Entidad } from "./entidad";

export class EntidadEstado extends Entidad {
	Color?: string;
	Descripcion?: string;

	/**
	 *
	 */
	constructor(data?:IEntidadEstadoDto) {
		super(data);
		if (data) {
			this.Color = data.Color;
			this.Descripcion = data.Descripcion;
		}
	}
}