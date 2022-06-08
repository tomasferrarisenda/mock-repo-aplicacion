export default (function () {
	'use strict';

	const module = { init: (ngModule: any) => { } };

	module.init = function (module) {

		module.factory('GuardiaAtencionDataService', GuardiaAtencionDataService);

		// Inyección de dependencia
		GuardiaAtencionDataService.$inject = ['DotService', '$log', 'HTTP_METHOD', 'ENV'];

		// Definición del servicio
		function GuardiaAtencionDataService(DotService, $log, HTTP_METHOD, ENV) {

			$log.debug('GuardiaAtencionDataService: ON.-');

			var externo = false;
			var matriculaMedico = '';
			var clavePaciente = '';
			var login = false;
			var paciente = '';
			var prescripcion = '';
			var practicasMedicas = '';
			var accionesEnfermeria = '';
			var detalle = '';
			var ubicacion = '';
			var vias = '';
			var tiposDosis = '';
			var usuario = '';

			// API o Interface
			const service = {
				getSucursales: getSucursales,
				getAllPrescripciones: getAllPrescripciones,
				getUbicacionBySucursal: getUbicacionBySucursal,
				getPrescripcionByIdPaciente: getPrescripcionByIdPaciente,
				getPrescripcionById: getPrescripcionById,
				getPacienteById: getPacienteById,
				newPrescripcion: newPrescripcion,
				getUsuarioByNombre: getUsuarioByNombre,
				getAllPrioridades: getAllPrioridades,
				getAllMedicamentos: getAllMedicamentos,
				// getAllDescartables: getAllDescartables,
				getAccionesEnfermeria: getAccionesEnfermeria,
				getPracticasMedicas: getPracticasMedicas,
				getAccionesEnfermeriaFavoritos: getAccionesEnfermeriaFavoritos,
				getPracticasMedicasFavoritas: getPracticasMedicasFavoritas,
				cargarPrescripcion: cargarPrescripcion,
				getAllVias: getAllVias,
				getAllTiposDosis: getAllTiposDosis,
				getIndicacionById: getIndicacionById,
				getMaterialByIdProducto: getMaterialByIdProducto,
				getDetallesPrescripcionPendientes: getDetallesPrescripcionPendientes,
				getDetallesPrescripcionRealizados: getDetallesPrescripcionRealizados,
				realizarPrescripcion: realizarPrescripcion,
				getAllMedicamentosByUbicacion: getAllMedicamentosByUbicacion,
				getAllDescartablesByUbicacion: getAllDescartablesByUbicacion,
				getTipoAlta: getTipoAlta,
				newAlta: newAlta,
				getTiposIndicacion: getTiposIndicacion,
				getAllTipoInternacion: getAllTipoInternacion,
				getMaterialesFavoritos: getMaterialesFavoritos,
				newPedido: newPedido,
				getPedidosByUbicacion: getPedidosByUbicacion,
				getAllMedicos: getAllMedicos,
				asociarPedidos: asociarPedidos,
				newUbicacionPacienteGuardia: newUbicacionPacienteGuardia,
				newFoja: newFoja,
				getPrescripcionDto: getPrescripcionDto,
				getDetalleDto: getDetalleDto,
				getMaterialDto: getMaterialDto,
				getFojaDto: getFojaDto
			};

			return service;

			function getSucursales() {
				var _url = 'legacy/Sucursal/GetSinTodas';
				return DotService.getCommon(HTTP_METHOD.GET, ENV.BACKEND + _url);
			}

			function getAllPrescripciones(pIdUbicacion) {
				var _url = 'Prescripcion/GetAllActivasByUbicacion/' + pIdUbicacion;
				return DotService.getCommon(HTTP_METHOD.GET, ENV.BACKEND + _url);
			}

			function getUbicacionBySucursal(pIdSucursal) {
				var _url = 'Ubicacion/GetUbicacionGuardiaBySucursal/' + pIdSucursal;
				return DotService.getCommon(HTTP_METHOD.GET, ENV.BACKEND + _url);
			}

			function getPrescripcionByIdPaciente() {
				var _url = 'Prescripcion/GetOneByIdPaciente/' + this.clavePaciente;
				return DotService.Get(_url, null);
			}

			function getPrescripcionById() {
				var _url = 'Prescripcion/' + this.prescripcion.id_prescripcion;
				return DotService.Get(_url, null);
			}

			function getPacienteById() {
				var _url = 'PacienteMedico/' + this.clavePaciente;
				var ret = DotService.Get(_url, null);
				$log.debug("paciente", ret);
				return ret;
			}

			function newPrescripcion(pPrescripcion) {
				var _url = 'Prescripcion/AddOne/';
				return DotService.Post(_url, pPrescripcion);
			}

			function getUsuarioByNombre(pNombre) {
				var _url = 'Usuario/GetByUserName/' + pNombre;
				return DotService.Get(_url, null);
			}

			function getAllPrioridades() {
				var _url = 'PioridadPrescripcionDetalle/';
				return DotService.Get(_url, null);
			}

			function getAllMedicamentos() {
				var _url = 'Material/ObtenerTodosMedicamentos/';
				return DotService.getCommon(HTTP_METHOD.GET, ENV.BACKEND + _url);
			}

			function getAllMedicamentosByUbicacion() {
				var _url = 'Material/GetAllMedicamentoEnStockByIdUbicacion/' + this.ubicacion.id_ubicacion;
				return DotService.Get(_url, null);
			}

			function getAllDescartablesByUbicacion() {
				var _url = 'Material/GetAllDescartableEnStockByIdUbicacion/' + this.ubicacion.id_ubicacion;
				return DotService.Get(_url, null);
			}


			function getAccionesEnfermeria() {
				var _url = 'Indicacion/GetAccionEnfermeria';
				return DotService.Get(_url, null);
			}

			function getPracticasMedicas() {
				var _url = 'Indicacion/GetPracticaMedica';
				return DotService.Get(_url, null);
			}

			function getAccionesEnfermeriaFavoritos() {
				var _url = 'Indicacion/GetAccionEnfermeriaFavoritos';
				return DotService.Get(_url, null);
			}

			function getPracticasMedicasFavoritas() {
				var _url = 'Indicacion/GetPracticaMedicaFavoritos';
				return DotService.Get(_url, null);
			}

			function cargarPrescripcion(pPrescripcion) {
				var _url = 'Prescripcion/Carga/';
				return DotService.Post(_url, pPrescripcion);
			}

			function getAllVias() {
				var _url = 'Via';
				return DotService.Get(_url, null);
			}
			function getAllTiposDosis() {
				var _url = 'TipoDosisPrescripcion';
				return DotService.Get(_url, null);
			}

			function getIndicacionById(pId) {
				var _url = 'Indicacion/' + pId;
				return DotService.getCommon(HTTP_METHOD.GET, ENV.BACKEND + _url);
			}

			function getMaterialByIdProducto(pId) {
				var _url = 'Material/GetMaterialByIdProducto/' + pId;
				return DotService.getCommon(HTTP_METHOD.GET, ENV.BACKEND + _url);
			}

			function getDetallesPrescripcionPendientes() {
				var _url = 'Prescripcion/GetDetallesPendientesById/' + this.prescripcion.Id;
				return DotService.Get(_url, null);
			}

			function getDetallesPrescripcionRealizados() {
				var _url = 'Prescripcion/GetDetallesRealizadosById/' + this.prescripcion.Id;
				return DotService.Get(_url);
			}

			function realizarPrescripcion(pPrescripcion) {
				var _url = 'PrescripcionDetalle/Realizar/';
				return DotService.Post(_url, pPrescripcion);
			}

			function getTipoAlta() {
				var _url = 'TipoAltaPrescripcion/';
				return DotService.Get(_url, null);
			}


			function newAlta(pPrescripcion, pTipoAlta, pTipoInternacion, pInformeMedico, pDiagnostico, pTipoHabitacion) {
				var _url = 'Prescripcion/Alta/' + pPrescripcion + '/' + pTipoAlta + '/' + pTipoInternacion +
					'/' + pInformeMedico + '/' + pDiagnostico + '/' + pTipoHabitacion;
				return DotService.Get(_url, null);
			}

			function getTiposIndicacion() {
				var _url = 'TipoIndicacion/';
				return DotService.Get(_url, null);
			}

			function getAllTipoInternacion() {
				var _url = 'TipoInternacion/';
				return DotService.Get(_url, null);
			}

			function getMaterialesFavoritos() {
				var _url = 'Material/GetAllFavoritosGuardia/';
				return DotService.getCommon(HTTP_METHOD.GET, ENV.BACKEND + _url);
			}

			function newPedido(pPedido) {
				var _url = 'PedidoFarmacia/NewPedido/';
				return DotService.getCommon(HTTP_METHOD.POST, ENV.BACKEND + _url, pPedido);
			}

			function getPedidosByUbicacion(pUbicacion) {
				var _url = 'PedidoFarmacia/GetAllEntregadosUrgenciaByUbicacion/' + pUbicacion;
				return DotService.Get(_url, null);
			}

			function getAllMedicos() {
				var _url = 'Usuario/GetUsuariosMedico/';
				return DotService.getCommon(HTTP_METHOD.GET, ENV.BACKEND + _url);
			}

			function asociarPedidos(pObject) {
				var _url = 'PedidoFarmacia/Asociar/';
				return DotService.Post(_url, pObject);
			}

			function newUbicacionPacienteGuardia(pIdPaciente) {
				var _url = 'Ubicacion/NewUbicacionPacienteGuardiaById/' + pIdPaciente;
				return DotService.Get(_url);
			}

			function newFoja(pFoja) {
				var _url = 'PrescripcionDetalle/NewFoja';
				return DotService.Post(_url, pFoja);
			}

			function getPrescripcionDto() {
				var _url = 'Prescripcion/GetDto';
				return DotService.Get(_url);
			}

			function getDetalleDto() {
				var _url = 'PrescripcionDetalle/GetDto';
				return DotService.Get(_url);
			}

			function getMaterialDto() {
				var _url = 'PrescripcionDetalleMaterial/GetDto';
				return DotService.Get(_url);
			}

			function getFojaDto() {
				var _url = 'PrescripcionDetalle/GetFojaDto';
				return DotService.Get(_url);
			}

		}
	};

	return module;
})();