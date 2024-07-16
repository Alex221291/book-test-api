import { Controller, Post, UseGuards, Request, Get, Res } from '@nestjs/common';
import { AppService } from './app.service';
import { AuthService } from './auth/auth.service';
import { LocalAuthGuard } from './auth/local-auth.guard';
import { Response } from 'express';

@Controller()
export class AppController {
	constructor(
		private readonly appService: AppService,
		private authService: AuthService,
	) {}

	@Get()
	index(@Res() res: Response) {
		res.status(404);
		return res.end();
	}

	@UseGuards(LocalAuthGuard)
	@Post('auth/login')
	async login(@Request() req) {
		return this.authService.login(req.user);
	}
}
