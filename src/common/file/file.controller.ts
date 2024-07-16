import {
	BadRequestException,
	Controller,
	Get,
	Param,
	Post,
	Request,
	Res,
	UploadedFile,
	UseGuards,
	UseInterceptors,
} from '@nestjs/common';
import { JwtAuthGuard } from '../../auth/jwt-auth.guard';
import { FileInterceptor } from '@nestjs/platform-express';
import md5 from '../../base/utils/md5';
import * as fs from 'fs';
import { FileService } from './file.service';
import { FileEntity } from './file.entity';
import { ConfigService } from '@nestjs/config';
import { Response } from 'express';
import * as sharp from 'sharp';

@Controller()
export class FileController {
	constructor(
		private fileService: FileService,
		private configService: ConfigService,
	) {}

	// @UseGuards(JwtAuthGuard)
	@Get('/api/v1/file/:filename')
	async getFile(@Param() params, @Res() response: Response) {
		const file = await this.fileService.findOneBy({
			filename: params.filename,
		});
		if (file) {
			const buffer = fs.createReadStream(file.dir + file.filename);
			response.setHeader('Content-Type', file.type);
			buffer.pipe(response);
		} else {
			throw new BadRequestException();
		}
	}

	@UseGuards(JwtAuthGuard)
	@Post('/api/v1/file/upload')
	@UseInterceptors(FileInterceptor('file'))
	async uploadFile(@Request() req, @UploadedFile() file: Express.Multer.File) {
		try {
			const dir = this.configService.get<string>('UPLOAD_DIR');
			const filename = file.originalname.replace(
				/^(.*)\.([A-z])/,
				`${md5(Date.now().toString() + Math.random())}.$2`,
			);
			const path = `${dir}${filename}`;
			await fs.writeFileSync(
				path,
				await sharp(file.buffer).resize(1200).toBuffer(),
			);
			const entity = new FileEntity();
			entity.filename = filename;
			entity.dir = dir;
			entity.type = file.mimetype;
			entity.size = file.size;
			return await this.fileService.add(entity);
		} catch (e) {
			throw new BadRequestException(e.message);
		}
	}
}
