export interface IModuloJerarquicoHabilitadoDto extends IEntidadDto {
    Titulo?: string;
    Color?: string;
    Icono?: string;
    Url?: string;
    Hijos?: IModuloJerarquicoHabilitadoDto[];
    Visible?: boolean;
    Version?: number;
}