export interface HttpOptions {
	/**
	 * Establece si la información enviada debe ser capturada en el back-end como diccionario.
	*/
	isDictionary?: boolean;
	/**
	 * @default false
	 * Establece si la información obtenida debe ser almacenada en cache.
	 * - Solo funciona con método GET
	 * - La key de cacheo se compone por la URL y los Parámetros
	*/
	isCachable?: boolean;
}