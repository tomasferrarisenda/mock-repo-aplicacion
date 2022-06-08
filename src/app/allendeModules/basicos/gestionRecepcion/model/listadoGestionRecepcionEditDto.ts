export interface listadoGestionRecepcionEditDto {
    Id?: number;
    idSucursal?: number;
    idEdificio?: number;
    idPiso?: number;
    idRecepcionLista?: string;
    CurrentPage?: number;
    PageSize?: number;

    sucursalLista?: number;
    edificioLista?: number;
    pisoLista?: number;

}