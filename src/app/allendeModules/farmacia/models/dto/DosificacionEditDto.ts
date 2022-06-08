import { IProductoIndicacionMedica } from "..";
import { IDosificacionDescartableEditDto } from "./DosificacionDescartableEditDto";
import { ITomaDosificacionEditDto } from "./TomaDosificacionEditDto";

export interface IDosificacionEditDto {
		IdSucursal?: number,
        IdTipoConcepto?: number,
        IdInternacion?: number,
        Fecha?: string,
        FechaHora?: string,
        Producto ?: IProductoIndicacionMedica,
        Posologia?: string,
        Matricula?: number,
        Profesional?: string,
        IdEstado?: number,
        IdEstadoFarmacia?: number,
        IdEstadoFacturacion?: number,
        ObservacionMedica?: string,
        ObservacionFarmacia?: string,
        EsUrgencia?: boolean,
        EsUrgentePorFarmacia?: boolean,
        Duplicada?: boolean,
        FechaSuspension?: string,
        UsuarioSuspension?: string,

        PuedeCambiarProducto?: boolean,
        PuedeCambiarEstadoFarmacia?: boolean,
		PuedeAgregarDescartable?: boolean,
		
		Ejecuciones?: Array<IDosificacionDescartableEditDto>,
		Descartables?:  Array<ITomaDosificacionEditDto>,
}