import { EntityRepository, Repository } from "typeorm";
import { User } from "./user.entity"
import { AuthCredentialsDto } from "./dto/AuthCredentials.dto";
import { ConflictException, InternalServerErrorException } from "@nestjs/common";
import * as bcrypt from 'bcryptjs'; 
import { response } from "express";

@EntityRepository(User)
export class UserRepository  extends Repository<User> {
   
    async createUser(authCredentialsDto: AuthCredentialsDto): Promise<void> {
        const {username, password} = authCredentialsDto;


        const salt = await bcrypt.genSalt();
        const hashedPassword = await bcrypt.hash(password, salt)
        // const what = await bcrypt.hash(password)
        // console.log(what)
        const user = this.create({username, password: hashedPassword});
        try{
            await this.save(user)  
        } catch (err) {
            console.log(err)
            if(err.code === '23505'){
                throw new ConflictException('Existing username')
            } else {
                throw new InternalServerErrorException()
            }
        }
    }
}