import { ConfigService } from '@nestjs/config'
import { TypeOrmModuleOptions} from '@nestjs/typeorm'
import {join} from 'path'

export const typeOrmconfig =(configService:ConfigService):TypeOrmModuleOptions=>({
    type:'postgres',
    url:configService.get('DATABASE_URL'),
    ssl:true,
    logging:true,
    entities:[ join( __dirname + '../../**/*.entity.{js,ts}' )], //todos los archivos .entity
    synchronize:true

})

