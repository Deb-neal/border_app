import { Injectable, NotFoundException } from '@nestjs/common';
import { BoardStatus } from './board-status.enum';
import { CreateBoardDto } from './dto/create-board.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { BoardRepository } from './boards.repository';
import { Board } from './boards.entity'
import { User } from 'src/auth/user.entity'

@Injectable()
export class BoardsService {

    // Inject Repository to Service
    constructor(   
        @InjectRepository(BoardRepository)
        private boardRepository: BoardRepository
    ){}

    // private boards:Board[] = [];
    
    // getAllBoards():Board[] {
    //     return this.boards
    // }
    createBoard(createBoardDto: CreateBoardDto, user: User) : Promise<Board>{
        return this.boardRepository.createBoard(createBoardDto, user)
    }

    // createBoard(createBoardDto: CreateBoardDto){
    //     const {title, description} = createBoardDto
    //     const board: Board = {
    //         id: uuid(),
    //         title,
    //         description,
    //         status: BoardStatus.PUBLIC
    //     }
    //     this.boards.push(board)
    //     return this.boards
    // }

    async getAllBoards(): Promise<Board[]> {
        // const query = this.boardRepository.createQueryBuilder('board')
        
        // query.where('board.userId = :userId', {userId: user.id})

        // const boards = await query.getMany()

        return this.boardRepository.getAllBoard()
    }

    async getPagination(
        page:number,
        pageSize:number,
        board:Board[],
        createBoardDto: CreateBoardDto
    ) :  Promise<Board[]> {
        // return this.boardRepository.paging()
        return this.boardRepository.getPagination(page, pageSize, board, createBoardDto)
    }

    async getSearchBoard(
        search:string,
    ): Promise<Board[]> {
        return this.boardRepository.getSearchBoard(search)
    }
    
    getBoardById(id): Promise <Board> {
        const found = this.boardRepository.findOne(id)
        if(!found){
            throw new NotFoundException(`Can't find board ${id}`)
        }
        return this.boardRepository.getBoardById(id)
    }

    deleteBoard(id, user): Promise<void> {
        return this.boardRepository.deleteBoard(id, user)
    }

    updateBoard(id, status): Promise<Board> {
        return this.boardRepository.updateBoard(id, status)
    }
    // getBoardById(id: string): Board {
    //     const found = this.boards.find((ele) => ele.id === id)
    //     if(!found){
    //         throw new NotFoundException(`Cant not find this id ${id}`)
    //     }
        
    //     return found
    // }

    // deleteBoard(id: string): void {
    //     const found = this.getBoardById(id)
    //     this.boards = this.boards.filter((ele) => ele.id !== found.id)
    // }

    // updateBoardStatus(id: string, status: BoardStatus): Board {
    //     const board = this.getBoardById(id);
    //     board.status = status
    //     return board 
    // }

    
}
