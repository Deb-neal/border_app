import { IsNotEmpty, IsString, Matches, MaxLength, MinLength } from "class-validator";


export class AuthCredentialsDto {
    @IsString()
    @MinLength(4)
    @MaxLength(20)
    @IsNotEmpty( { message: 'not invalid tyoe not empty'})
    username: string;

    @IsNotEmpty()
    @MinLength(4)
    @MaxLength(20)
    @Matches(/^[a-zA-Z0-9]*$/, {message: "PassWord wrong"}) 
    password: string;
}