import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      useFactory: () => ({
        // TODO: update configuration, should store in env
        type: 'postgres',
        host: process.env.NEST_TEMP_DB_HOST,
        port: Number(process.env.NEST_TEMP_DB_PORT),
        username: process.env.NEST_TEMP_DB_USERNAME,
        password: process.env.NEST_TEMP_DB_PASSWORD,
        database: process.env.NEST_TEMP_DB_NAME,
        autoLoadEntities: true,
        synchronize: true,
      }),
    }),
  ],
  controllers: [],
  providers: [],
})
export class DatabaseModule {}
