import { itemBateriaEstudiosEditDto } from "./itemBateriaEstudiosEditDto";

export class bateriaEstudiosEditDto {
    Id?:number;
    IdProfesionalPropietario?:number;
    IdServicioPropietario?:number;
    Items?: Array<itemBateriaEstudiosEditDto> = []; // Se importa modelo debido a que estos son los que utiliza el elemento
    Nombre?:string;
    MatriculaProfesional?:number;
    NombreProfesionalPropietario?:string;
    NombreServicioPropietario?:string;
}