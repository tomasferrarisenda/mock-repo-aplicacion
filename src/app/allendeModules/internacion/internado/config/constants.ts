/**
 * @author 			emansilla
 * @description 	description
 */
export default (function () {
	
	const module = { init : (ngModule: any) => {} };

	module.init = function (module) {

		module.constant('INTERNADO_ORDER_BY', [
			{
				id : 1,
				value : 'fecha_admision',
				descripcion : 'Fecha de ingreso (Asc.)',
				reverse : false
			},
			{
				id : 2,
				value : 'fecha_admision',
				descripcion : 'Fecha de ingreso (Desc.)',
				reverse : true
			},
			{
				id : 3,
				value : 'Paciente.nombre_completo',
				descripcion : 'Nombre de paciente (A-Z)',
				reverse : false
			},
			{
				id : 4,
				value : 'Paciente.nombre_completo',
				descripcion : 'Nombre de paciente (Z-A)',
				reverse : true
			},
			{
				id : 5,
				value : 'CamaActual.Habitacion.numero_habitacion',
				descripcion : 'Habitación (Asc)',
				reverse : false
			},
			{
				id : 6,
				value : 'CamaActual.Habitacion.numero_habitacion',
				descripcion : 'Habitación (Desc)',
				reverse : true
			}
		]);

		module.constant('INTERNADO_ORDER_BY_LAZY', [
			{
				id : 1,
				value : 'fecha_admision',
				descripcion : 'Fecha de ingreso (Asc.)',
				reverse : false
			},
			{
				id : 2,
				value : 'fecha_admision',
				descripcion : 'Fecha de ingreso (Desc.)',
				reverse : true
			},
			{
				id : 3,
				value : 'nombre_paciente',
				descripcion : 'Nombre de paciente (A-Z)',
				reverse : false
			},
			{
				id : 4,
				value : 'nombre_paciente',
				descripcion : 'Nombre de paciente (Z-A)',
				reverse : true
			},
			{
				id : 5,
				value : 'numero_habitacion',
				descripcion : 'Habitación (Asc)',
				reverse : false
			},
			{
				id : 6,
				value : 'numero_habitacion',
				descripcion : 'Habitación (Desc)',
				reverse : true
			}
		]);

	};
	
	return module;

})();