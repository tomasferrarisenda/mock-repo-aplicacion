/**
 * @author 			emansilla
 * @description 	description
 */
import loginTemplate = require('../templates/login.tpl.html');
import actionListTemplate = require('../templates/action-list-selector.tpl.html');
import changePasswordTemplate = require('../templates/change-password.tpl.html');
import { ICredentialsDataService } from './CredentialsDataService';

export interface ISecurityLogicService {
	OpenLogin(): any;
	LoginOk(credentials, path): any;
	ValidarUsuario(): any;
	OpenActionSelectorByPermission(user, permissionId, permissionList): any;
	ChangePassword(userName): any
}

class SecurityLogicService implements ISecurityLogicService {
	
	constructor(
		private $log,
		private $q,
		private $uibModal,
		private $location,
		private AuthorizationService,
		private CredentialsDataService: ICredentialsDataService,
		private UserInfoDataService,
		private modalService: IModalService,
		private alertaService: IAlertaService) {

			this.$log = $log.getInstance('SecurityLogicService');
			this.$log.debug('ON.-');

	}
	public OpenLogin() {

		return this.$uibModal.open({
			template: loginTemplate,
			controller: 'AuthenticationModalController',
			controllerAs: 'vm',
			size: 'md'
		}).result;
	}
		
	public LoginOk(pCredentials, pPath) {
		const vm = this;
		this.$log.debug('Login OK.-', pCredentials.access_token);
		const def = vm.$q.defer();

		//this.CurrentUser.setProfile(pCredentials.userName, pCredentials.access_token);
		this.CredentialsDataService.Set(pCredentials);
		this.UserInfoDataService.Get(pCredentials.userName || pCredentials.UserName)
		.then(pUserInfo => {
			vm.CredentialsDataService.SetInfo(pUserInfo);
			//vm.CurrentUser.setAditionalInfoFromObject(pUserInfo);

			if (pUserInfo.DiasHastaQueExpireLaPassword > 0) {
				let textDias = pUserInfo.DiasHastaQueExpireLaPassword === 1 ? 'día' : 'días';
				this.alertaService.NewWarning(`Su clave expirará dentro de ${pUserInfo.DiasHastaQueExpireLaPassword} ${textDias}. Click aquí para cambiarla ahora.`,'',() => {
					this.ChangePassword(pCredentials.userName || pCredentials.UserName);
				});
			}

			if (pPath) vm.$location.path(pPath);
			def.resolve('ok');
		});

		return def.promise;
	}

	public ValidarUsuario() {
		return this.$uibModal.open({
			template: loginTemplate,
			controller: 'ValidarUsuarioModalController',
			controllerAs: 'vm',
			size: 'md'
		}).result;
	}

	public OpenActionSelectorByPermission(pUser, pPermissionId, pPermissionList) {
		const vm = this;
		return this.$uibModal.open({
			template: actionListTemplate,
			controller: 'ActionListSelectorController',
			controllerAs: 'vm',
			size: 'lg',
			resolve: {
				Title: function () {
					return 'Seleccionar acción';
				},
				Actions: function () {
					const permisosId = vm.AuthorizationService.getPremisosByIdPadre(pUser, pPermissionId);
					const estadosElegibles: Array<any> = [];

					for (var i = 0; i < pPermissionList.length; i++) {

						for (var j = 0; j < permisosId.length; j++) {
							if (permisosId[j].Id === pPermissionList[i].Id) {
								estadosElegibles.push(pPermissionList[i]);
							}
						}
					}
					return estadosElegibles;
				}
			}
		}).result;
	}
	public ChangePassword(pUserName) {

		return this.$uibModal.open({
			template: changePasswordTemplate,
			controller: 'ChangePasswordController',
			controllerAs: 'vm',
			size: 'md',
			resolve: {
				User: function () {
					return pUserName;
				}
			}
		}).result;
	}

	static serviceFactory($log, $q, $uibModal, $location, AuthorizationService, CredentialsDataService, UserInfoDataService, ModalService, AlertaService) {
		return new SecurityLogicService($log, $q, $uibModal, $location, AuthorizationService, CredentialsDataService, UserInfoDataService, ModalService, AlertaService);
	}
}
SecurityLogicService.serviceFactory.$inject = ['Logger', '$q', '$uibModal', '$location',
	'AuthorizationService', 'CredentialsDataService', 'UserInfoDataService', 'ModalService', 'AlertaService'];
export default class {
	public static init(ngModule: any) {
		ngModule.factory('SecurityLogicService', SecurityLogicService.serviceFactory);
	}
}