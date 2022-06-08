export interface IEmpresaHabilitadaDto extends IEntidadDto {
    IdEmpresa?: number;
    /**
     * Se debe utilizar esta en vez de "Nombre".
     */
    NombreEmpresa?: string;
    Habilitada?: boolean;
    PorDefecto?: boolean;
}