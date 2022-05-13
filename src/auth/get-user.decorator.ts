import { createParamDecorator, ExecutionContext } from "@nestjs/common";
import { User } from "./user.entity"

export const GetUser =  createParamDecorator((data, idx: ExecutionContext): User => {
    const req = idx.switchToHttp().getRequest()
    return req.user
})