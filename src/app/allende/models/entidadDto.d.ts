declare interface IEntidadDto {
    Id?:number;
    Nombre?: string;
}

declare interface IEntidadEstadoDto extends IEntidadDto{
    Color?: string;
    Descripcion?: string;
}