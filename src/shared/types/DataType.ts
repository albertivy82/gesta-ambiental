export interface DataType {
    access_token: string;
    refresh_token: string;
    scope: string;
    token_type: 'bearer' | string;
    expires_in: number;
    [key: string]: string | number;
}