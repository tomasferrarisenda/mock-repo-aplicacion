export interface FiltroDocumentoAsociadoDto {
    Id? : number,
    IdTipoEntidad? : number,
    IdEntidad? : number,
    CodigoEntidad? : number,
    fechaDesde? : Date,
    fechaHasta? : Date,
    idAmbitoUso? : number,
    idTipoDocumento? : number,
    Nombre? : String,
    PageSize? : number,
    CurrentPage? : number,
}