export interface GenericReponseModel<T = any> {
    statusCode?: number;
    message: string,
    data?: T;
}
export interface BaseModel {
    id: string;
}