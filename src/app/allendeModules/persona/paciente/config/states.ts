/**
 * @author 			emansilla
 * @description 	description
 */
import pacienteNewView = require('../views/paciente-new.html');
import pacienteListView = require('../views/paciente-list.html');
import pacienteEditView = require('../views/paciente-edit.html');
import { ITipoSexoDataService, ISupportDataService } from '../../../support/basic/services';
import { IPacienteDataService } from '../../../persona/paciente/services';

export default (function () {
	'use strict';
	
	const module = { init : (ngModule: any) => {} };

	module.init = function (module) {

		module.config(routes);

		routes.$inject = ['$stateProvider', '$urlRouterProvider', 'ACTION_PACIENTE'];

		function routes ($stateProvider, $urlRouterProvider, ACTION_PACIENTE)
		{
			$urlRouterProvider.when('/Paciente','/Paciente/List');

			$stateProvider.state({
				name : 'paciente',
				parent : 'signed',
				template : '<ui-view/>',
				url: '/Paciente',
				data : {
					module: 'PACIENTE',
					path : 'Paciente'
				}
			});

			$stateProvider.state(
			{
				name: 'paciente.new',
				url : '/New',
				template: pacienteNewView,
				controller: 'PacienteNewController',
				controllerAs: 'vm',
				data : {
					title : 'Nuevo paciente',
					idPermiso: 101,
					icon : 'NEW'
				},
				params:{
					externo : false,
					internoApp: false,
					idTipoDocumento : 0,
					numeroDocumento : 0,
					nombre: '',
					apellido: '',
				},
				resolve : {
					Resolves : ResolveDataPaciente
				}
			});

			$stateProvider.state(
			{
				name : 'paciente.list',
				url : '/List',
				template : pacienteListView,
				controller : 'PacienteListController',
				controllerAs : 'vm',
				data : {
					title : 'Lista de pacientes',
					idPermiso: 79,
					icon : 'LIST'
				}
			});

			$stateProvider.state(
			{
				name:'paciente.edit',
				url:'/Edit',
				template: pacienteEditView,
				controller: 'PacienteEditController',
				controllerAs: 'vm',
				data : {
					title : 'Editar paciente',
					idPermiso: 196,
					icon : 'EDIT'
				},
				params : {
					idPaciente : '',
					externo : false,
					idPacienteOld: ''
				},
				resolve : {
					Resolves : ResolveDataPaciente
				}
			});
			//Para llamar con parametros desde la pantalla de paciente
			$stateProvider.state({
				name : 'pacienteListParams',
				url : '/Persona/Paciente/List/Params/{userName}/{accessToken}/{clavePaciente}/{idTipoDocumento}/{numeroDocumento}',
				template: 'redireccionando...',
				controller: 'PacienteInterceptorController',
				data : {
					userRequired : false
				}
			});
			//Para cerrar la ventana cuando se llama desde la pantalla de paciente externa
			$stateProvider.state({
				name : 'paciente.confirm',
				url: '/Confirm',
				template : 'confirm'
			});

			ResolveDataPaciente.$inject = ['PacienteDataService', 'SupportDataService', 'TipoSexoDataService',
				'$stateParams', '$q'];
			function ResolveDataPaciente(PacienteDataService: IPacienteDataService, SupportDataService: ISupportDataService,TipoSexoDataService: ITipoSexoDataService,
				$stateParams, $q) {

				var _paciente;
				if ($stateParams.idPaciente) {
					_paciente = PacienteDataService.obtenerPacientePorIdEditar($stateParams.idPaciente);
				} else if ($stateParams.idPacienteOld) {
					_paciente = PacienteDataService.obtenerPacientePorIdEditarViejo($stateParams.idPacienteOld);
				} else if($stateParams.externo){
					_paciente = PacienteDataService.nuevoPacienteConDocumento($stateParams.idTipoDocumento,$stateParams.numeroDocumento);
				}else if($stateParams.internoApp){
					if ($stateParams.nombre === "" || $stateParams.apellido === ""){
						_paciente = PacienteDataService.nuevoPacienteConDocumento($stateParams.idTipoDocumento, $stateParams.numeroDocumento);
					}else
					_paciente = PacienteDataService.nuevoPacienteConDocumentoYNombreApellido($stateParams.idTipoDocumento, 
						$stateParams.numeroDocumento, $stateParams.nombre, $stateParams.apellido);
				}else {
					_paciente = PacienteDataService.nuevoPaciente();
				}
				var _estadosCiviles = SupportDataService.obtenerTodosEstadoCivil();
				var _nacionalidades = SupportDataService.obtenerTodosPaises();
				var _tipoSexos = TipoSexoDataService.obtenerTiposSexoMF();//TipoSexoDataService.obtenerTodosTipoSexo();
				var _estadoPacired = PacienteDataService.obtenerEstadoEmpadronamientoPorPermisos();
				var _tiposRelacion = PacienteDataService.getTiposRelacionPaciente();
				var _tiposPaciente = PacienteDataService.obtenerTodosTipoPaciente();

				return $q.all([_paciente, _estadosCiviles, _nacionalidades, _estadoPacired,
						 _tiposRelacion, _tipoSexos,_tiposPaciente]);
			}
		}
	};
	return module;

})();