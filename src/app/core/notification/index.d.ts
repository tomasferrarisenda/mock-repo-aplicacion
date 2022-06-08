
declare interface IFiltroEntidadesAlertadasDto {    
    IdTipoEntidad: number;
    IdEntidades: number[];
    TiposOrigen: number[];
    TiposAlerta: number[];
}
declare interface IAlertaService {
	NewPrueba: any;
	Add: any;
	NewWarning(titulo: string, nombre?: string, onClick?: Function): any;
	NewError(titulo: string, nombre?: string): any;
	NewInfo(titulo: string, nombre?: string): any;
	NewSuccess(titulo: string, nombre?: string): any;
	Pop: any;
	CloseAll(): any;
	OnLogin(): any;
	GetAlertasDePaciente: any;
	AddToAlertasUsuario: any;
	GetAlertasByEntidad(entidades : Array<IFiltroEntidadesAlertadasDto>): void;
	GetTimeout(): any;
}
declare interface IModalService {
	loadingOpen(): void;
	loadingClose(): void;
	media(): angular.IPromise<any>;
	warning(message: string): void;
	warn(message: string): void;
	error(message: string, detail?: string): void;
	info(message: string, size?:string): void;
	success(message: string, size?:string): void;
	confirm(message: string, func:Function, size?:string, options?:any): any;
	// special
	prompt(title: string, value:string, func: Function, size?: string): any;
	//levanto modal para validar guardar con warnings
	validarWarning(validarResponse: any): any;
	//modal para seleccionar opciones
	selectOptionModal(options: Array<{id:number,label:string}>, title?): any;
	//modal para editar o guardar textarea
	textAreaModal(textAreaOptions: ITextAreaModalOptions)
	openOpcionesDeConfiguracion(title: string, options: any): any;
	// modal para editar un input generico con callback
	openEditInputGenerico(options: IInputEditModalOptions):any;
	openAuditoriaElementoPorId(_options: IAuditoriaPorIdModalOptions):any;
	openSuccessAnimationModal(pTitulo: string): any;
}
declare interface ISelectorService {

	newSelector(options : ISelectorOptions)

}