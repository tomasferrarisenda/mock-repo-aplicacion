export interface IPacientesACargoDto extends IEntidadDto {
    /**
     * Utilizar esta, en vez de "Id".
     */
    IdPaciente?: number;
    // Nombre se hereda
    Apellido?: string;

    IdTipoDocumento?: number;
    TipoDocumento?: string;
    Documento?: string;

    /**
     * Viene con formato Back-End. Se debe parsear
     */
    FechaNacimiento?: string;
    /**
     * Calculado en front-end.
     * TODO: ver de quitar esto
     */
    fechaHoraNacimiento?: Date;
    Edad?: number;
    Sexo?: string;

    IdTipoRelacion?: number;
    TipoRelacion?: string;
}