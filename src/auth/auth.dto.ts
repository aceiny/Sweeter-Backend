import {IsNotEmpty, Length } from "class-validator";

export class SignupDto {
    @IsNotEmpty()
    name : string;
    @IsNotEmpty()
    email: string;
    @IsNotEmpty()
    username: string;
    @IsNotEmpty()
    @Length(4)
    password: string;
}
export class LoginDto {
    @IsNotEmpty()
    username: string;
    @IsNotEmpty()
    @Length(4)
    password: string;
}