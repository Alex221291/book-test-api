import { FileService } from './file.service';
import { FileEntity } from './file.entity';
import { ConfigService } from '@nestjs/config';
import { Response } from 'express';
export declare class FileController {
    private fileService;
    private configService;
    constructor(fileService: FileService, configService: ConfigService);
    getFile(params: any, response: Response): Promise<void>;
    uploadFile(req: any, file: Express.Multer.File): Promise<FileEntity>;
}
