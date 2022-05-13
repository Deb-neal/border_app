import { Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserRepository } from './user.repository';
import { JwtService } from '@nestjs/jwt'
import { AuthCredentialsDto } from './dto/AuthCredentials.dto';
import * as bcrypt from 'bcryptjs'; 

@Injectable()
export class AuthService {

    constructor(@InjectRepository(UserRepository) private userRepository: UserRepository, private jwtService: JwtService) {}

    async signUp(authCredentialsDto: AuthCredentialsDto): Promise<void>{
        return this.userRepository.createUser(authCredentialsDto)
    }
    
    async signIn(authcredentialDto: AuthCredentialsDto): Promise<{accessToken: string}> {
        const {username, password} = authcredentialDto
        const user = await this.userRepository.findOne({ username })

        if (user && (await bcrypt.compare(password, user.password)) ){

            // 로그인 성공시 토큰생성 같이
            const payload = { username }
            const accessToken = await this.jwtService.sign(payload)

            return {accessToken: accessToken}
        } else {
            throw new UnauthorizedException('login fail')
        }
    }


}
