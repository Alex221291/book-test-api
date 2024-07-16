import { DataSource } from 'typeorm';
import { ConfigService } from '@nestjs/config';
import { config } from 'dotenv';

config();

const configService = new ConfigService();

export default new DataSource({
	type: 'postgres',
	url: process.env.DATABASE_URL,
	ssl: true,
	//database: configService.get('POSTGRESQL_DATABASE'),
	//host: configService.get('SQL_HOST'),
	//port: 5432,
	//username: configService.get('POSTGRESQL_USERNAME'),
	//password: configService.get('POSTGRESQL_PASSWORD'),
	entities: ['dist/**/*.entity{.ts,.js}'],
	migrations: ['dist/migrations/*{.ts,.js}'],
});
