import { Body, Controller, Get, Post, Req, UseGuards, ValidationPipe } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { AuthService } from './auth.service';
import { AuthCredentialsDto } from './dto/AuthCredentials.dto';
import { GetUser } from './get-user.decorator';
import { User } from "./user.entity"

@Controller('auth')
export class AuthController {

    constructor(private authService: AuthService){}

    @Post('/signup')
    signUP(@Body() authcredentialDto: AuthCredentialsDto): Promise<void> {
        return this.authService.signUp(authcredentialDto);
    }

    @Post('/signin')
    signIn(@Body(ValidationPipe) authcredentialDto: AuthCredentialsDto): Promise<{accessToken: string}>{
        return this.authService.signIn(authcredentialDto)
    }

    @Post('/test')
    @UseGuards(AuthGuard('jwt'))
    test(@GetUser() user:User){
        console.log('what', user )
    }
}