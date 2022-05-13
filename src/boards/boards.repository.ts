import { ConsoleLogger, HttpCode, Injectable, NotFoundException } from '@nestjs/common';
import { createQueryBuilder, EntityRepository, Like, Repository } from "typeorm";
import { CreateBoardDto } from './dto/create-board.dto';
import { Board, Page } from "./boards.entity"
import { BoardStatus } from "./board-status.enum";
import { User } from 'src/auth/user.entity'
import { response } from 'express';

@EntityRepository(Board)
@Injectable()
export class BoardRepository extends Repository<Board> {

    async createBoard(createBoardDto: CreateBoardDto, user: User): Promise<Board>{
        const {title, description, PageNumber} = createBoardDto

        // 여기서 탑페이지가 몇번째인지 찾는 action 한번
        const TopPage = await this.find({order:{PageNumber: "DESC"}, select: ["PageNumber"], take: 1})
        
        // 찾은 탑페이지를 통해 그 페이지가 몇개가 있는지 찾는 action 한번
        // 이러면 action이 두번 발생해서 효율성 문제 고려
        // 마지막에 존재하는 페이지, 그리고 그 페이지에 존재하는 Board들의 갯수를 가지고있으면 첫번째 action이 없어지지 않을까
        const HowManyTopPage = await this.find({order:{PageNumber: "DESC"}, select: ["PageNumber"], where: {PageNumber: TopPage[0].PageNumber}})
        
        // 찾은 내용 바탕으로 함수 구현
        function PlusPageNumber() {
            if (HowManyTopPage.length >= 5){
               TopPage[0].PageNumber++
               return TopPage[0].PageNumber
            } else {
                return TopPage[0].PageNumber
            }
        } 

        const board =  this.create({
            title,
            description,
            status: BoardStatus.PUBLIC,
            user,
            PageNumber: PlusPageNumber()
        })

        await this.save(board)
        return board
    }

    async getAllBoard(): Promise<Board[]> {
        
        const found = await this.find()
        return found
    }
    
     // Pagination 구현방법 another case --------

    async paging () :Promise<[Board[],number]>{
        return createQueryBuilder()
            .select([
                'board.id',
                'board.title',
                'board.description',
            ])
            .from(Board,'board')
            .offset(1)
            .limit(10)
            .disableEscaping()
            .getManyAndCount()
        }

    async findAll() {
        return this.findAll()
    }

    // -----------------------------------------------

    async getPagination(page, pageSize, board:Board[], createBoardDto:CreateBoardDto): Promise<Board[]> {
        
        // 처음 코드 작성시 page 요청이 들어오지 않으면 전체 board 데이터를 출력해주는 방식을 생각
        // 하지만 그럴경우 데이터가 적으면 괜찮지만 1억개의 데이터가 존재할때 그걸 전부 출력하면 심각한 문제가 발생 ( DB 데이터 처리하는 과정 에서)
        // 전체 데이터를 출력해주는 로직은 따로 짜자
        // if(!page) {
        //     return this.find()
        // } 

        // const [paginated, total] = await this.findAndCount({
        //     skip: ( page - 1 ) * pageSize,
        //     take: pageSize
        // })
        
        // if (page > total / pageSize) {
        //     throw new NotFoundException(`Can't find`)
        // }
        try {
            const [paginated, total] = await this.findAndCount({
                skip: ( page - 1 ) * pageSize,
                take: pageSize
            })
            if (page > total / pageSize) {
                throw new NotFoundException(`Can't find Page ${page}`)
            }
           // 총 페이지 수가 넘는 요청이 들어올경우 Error 출력
           // Ex. 100개의 데이터를 5개씩 구성할경우 20페이지, 만약 21페이지를 보여달라는 요청이 들어올경우 error 출력
           return paginated
            response.status(200).send("login success")
        } catch (error) {
            if (error instanceof NotFoundException) {
                throw new NotFoundException(`Can't find Page ${page}`)
            }
        }
    }

    async getSearchBoard(
        search
    ): Promise<Board[]> {
        search = JSON.parse(search)
        const Searching = await this.find({
            where: {title: Like(`%${search}%`)}
        })
        return Searching
    }

    async getBoardById(id): Promise <Board> {
        const found = await this.findOne(id)
 
        if(!found){
            throw new NotFoundException(`Can't find board ${id}`)
        }
        return found
    }

    async deleteBoard(id: number, user: User): Promise<void> {
        console.log('아이디', id)
        console.log('유저', user)
        console.log('이건 뭐지', {id, user})
        const result = await this.delete({id, user})
        console.log('삭제물', result)
        if (result.affected === 0){
        throw new NotFoundException(`Can't find board ${id}`)
        }  
    }

    async updateBoard(id: number, status: BoardStatus): Promise<Board> {
        const board = await this.getBoardById(id)
        board.status = status
        await this.save(board)
        return board
    }
}