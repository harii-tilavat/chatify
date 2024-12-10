export interface LoginModel {
    email: string;
    password: string;
}
export interface SignupModel {
    fullName: string;
    email: string;
    password: string;
}
export interface UserModel extends SignupModel {
    profile?: string;
    createdAt?: string;
    updatedAt?: string;
}

export interface LoginResponseModel {
    user: UserModel;
    token: string;
}