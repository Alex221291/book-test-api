import { Injectable } from '@nestjs/common';
import { BaseService } from '../../base/base.service';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { FileEntity } from './file.entity';

@Injectable()
export class FileService extends BaseService<FileEntity> {
	constructor(
		@InjectRepository(FileEntity)
		protected repository: Repository<FileEntity>,
	) {
		super();
	}
}
