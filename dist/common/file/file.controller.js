"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.FileController = void 0;
const common_1 = require("@nestjs/common");
const jwt_auth_guard_1 = require("../../auth/jwt-auth.guard");
const platform_express_1 = require("@nestjs/platform-express");
const md5_1 = require("../../base/utils/md5");
const fs = require("fs");
const file_service_1 = require("./file.service");
const file_entity_1 = require("./file.entity");
const config_1 = require("@nestjs/config");
const sharp = require("sharp");
let FileController = class FileController {
    constructor(fileService, configService) {
        this.fileService = fileService;
        this.configService = configService;
    }
    async getFile(params, response) {
        const file = await this.fileService.findOneBy({
            filename: params.filename,
        });
        if (file) {
            const buffer = fs.createReadStream(file.dir + file.filename);
            response.setHeader('Content-Type', file.type);
            buffer.pipe(response);
        }
        else {
            throw new common_1.BadRequestException();
        }
    }
    async uploadFile(req, file) {
        try {
            const dir = this.configService.get('UPLOAD_DIR');
            const filename = file.originalname.replace(/^(.*)\.([A-z])/, `${(0, md5_1.default)(Date.now().toString() + Math.random())}.$2`);
            const path = `${dir}${filename}`;
            await fs.writeFileSync(path, await sharp(file.buffer).resize(1200).toBuffer());
            const entity = new file_entity_1.FileEntity();
            entity.filename = filename;
            entity.dir = dir;
            entity.type = file.mimetype;
            entity.size = file.size;
            return await this.fileService.add(entity);
        }
        catch (e) {
            throw new common_1.BadRequestException(e.message);
        }
    }
};
__decorate([
    (0, common_1.Get)('/api/v1/file/:filename'),
    __param(0, (0, common_1.Param)()),
    __param(1, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], FileController.prototype, "getFile", null);
__decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, common_1.Post)('/api/v1/file/upload'),
    (0, common_1.UseInterceptors)((0, platform_express_1.FileInterceptor)('file')),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.UploadedFile)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], FileController.prototype, "uploadFile", null);
FileController = __decorate([
    (0, common_1.Controller)(),
    __metadata("design:paramtypes", [file_service_1.FileService,
        config_1.ConfigService])
], FileController);
exports.FileController = FileController;
//# sourceMappingURL=file.controller.js.map