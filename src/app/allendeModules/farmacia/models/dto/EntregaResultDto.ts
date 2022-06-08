import { IInternacionEtiquetasResponse } from "./InternacionEtiquetasResponse";

export interface IEntregaResultValidationDto extends ValidationResultDto {
	IdMovimiento?: number,
	ImprimirDetalle?: boolean,
	CantidadEtiquetas?: number
	InternacionEtiquetas?: Array<IInternacionEtiquetasResponse>,
	IdEntidadValidada?: number
}