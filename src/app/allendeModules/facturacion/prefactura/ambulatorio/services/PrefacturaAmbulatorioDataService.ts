export default (function(){
	const module = { init : (ngModule: any) => {} };

	module.init = function (module) {

		module.factory('PrefacturaAmbulatorioDataService', PrefacturaAmbulatorioDataService);

		PrefacturaAmbulatorioDataService.$inject = ['DotService', 'Logger'];
		
		function PrefacturaAmbulatorioDataService (DotService, $log) {
			
			/* ------------------------------------------------ LOG ------------------------------------------------ */

			$log = $log.getInstance('PrefacturaAmbulatorioDataService');
			$log.debug('ON.-');
			/* ------------------------------------------ API Y VARIABLES ------------------------------------------ */

			var IdPaciente = null;
			var FechaDesde = null;
			var FechaHasta = null;
			var Servicio = null;
			var Sucursal = null;
			var Mutual = null;

			const service = {
				obtenerPrefacturaAmbulatorio : obtenerPrefacturaAmbulatorio,
				obtenerPrefacturaAmbulatorioPorId : obtenerPrefacturaAmbulatorioPorId,
				getCalculoMontosHonorarios : getCalculoMontosHonorarios,
				generarItemPrefactura : generarItemPrefactura,
				guardarPrefactura : guardarPrefactura,
				generarFiltroListaPrefactura : generarFiltroListaPrefactura,
				obtenerPrefacturasFiltradas : obtenerPrefacturasFiltradas,
				getCalculoPracticaDto: getCalculoPracticaDto,
				agregarPrefacturableAPrefactura : agregarPrefacturableAPrefactura,
				editarParticipanteItemPrefacturado : editarParticipanteItemPrefacturado,
				cambiarProfesionalEfectorDePrefactura : cambiarProfesionalEfectorDePrefactura,
				cambiarCoberturaDePrefactura : cambiarCoberturaDePrefactura,
				eliminarItemPrefactura : eliminarItemPrefactura,
				validarEliminarItemPrefactura : validarEliminarItemPrefactura,
				obtenerCuentasPorItemPrefacturaProfesionalTipoComponente : obtenerCuentasPorItemPrefacturaProfesionalTipoComponente,
				obtenerNuevoParticipanteItemPrefactura : obtenerNuevoParticipanteItemPrefactura,
				obtenerNuevoParticipanteItemPrefacturaConMatricula : obtenerNuevoParticipanteItemPrefacturaConMatricula,
				actualizarParticipanteItemPrefactura : actualizarParticipanteItemPrefactura,
				receptarTurnoAPartirDePrefacturaAmbulatoria : receptarTurnoAPartirDePrefacturaAmbulatoria,
				sucursalObtenerTodos : sucursalObtenerTodos,
				autorizarPrefactura : autorizarPrefactura,
				exportarListaToXls : exportarListaToXls,
				obtenerAfiliadoOKSegunPadrones: obtenerAfiliadoOKSegunPadrones,
				Desglosar: Desglosar,
				cambiarCodigoItemPrefacturado: cambiarCodigoItemPrefacturado
			};
			return service;

			/* ------------------------------------------- IMPLEMENTACIÓN ------------------------------------------- */
			function obtenerPrefacturaAmbulatorio(pNumeroTurno) {
				var _url = 'PrefacturacionAmbulatoria/ObtenerPorIdTurno/'+ pNumeroTurno;
				return DotService.Get(_url);
			}

			function obtenerPrefacturaAmbulatorioPorId(id) {
				var _url = 'PrefacturacionAmbulatoria/ObtenerPorId/'+ id;
				return DotService.Get(_url);
			}

			function getCalculoMontosHonorarios(pImportesPracticaDLLDto) {
				var _url = 'Prefacturacion/CalcularMontoPractica';
				return DotService.Post(_url, pImportesPracticaDLLDto);
			}

			function getCalculoPracticaDto() {
				var _url = 'Prefacturacion/CrearCalculoPracticaDto';
				return DotService.Get(_url);
			}

			function generarItemPrefactura() {
				var _url = 'PrefacturacionAmbulatoria/CrearItemPrefactura';
				return DotService.Post(_url);
			}

			function guardarPrefactura(prefactura) {
				var _url = 'PrefacturacionAmbulatoria/Guardar';
				return DotService.Post(_url, prefactura);
			}

			function generarFiltroListaPrefactura() {
				var _url = 'PrefacturacionAmbulatoria/CrearFiltroPrefacturaAmbulatoria';
				return DotService.Get(_url);
			}

			function obtenerPrefacturasFiltradas(pFiltros) {
				var _url = 'PrefacturacionAmbulatoria/ObtenerPorFiltros';
				return DotService.Post(_url, pFiltros);
			}

			function agregarPrefacturableAPrefactura(idPrefactura, idTipoPrefacturable, idPrefacturable) {
				var _url = 'PrefacturacionAmbulatoria/AgregarPrefacturableAPrefactura/'+idPrefactura+'/'+idTipoPrefacturable+'/'+idPrefacturable;
				return DotService.Get(_url);
			}

			function editarParticipanteItemPrefacturado(idParticipante, idProfesional) {
				var _url = 'PrefacturacionAmbulatoria/EditarParticipanteItemPrefactura/'+idParticipante+'/'+idProfesional;
				return DotService.Get(_url);
			}

			function cambiarProfesionalEfectorDePrefactura(idPrefactura, idProfesionalEfector) {
				var _url = 'PrefacturacionAmbulatoria/CambiarProfesionalEfectorDePrefactura/'+idPrefactura+'/'+idProfesionalEfector;
				return DotService.Get(_url);
			}

			function cambiarCoberturaDePrefactura(idPrefactura, idPlan) {
				var _url = 'PrefacturacionAmbulatoria/CambiarCoberturaDePrefactura/'+idPrefactura+'/'+idPlan;
				return DotService.Get(_url);
			}

			function eliminarItemPrefactura(idItem) {
				var _url = 'PrefacturacionAmbulatoria/EliminarItemPrefactura/'+idItem;
				return DotService.Get(_url);
			}

			function validarEliminarItemPrefactura(idItem) {
				var _url = 'PrefacturacionAmbulatoria/ValidarEliminarItemPrefactura/'+idItem;
				return DotService.Get(_url);
			}

			function obtenerCuentasPorItemPrefacturaProfesionalTipoComponente(idItemPrefactura, idProfesional, idTipoComponente){
				var _url = 'PrefacturacionAmbulatoria/ObtenerCuentasPorItemPrefacturaProfesionalTipoComponente/'+idItemPrefactura+'/'+idProfesional+'/'+idTipoComponente;
				return DotService.Get(_url);
			}

			function obtenerNuevoParticipanteItemPrefactura(idItemPrefactura, idProfesional, idTipoComponente){
				var _url = 'PrefacturacionAmbulatoria/ObtenerNuevoParticipanteItemPrefactura/'+idItemPrefactura+'/'+idProfesional+'/'+idTipoComponente;
				return DotService.Get(_url);
			}

			function obtenerNuevoParticipanteItemPrefacturaConMatricula(idItemPrefactura, numeroMatricula, idTipoComponente){
				var _url = 'PrefacturacionAmbulatoria/obtenerNuevoParticipanteItemPrefacturaConMatricula/'+idItemPrefactura+'/'+numeroMatricula+'/'+idTipoComponente;
				return DotService.Get(_url);
			}

			function actualizarParticipanteItemPrefactura(idParticipante, numeroMatricula, idTipoComponente){
				var _url = 'PrefacturacionAmbulatoria/ActualizarParticipanteItemPrefactura/'+idParticipante+'/'+numeroMatricula+'/'+idTipoComponente;
				return DotService.Get(_url);
			}

			function receptarTurnoAPartirDePrefacturaAmbulatoria(prefacturaDto) {
				var _url = 'Turnos/receptarTurnoAPartirDePrefacturaAmbulatoria';
				return DotService.Post(_url, prefacturaDto);
			}

			function sucursalObtenerTodos () {
				var _url = 'Sucursal/ObtenerTodas';
				return DotService.Get(_url,{ isCachable: true });
			}

			function autorizarPrefactura(idPrefactura) {
				var _url = 'PrefacturacionAmbulatoria/AutorizarPrefactura/'+idPrefactura;
				return DotService.Get(_url);	
			}

			function exportarListaToXls(idPaciente, fechaDesde, fechaHasta, idServicio, idSucursal, currentPage, pageSize) {
				var _url = 'PrefacturacionAmbulatoria/ExportListToExcel/'+idPaciente+'/'+fechaDesde+'/'+fechaHasta+'/'+idServicio+'/'+idSucursal+'/'+currentPage+'/'+pageSize;
				return DotService.DownloadFile(_url, 'PrefacturasAmbulatorias.xlsx');
			}

			function obtenerAfiliadoOKSegunPadrones(pIdMutual, pNroDocumento) {
				var _url = 'PrefacturacionAmbulatoria/AfiliadoOKSegunPadrones/'+pIdMutual+'/'+pNroDocumento;
				return DotService.Get(_url);	
			}

			function Desglosar(idItemPrefactura){
				var _url = 'PrefacturacionAmbulatoria/DesglosarItem/'+idItemPrefactura;
				return DotService.Get(_url);	
			}

			function cambiarCodigoItemPrefacturado(idItemPrefactura,idTipoPrefacturable,idPrefacturable){
				var _url = 'PrefacturacionAmbulatoria/CambiarCodigoItemPrefacturado/'+idItemPrefactura+'/'+idTipoPrefacturable+'/'+idPrefacturable;
				return DotService.Get(_url);	
			}

		}
	};

	return module;
})();