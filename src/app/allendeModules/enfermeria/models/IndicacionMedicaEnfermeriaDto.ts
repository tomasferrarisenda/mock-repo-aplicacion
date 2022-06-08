import { IAgregadoEnfermeriaDto } from "./AgregadoEnfermeriaDto";
import { IProductoEnIndicacionMedicaDto } from "./ProductoEnIndicacionMedicaDto";
import { IEjecucionIndicacionMedicaEnfermeriaDto } from "./EjecucionIndicacionMedicaEnfermeriaDto";

export interface IIndicacionMedicaEnfermeriaDto {
		Id:number,
        IdSucursal:number,
        IdInternacion:number,
        Fecha:string,
        FechaHora:string,
        IdTipoConcepto:number,
        IdEstado:number,
        TieneUrgencia:boolean,
        Duplicada:boolean,
        IdTipoIndicacion:number,
        Producto: IProductoEnIndicacionMedicaDto,
        Descripcion:string,
        Posologia:string,
        IdEstadoFarmacia:number,
        IdEstadoEjecucion:number,
        TieneMultiDosis:boolean,
        IdTipoAntibiotico:number,
        EsAltoRiesgo:boolean,
        ObservacionMedica:string,
        Ejecuciones: Array<IEjecucionIndicacionMedicaEnfermeriaDto>,
        Agregados: Array<IAgregadoEnfermeriaDto>,
        EsSOS:boolean,

        TienePendienteActivo: boolean,
        TienePendiente: boolean,
        ColorVia: string,

        //campos opcionales para seteo de datos en Front
        showSubData?: boolean,
        EstadoIndicacion?: any,
        EstadoEjecucion?: any,
        TipoIndicacion?: any,
        descripcionProducto?: any,
        monodroga?:any
}