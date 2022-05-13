import { TypeOrmModuleOptions } from "@nestjs/typeorm";
import * as config from 'config'

let dbConfig = config.get('db')
let devMode = process.env.NODE_ENV === 'developer'
if(devMode) {
    dbConfig = dbConfig.developerment
}

export const typeORMConfig : TypeOrmModuleOptions = {
    type: 'mysql',
    host: 'host.docker.internal',
    port: 3306,
    username: 'root',
    password: '1Q2W3E4R!',
    database: 'board_app',
    entities: [__dirname + '/../**/*.entity.{js,ts}'],
    // synchronize : true 값을 설정하면 어플리케이션을 다시 실행할 때 엔티티안에서 수정된 컬럼의 길이 타입 변경값등을 해당 테이블을 Drop한 후 다시 생성해준다 
    synchronize: false,
    logging: true
}