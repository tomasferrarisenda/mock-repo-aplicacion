export interface IPacienteUsuarioDto {
    Id?: number;
    NombrePaciente?: string;
    NumeroDocumento?: string;
    IdTipoDocumento?: number;
    TipoDocumento?: string;
    IdSexo?: number;
    Sexo?: string;
    FechaNacimiento?: string;

    // paciente a cargo. Calculada
    Defecto: boolean;
}