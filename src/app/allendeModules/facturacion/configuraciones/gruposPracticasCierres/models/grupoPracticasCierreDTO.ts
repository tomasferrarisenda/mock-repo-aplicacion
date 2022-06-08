import { itemGrupoPracticaCierreDTO } from "./itemGrupoPracticaCierreDTO";

export interface grupoPracticasCierreDTO {
	Id?: number;
	IdEstadoCierre?: number;
	IdServicio?: number;
	IdSucursal?: number;
	Items?: GridViewDto<itemGrupoPracticaCierreDTO>;
	Nombre?: string;
	NombreEstadoCierre?: string;
	NombreServicio?: string;
	NombreSucursal?: string;

}