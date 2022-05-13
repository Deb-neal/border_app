import { Inject, createParamDecorator, ExecutionContext } from "@nestjs/common";
import { createQueryBuilder, EntityRepository, Like, Repository } from "typeorm";
import { BoardRepository } from './boards.repository';
import { Board } from "./boards.entity"
import { ConstraintMetadata } from "class-validator/types/metadata/ConstraintMetadata";

export const GetTopPage =  createParamDecorator((data: Promise<Board[]>, idx: ExecutionContext): Board => {    
    /*console.log('아이디엑스', idx.switchToHttp().getResponse())*/
    
    const injectService = Inject(BoardRepository)
    console.log('인젝터', injectService)
    
    const req = idx.switchToHttp().getResponse()
    return req
})




// export const GetTopPages = () => {
    
//     const injectService = Inject(BoardRepository)
//     console.log('인젝터', injectService)
//     // constructor(private boardRepository: BoardRepository){}
    
//     // GetTopPage =  createParamDecorator((data: Promise<Board[]>, idx: ExecutionContext): Board => {    
//     //     /*console.log('아이디엑스', idx.switchToHttp().getResponse())*/
    
//     //     const req = idx.switchToHttp().getResponse()
//     //     return req
//     // })

    
// }