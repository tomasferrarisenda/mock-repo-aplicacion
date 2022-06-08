export interface IAuthTicketDto {
    access_token?: string;
    refresh_token?: string;
    companyId?: string;
    token_type?: string;
    userName?: string;
    userCompleteName?: string;
    id?: number;
    employeeId?: number;
    // companyId?: string;
    expires_in?: string;
    // "as?:companyId": string;
}

/**
 * Creado para creación manual
 */
export interface IAuthTicketMinDto {
    access_token: string;
    userName: string;
}