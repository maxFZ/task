import { NestMiddleware } from '@nestjs/common';
import { Injectable } from '@nestjs/common';
import { NextFunction, Response, Request } from 'express';
import { ExpressRequestInterface } from 'src/types/expressRequest.interface';
import { verify } from 'jsonwebtoken';
import { JWT_SECRET } from 'src/config';
import { AuthService } from '../auth.service';

@Injectable()
export class AuthMiddleware implements NestMiddleware {
	constructor(private readonly authService: AuthService) { }
	async use(req: ExpressRequestInterface, res: Response, next: NextFunction) {
		if (!req.headers.authorization) {
			req.user = null;
			next();
			return;
		}

		const token = req.headers.authorization.split(' ')[1];

		try {
			const decode = verify(token, JWT_SECRET);
			const user = await this.authService.findById(decode.id);
			req.user = user;
			next();
		} catch (error) {
			req.user = null;
			next();
		}
	}
}