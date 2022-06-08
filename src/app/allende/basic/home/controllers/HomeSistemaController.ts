/**
 * @author 			emansilla
 * @description 	description
 */
import * as angular from 'angular';
import { IModuloJerarquicoHabilitadoDto } from 'core/security/models';
import { ISecurityDataService } from 'core/security/services/SecurityDataService';



class HomeSistemaController {
	static $inject = ['Logger', '$state', '$stateParams', 'ENV', 'User', 'SecurityDataService'];
	// Variables
	items = [];
	title = {
		name: 'this.$state.current.data.title',
		icon: 'this.$state.current.data.icon'
	};
	modules: Array<any> = [];
	moduleSelected: IModuloJerarquicoHabilitadoDto | '' = '';
	modulePath: Array<any> = [];
	loading = false;
	// Constructor
	constructor(
		private $log,
		private $state,
		private $stateParams,
		private ENV,
		private User,
		private SecurityDataService: ISecurityDataService) {
		this.$log = this.$log.getInstance('HomeSistemaController');
		this.$log.debug('ON.-', User);
		this.activate();
	}

	private activate() {

		//debo validar sesion activa
		this.SecurityDataService.ValidateSession();

		this.$log.debug('Inicializar ON.-', this.$stateParams.moduleName);
		this.modules = this.User.modules;
		this.title.name = this.$state.current.data.title;
		this.title.icon = this.$state.current.data.icon;

		if (this.$stateParams.moduleName)
			this.updateSelectByName(this.$stateParams.moduleName);
	}

	public updateSelect(pItem: IModuloJerarquicoHabilitadoDto) {
		if (!pItem.Hijos || !pItem.Hijos.length) {
			if (pItem.Version === 1)
				this.$state.go(pItem.Nombre);
			else 
				window.location.href = `${this.ENV.APP2}/${pItem.Url}`
		} else {
			this.moduleSelected = pItem;
			this.addOne(pItem);
		}
	}

	public removeLast() {
		this.modulePath.pop();
		this.moduleSelected = this.getLast();
	}

	public addOne(pItem) {
		this.modulePath.push(pItem);
	}

	private getLast(): IModuloJerarquicoHabilitadoDto {
		return this.modulePath[this.modulePath.length - 1];
	}

	private resetPath() {
		this.modulePath = [];
	}

	private updateSelectByName(pModuleName) {
		this.resetPath();
		for (var i = this.modules.length - 1; i >= 0; i--) {
			if (this.modules[i].Nombre === pModuleName) {
				this.updateSelect(this.modules[i]);
				break;
			}
		}
	}
}
export default class {
	public static init(ngModule: any) {
		ngModule.controller('HomeSistemaController', HomeSistemaController)
	}
}