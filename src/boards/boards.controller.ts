import { Body, Controller, Delete, Get, Param, Patch, Post, ParseUUIDPipe, UsePipes, ValidationPipe, ParseIntPipe, UseGuards, Query, Logger } from '@nestjs/common';
import { BoardsService } from './boards.service';
import { BoardStatus } from './board-status.enum';
import { CreateBoardDto } from './dto/create-board.dto';
import { BoardStatusValidationPipe } from './pipes/board-status-validation.pipe'
import { Board } from './boards.entity'
import { AuthGuard } from '@nestjs/passport';
import { GetUser } from 'src/auth/get-user.decorator';
import { GetTopPage } from './get-TopPage.decorator'
import { User } from 'src/auth/user.entity'

@Controller('boards')
@UseGuards(AuthGuard('jwt'))
export class BoardsController{
    private logger = new Logger('Boards');
    constructor(private boardsService: BoardsService){}
    
    // @Get()
    // getAllBoard(): Board[] {
    //     return this.boardsService.getAllBoards()
    // }
    
    
    @Post() 
    @UsePipes(ValidationPipe)
    createBoard(@Body() createBoardDto: CreateBoardDto,
    @GetUser() user: User,
    @GetTopPage() topPage: any
    ) : Promise<Board> {
        this.logger.verbose(`User ${user.username} createing a new board.
        Payload: ${JSON.stringify(createBoardDto)}`)
        return this.boardsService.createBoard(createBoardDto, user)
    }

    

    // @Post()
    // @UsePipes(ValidationPipe)
    // createBoard(
    // @Body() createBoardDto: CreateBoardDto
    // ) {
    //     return this.boardsService.createBoard(createBoardDto)
    // }

    @Get()
    getAllBoard(): Promise<Board[]> {
        this.logger.verbose(`User trying to get all board`)
        return this.boardsService.getAllBoards()
    }
    
    @Get('/page')
    getPagination(
        @Body() createBoardDto: CreateBoardDto,
        @Query('page', ParseIntPipe) page:number,
        board:Board[]
    ):  Promise<Board[]>{
      const pageSize = 5
        return this.boardsService.getPagination(page, pageSize, board, createBoardDto)
    }

    @Get('search')
    getSearchBoard(
        @Query('search') search:string
    ): Promise<Board[]>{
        return this.boardsService.getSearchBoard(search)
    }

    @Get('/:id')
    getBoardById(@Param('id') id:string) : Promise<Board> {
        return this.boardsService.getBoardById(id)
    }

    
    @Delete('/:id')
    deleteBoard(@Param('id', ParseIntPipe) id:number,
    @GetUser() user: User
    ) : Promise<void> {
      return this.boardsService.deleteBoard(id, user)
    }

    @Patch('/:id/status')
    updataBoard(
      @Param('id', ParseIntPipe) id:number,
      @Body('status', BoardStatusValidationPipe) status:BoardStatus
    ) : Promise<Board> {
        return this.boardsService.updateBoard(id, status)
    }

    // @Get('/:id')
    // getBoardById(@Param('id')  id:string): Board {
    //     return this.boardsService.getBoardById(id)
     
    // }

    // @Delete('/:id')
    // deleteBoard(@Param('id') id:string): void {
    //     this.boardsService.deleteBoard(id)
    // }

    // @Patch('/:id/status')
    // updateBoardStatus(
    // @Param('id') id:string,
    // @Body('status', BoardStatusValidationPipe) status:  BoardStatus
    // ) {
    //     console.log('아이디', id)
    //     console.log('상태', status)
    //     return this.boardsService.updateBoardStatus(id, status)
    // }

}
