/**
 * @author 			emansilla
 * @description 	description
 */
import * as angular from 'angular';
export interface ICieDataService {
	GetCapitulos () : angular.IPromise<any>;
	GetSubCapitulosByCapitulo (pCapitulo) : angular.IPromise<any>;
	GetDiagnosticosBySubCapitulo (pSubcapitulo) : angular.IPromise<any>;
	GetEnfermedadesByDiagnostico (pDiagnostico) : angular.IPromise<any>;
	GetEnfermedades () : angular.IPromise<any>;
}
export class CieDataService implements ICieDataService {
	static $inject: Array<string> = ['DotService', 'Logger'];
	constructor(public DotService: any, public $log: any ){
	}

	public GetCapitulos () : angular.IPromise<any> {
		var _url = 'legacy/CapituloCie/';
		return this.DotService.Get(_url);
	}

	public GetSubCapitulosByCapitulo (pCapitulo) : angular.IPromise<any> {
		var _url, _id;
		(pCapitulo.id_cie_capitulo) ? _id = pCapitulo.id_cie_capitulo : _id = 0;
		_url = 'legacy/SubCapituloCie/ByCapitulo/' + _id;
		return this.DotService.Get(_url);
	}

	public GetDiagnosticosBySubCapitulo (pSubcapitulo) : angular.IPromise<any> {
		var _url, _id;
		(pSubcapitulo.id_cie_subcapitulo) ? _id = pSubcapitulo.id_cie_subcapitulo : _id = 0;
		_url = 'legacy/DiagnosticoCie/BySubCapitulo/' + _id;
		return this.DotService.Get(_url);
	}

	public GetEnfermedadesByDiagnostico (pDiagnostico) : angular.IPromise<any> {
		var _url, _id;
		(pDiagnostico.id_cie_diagnostico) ? _id = pDiagnostico.id_cie_diagnostico : _id = 0;
		_url = 'legacy/EnfermedadCie/ByDiagnostico/' + _id;
		return this.DotService.Get(_url);
	}

	public GetEnfermedades () : angular.IPromise<any> {
		var _url = 'legacy/EnfermedadCie/';
		return this.DotService.Get(_url);
	}

	static seviceFactory(DotService, log) {
		return new CieDataService(DotService, log);
	}
}
CieDataService.seviceFactory.$inject = ['DotService', 'Logger'];

export default class {
	public static init(ngModule: any) {
		ngModule.factory('CieDataService', CieDataService.seviceFactory);
	}
}