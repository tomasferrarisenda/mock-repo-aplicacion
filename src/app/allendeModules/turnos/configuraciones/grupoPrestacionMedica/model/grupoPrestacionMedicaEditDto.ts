import { ItemGrupoPrestacionMedicaListDto } from './itemGrupoPrestacionMedicaListDto'

export class GrupoPrestacionMedicaEditDto{
    Id? : number;
    Nombre? : string;
    IdServicio? : number;
    NombreServicio? : string;
    IdSucursal? : number;
    NombreSucursal? : string;
    IdRecurso? : number;
    IdTipoRecurso? : number;
    Recurso? : string;
    Observaciones? : string;
    Items? : ItemGrupoPrestacionMedicaListDto[];
}