import {EnfermeraSectorAsignacionTemporal} from './EnfermeraSectorAsignacionTemporal'
export interface EnfermeraAsignacionTemporal {
	IdEnfermera?: number,
	Desde?: string,
	Hasta?: string,
	IncluirAsignacionPorDefecto?: boolean,
	Sectores?: Array<EnfermeraSectorAsignacionTemporal>
}
