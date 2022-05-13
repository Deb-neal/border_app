import { Module } from '@nestjs/common';
import { TypeOrmModule }  from '@nestjs/typeorm'
import { BoardsModule } from './boards/boards.module';
import { BoardsController } from './boards/boards.controller';
import { BoardsService } from './boards/boards.service';
import { typeORMConfig } from './configs/typeorm.config';
import { AuthModule } from './auth/auth.module';
import { PageModule } from './Page/page.module';
import { AppController } from './app.controller';
import { AppService } from './app.service'

@Module({
  imports: [
    TypeOrmModule.forRoot(typeORMConfig),
    BoardsModule,
    AuthModule,
    PageModule
  ],
  controllers: [AppController],
  providers: [AppService]
})
export class AppModule {}
